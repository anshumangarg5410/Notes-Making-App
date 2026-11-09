import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { EditorLayout } from '../components/Editor/EditorLayout';

export const NoteEditorPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const noteId = searchParams.get('noteId');
  const view = searchParams.get('view') || 'all';

  return (
    <EditorLayout
      initialNoteId={noteId}
      initialView={view}
      onNavigateDashboard={() => navigate('/dashboard')}
    />
  );
};

export default NoteEditorPage;
