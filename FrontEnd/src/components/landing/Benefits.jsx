import React from 'react';
import { Zap, RefreshCw, Smartphone } from 'lucide-react';

export const Benefits = () => {
  return (
    <div className="pt-4 grid grid-cols-3 gap-4 max-w-md">
      {/* Benefit 1: Works Offline */}
      <div className="flex flex-col items-start gap-1.5">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20 stroke-[2.2]" />
          <span className="text-xs sm:text-sm font-medium text-stone-200 tracking-tight">
            Works Offline
          </span>
        </div>
      </div>

      {/* Benefit 2: Auto Syncs */}
      <div className="flex flex-col items-start gap-1.5">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-purple-400 stroke-[2.2]" />
          <span className="text-xs sm:text-sm font-medium text-stone-200 tracking-tight">
            Auto Syncs
          </span>
        </div>
      </div>

      {/* Benefit 3: Across Devices */}
      <div className="flex flex-col items-start gap-1.5">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-purple-400 stroke-[2.2]" />
          <span className="text-xs sm:text-sm font-medium text-stone-200 tracking-tight">
            Across Devices
          </span>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
