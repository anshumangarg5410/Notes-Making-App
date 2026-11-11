import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import websiteLogo from '../assets/shared/logo/websiteLogo.png';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  const isDemo = new URLSearchParams(location.search).get('demo') === 'true' || !!localStorage.getItem('notely_token');

  if (loading && !isDemo) {
    return (
      <div className="min-h-screen bg-[#0d0a14] text-[#f5f3f0] flex flex-col items-center justify-center select-none">
        <div className="relative w-16 h-16 flex items-center justify-center mb-4">
          <div className="absolute inset-0 rounded-full blur-xl bg-purple-500/40 animate-pulse pointer-events-none" />
          <img
            src={websiteLogo}
            alt="NoteNest Logo"
            className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_16px_rgba(168,85,247,0.6)] animate-pulse"
          />
        </div>
        <h2 className="font-serif font-bold text-xl text-white tracking-tight">
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
