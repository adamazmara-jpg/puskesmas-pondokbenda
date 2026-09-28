import React from 'react';

interface LogoProps {
  className?: string;
}

export const PuskesmasLogo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <svg
      viewBox="0 0 300 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Hexagon Border */}
      <polygon
        points="150,12 285,90 285,250 150,328 15,250 15,90"
        fill="none"
        stroke="#064e3b"
        strokeWidth="18"
        strokeLinejoin="miter"
      />

      {/* Base Green Cross */}
      <path
        d="M105 65 H195 V135 H255 V215 H195 V285 H105 V215 H45 V135 H105 Z"
        fill="#047857"
      />

      {/* Darker Green Roof / House Overlay */}
      <path
        d="M95 215 L255 135 V215 H195 V285 H105 V215 Z"
        fill="#064e3b"
      />

      {/* White Roof Slope Accent */}
      <path
        d="M90 215 L255 132"
        stroke="#ffffff"
        strokeWidth="12"
        strokeLinecap="square"
      />

      {/* Two Overlapping White Circles */}
      <circle
        cx="162"
        cy="188"
        r="17"
        fill="none"
        stroke="#ffffff"
        strokeWidth="6"
      />
      <circle
        cx="184"
        cy="188"
        r="17"
        fill="none"
        stroke="#ffffff"
        strokeWidth="6"
      />
    </svg>
  );
};
