import React, { useState } from 'react';
import { HardDrive, Cloud, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import storageService from '../../services/storageService';
import { offlineService } from '../../services/db';

export default function StorageOnboardingModal({ isOpen, onComplete, user }) {
  const [selectedOption, setSelectedOption] = useState('local');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleContinue = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (selectedOption === 'local') {
        // Save preference to backend
        await storageService.updatePreferences({
          provider: 'local',
          onboardingCompleted: true
        });

        // Save locally to IndexedDB
        await offlineService.setStorageMeta('storage_provider', 'local');
        await offlineService.setStorageMeta('onboarding_completed', true);

        // Check if legacy MongoDB data exists to seed local IndexedDB
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
      } else if (selectedOption === 'google-drive') {
        // Get Google OAuth URL and redirect
        const res = await storageService.getGoogleConnectUrl();
        if (res.success && res.data?.authUrl) {
          await offlineService.setStorageMeta('storage_provider', 'google-drive');
          window.location.href = res.data.authUrl;
        } else {
          throw new Error(res.message || 'Failed to initiate Google authorization.');
        }
      }
    } catch (err) {
      console.error('Storage onboarding error:', err);
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to configure storage');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#12131f] border border-[#232538] rounded-2xl shadow-2xl p-6 sm:p-8 text-white overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-medium">
            <span>Welcome to NoteNest</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Choose Your Storage Architecture</h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
            NoteNest is built local-first. Select how you want to preserve and synchronize your notebooks.
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Storage Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Option A: Local Storage */}
          <div
            onClick={() => setSelectedOption('local')}
            className={`cursor-pointer relative p-5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
              selectedOption === 'local'
                ? 'bg-pink-500/5 border-pink-500/50 shadow-lg shadow-pink-500/5 ring-1 ring-pink-500/30'
                : 'bg-[#181926] border-[#26283b] hover:border-[#383a54]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-pink-500/15 border border-pink-500/25 flex items-center justify-center text-pink-400">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedOption === 'local'
                      ? 'border-pink-500 bg-pink-500 text-white'
                      : 'border-gray-600 bg-transparent'
                  }`}
                >
                  {selectedOption === 'local' && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </div>

              <h3 className="text-base font-semibold text-white mb-1">NoteNest Local Storage</h3>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                Keep your notebooks on this device. Work offline without connecting an external cloud account.
              </p>

              <ul className="space-y-1.5 text-[11px] text-gray-400 border-t border-[#232538] pt-3">
                <li className="flex items-start gap-1.5">
                  <span className="text-pink-400 font-bold">•</span>
                  <span>Instant high-speed offline access via browser IndexedDB</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-pink-400 font-bold">•</span>
                  <span>Stored securely on this local browser profile</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-pink-400 font-bold">•</span>
                  <span>Can export JSON backups anytime from Settings</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-[#232538]">
              <span className="text-[11px] font-medium text-pink-400/90">Zero cloud dependencies</span>
            </div>
          </div>

          {/* Option B: Google Drive */}
          <div
            onClick={() => setSelectedOption('google-drive')}
            className={`cursor-pointer relative p-5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
              selectedOption === 'google-drive'
                ? 'bg-pink-500/5 border-pink-500/50 shadow-lg shadow-pink-500/5 ring-1 ring-pink-500/30'
                : 'bg-[#181926] border-[#26283b] hover:border-[#383a54]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                  <Cloud className="w-5 h-5" />
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedOption === 'google-drive'
                      ? 'border-pink-500 bg-pink-500 text-white'
                      : 'border-gray-600 bg-transparent'
                  }`}
                >
                  {selectedOption === 'google-drive' && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </div>

              <h3 className="text-base font-semibold text-white mb-1">Connect Google Drive</h3>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                Connect your Google Drive to synchronize notebooks across devices using your own cloud storage.
              </p>

              <ul className="space-y-1.5 text-[11px] text-gray-400 border-t border-[#232538] pt-3">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Synchronizes to your private <code className="text-white bg-[#12131f] px-1 py-0.5 rounded">NoteNest</code> folder</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>IndexedDB stays active for offline editing</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Automatic background delta sync when online</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-[#232538]">
              <span className="text-[11px] font-medium text-emerald-400/90">Cross-device synchronization</span>
            </div>
          </div>
        </div>

        {/* Security & Scope Guarantee */}
        <div className="p-3 rounded-xl bg-[#161725] border border-[#232538] flex items-center gap-2.5 text-gray-400 text-[11px] mb-6">
          <ShieldCheck className="w-4 h-4 text-pink-400 flex-shrink-0" />
          <span>
            <strong>Privacy Guarantee:</strong> NoteNest only requests access to files it creates under the dedicated{' '}
            <span className="text-gray-200">drive.file</span> scope. Your existing Google Drive documents remain completely unreadable and private.
          </span>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleContinue}
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-lg shadow-pink-600/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Configuring Storage...</span>
              </>
            ) : selectedOption === 'google-drive' ? (
              <>
                <span>Connect Google Drive</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Continue with Local Storage</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

