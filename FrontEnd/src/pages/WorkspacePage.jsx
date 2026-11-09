import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { EditorLayout } from '../components/Editor/EditorLayout';
import { SettingsModal } from '../components/modals/SettingsModal';
import { useTheme } from '../context/ThemeContext';

export const WorkspacePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const noteId = searchParams.get('noteId');

  return (
    <div className={`h-screen w-screen overflow-hidden ${isDark ? 'bg-[#090D16]' : 'bg-[#F8FAFC]'}`}>
      <EditorLayout
        initialNoteId={noteId}
        onNavigateDashboard={() => navigate('/dashboard')}
        onOpenSettings={() => navigate('/settings')}
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
