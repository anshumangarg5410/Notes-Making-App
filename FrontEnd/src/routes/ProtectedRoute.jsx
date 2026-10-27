import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Feather } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-bg dark:bg-charcoal-950 flex flex-col items-center justify-center select-none">
        <div className="w-12 h-12 rounded-2xl bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-500 flex items-center justify-center mb-4 animate-bounce">
          <Feather className="w-6 h-6 transform -rotate-12" />
        </div>
        <h2 className="font-serif font-bold text-xl text-charcoal-800 dark:text-cream-50">
          Notely
        </h2>
        <p className="text-xs text-charcoal-400 dark:text-charcoal-500 mt-1">
          Loading your workspace...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
