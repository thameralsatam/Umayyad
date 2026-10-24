import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { MosqueProgrammaticArtwork } from './MosqueProgrammaticArtwork';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackSrc?: string;
  alt: string;
  category?: string;
  era?: string;
  variant?: string;
  className?: string;
  imgClassName?: string;
  aspectRatio?: string;
  caption?: string;
  showOverlay?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  naturalAspect?: boolean;
  priority?: boolean;
  lang?: Language;
}

/**
 * SafeImage: Renders real images with graceful fallback to MosqueProgrammaticArtwork.
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc,
  alt,
  category,
  era,
  variant,
  className = '',
  imgClassName = '',
  aspectRatio,
  objectPosition = 'object-center',
  priority = false,
  lang = 'ar',
}) => {
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setHasError(false);
    if (imgRef.current && imgRef.current.complete) {
      if (imgRef.current.naturalWidth === 0) {
        setHasError(true);
      }
    }
  }, [src, fallbackSrc]);

  const finalSrc = hasError && fallbackSrc ? fallbackSrc : src;

  if (!finalSrc || (hasError && !fallbackSrc)) {
    return (
      <div
        className={`relative w-full h-full overflow-hidden ${
          aspectRatio ? aspectRatio : ''
        } ${className}`}
      >
        <MosqueProgrammaticArtwork
          title={alt}
          category={category}
          era={era}
          variant={variant}
          lang={lang}
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${
        aspectRatio ? aspectRatio : ''
      } ${className}`}
    >
      <img
        ref={imgRef}
        src={finalSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover ${objectPosition} ${imgClassName}`}
      />
    </div>
  );
};
