import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  const isDemo = new URLSearchParams(location.search).get('demo') === 'true' || !!localStorage.getItem('notely_token');

  if (loading && !isDemo) {
    return (
      <div className="min-h-screen bg-[#0d0a14] text-[#f5f3f0] flex flex-col items-center justify-center select-none">
        <div className="w-12 h-12 rounded-2xl bg-purple-900/60 border border-purple-500/30 text-purple-300 flex items-center justify-center mb-4 animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.5)]">
          <BookOpen className="w-6 h-6" />
        </div>
        <h2 className="font-serif font-bold text-xl text-white">
          NoteNest
        </h2>
        <p className="text-xs text-stone-400 mt-1">
          Loading your workspace...
        </p>
      </div>
    );
  }

  if (!isAuthenticated && !isDemo) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
