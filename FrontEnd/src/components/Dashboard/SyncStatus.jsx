import React, { useState, useEffect } from 'react';

export const SyncStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 2000);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  let dotColor = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]';
  let statusText = 'Synced';
  let detailText = 'All notes are up to date';

  if (!isOnline) {
    dotColor = 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]';
    statusText = 'Offline';
    detailText = 'Working locally (changes will sync)';
  } else if (isSyncing) {
    dotColor = 'bg-purple-400 animate-ping shadow-[0_0_8px_rgba(192,132,252,0.8)]';
    statusText = 'Syncing';
    detailText = 'Updating cloud storage...';
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181226]/90 border border-purple-500/25 text-xs text-stone-200 select-none shadow-xs">
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      <span className="font-semibold text-white">{statusText}</span>
      <span className="text-purple-300/40">·</span>
      <span className="text-purple-200/70 text-[11px] sm:text-xs">{detailText}</span>
    </div>
  );
};

export default SyncStatus;

