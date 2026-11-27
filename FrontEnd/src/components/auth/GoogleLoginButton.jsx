import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getIntegrationFlags, isLoginFlagDisabledInEnv } from '../../services/integrationStatus';
import { AlertCircle, Loader2, X } from 'lucide-react';

export const GoogleLoginButton = ({ isDark = true, onSuccess }) => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [gisLoaded, setGisLoaded] = useState(false);
  const [googleLoginAvailable, setGoogleLoginAvailable] = useState(!isLoginFlagDisabledInEnv());
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const { googleLogin } = useAuth();
  const { success, error: toastError } = useToast();

  const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const clientId = rawClientId.replace(/["'\s]/g, '').trim();

  // Check backend + env feature flag once on mount without calling Google APIs
  useEffect(() => {
    let active = true;
    getIntegrationFlags().then((flags) => {
      if (active) {
        setGoogleLoginAvailable(Boolean(flags.googleLoginEnabled && clientId));
      }
    });
    return () => {
      active = false;
    };
  }, [clientId]);

  // Lazy-load GIS detection ONLY when Google Login is enabled
  useEffect(() => {
    if (!googleLoginAvailable) return;

    const checkGis = () => {
      if (window.google?.accounts?.id) {
        setGisLoaded(true);
        return true;
      }
      return false;
    };

    if (checkGis()) return;

    const interval = setInterval(() => {
      if (checkGis()) {
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [googleLoginAvailable]);

  const handleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      toastError('Failed to receive Google credential token.');
      return;
    }

    setLoading(true);
    try {
      const res = await googleLogin(response.credential);
      if (res && res.success) {
        success(`Welcome, ${res.googleData?.name || res.data?.name || 'User'}!`);
        if (onSuccess) {
          onSuccess(res.googleData || res.data);
        }
      }
    } catch (err) {
      const code = err.response?.data?.code;
      if (err.response?.status === 503 || code === 'GOOGLE_LOGIN_DISABLED') {
        setGoogleLoginAvailable(false);
        setShowUnavailableModal(true);
        return;
      }
      const message =
        err.response?.data?.message ||
        err.message ||
        'Google authentication failed. Please try again.';
      toastError(message);
    } finally {
      setLoading(false);
    }
  };

  // Lazy-initialize and render Google button ONLY when Google Login is enabled
  useEffect(() => {
    if (!googleLoginAvailable || !gisLoaded || !clientId || !containerRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      containerRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(containerRef.current, {
        type: 'standard',
        theme: isDark ? 'filled_black' : 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 400
      });
    } catch (err) {
      console.warn('Google Identity Services render notice:', err);
    }
  }, [googleLoginAvailable, gisLoaded, clientId, isDark]);

  const handleButtonClick = async () => {
    // Re-check live availability if needed, without initiating Google OAuth when disabled
    if (!googleLoginAvailable || isLoginFlagDisabledInEnv() || !clientId) {
      setShowUnavailableModal(true);
      return;
    }

    const flags = await getIntegrationFlags(true);
    if (!flags.googleLoginEnabled) {
      setGoogleLoginAvailable(false);
      setShowUnavailableModal(true);
      return;
    }

    if (!window.google?.accounts?.id) {
      setShowUnavailableModal(true);
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false
      });
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          const btn =
            containerRef.current?.querySelector('div[role="button"]') ||
            containerRef.current?.querySelector('iframe');
          if (btn) btn.click();
        }
      });
    } catch (err) {
      console.warn('Google prompt fallback notice:', err);
      setShowUnavailableModal(true);
    }
  };

  return (
    <>
      <div className="w-full my-1">
        <div
          onClick={handleButtonClick}
          className="relative w-full rounded-[3px] overflow-hidden group cursor-pointer select-none"
        >
          <div
            className={`w-full py-2.5 sm:py-3 px-5 rounded-[3px] font-medium text-xs sm:text-sm border flex items-center justify-center gap-3 transition-all duration-200 ${
              isDark
                ? 'bg-[#181126] border-purple-500/30 text-stone-100 group-hover:bg-[#241938] group-hover:border-purple-400/60 shadow-[0_0_15px_rgba(147,51,234,0.12)] group-hover:shadow-[0_0_22px_rgba(147,51,234,0.25)]'
                : 'bg-white border-purple-200 text-stone-800 group-hover:bg-purple-50 group-hover:border-purple-300 shadow-sm'
            }`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span className="font-semibold tracking-tight">Continue with Google</span>
          </div>

          {/* Render interactive Google Identity Services iframe ONLY when Google Login is enabled */}
          {googleLoginAvailable && clientId && (
            <div
              ref={containerRef}
              className="absolute inset-0 z-20 w-full h-full opacity-[0.001] cursor-pointer overflow-hidden flex items-center justify-center pointer-events-auto"
              style={{
                transform: 'scale(1.4)',
                transformOrigin: 'center'
              }}
              title="Continue with Google"
            />
          )}
        </div>
      </div>

      {/* Friendly Google Sign-In Unavailable Modal */}
      {showUnavailableModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowUnavailableModal(false)}
        >
          <div
            className={`relative w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
              isDark
                ? 'bg-[#12131f] border-[#26283b] text-white'
                : 'bg-white border-purple-200 text-stone-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowUnavailableModal(false)}
              aria-label="Close"
              className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
                isDark ? 'text-gray-400 hover:bg-white/10 hover:text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-2 pr-4">
                <h3 className="text-base font-semibold tracking-tight">
                  Google Sign-In Temporarily Unavailable
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-stone-600'}`}>
                  We're currently experiencing an issue with Google authentication. Please use your email and password to sign in. Your account and other NoteNest features are working normally.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowUnavailableModal(false)}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                Continue with Email
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleLoginButton;
