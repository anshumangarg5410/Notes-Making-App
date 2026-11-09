import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthModalProvider } from './context/AuthModalContext';
import { AuthModal } from './components/auth/AuthModal';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AuthModalProvider>
            <ErrorBoundary>
              <BrowserRouter>
                {/* Global Authentication Modal (Login / Sign-up / Logout / Forgot Password) */}
                <AuthModal />

                <Routes>
                  {/* Public Landing Page */}
                  <Route path="/" element={<LandingPage />} />

                  {/* Main Application Dashboard (Exact Design Reference) */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Dedicated Protected Notes Workspace */}
                  <Route
                    path="/notes"
                    element={
                      <ProtectedRoute>
                        <WorkspacePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Legacy / Alias Route */}
                  <Route path="/workspace" element={<Navigate to="/dashboard" replace />} />

                  {/* Public Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BrowserRouter>
            </ErrorBoundary>
          </AuthModalProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
