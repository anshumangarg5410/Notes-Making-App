import React from 'react';
import { Activity } from 'lucide-react';

export const RecentActivity = ({
  activities = [
    { id: '1', description: 'Edited "API Gateway in Go"', time: '10 min ago' },
    { id: '2', description: 'Created "System Design"', time: '42 min ago' },
    { id: '3', description: 'Updated "DBMS Notes"', time: '2 hr ago' },
    { id: '4', description: 'Created folder "Projects"', time: 'Yesterday' }
  ]
}) => {
  return (
    <div className="rounded-[4px] p-5 bg-[#181226]/90 border border-purple-500/20 shadow-xl select-none">
      {/* Header with Activity / Pulse Icon */}
      <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-purple-500/15">
        <Activity className="w-4 h-4 text-purple-400" />
        <h3 className="text-base font-bold text-white tracking-tight">
          Recent Activity
        </h3>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-4 space-y-4">
        {/* Continuous vertical dashed line connecting dots */}
        <div className="absolute left-1.5 top-2 bottom-3 w-px border-l border-dashed border-purple-500/30" />

        {activities.map((act) => (
          <div key={act.id} className="relative flex items-start gap-3 text-xs">
            {/* Timeline Circular Dot Marker */}
            <div className="w-2.5 h-2.5 rounded-full bg-purple-400 border-2 border-[#181226] shadow-[0_0_8px_rgba(192,132,252,0.8)] shrink-0 mt-0.5 relative z-10 -ml-1.5" />

            {/* Description & Time */}
            <div className="flex-1 min-w-0 flex items-baseline justify-between gap-2">
              <span className="text-stone-300 font-medium truncate">
                {act.description}
              </span>
              <span className="text-[11px] text-stone-500 shrink-0 font-mono">
                {act.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;

