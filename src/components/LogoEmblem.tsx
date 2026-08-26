import React from 'react';
import { BridgeEmblemSymbol } from './BridgeLogo';

interface LogoEmblemProps {
  emblemType?: string;
  customUrl?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const LogoEmblem: React.FC<LogoEmblemProps> = ({
  emblemType = 'bridge',
  customUrl,
  className = '',
  size = 'lg'
}) => {
  if (customUrl) {
    return (
      <img
        src={customUrl}
        alt="Logo dell'Opera"
        className={`object-contain ${className}`}
      />
    );
  }

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const svgClass = `${iconSizes[size]} transition-all duration-300 stroke-current`;

  switch (emblemType) {
    case 'bridge':
      return (
        <BridgeEmblemSymbol
          className={`${iconSizes[size]} transition-all duration-300 ${className}`}
          strokeWidth={3}
        />
      );
    case 'book':
      return (
        <svg className={svgClass} fill="none" strokeWidth="1.25" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      );
    case 'quill':
      return (
        <svg className={svgClass} fill="none" strokeWidth="1.25" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      );
    case 'feather':
      return (
        <svg className={svgClass} fill="none" strokeWidth="1.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 3.75c-4.5 0-9.75 3.75-12 9.75l-4.5 6.75 6.75-4.5c6-2.25 9.75-7.5 9.75-12z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 20.25l7.5-7.5" />
        </svg>
      );
    case 'seal':
      return (
        <svg className={svgClass} fill="none" strokeWidth="1.2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeDasharray="2 2" />
          <circle cx="12" cy="12" r="6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6M9 12h6" />
        </svg>
      );
    case 'monogram':
      return (
        <svg className={svgClass} fill="none" strokeWidth="1.1" viewBox="0 0 24 24">
          <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16V8l8 8V8" />
        </svg>
      );
    case 'geometric':
      return (
        <svg className={svgClass} fill="none" strokeWidth="1.25" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5v17M3.5 12h17" strokeDasharray="3 3" />
          <polygon points="12,7 17,12 12,17 7,12" strokeWidth="1.1" />
        </svg>
      );
    default:
      return (
        <BridgeEmblemSymbol
          className={`${iconSizes[size]} transition-all duration-300 ${className}`}
          strokeWidth={3}
        />
      );
  }
};
