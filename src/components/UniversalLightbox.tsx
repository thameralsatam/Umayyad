import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Language, LightboxImageItem } from '../types';
import { MosqueProgrammaticArtwork } from './MosqueProgrammaticArtwork';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  MapPin,
  BookOpen,
  Calendar,
  Loader2,
} from 'lucide-react';

interface UniversalLightboxProps {
  images: LightboxImageItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate?: (index: number) => void;
  lang: Language;
}

export const UniversalLightbox: React.FC<UniversalLightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
  lang,
}) => {
  const isAr = lang === 'ar';
  const currentImg = images[currentIndex] || images[0];

  // Zoom & Pan state
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [hasImageError, setHasImageError] = useState<boolean>(false);

  // Gesture refs
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartScaleRef = useRef<number>(1);
  const lastTapRef = useRef<number>(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Clamp pan offsets so the image can never be dragged out of the screen boundaries.
   * Keeps image edges comfortably visible within the viewport.
   */
  const clampPan = useCallback(
    (x: number, y: number, scale: number): { x: number; y: number } => {
      if (scale <= 1) return { x: 0, y: 0 };
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 768;
      const el = imageContainerRef.current;
      const baseW = el ? el.offsetWidth : vw * 0.85;
      const baseH = el ? el.offsetHeight : vh * 0.7;

      const scaledW = baseW * scale;
      const scaledH = baseH * scale;

      const maxPanX = scaledW > vw ? (scaledW - vw) / 2 + 50 : 40;
      const maxPanY = scaledH > vh ? (scaledH - vh) / 2 + 50 : 40;

      return {
        x: Math.max(-maxPanX, Math.min(maxPanX, x)),
        y: Math.max(-maxPanY, Math.min(maxPanY, y)),
      };
    },
    []
  );

  // Reset zoom, pan, and loading state when image changes
  useEffect(() => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
    setIsDragging(false);
    setIsImageLoading(true);
    setHasImageError(false);
  }, [currentIndex, currentImg?.src]);

  // Lock body scroll while lightbox is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const resetTransform = useCallback(() => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
    setIsDragging(false);
  }, []);

  const handleZoomIn = () => {
    setZoomScale((prev) => {
      const next = Math.min(Number((prev + 0.35).toFixed(2)), 3.5);
      setPanOffset((prevPan) => clampPan(prevPan.x, prevPan.y, next));
      return next;
    });
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => {
      const next = Math.max(Number((prev - 0.35).toFixed(2)), 0.7);
      if (next <= 1) {
        setPanOffset({ x: 0, y: 0 });
      } else {
        setPanOffset((prevPan) => clampPan(prevPan.x, prevPan.y, next));
      }
      return next;
    });
  };

  const handleNext = useCallback(() => {
    if (!onNavigate || images.length <= 1) return;
    const nextIdx = (currentIndex + 1) % images.length;
    onNavigate(nextIdx);
  }, [currentIndex, images.length, onNavigate]);

  const handlePrev = useCallback(() => {
    if (!onNavigate || images.length <= 1) return;
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    onNavigate(prevIdx);
  }, [currentIndex, images.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        resetTransform();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose, resetTransform]);

  // Mouse Pan Handlers with strict screen boundary clamping
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomScale <= 1) return;
    e.preventDefault();
    const rawX = e.clientX - dragStartRef.current.x;
    const rawY = e.clientY - dragStartRef.current.y;
    setPanOffset(clampPan(rawX, rawY, zoomScale));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers: 1-finger pan with boundary clamping, 2-finger pinch zoom, 1-finger swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      pinchStartDistRef.current = dist;
      pinchStartScaleRef.current = zoomScale;
      setIsDragging(false);
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      if (zoomScale > 1) {
        setIsDragging(true);
        dragStartRef.current = {
          x: touch.clientX - panOffset.x,
          y: touch.clientY - panOffset.y,
        };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const ratio = currentDist / pinchStartDistRef.current;
      const targetScale = Math.min(Math.max(pinchStartScaleRef.current * ratio, 0.75), 3.5);
      const nextScale = Number(targetScale.toFixed(2));
      setZoomScale(nextScale);
      setPanOffset((prevPan) => clampPan(prevPan.x, prevPan.y, nextScale));
    } else if (e.touches.length === 1 && isDragging && zoomScale > 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const rawX = touch.clientX - dragStartRef.current.x;
      const rawY = touch.clientY - dragStartRef.current.y;
      setPanOffset(clampPan(rawX, rawY, zoomScale));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (pinchStartDistRef.current !== null && e.touches.length < 2) {
      pinchStartDistRef.current = null;
      if (zoomScale <= 1) {
        setPanOffset({ x: 0, y: 0 });
      }
    }

    if (e.touches.length === 0) {
      setIsDragging(false);

      // Horizontal swipe navigation when not zoomed
      if (zoomScale <= 1 && touchStartRef.current) {
        const changedTouch = e.changedTouches[0];
        if (changedTouch) {
          const deltaX = changedTouch.clientX - touchStartRef.current.x;
          const deltaY = changedTouch.clientY - touchStartRef.current.y;
          const deltaTime = Date.now() - touchStartRef.current.time;

          if (deltaTime < 400 && Math.abs(deltaX) > 40 && Math.abs(deltaY) < 60) {
            if (deltaX < 0) {
              handleNext();
            } else {
              handlePrev();
            }
          }
        }
      }

      // Mobile double-tap to zoom
      const now = Date.now();
      if (now - lastTapRef.current < 280) {
        if (zoomScale > 1) {
          resetTransform();
        } else {
          const newScale = 2.2;
          setZoomScale(newScale);
          setPanOffset({ x: 0, y: 0 });
        }
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
      }
    }
  };

  // Double click (desktop)
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (zoomScale > 1) {
      resetTransform();
    } else {
      setZoomScale(2.2);
      setPanOffset({ x: 0, y: 0 });
    }
  };

  // Mouse wheel zoom with clamp
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.deltaY < 0) {
      setZoomScale((prev) => {
        const next = Math.min(Number((prev + 0.2).toFixed(2)), 3.5);
        setPanOffset((prevPan) => clampPan(prevPan.x, prevPan.y, next));
        return next;
      });
    } else {
      setZoomScale((prev) => {
        const next = Math.max(Number((prev - 0.2).toFixed(2)), 0.75);
        if (next <= 1) {
          setPanOffset({ x: 0, y: 0 });
        } else {
          setPanOffset((prevPan) => clampPan(prevPan.x, prevPan.y, next));
        }
        return next;
      });
    }
  };

  const isTransformed = zoomScale !== 1 || panOffset.x !== 0 || panOffset.y !== 0;

  if (!currentImg) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-black/96 text-white select-none transition-opacity duration-200"
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* 
        ========================================================================
        1. CLEAN TOP HEADER (CATEGORY BADGE, PRESTIGIOUS COUNTER & CLOSE BUTTON)
        ========================================================================
      */}
      <header
        className="pointer-events-none fixed inset-x-0 top-0 pt-4 pb-8 px-4 sm:px-8 flex items-center justify-between z-50 bg-gradient-to-b from-black/90 via-black/40 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Category Badge */}
        <div className="pointer-events-auto flex items-center gap-2">
          {currentImg.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-[#d8c79d] border border-white/15 text-xs font-heading font-medium backdrop-blur-md">
              {currentImg.category}
            </span>
          )}
        </div>

        {/* Counter & Close Button */}
        <div className="pointer-events-auto flex items-center gap-2.5 shrink-0">
          {images.length > 1 && (
            <span className="text-xs text-white/90 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md select-none font-medium">
              0{currentIndex + 1} <span className="text-[#b9a779]">/</span> 0{images.length}
            </span>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/15 backdrop-blur-md shadow-lg"
            title={isAr ? 'إغلاق المعاينة (Esc)' : 'Close (Esc)'}
            aria-label="Close lightbox"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* 
        ========================================================================
        2. INTERACTIVE MAIN VIEWPORT WITH ZERO OBSTRUCTION
        ========================================================================
      */}
      <main
        ref={viewportRef}
        className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center px-4 sm:px-8 pt-18 pb-32 sm:pb-36 transition-all duration-200 touch-none"
        onWheel={handleWheel}
        onClick={(e) => {
          if (e.target === viewportRef.current) {
            onClose();
          }
        }}
      >
        {/* Visual Artwork or Image Display with Zoom & Pan */}
        <div
          ref={imageContainerRef}
          className={`relative max-w-5xl max-h-[75vh] transition-transform will-change-transform flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl border border-[#b9a779]/35 ${
            isDragging ? 'duration-0' : 'duration-150 ease-out'
          } ${
            zoomScale > 1
              ? isDragging
                ? 'cursor-grabbing'
                : 'cursor-grab'
              : 'cursor-zoom-in'
          }`}
          style={{
            transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoomScale})`,
            transformOrigin: 'center center',
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleClick}
          onClick={(e) => e.stopPropagation()}
        >
          {currentImg.src && !hasImageError ? (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                  <Loader2 className="w-8 h-8 text-[#b9a779] animate-spin" />
                </div>
              )}
              <img
                src={currentImg.src}
                alt={currentImg.title}
                referrerPolicy="no-referrer"
                onLoad={() => setIsImageLoading(false)}
                onError={() => {
                  setIsImageLoading(false);
                  setHasImageError(true);
                }}
                className={`max-w-[90vw] max-h-[70vh] w-auto h-auto object-contain transition-opacity duration-300 ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                draggable={false}
              />
            </>
          ) : (
            <div className="w-[92vw] max-w-4xl aspect-[16/10] sm:aspect-[16/9]">
              <MosqueProgrammaticArtwork
                title={currentImg.title}
                category={currentImg.category}
                era={currentImg.year}
                lang={lang}
                className="w-full h-full"
              />
            </div>
          )}
        </div>

        {/* Floating Navigation Arrows on the Air with Blur */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xl border border-white/20 text-white transition-all shadow-2xl flex items-center justify-center cursor-pointer z-40"
              title={isAr ? 'الصورة السابقة' : 'Previous Image'}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xl border border-white/20 text-white transition-all shadow-2xl flex items-center justify-center cursor-pointer z-40"
              title={isAr ? 'الصورة التالية' : 'Next Image'}
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </main>

      {/* 
        ========================================================================
        3. BOTTOM EDITORIAL OVERLAY: HARMONIOUS, SERENE & UNCLUTTERED
        ========================================================================
      */}
      <footer
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-16 pb-6 px-4 sm:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-5">
          {/* Editorial Caption Area */}
          <div className="pointer-events-auto space-y-2 max-w-2xl">
            {/* Image Subject Title */}
            <h3 className="text-base sm:text-lg lg:text-xl font-heading font-bold text-white tracking-wide">
              {currentImg.title}
            </h3>

            {/* Description - Calm, serene, uniform font weight */}
            {currentImg.description && (
              <p className="text-xs sm:text-sm text-[#F4EFE6]/90 font-light leading-relaxed font-['Qomra',sans-serif]">
                {currentImg.description.replace(/\*\*/g, '')}
              </p>
            )}

            {/* Metadata Badges with subtle gold accents */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#b9a779]/90 font-light pt-0.5">
              {currentImg.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#b9a779] shrink-0" />
                  <span>{currentImg.location}</span>
                </span>
              )}
              {currentImg.year && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#b9a779] shrink-0" />
                  <span>{currentImg.year}</span>
                </span>
              )}
              {currentImg.citation && (
                <span className="hidden sm:flex items-center gap-1.5 text-[#b9a779]/80 truncate max-w-sm">
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{currentImg.citation}</span>
                </span>
              )}
            </div>
          </div>

          {/* Zoom Controls Toolbar */}
          <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-2xl border border-white/15 text-white shadow-2xl transition-colors shrink-0 self-start md:self-end">
              {/* Zoom Out Button */}
              <button
                onClick={handleZoomOut}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={isAr ? 'تصغير (-)' : 'Zoom Out (-)'}
                aria-label="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Zoom Percentage */}
              <div className="w-10 sm:w-12 text-center text-[11px] sm:text-xs font-semibold text-white/90 select-none">
                {Math.round(zoomScale * 100)}%
              </div>

              {/* Zoom In Button */}
              <button
                onClick={handleZoomIn}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={isAr ? 'تكبير (+)' : 'Zoom In (+)'}
                aria-label="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Reset Zoom & Pan Button */}
              <button
                onClick={resetTransform}
                className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                  isTransformed
                    ? 'bg-[#b9a779]/40 text-[#f5ebd7]'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/10'
                }`}
                title={isAr ? 'إعادة ضبط الحجم والموضع (0)' : 'Reset Scale & Pan (0)'}
                aria-label="Reset scale and pan"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
        </div>
      </footer>
    </div>,
    document.body
  );
};
