import React, { useState } from 'react';
import { HardDrive, Cloud, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import storageService from '../../services/storageService';
import { offlineService } from '../../services/db';
import { getIntegrationFlags, isDriveFlagDisabledInEnv } from '../../services/integrationStatus';

export default function StorageOnboardingModal({ isOpen, onComplete }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [driveUnavailable, setDriveUnavailable] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const completeWithoutDrive = async (driveStatus = 'declined') => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await storageService.updatePreferences({
        provider: 'local',
        onboardingCompleted: true,
        driveStatus
      });

      await offlineService.setStorageMeta('storage_provider', 'local');
      await offlineService.setStorageMeta('drive_connected', false);
      await offlineService.setStorageMeta('onboarding_completed', true);

      // Seed local IndexedDB if legacy MongoDB data exists
      try {
        const migrationRes = await storageService.getMigrationData();
        if (migrationRes.success && migrationRes.data) {
          const { notebooks = [], sections = [], notes = [] } = migrationRes.data;
          if (notebooks.length > 0) await offlineService.cacheServerNotebooks(notebooks);
          if (sections.length > 0) await offlineService.cacheServerSections(sections);
          if (notes.length > 0) await offlineService.cacheServerNotes(notes);
        }
      } catch (migErr) {
        console.warn('Migration data fetch skipped/failed:', migErr.message);
      }

      onComplete({ provider: 'local' });
    } catch (err) {
      console.error('Continue without Drive error:', err);
      // Still allow user into local-first workspace rather than blocking them
      await offlineService.setStorageMeta('storage_provider', 'local').catch(() => {});
      await offlineService.setStorageMeta('drive_connected', false).catch(() => {});
      await offlineService.setStorageMeta('onboarding_completed', true).catch(() => {});
      onComplete({ provider: 'local' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnectDrive = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (isDriveFlagDisabledInEnv()) {
        setDriveUnavailable(true);
        setIsSubmitting(false);
        return;
      }

      const flags = await getIntegrationFlags(true);
      if (!flags.googleDriveEnabled) {
        setDriveUnavailable(true);
        setIsSubmitting(false);
        return;
      }

      const res = await storageService.getGoogleConnectUrl();
      if (res.success && res.data?.authUrl) {
        // Do NOT mark storage_provider = 'google-drive' until OAuth callback succeeds!
        window.location.href = res.data.authUrl;
      } else {
        setDriveUnavailable(true);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.warn('Google Drive connect unavailable:', err);
      setDriveUnavailable(true);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#12131f] border border-[#232538] rounded-2xl shadow-2xl p-6 sm:p-8 text-white overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {driveUnavailable ? (
          <div className="relative z-10 space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Google Drive Temporarily Unavailable
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  We're currently unable to connect to Google Drive. You can continue using NoteNest without it. Your existing notes and files remain unaffected.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#161725] border border-[#232538] flex items-center gap-2.5 text-gray-400 text-xs">
              <HardDrive className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <span>
                Your notebooks, notes, and dashboard will continue working normally using NoteNest Local Storage. You can connect Google Drive later from Settings.
              </span>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => completeWithoutDrive('connection_failed')}
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-lg shadow-pink-600/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Opening Workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Continue Without Google Drive</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="relative z-10">
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-medium">
                <Cloud className="w-3.5 h-3.5" />
                <span>Optional Cloud Integration</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Connect Your Google Drive?
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                Would you like to connect your Google Drive account to store and access your files directly through NoteNest?
              </p>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                You can use NoteNest without connecting Google Drive. Your normal notes, dashboard, and other features will continue working.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div className="p-4 rounded-xl bg-[#181926] border border-[#26283b] space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <Cloud className="w-4 h-4" />
                  <span>With Google Drive</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Syncs notes as <code className="text-gray-200">.txt</code> files inside your private <code className="text-gray-200">NoteNest</code> Drive folder.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#181926] border border-[#26283b] space-y-2">
                <div className="flex items-center gap-2 text-pink-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Without Google Drive</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Works fast & offline with IndexedDB and MongoDB — zero Google API dependencies.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#161725] border border-[#232538] flex items-center gap-2.5 text-gray-400 text-[11px] mb-6">
              <ShieldCheck className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <span>
                You can change this preference anytime under <strong>Settings → Storage &amp; Integrations</strong>.
              </span>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => completeWithoutDrive('declined')}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1c1e2e] hover:bg-[#25283d] border border-[#2d3048] text-gray-200 text-xs sm:text-sm font-medium transition-colors disabled:opacity-50"
              >
                Continue Without Google Drive
              </button>
              <button
                type="button"
                onClick={handleConnectDrive}
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-lg shadow-pink-600/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Checking Google Drive...</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-4 h-4" />
                    <span>Connect Google Drive</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
