import React from 'react';
import { Language } from '../types';
import { MosqueLogo } from './MosqueLogo';
import { CameraOff } from 'lucide-react';

interface MosqueProgrammaticArtworkProps {
  variant?: string;
  title?: string;
  category?: string;
  era?: string;
  className?: string;
  aspectRatio?: string;
  lang?: Language;
}

export function resolveArtworkVariant(
  variant?: string,
  title?: string,
  category?: string,
  id?: string
): string {
  return variant || category || title || id || 'default';
}

/**
 * Serene, perfectly centered placeholder frame.
 * Engineered for 100% responsive symmetry across cards of any size
 * (from small gallery thumbnails to large hero banners) without clipping or left-shifting.
 */
export const MosqueProgrammaticArtwork: React.FC<MosqueProgrammaticArtworkProps> = React.memo(({
  title,
  category,
  era,
  className = '',
  aspectRatio = '',
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';

  return (
    <div
      className={`relative w-full h-full min-h-[120px] overflow-hidden select-none bg-[#fafaf9] text-[#002623] flex flex-col items-center justify-center text-center p-3 sm:p-5 md:p-6 ${aspectRatio} ${className}`}
    >
      {/* Symmetrical, perfectly centered content box */}
      <div className="relative z-10 w-full max-w-[280px] sm:max-w-[340px] mx-auto flex flex-col items-center justify-center space-y-2 sm:space-y-2.5">
        {/* Dignified Mosque Emblem with subtle camera icon */}
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl sm:rounded-2xl bg-white border border-[#e5e5e5] shadow-2xs">
            <MosqueLogo variant="icon" colorMode="gold" className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </div>
          <div className="absolute -bottom-1 -end-1 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center text-[#8a8477] shadow-2xs">
            <CameraOff className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#b9a779]" aria-hidden="true" />
          </div>
        </div>

        {/* Clear, Centered Single-Line Title & Subtitle */}
        <div className="space-y-0.5 sm:space-y-1 w-full px-1">
          {category && (
            <span className="text-[10px] sm:text-xs text-[#b9a779] font-medium tracking-wide block truncate font-['Qomra',sans-serif]">
              {category} {era ? `• ${era}` : ''}
            </span>
          )}
          <h3 className="text-xs sm:text-sm md:text-base font-bold font-heading text-[#002623] tracking-tight leading-snug line-clamp-2">
            {title || (isAr ? 'لا تتوفر صور حالياً' : 'No Photos Available')}
          </h3>
          <p className="text-[10px] sm:text-xs text-[#737373] font-light leading-tight truncate font-['Qomra',sans-serif]">
            {isAr
              ? 'الأرشيف البصري قيد التوثيق المعتمد'
              : 'Visual archive under verified update'}
          </p>
        </div>

        {/* Subtle, Centered Hairline Accent */}
        <div className="flex items-center justify-center gap-2 pt-0.5 text-[#a3a3a3] w-full">
          <span className="h-px w-4 sm:w-6 bg-[#e5e5e5] shrink-0" />
          <span className="text-[9px] sm:text-[10.5px] text-[#8a8477] font-heading font-medium tracking-wide truncate max-w-[140px] sm:max-w-[180px]">
            {isAr ? 'الجامع الأموي بدمشق' : 'Umayyad Mosque'}
          </span>
          <span className="h-px w-4 sm:w-6 bg-[#e5e5e5] shrink-0" />
        </div>
      </div>
    </div>
  );
});
