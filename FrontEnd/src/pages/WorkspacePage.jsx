import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EditorLayout } from '../components/Editor/EditorLayout';
import { SettingsModal } from '../components/modals/SettingsModal';
import { useTheme } from '../context/ThemeContext';

export const WorkspacePage = () => {
  const [searchParams] = useSearchParams();
  const { isDark } = useTheme();

  const noteId = searchParams.get('noteId');
  const navParam = searchParams.get('nav') || searchParams.get('view') || 'all';
  const folderParam = searchParams.get('folder');
  const tagParam = searchParams.get('tag');
  const [isSettingsOpen, setIsSettingsOpen] = useState(searchParams.get('settings') === 'true');

  return (
    <div className={`h-screen w-screen overflow-hidden ${isDark ? 'bg-[#090D16]' : 'bg-[#F8FAFC]'}`}>
      <EditorLayout
        initialNoteId={noteId}
        initialNav={navParam}
        initialFolder={folderParam}
        initialTag={tagParam}
        onNavigateDashboard={() => {}}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default WorkspacePage;
