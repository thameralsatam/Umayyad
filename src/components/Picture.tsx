import React, { useEffect, useState } from 'react';
import { Language } from '../types';

interface PictureProps {
  src: string;
  alt: string;
  lang: Language;
  className?: string;
  eager?: boolean;
}

/** صورة مع بديل هادئ إذا تعذّر التحميل */
export const Picture: React.FC<PictureProps> = ({ src, alt, lang, className = '', eager = false }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-[#ebebeb] px-4 text-center text-sm text-ink-soft ${className}`}
      >
        {lang === 'ar' ? 'الصورة غير متوفرة' : 'Image unavailable'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
};
