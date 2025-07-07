// FILE: ChatLoginSVG.jsx
import React, { useEffect, useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { colors } from '../styles/theme';

const ChatLoginSVG = ({ isDark }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

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

        <rect
          x="170"
          y="80"
          width="60"
          height="100"
          rx="10"
          fill={colors.primary.main}
          className={`transition-all duration-1000 delay-300 ${animate ? 'opacity-100' : 'opacity-0'}`}
          style={{
            transform: animate ? 'translateY(0)' : 'translateY(20px)',
            transition: 'transform 0.8s ease-out, opacity 0.8s ease-out',
          }}
        />

        <rect
          x="175"
          y="90"
          width="50"
          height="80"
          rx="5"
          fill={isDark ? colors.background.dark.paper : colors.background.light.paper}
          className={`transition-all duration-1000 delay-500 ${animate ? 'opacity-100' : 'opacity-0'}`}
        />

        <g className={`transition-all duration-1000 delay-700 ${animate ? 'opacity-100' : 'opacity-0'}`}>
          <rect x="180" y="100" width="25" height="8" rx="4" fill={colors.primary.light} />
          <rect x="185" y="112" width="20" height="8" rx="4" fill={colors.primary.light} />
          <rect x="180" y="130" width="30" height="8" rx="4" fill="#e0e0e0" />
          <rect x="180" y="142" width="22" height="8" rx="4" fill="#e0e0e0" />
        </g>

        <g className={`transition-all duration-2000 delay-1000 ${animate ? 'opacity-100' : 'opacity-0'}`}>
          <circle
            cx="120"
            cy="100"
            r="15"
            fill={colors.primary.light}
            opacity="0.3"
            style={{ animation: animate ? 'float 3s ease-in-out infinite' : 'none' }}
          />
          <MessageCircle className="w-6 h-6" x="114" y="94" fill={colors.primary.main} />
          <circle
            cx="280"
            cy="130"
            r="12"
            fill={colors.primary.light}
            opacity="0.3"
            style={{ animation: animate ? 'float 3s ease-in-out infinite 0.5s' : 'none' }}
          />
          <Send className="w-4 h-4" x="276" y="126" fill={colors.primary.main} />
        </g>

        <g className={`transition-all duration-1000 delay-1200 ${animate ? 'opacity-100' : 'opacity-0'}`}>
          <circle cx="185" cy="160" r="2" fill={colors.primary.main}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="192" cy="160" r="2" fill={colors.primary.main}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="0.3s" />
          </circle>
          <circle cx="199" cy="160" r="2" fill={colors.primary.main}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="0.6s" />
          </circle>
        </g>

        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </svg>
    </div>
  );
};

export default ChatLoginSVG;
