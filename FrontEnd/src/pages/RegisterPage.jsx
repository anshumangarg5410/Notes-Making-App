import React from 'react';
import { AuthModal } from '../components/auth/AuthModal';
import landingBg from '../assets/wide_dark_moody_stationary_themed_background_des.png';

export const RegisterPage = () => {
  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center overflow-x-hidden p-4 select-none"
      style={{
        backgroundImage: `url(${landingBg})`,
        backgroundColor: '#0d0a14',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs pointer-events-none" />
      <div className="relative z-10 w-full max-w-2xl flex justify-center">
        <AuthModal isStandalone={true} initialView="signup" />
      </div>
    </div>
  );
};

export default RegisterPage;
