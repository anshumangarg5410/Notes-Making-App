import React, { useState } from 'react';
import { Bell, Mail, ShieldAlert, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const NotificationSettings = () => {
  const { success } = useToast();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [productUpdates, setProductUpdates] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  const handleToggle = (setter, curr, label) => {
    setter(!curr);
    success(`${label} ${!curr ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="rounded-[6px] border border-[#272738] bg-[#14141e] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Notification Preferences</h3>
        </div>
        <p className="text-[11px] text-gray-400 mb-4">
          Choose which notifications and email digests you wish to receive
        </p>

        <div className="space-y-3.5 max-w-lg">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-gray-200">Security Alerts</p>
                <p className="text-[10.5px] text-gray-500">Critical emails about password changes or new device logins</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle(setSecurityAlerts, securityAlerts, 'Security alerts')}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                securityAlerts ? 'bg-purple-600' : 'bg-[#272738]'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${securityAlerts ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-gray-200">Product Updates & Features</p>
                <p className="text-[10.5px] text-gray-500">Newsletters covering new NoteNest capabilities and templates</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle(setProductUpdates, productUpdates, 'Product updates')}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                productUpdates ? 'bg-purple-600' : 'bg-[#272738]'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${productUpdates ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-gray-200">Weekly Knowledge Digest</p>
                <p className="text-[10.5px] text-gray-500">Summary of notes created, modified, and tagged this week</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle(setEmailAlerts, emailAlerts, 'Weekly digest')}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                emailAlerts ? 'bg-purple-600' : 'bg-[#272738]'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${emailAlerts ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

