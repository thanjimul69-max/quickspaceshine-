import React from 'react';

interface QSSLogoProps {
  className?: string;
  variant?: 'gradient' | 'white' | 'dark' | 'emerald' | 'pink' | 'black';
}

export const QSSLogo: React.FC<QSSLogoProps> = ({
  className = 'w-10 h-10',
  variant = 'dark',
}) => {
  const fillColor =
    variant === 'white'
      ? '#FFFFFF'
      : variant === 'emerald'
      ? '#10B981'
      : variant === 'pink'
      ? '#000000'
      : variant === 'dark' || variant === 'black'
      ? '#000000'
      : '#000000';

  return (
    <svg
      viewBox="0 0 220 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} filter drop-shadow-sm`}
      aria-label="Quick Space Shine QSS Logo"
    >
      <defs>
        <linearGradient id="qss-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#000000" />
          <stop offset="50%" stopColor="#09090b" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
      </defs>

      <g fill={fillColor}>
        {/* Tall Condensed Bold 'Q' */}
        <path d="M 50 10 C 20 10 2 40 2 92 C 2 144 20 174 50 174 C 62 174 73 167 82 154 L 96 176 L 120 154 L 98 126 C 104 115 108 103 108 92 C 108 40 80 10 50 10 Z M 50 42 C 68 42 78 62 78 92 C 78 116 71 135 58 141 L 76 163 L 62 172 L 44 148 C 24 144 22 122 22 92 C 22 62 32 42 50 42 Z" />

        {/* Lower Stencil 'S' */}
        <path d="M 98 112 C 86 112 74 118 70 128 C 66 137 70 146 82 150 L 92 153 C 102 156 106 161 104 167 C 101 174 88 178 76 172 C 71 169 68 162 67 155 L 54 157 C 56 168 63 179 74 184 C 91 191 114 185 118 171 C 122 158 114 148 98 143 L 88 140 C 80 137 78 132 80 127 C 82 121 92 118 102 122 C 107 124 110 128 111 133 L 124 130 C 122 121 114 113 98 112 Z" />
        {/* Stencil Cutouts for Lower S */}
        <line x1="72" y1="124" x2="84" y2="130" stroke="currentColor" strokeWidth="4" />

        {/* Upper Stencil 'S' */}
        <path d="M 142 60 C 130 60 118 66 114 76 C 110 85 114 94 126 98 L 136 101 C 146 104 150 109 148 115 C 145 122 132 126 120 120 C 115 117 112 110 111 103 L 98 105 C 100 116 107 127 118 132 C 135 139 158 133 162 119 C 166 106 158 96 142 91 L 132 88 C 124 85 122 80 124 75 C 126 69 136 66 146 70 C 151 72 154 76 155 81 L 168 78 C 166 69 158 61 142 60 Z" />
      </g>
    </svg>
  );
};
