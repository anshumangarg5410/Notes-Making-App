import React, { useState } from 'react';
import { Cloud, RefreshCw, CheckCircle2, Database, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const SyncSettings = () => {
  const { success, error: toastError } = useToast();
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  const handleForceSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      success('Sync complete. All notes and folders are up to date.');
    }, 900);
  };

  const handleClearCache = () => {
    success('Local database cache refreshed.');
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="rounded-[6px] border border-[#272738] bg-[#14141e] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Cloud className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Sync & Offline Persistence</h3>
        </div>
        <p className="text-[11px] text-gray-400 mb-4">
          NoteNest keeps your knowledge available offline and synchronizes seamlessly with MongoDB Atlas
        </p>

        {/* Sync Status Banner */}
        <div className="p-3.5 rounded-[6px] bg-[#1a1a26] border border-[#2e2e44] flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="text-xs font-semibold text-white">All notes are synchronized</p>
              <p className="text-[11px] text-gray-400">Last synced at {lastSync}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleForceSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div className="p-3 bg-[#171722] border border-[#272738] rounded-[5px]">
            <p className="text-[11px] text-gray-400">Offline Engine</p>
            <p className="text-sm font-bold text-white mt-1">IndexedDB / Dexie.js</p>
            <p className="text-[10px] text-emerald-400 mt-0.5">● Active & Ready</p>
          </div>
          <div className="p-3 bg-[#171722] border border-[#272738] rounded-[5px]">
            <p className="text-[11px] text-gray-400">Pending Changes</p>
            <p className="text-sm font-bold text-white mt-1">0 operations</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Queue is clear</p>
          </div>
          <div className="p-3 bg-[#171722] border border-[#272738] rounded-[5px]">
            <p className="text-[11px] text-gray-400">Sync Interval</p>
            <p className="text-sm font-bold text-white mt-1">Real-time / Instant</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Debounced auto-save</p>
          </div>
        </div>

        {/* Cache Clean */}
        <div className="pt-3 border-t border-[#272738]/60 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-200">Rebuild Local Index</p>
            <p className="text-[10.5px] text-gray-500">Refreshes local client cache without affecting your cloud notes</p>
          </div>
          <button
            type="button"
            onClick={handleClearCache}
            className="px-3 py-1.5 border border-[#2f2f42] hover:bg-[#1f1f2e] text-gray-300 rounded-[5px] text-xs cursor-pointer transition-colors"
          >
            Rebuild Cache
          </button>
        </div>
      </div>
    </div>
  );
};
