import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { EditorLayout } from '../components/editor/EditorLayout';
import { useTheme } from '../context/ThemeContext';

export const WorkspacePage = () => {
  const [searchParams] = useSearchParams();
  const { isDark } = useTheme();

  const noteId = searchParams.get('noteId');
  const isSettings = searchParams.get('settings') === 'true';
  const navParam = isSettings ? 'settings' : (searchParams.get('nav') || searchParams.get('view') || 'all');
  const folderParam = searchParams.get('folder');
  const tagParam = searchParams.get('tag');

  return (
    <div className={`h-screen w-screen overflow-hidden ${isDark ? 'bg-[#090D16]' : 'bg-[#F8FAFC]'}`}>
      <EditorLayout
        initialNoteId={noteId}
        initialNav={navParam}
        initialFolder={folderParam}
        initialTag={tagParam}
        onNavigateDashboard={() => {}}
      />
    </div>
  );
};

export default WorkspacePage;
