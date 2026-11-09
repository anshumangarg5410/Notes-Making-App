import React from 'react';
import {
  Folder,
  Code,
  Layers,
  User,
  GitBranch,
  Database,
  Palette,
  Bookmark
} from 'lucide-react';

export const FolderColorIcon = ({ name = '', color = 'purple', size = 'md' }) => {
  const lowerName = name.toLowerCase();

  // Determine color scheme
  let colorClass = 'bg-purple-600/30 text-purple-300 border-purple-500/40';
  let innerIcon = null;

  if (lowerName.includes('project') || color === 'blue') {
    colorClass = 'bg-sky-500/25 text-sky-400 border-sky-500/40';
    innerIcon = <Code className="w-3.5 h-3.5 stroke-[2.5]" />;
  } else if (lowerName.includes('dsa') || color === 'green') {
    colorClass = 'bg-emerald-500/25 text-emerald-400 border-emerald-500/40';
    innerIcon = <Layers className="w-3.5 h-3.5 stroke-[2.5]" />;
  } else if (lowerName.includes('personal') || color === 'amber') {
    colorClass = 'bg-amber-500/25 text-amber-400 border-amber-500/40';
    innerIcon = <User className="w-3.5 h-3.5 stroke-[2.5]" />;
  } else if (lowerName.includes('system') || color === 'rose') {
    colorClass = 'bg-rose-500/25 text-rose-400 border-rose-500/40';
    innerIcon = <GitBranch className="w-3.5 h-3.5 stroke-[2.5]" />;
  } else if (lowerName.includes('dbms') || color === 'violet') {
    colorClass = 'bg-purple-500/25 text-purple-300 border-purple-500/40';
    innerIcon = <Database className="w-3.5 h-3.5 stroke-[2.5]" />;
  } else if (lowerName.includes('ui') || lowerName.includes('ux') || color === 'cyan') {
    colorClass = 'bg-cyan-500/25 text-cyan-400 border-cyan-500/40';
    innerIcon = <Palette className="w-3.5 h-3.5 stroke-[2.5]" />;
  } else if (lowerName.includes('resource') || color === 'indigo') {
    colorClass = 'bg-indigo-500/25 text-indigo-300 border-indigo-500/40';
    innerIcon = <Bookmark className="w-3.5 h-3.5 stroke-[2.5]" />;
  } else {
    // Default / College (Purple)
    colorClass = 'bg-purple-600/30 text-purple-300 border-purple-500/40';
    innerIcon = <Folder className="w-4 h-4 fill-purple-400/30" />;
  }

  const dimension = size === 'lg' ? 'w-11 h-11' : size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';

  return (
    <div
      className={`${dimension} rounded-[6px] border flex items-center justify-center shrink-0 shadow-sm transition-transform duration-150 ${colorClass}`}
    >
      {innerIcon}
    </div>
  );
};
