import React from 'react';
import { HardDrive, Sparkles, Check, Database } from 'lucide-react';

export const StorageSettings = ({ user, notes = [] }) => {
  // Calculate real storage
  let totalBytes = 0;
  if (Array.isArray(notes)) {
    notes.forEach((n) => {
      const titleBytes = n.title ? new Blob([n.title]).size : 0;
      const contentStr = typeof n.content === 'string' ? n.content : JSON.stringify(n.content || '');
      const contentBytes = contentStr ? new Blob([contentStr]).size : 0;
      totalBytes += titleBytes + contentBytes;
    });
  }

  const totalQuotaBytes = 512 * 1024 * 1024; // Real MongoDB Atlas M0 cluster capacity (512 MB)
  const usedFormatted = totalBytes < 1024 * 1024
    ? `${Math.max(1, Math.round(totalBytes / 1024))} KB`
    : `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;

  const rawPct = (totalBytes / totalQuotaBytes) * 100;
  const percentage = rawPct < 0.1 ? '< 1%' : `${rawPct.toFixed(1)}%`;
  const progressWidth = `${Math.max(3, Math.min(100, Math.round(rawPct)))}%`;

  return (
    <div className="space-y-4 text-xs">
      <div className="rounded-[6px] border border-[#272738] bg-[#14141e] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <HardDrive className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Storage & Quotas</h3>
        </div>
        <p className="text-[11px] text-gray-400 mb-4">
          Monitor your cloud storage usage across notes, attachments, and backups
        </p>

        {/* Progress Bar & Meter */}
        <div className="p-4 rounded-[6px] bg-[#1a1a26] border border-[#2e2e44] mb-5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-white">{usedFormatted} of 512 MB used</span>
            <span className="text-purple-400 font-bold">{percentage}</span>
          </div>
          <div className="w-full h-2 bg-[#252538] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        {/* Breakdown */}
        <h4 className="text-xs font-semibold text-gray-300 mb-3">Storage Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div className="p-3 bg-[#171722] border border-[#272738] rounded-[5px]">
            <p className="text-[11px] text-gray-400">Notes & Content</p>
            <p className="text-sm font-bold text-white mt-1">{usedFormatted}</p>
            <p className="text-[10px] text-purple-400 mt-0.5">{notes.length} active notes</p>
          </div>
          <div className="p-3 bg-[#171722] border border-[#272738] rounded-[5px]">
            <p className="text-[11px] text-gray-400">Database Quota</p>
            <p className="text-sm font-bold text-white mt-1">512 MB</p>
            <p className="text-[10px] text-emerald-400 mt-0.5">MongoDB Atlas M0</p>
          </div>
          <div className="p-3 bg-[#171722] border border-[#272738] rounded-[5px]">
            <p className="text-[11px] text-gray-400">Client Cache</p>
            <p className="text-sm font-bold text-white mt-1">IndexedDB</p>
            <p className="text-[10px] text-purple-400 mt-0.5">Offline-first local</p>
          </div>
        </div>

        {/* Free Plan / Workspace info */}
        <div className="p-4 rounded-[6px] bg-[#1a1a26] border border-[#2e2e44] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[6px] bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Database className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>NoteNest Free Plan</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-semibold">Active</span>
              </p>
              <p className="text-[11px] text-gray-400">512 MB cloud storage on MongoDB Atlas • Offline-first local sync</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

