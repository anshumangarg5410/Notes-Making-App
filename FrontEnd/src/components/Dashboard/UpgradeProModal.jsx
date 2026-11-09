import React from 'react';
import { Sparkles, Check, X, Shield, Zap, Cloud, Smartphone } from 'lucide-react';
import upgradeProIcon from '../../assets/dashboard/upgrade-pro-icon-clean.png';

export const UpgradeProModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    { icon: Cloud, text: '50 GB Secure Cloud Storage (vs 2 GB Free)' },
    { icon: Smartphone, text: 'Unlimited Devices & Instant Offline Sync' },
    { icon: Zap, text: 'Full-text Search with OCR for images & PDFs' },
    { icon: Shield, text: 'Version History with 90-day restore point' }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-3xl p-6 bg-[#1b1429] border border-purple-500/40 text-white shadow-2xl animate-in zoom-in-95 duration-150 select-none text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pro Icon Illustration */}
        <div className="flex justify-center mb-3">
          <img
            src={upgradeProIcon}
            alt="NoteNest Pro"
            className="w-20 h-auto object-contain drop-shadow-lg"
          />
        </div>

        {/* Heading */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/30 text-xs font-semibold text-purple-200 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>NoteNest Pro Plan</span>
        </div>
        <h3 className="font-serif font-bold text-2xl text-white">
          Level Up Your Knowledge
        </h3>
        <p className="text-xs text-stone-300 mt-1 max-w-xs mx-auto leading-relaxed">
          Unlock maximum storage, multi-device synchronization and advanced search capabilities.
        </p>

        {/* Features List */}
        <div className="my-5 space-y-2.5 text-left p-3.5 rounded-2xl bg-[#140e21] border border-purple-500/20">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="flex items-center gap-3 text-xs text-stone-200">
                <div className="w-5 h-5 rounded-full bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span>{feat.text}</span>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-full font-semibold text-xs sm:text-sm bg-gradient-to-r from-[#9333ea] to-[#7c3aed] text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.65)] transition-all cursor-pointer"
        >
          Got It, Thanks!
        </button>
      </div>
    </div>
  );
};

export default UpgradeProModal;
