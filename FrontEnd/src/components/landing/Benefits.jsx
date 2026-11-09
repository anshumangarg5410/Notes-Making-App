import React from 'react';
import { Zap, RefreshCw, Smartphone } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Benefits = () => {
  const { isDark } = useTheme();
  const labelClass = isDark ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className="pt-4 grid grid-cols-3 gap-4 max-w-md">
      {/* Benefit 1: Works Offline */}
      <div className="flex flex-col items-start gap-1.5">
        <div className="flex items-center gap-2">
          <Zap className={`w-4 h-4 stroke-[2.2] ${isDark ? 'text-indigo-300 fill-indigo-300/20' : 'text-indigo-600 fill-indigo-600/10'}`} />
          <span className={`text-xs sm:text-sm font-medium tracking-tight ${labelClass}`}>
            Works Offline
          </span>
        </div>
      </div>

      {/* Benefit 2: Auto Syncs */}
      <div className="flex flex-col items-start gap-1.5">
        <div className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 stroke-[2.2] ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`} />
          <span className={`text-xs sm:text-sm font-medium tracking-tight ${labelClass}`}>
            Auto Syncs
          </span>
        </div>
      </div>

      {/* Benefit 3: Across Devices */}
      <div className="flex flex-col items-start gap-1.5">
        <div className="flex items-center gap-2">
          <Smartphone className={`w-4 h-4 stroke-[2.2] ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`} />
          <span className={`text-xs sm:text-sm font-medium tracking-tight ${labelClass}`}>
            Across Devices
          </span>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
