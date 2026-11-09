import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from '../../context/AuthModalContext';
import { AuthCardFrame } from './AuthCardFrame';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { LogoutModal } from './LogoutModal';

export const AuthModal = ({
  isStandalone = false,
  initialView = null,
  onStandaloneClose = null
}) => {
  const {
    isOpen,
    view: contextView,
    setView,
    closeModal,
    customTheme,
    onLogoutConfirm
  } = useAuthModal();
  const navigate = useNavigate();

  // If used standalone on /login or /register page, respect initialView
  const currentView = initialView || contextView;

  // If not open and not standalone, don't render anything
  if (!isOpen && !isStandalone) {
    return null;
  }

  const handleClose = () => {
    if (isStandalone) {
      if (onStandaloneClose) {
        onStandaloneClose();
      } else {
        navigate('/');
      }
    } else {
      closeModal();
    }
  };

  const handleSuccess = () => {
    if (!isStandalone) {
      closeModal();
    }
    navigate('/notes');
  };

  const renderContent = () => {
    if (currentView === 'logout') {
      return (
        <LogoutModal
          onClose={handleClose}
          onConfirm={onLogoutConfirm}
        />
      );
    }

    if (currentView === 'signup') {
      return (
        <AuthCardFrame
          onClose={handleClose}
          themeOverride={customTheme}
        >
          <SignupForm
            onSwitchToLogin={() => setView('login')}
            onSuccess={handleSuccess}
          />
        </AuthCardFrame>
      );
    }

    if (currentView === 'forgot') {
      return (
        <AuthCardFrame
          onClose={handleClose}
          themeOverride={customTheme}
        >
          <ForgotPasswordForm
            onSwitchToLogin={() => setView('login')}
          />
        </AuthCardFrame>
      );
    }

    // Default to 'login'
    return (
      <AuthCardFrame
        onClose={handleClose}
        themeOverride={customTheme}
      >
        <LoginForm
          onSwitchToSignup={() => setView('signup')}
          onSwitchToForgot={() => setView('forgot')}
          onSuccess={handleSuccess}
        />
      </AuthCardFrame>
    );
  };

  if (isStandalone) {
    return (
      <div className="w-full flex justify-center items-center py-6 px-4">
        {renderContent()}
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="relative w-full max-w-2xl flex justify-center animate-in zoom-in-95 duration-200">
        {renderContent()}
      </div>
    </div>
  );
};

export default AuthModal;
