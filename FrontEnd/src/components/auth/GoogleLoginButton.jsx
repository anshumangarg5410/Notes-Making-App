import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Loader2 } from 'lucide-react';

export const GoogleLoginButton = ({ isDark = true, onSuccess }) => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [gisLoaded, setGisLoaded] = useState(false);
  const { googleLogin } = useAuth();
  const { success, error: toastError } = useToast();

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  // Ensure Google Identity Services script is available
  useEffect(() => {
    const checkGis = () => {
      if (window.google?.accounts?.id) {
        setGisLoaded(true);
        return true;
      }
      return false;
    };

    if (checkGis()) return;

    // If script not loaded yet, wait or poll briefly
    const interval = setInterval(() => {
      if (checkGis()) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

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
      const message =
        err.response?.data?.message ||
        err.message ||
        'Google authentication failed. Please try again.';
      toastError(message);
    } finally {
      setLoading(false);
    }
  };

  // Initialize and render Google button
  useEffect(() => {
    if (!gisLoaded || !clientId || !containerRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // Render the official Google Identity Services button
      containerRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(containerRef.current, {
        type: 'standard',
        theme: isDark ? 'filled_black' : 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 320
      });
    } catch (err) {
      console.warn('Google Identity Services button render notice:', err);
    }
  }, [gisLoaded, clientId, isDark]);

  const handleCustomClick = () => {
    if (!clientId) {
      toastError(
        'VITE_GOOGLE_CLIENT_ID is not configured. Please add your Google OAuth Client ID to FrontEnd/.env.'
      );
      return;
    }

    if (!window.google?.accounts?.id) {
      toastError('Google Identity Services is still loading. Please try again in a moment.');
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
          // If prompt is suppressed (e.g. FedCM or third-party cookie restrictions),
          // clicking the rendered button inside containerRef provides the direct popup
          const btn = containerRef.current?.querySelector('div[role="button"]') || containerRef.current?.querySelector('iframe');
          if (btn) btn.click();
        }
      });
    } catch (err) {
      console.warn('Prompt error:', err);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center my-1">
      {/* If Client ID is missing, provide a visible, helpful banner so test setup is trivial */}
      {!clientId ? (
        <button
          type="button"
          onClick={handleCustomClick}
          className={`w-full py-2.5 px-4 rounded-[3px] text-xs sm:text-sm font-medium border flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer ${
            isDark
              ? 'bg-[#181226] border-purple-500/30 text-stone-200 hover:bg-[#251b3d] hover:border-purple-400/60 shadow-sm'
              : 'bg-white border-purple-200 text-stone-700 hover:bg-purple-50 hover:border-purple-300 shadow-sm'
          }`}
        >
          {/* Multi-color Google G Icon */}
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
          <span>Continue with Google</span>
        </button>
      ) : (
        /* Render container for official Google Identity Services button */
        <div className="relative w-full flex justify-center min-h-[40px]">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-xs rounded">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
            </div>
          )}
          <div ref={containerRef} className="w-full flex justify-center" />
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;
