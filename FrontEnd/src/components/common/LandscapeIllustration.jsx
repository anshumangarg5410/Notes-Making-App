import React from 'react';

export const LandscapeIllustration = ({ className = '' }) => {
  return (
    <div className={`relative w-full overflow-hidden rounded-b-2xl select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 320 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Cosmic Nebula Sky Gradient */}
          <linearGradient id="skyGrad" x1="160" y1="0" x2="160" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#090D16" />
            <stop offset="40%" stopColor="#0F172A" />
            <stop offset="75%" stopColor="#1E1B4B" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>

          {/* Luminous Celestial Moon/Star Glow */}
          <linearGradient id="moonGlow" x1="160" y1="90" x2="160" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#C7D2FE" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>

          {/* Calm Mirror Water Surface */}
          <linearGradient id="waterGrad" x1="160" y1="135" x2="160" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E1B4B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#090D16" />
          </linearGradient>

          {/* Far Violet Mountain Silhouette */}
          <linearGradient id="mountainBack" x1="160" y1="90" x2="160" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3730A3" />
          </linearGradient>

          {/* Mid-range Ridge */}
          <linearGradient id="mountainMid" x1="160" y1="110" x2="160" y2="155" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E1B4B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="320" height="200" fill="url(#skyGrad)" />

        {/* Distant Nebula Dust & Twinkles */}
        <circle cx="45" cy="35" r="1" fill="#FFFFFF" fillOpacity="0.7" />
        <circle cx="85" cy="20" r="1.5" fill="#C7D2FE" fillOpacity="0.9" />
        <circle cx="120" cy="50" r="1" fill="#FFFFFF" fillOpacity="0.6" />
        <circle cx="190" cy="25" r="1.5" fill="#DDD6FE" fillOpacity="0.8" />
        <circle cx="230" cy="45" r="1" fill="#FFFFFF" fillOpacity="0.7" />
        <circle cx="280" cy="30" r="1.5" fill="#C7D2FE" fillOpacity="0.9" />
        <circle cx="295" cy="65" r="1" fill="#FFFFFF" fillOpacity="0.5" />

        {/* Soft Violet Atmospheric Nebula Mist */}
        <ellipse cx="160" cy="115" rx="140" ry="25" fill="#818CF8" fillOpacity="0.18" />

        {/* Glowing Luminous Celestial Moon */}
        <circle cx="165" cy="118" r="30" fill="url(#moonGlow)" />

        {/* Far Mountains Silhouette */}
        <path
          d="M0 145 L35 125 L90 135 L150 112 L205 128 L270 110 L320 138 L320 170 L0 170 Z"
          fill="url(#mountainBack)"
          opacity="0.9"
        />

        {/* Mid-range Ridge */}
        <path
          d="M0 152 L55 132 L110 144 L175 124 L240 146 L320 126 L320 180 L0 180 Z"
          fill="url(#mountainMid)"
        />

        {/* Water Lake Surface */}
        <path d="M0 142 L320 142 L320 200 L0 200 Z" fill="url(#waterGrad)" />

        {/* Lake Reflection Ripples */}
        <ellipse cx="165" cy="146" rx="28" ry="1.5" fill="#A5B4FC" fillOpacity="0.4" />
        <ellipse cx="163" cy="151" rx="20" ry="1.2" fill="#818CF8" fillOpacity="0.3" />
        <ellipse cx="167" cy="156" rx="14" ry="1" fill="#818CF8" fillOpacity="0.25" />
        <ellipse cx="164" cy="162" rx="9" ry="0.8" fill="#6366F1" fillOpacity="0.2" />

        {/* Left Foreground Shoreline & Pine Ridge */}
        <path
          d="M-10 200 L-10 135 C15 138, 40 155, 65 170 C85 182, 115 190, 135 200 Z"
          fill="#0B0F19"
        />

        {/* Detailed Pine Forest Silhouettes (Left) */}
        <path d="M12 148 L17 132 L22 148 L19 148 L23 158 L11 158 Z" fill="#0E131F" />
        <path d="M22 142 L28 122 L34 142 L31 142 L36 154 L20 154 Z" fill="#090D16" />
        <path d="M34 146 L40 128 L46 146 L43 146 L48 158 L32 158 Z" fill="#0E131F" />
        <path d="M4 158 L9 138 L14 158 L12 158 L16 170 L2 170 Z" fill="#0E131F" />
        <path d="M14 162 L20 140 L26 162 L23 162 L28 174 L12 174 Z" fill="#090D16" />
        <path d="M26 165 L33 144 L40 165 L37 165 L43 178 L23 178 Z" fill="#070A10" />
        <path d="M38 168 L45 146 L52 168 L49 168 L56 182 L34 182 Z" fill="#090D16" />
        <path d="M50 172 L57 152 L64 172 L61 172 L68 185 L46 185 Z" fill="#0E131F" />
        <path d="M62 178 L70 158 L78 178 L75 178 L82 190 L58 190 Z" fill="#090D16" />
        <path d="M76 182 L84 162 L92 182 L89 182 L96 195 L72 195 Z" fill="#0E131F" />
        <path d="M90 188 L98 170 L106 188 L103 188 L110 200 L86 200 Z" fill="#070A10" />

        {/* Right Shore Pine Cluster */}
        <path
          d="M330 200 L330 155 C310 158, 290 170, 275 185 C265 192, 255 196, 250 200 Z"
          fill="#0B0F19"
        />
        <path d="M280 172 L285 155 L290 172 L288 172 L292 182 L278 182 Z" fill="#0E131F" />
        <path d="M292 168 L298 148 L304 168 L301 168 L307 180 L289 180 Z" fill="#090D16" />
        <path d="M306 162 L312 144 L318 162 L315 162 L320 174 L302 174 Z" fill="#070A10" />
      </svg>
    </div>
  );
};
