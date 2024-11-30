import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className={className}
    >
      <defs>
        <linearGradient id="mindfulGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#6a11cb', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#2575fc', stopOpacity:1}} />
        </linearGradient>
      </defs>
      <path 
        d="M50 10 
           Q70 30, 50 50 
           Q30 70, 50 90 
           Q70 70, 50 50 
           Q30 30, 50 10" 
        fill="url(#mindfulGradient)" 
        stroke="white" 
        strokeWidth="3"
      />
      <circle 
        cx="50" 
        cy="50" 
        r="40" 
        fill="transparent" 
        stroke="url(#mindfulGradient)" 
        strokeWidth="4" 
        strokeDasharray="10 5"
      />
    </svg>
  );
};

export default Logo;
