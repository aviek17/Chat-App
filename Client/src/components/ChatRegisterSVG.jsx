// FILE: ChatRegisterSVG.jsx
import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { colors } from '../styles/theme';

const ChatRegisterSVG = ({ isDark }) => {
  const [animate, setAnimate] = useState(false);
  useEffect(() => setAnimate(true), []);

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full max-w-lg"
        style={{ maxHeight: '450px' }}
      >
        <rect
          x="50"
          y="50"
          width="300"
          height="200"
          rx="20"
          fill={isDark ? colors.background.dark.secondary : colors.background.light.secondary}
          stroke={colors.primary.main}
          strokeWidth="2"
          className={`transition-all duration-1000 ${animate ? 'opacity-100' : 'opacity-0'}`}
          style={{
            transform: animate ? 'scale(1)' : 'scale(0.9)',
            transformOrigin: 'center',
            transition: 'transform 1s ease-out, opacity 1s ease-out',
          }}
        />

        {/* Three user icons */}
        <g className={`transition-all duration-1000 delay-300 ${animate ? 'opacity-100' : 'opacity-0'}`}>
          <circle cx="150" cy="130" r="18" fill={colors.primary.light} />
          <circle cx="200" cy="130" r="18" fill={colors.primary.main} />
          <circle cx="250" cy="130" r="18" fill={colors.primary.dark} />
        </g>

        {/* Speech bubbles */}
        <g className={`transition-all duration-1000 delay-700 ${animate ? 'opacity-100' : 'opacity-0'}`}>
          <rect x="120" y="100" width="35" height="10" rx="5" fill={colors.primary.light} />
          <rect x="240" y="160" width="40" height="10" rx="5" fill={colors.primary.dark} />
          <rect x="180" y="180" width="40" height="10" rx="5" fill={colors.primary.main} />
        </g>

        {/* Connecting arcs */}
        <g className={`transition-all duration-1000 delay-900 ${animate ? 'opacity-100' : 'opacity-0'}`}>
          <path d="M150 130 Q175 100 200 130" stroke={colors.primary.light} strokeWidth="2" fill="none" />
          <path d="M200 130 Q225 160 250 130" stroke={colors.primary.main} strokeWidth="2" fill="none" />
        </g>

        {/* Pulse icon for joining */}
        <g className={`transition-all duration-1000 delay-1100 ${animate ? 'opacity-100' : 'opacity-0'}`}>
          <circle cx="200" cy="210" r="14" fill={colors.primary.light} opacity="0.3" style={{ animation: animate ? 'pulse 2s infinite' : 'none' }} />
          <path d="M195 210 L205 210 M200 205 L200 215" stroke={colors.primary.main} strokeWidth="3" />
        </g>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.1); opacity: 0.6; }
          }
        `}</style>
      </svg>
    </div>
  );
};

export default ChatRegisterSVG;
