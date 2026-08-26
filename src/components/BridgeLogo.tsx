import React from 'react';

export interface BridgeLogoProps {
  /**
   * Layout variant:
   * - 'full': Centered vertical layout with symbol and eBookMe
   * - 'horizontal': Inline horizontal layout (symbol + text side-by-side)
   * - 'emblem': Infinity-book symbol only
   * - 'compact': Small inline badge for headers / navbars
   */
  variant?: 'full' | 'horizontal' | 'emblem' | 'compact';
  /**
   * Brand text override (defaults to eBookMe)
   */
  brandText?: string;
  /**
   * Theme mode:
   * - 'auto': Uses current text color from parent or dark class
   * - 'light': Dark ink (#2D2D2A) on light canvas
   * - 'dark': White/light (#F7F6F2) on dark canvas
   */
  themeMode?: 'auto' | 'light' | 'dark';
  /**
   * Size presets or custom scaling
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  className?: string;
  symbolClassName?: string;
  textClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const BridgeEmblemSymbol: React.FC<{
  className?: string;
  color?: string;
  strokeWidth?: number;
}> = ({ className = 'w-12 h-12', color = 'currentColor', strokeWidth = 3.2 }) => {
  return (
    <svg
      viewBox="0 0 200 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      aria-label="Bridge Editions Emblem"
    >
      {/* Upper Book Pages - Left Stack */}
      <path
        d="M60 28 L98 52"
        stroke={color}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
      />
      <path
        d="M60 28 C74 24 90 32 98 48"
        stroke={color}
        strokeWidth={strokeWidth * 0.85}
        strokeLinecap="round"
      />
      <path
        d="M56 34 C56 34 56 28 60 28"
        stroke={color}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
      />
      <path
        d="M56 34 L100 58"
        stroke={color}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
      />

      {/* Upper Book Pages - Right Stack */}
      <path
        d="M140 28 L102 52"
        stroke={color}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
      />
      <path
        d="M140 28 C126 24 110 32 102 48"
        stroke={color}
        strokeWidth={strokeWidth * 0.85}
        strokeLinecap="round"
      />
      <path
        d="M144 34 C144 34 144 28 140 28"
        stroke={color}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
      />
      <path
        d="M144 34 L100 58"
        stroke={color}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
      />

      {/* Infinity Ribbon Loop Left & Right Continuous Curves */}
      {/* Left Loop: Curves from center (100, 58) out through (56, 34) down to bottom loop (30, 80) across (60, 106) and crosses back through center (100, 58) */}
      <path
        d="M100 58 C84 46 64 36 56 38 C42 42 24 56 24 78 C24 98 44 108 64 108 C84 108 116 80 144 48 C160 30 176 44 176 72 C176 96 156 108 136 108 C116 108 84 80 56 48 C46 36 34 44 34 62"
        stroke="none"
      />

      {/* Main Infinity Loop Ribbon (Precise Hand-tuned Path matching reference) */}
      <path
        d="M 100 58 
           C 86 44, 62 36, 54 44 
           C 40 54, 26 66, 26 84 
           C 26 102, 44 114, 66 114 
           C 88 114, 112 88, 134 62 
           C 152 42, 174 54, 174 84 
           C 174 102, 156 114, 134 114 
           C 112 114, 88 88, 66 62 
           C 54 48, 42 48, 38 60"
        stroke={color}
        strokeWidth={strokeWidth * 1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Main Top Open Pages Spanning to Center V-Fold */}
      <path
        d="M 54 44 C 68 34, 86 44, 100 58 C 114 44, 132 34, 146 44"
        stroke={color}
        strokeWidth={strokeWidth * 1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Book Outer Page Wings - Left and Right */}
      <path
        d="M 54 44 L 54 36 C 54 36, 76 26, 100 50 C 124 26, 146 36, 146 36 L 146 44"
        stroke={color}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Topmost Subtle Fanned Page Layer */}
      <path
        d="M 60 32 C 60 32, 78 22, 100 44 C 122 22, 140 32, 140 32"
        stroke={color}
        strokeWidth={strokeWidth * 0.85}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const BridgeLogo: React.FC<BridgeLogoProps> = ({
  variant = 'full',
  brandText = 'eBookMe',
  themeMode = 'auto',
  size = 'md',
  className = '',
  symbolClassName = '',
  textClassName = '',
  onClick
}) => {
  // Determine color scheme
  const isDarkExplicit = themeMode === 'dark';
  const isLightExplicit = themeMode === 'light';

  let colorStyle = '';
  if (isDarkExplicit) {
    colorStyle = 'text-[#F7F6F2]';
  } else if (isLightExplicit) {
    colorStyle = 'text-[#2D2D2A]';
  } else {
    colorStyle = 'text-current';
  }

  // Size mapping
  const symbolSizes = {
    xs: 'w-6 h-4',
    sm: 'w-8 h-5.5',
    md: 'w-14 h-9',
    lg: 'w-24 h-15',
    xl: 'w-32 h-20',
    '2xl': 'w-44 h-28',
    custom: ''
  };

  const titleSizes = {
    xs: 'text-[11px]',
    sm: 'text-[13px]',
    md: 'text-[18px]',
    lg: 'text-[26px]',
    xl: 'text-[34px]',
    '2xl': 'text-[44px]',
    custom: ''
  };

  const subtitleSizes = {
    xs: 'text-[6px] tracking-[0.24em]',
    sm: 'text-[7.5px] tracking-[0.26em]',
    md: 'text-[9.5px] tracking-[0.28em]',
    lg: 'text-[13px] tracking-[0.3em]',
    xl: 'text-[15px] tracking-[0.32em]',
    '2xl': 'text-[19px] tracking-[0.34em]',
    custom: ''
  };

  const renderBrandText = (isInline = false) => {
    if (brandText === 'eBookMe') {
      return (
        <span className="font-semibold tracking-normal font-sans">
          eBook<span className="font-light opacity-80">Me</span>
        </span>
      );
    }
    return <span className="font-medium tracking-normal font-sans">{brandText}</span>;
  };

  if (variant === 'emblem') {
    return (
      <div
        className={`inline-flex items-center justify-center ${colorStyle} ${className}`}
        onClick={onClick}
      >
        <BridgeEmblemSymbol
          className={`${symbolSizes[size]} ${symbolClassName}`}
        />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2 ${colorStyle} select-none ${className}`}
        onClick={onClick}
      >
        <BridgeEmblemSymbol className="w-5 h-3.5 shrink-0" strokeWidth={3.4} />
        <div className="flex flex-col leading-none">
          <span className="text-[13px] leading-tight">
            {renderBrandText(true)}
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div
        className={`inline-flex items-center gap-3 ${colorStyle} select-none ${className}`}
        onClick={onClick}
      >
        <BridgeEmblemSymbol
          className={`${symbolSizes[size === 'custom' ? 'md' : size]} ${symbolClassName} shrink-0`}
        />
        <div className={`flex flex-col items-start leading-tight ${textClassName}`}>
          <div className={`${titleSizes[size]}`}>
            {renderBrandText(true)}
          </div>
        </div>
      </div>
    );
  }

  // Default: Full centered layout
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${colorStyle} select-none ${className}`}
      onClick={onClick}
    >
      <BridgeEmblemSymbol
        className={`${symbolSizes[size]} ${symbolClassName} mb-3`}
      />
      <div className={`flex flex-col items-center ${textClassName}`}>
        <h1 className={`leading-none font-sans ${titleSizes[size]}`}>
          {renderBrandText(false)}
        </h1>
        <p
          className={`font-light uppercase leading-none mt-2 opacity-60 font-sans ${subtitleSizes[size]}`}
        >
          Reader
        </p>
      </div>
    </div>
  );
};
