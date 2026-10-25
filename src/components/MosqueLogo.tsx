import React from 'react';
import { Language } from '../types';

interface MosqueLogoProps {
  variant?: 'horizontal' | 'icon';
  colorMode?: 'gold' | 'off-white' | 'white' | 'darkgreen' | 'black' | 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  lang?: Language;
  className?: string;
  showSubtitle?: boolean;
}

export const MosqueLogo: React.FC<MosqueLogoProps> = ({
  variant = 'horizontal',
  colorMode = 'darkgreen',
  size = 'md',
  lang = 'ar',
  className = '',
}) => {
  const isDark = colorMode === 'white' || colorMode === 'off-white' || colorMode === 'dark';

  // Map variant, lang, and colorMode to the official SVG assets in /logo/
  const getLogoPath = (): { src: string; width: number; height: number; alt: string } => {
    if (variant === 'icon') {
      return {
        src: '/logo/Logo.svg',
        width: 190,
        height: 182,
        alt: lang === 'ar' ? 'شعار وزارة الأوقاف' : 'Ministry of Endowments Emblem',
      };
    }

    // Default: Horizontal
    if (lang === 'en') {
      return {
        src: isDark ? '/logo/en-dark.svg' : '/logo/en.svg',
        width: 181,
        height: 64,
        alt: 'Ministry of Endowments — Syrian Arab Republic',
      };
    }

    // Arabic Horizontal
    return {
      src: isDark ? '/logo/ar-dark.svg' : '/logo/ar.svg',
      width: 162,
      height: 58,
      alt: 'وزارة الأوقاف — الجمهورية العربية السورية',
    };
  };

  const getHeightClass = () => {
    switch (size) {
      case 'sm':
        return variant === 'icon' ? 'h-7 w-7' : 'h-[42px]';
      case 'md':
        return variant === 'icon' ? 'h-10 w-10' : 'h-[56px] sm:h-[66px]';
      case 'lg':
        return variant === 'icon' ? 'h-16 w-16' : 'h-16 sm:h-20';
      case 'xl':
        return variant === 'icon' ? 'h-24 w-24' : 'h-24 sm:h-28';
      default:
        return 'h-[58px]';
    }
  };

  const logoData = getLogoPath();

  return (
    <div className={`inline-flex items-center select-none max-w-full ${className}`}>
      <img
        src={logoData.src}
        alt={logoData.alt}
        width={logoData.width}
        height={logoData.height}
        className={`${getHeightClass()} w-auto max-w-full object-contain transition-transform duration-300 hover:opacity-95`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};

