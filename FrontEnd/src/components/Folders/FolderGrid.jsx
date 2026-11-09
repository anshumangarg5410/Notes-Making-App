import React from 'react';
import { FolderCard } from './FolderCard';

export const FolderGrid = ({
  folders = [],
  selectedFolderId,
  onSelectFolder,
  onOpenFolder,
  onRenameFolder,
  onMoveFolder,
  onAddSubfolder,
  onDeleteFolder
}) => {
  if (folders.length === 0) {
    return (
      <div className="p-8 text-center bg-[#151520] border border-[#242436] rounded-[5px] text-xs text-gray-400">
        No folders match your search query.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
      {folders.map((folder) => {
        const isSelected = (folder._id || folder.id) === selectedFolderId;
        return (
          <FolderCard
            key={folder._id || folder.id}
            folder={folder}
            isSelected={isSelected}
            onSelect={onSelectFolder}
            onOpen={onOpenFolder}
            onRename={onRenameFolder}
            onMove={onMoveFolder}
            onAddSubfolder={onAddSubfolder}
            onDelete={onDeleteFolder}
          />
        );
      })}
    </div>
  );
};

