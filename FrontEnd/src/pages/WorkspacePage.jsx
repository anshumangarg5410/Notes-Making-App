import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { EditorLayout } from '../components/Editor/EditorLayout';
import { SettingsModal } from '../components/modals/SettingsModal';

export const WorkspacePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const noteId = searchParams.get('noteId');

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0c0c11]">
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
