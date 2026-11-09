import React, { useState, useEffect } from 'react';
import { User, Mail, AtSign, FileText } from 'lucide-react';

export const PersonalInformation = ({
  user,
  onSave,
  onChangeEmailRequest,
  isLoading = false
}) => {
  const [name, setName] = useState(user?.name || 'Anshuman Garg');
  const [username, setUsername] = useState(
    user?.username || (user?.name ? `@${user.name.toLowerCase().replace(/\s+/g, '')}` : '@anshuman')
  );
  const [bio, setBio] = useState(
    user?.bio || 'Student • Developer • Building cool stuff with code.'
  );

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.username) setUsername(user.username.startsWith('@') ? user.username : `@${user.username}`);
      if (user.bio !== undefined) setBio(user.bio);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        name: name.trim(),
        username: username.trim().replace(/^@/, ''),
        bio: bio.trim()
      });
    }
  };

  return (
    <div className="rounded-[6px] border border-[#272738] bg-[#14141e] p-5 shadow-sm text-xs">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-4 bg-purple-500 rounded-full" />
        <h3 className="text-sm font-bold text-white tracking-tight">
          Personal Information
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Full Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 font-medium mb-1.5">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="w-3.5 h-3.5 text-gray-500 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-[#1b1b26] border border-[#272738] focus:border-purple-500/60 rounded-[3px] pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 font-medium mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-3.5 h-3.5 text-gray-500 absolute left-3 pointer-events-none" />
              <input
                type="email"
                disabled
                value={user?.email || 'anshumangarg@gmail.com'}
                className="w-full bg-[#181822] border border-[#272738] rounded-[3px] pl-9 pr-20 py-2 text-xs text-gray-400 focus:outline-none cursor-not-allowed"
              />
              <button
                type="button"
                onClick={onChangeEmailRequest}
                className="absolute right-1.5 px-2.5 py-1 rounded-[2px] bg-[#222232] hover:bg-[#2b2b3e] text-gray-300 hover:text-white border border-[#2e2e42] text-[11px] font-medium transition-colors"
              >
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Username & Bio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 font-medium mb-1.5">
              Username
            </label>
            <div className="relative flex items-center">
              <AtSign className="w-3.5 h-3.5 text-gray-500 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@username"
                className="w-full bg-[#1b1b26] border border-[#272738] focus:border-purple-500/60 rounded-[3px] pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 font-medium mb-1.5">
              Bio
            </label>
            <div className="relative flex items-start">
              <FileText className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5 pointer-events-none" />
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief bio or description..."
                className="w-full bg-[#1b1b26] border border-[#272738] focus:border-purple-500/60 rounded-[3px] pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 rounded-[4px] bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold shadow-sm transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

