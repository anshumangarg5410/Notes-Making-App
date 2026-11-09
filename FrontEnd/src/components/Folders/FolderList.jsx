import React from 'react';
import { Clock } from 'lucide-react';
import { FolderColorIcon } from './FolderColorIcon';

export const FolderList = ({
  folders = [],
  selectedFolderId,
  onSelectFolder,
  onOpenFolder
}) => {
  if (folders.length === 0) {
    return (
      <div className="p-8 text-center bg-[#151520] border border-[#242436] rounded-[5px] text-xs text-gray-400">
        No folders found.
      </div>
    );
  }

  return (
    <div className="bg-[#151520] border border-[#242436] rounded-[5px] divide-y divide-[#222232] overflow-hidden select-none text-xs">
      {folders.map((folder) => {
        const isSelected = (folder._id || folder.id) === selectedFolderId;
        const noteCount = folder.noteCount ?? folder.count ?? 0;
        const subCount = folder.subfolderCount ?? (folder.subfolders ? folder.subfolders.length : 0);

        return (
          <div
            key={folder._id || folder.id}
            onClick={() => onSelectFolder(folder)}
            className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
              isSelected
                ? 'bg-purple-950/40 text-purple-200'
                : 'hover:bg-[#191926] text-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderColorIcon name={folder.name} color={folder.color} size="sm" />
              <div>
                <div className="font-semibold">{folder.name}</div>
                <div className="text-[11px] text-gray-500">
                  {noteCount} notes {subCount > 0 && `• ${subCount} subfolders`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{folder.updatedAt ? new Date(folder.updatedAt).toLocaleDateString() : 'Recent'}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
