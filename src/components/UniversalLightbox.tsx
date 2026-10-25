import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Language, LightboxImageItem } from '../types';

interface UniversalLightboxProps {
  images: LightboxImageItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  lang: Language;
}

const glass =
  'grid cursor-pointer place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20';

const slideVariants = {
  enter: (d: number) => ({ opacity: 0, x: d * 32 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: (d: number) => ({ opacity: 0, x: -d * 32, transition: { duration: 0.2, ease: 'easeIn' } }),
};

export const UniversalLightbox: React.FC<UniversalLightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
  lang,
}) => {
  const isAr = lang === 'ar';
  const count = images.length;
  const item = images[currentIndex] || images[0];

  const [zoomed, setZoomed] = useState(false);
  const [failed, setFailed] = useState(false);
  const [slide, setSlide] = useState(1);
  const touchX = useRef<number | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const imgEl = useRef<HTMLImageElement>(null);
  const zoomPoint = useRef({ x: 0.5, y: 0.5 });

  // step > 0 يعني الانتقال إلى الصورة التالية في الترتيب
  const goTo = useCallback(
    (target: number, step: number) => {
      if (count <= 1) return;
      setSlide(step * (isAr ? -1 : 1));
      onNavigate(target);
    },
    [count, isAr, onNavigate]
  );

  const go = useCallback(
    (step: number) => {
      goTo((currentIndex + step + count) % count, step);
    },
    [count, currentIndex, goTo]
  );

  useEffect(() => {
    setZoomed(false);
    setFailed(false);
  }, [currentIndex]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(isAr ? -1 : 1);
      else if (e.key === 'ArrowLeft') go(isAr ? 1 : -1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, isAr, onClose]);

  // عند التكبير: مركّز المشهد على النقطة التي تم الضغط عليها
  useLayoutEffect(() => {
    if (!zoomed) return;
    const c = stage.current;
    const img = imgEl.current;
    if (!c || !img) return;
    c.scrollTo({
      left: img.offsetLeft + zoomPoint.current.x * img.offsetWidth - c.clientWidth / 2,
      top: img.offsetTop + zoomPoint.current.y * img.offsetHeight - c.clientHeight / 2,
    });
  }, [zoomed]);

  if (!item) return null;

  const onImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!zoomed) {
      const r = e.currentTarget.getBoundingClientRect();
      zoomPoint.current = {
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top) / r.height,
      };
    }
    setZoomed((z) => !z);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null || zoomed) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(delta) < 50) return;
    const dir = delta < 0 ? 1 : -1;
    go(isAr ? -dir : dir);
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="fixed inset-0 z-[9999] flex flex-col bg-[#002623]/45 text-white backdrop-blur-2xl"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-8" onClick={(e) => e.stopPropagation()}>
        <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm tabular-nums backdrop-blur-md">
          {pad(currentIndex + 1)} / {pad(count)}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={isAr ? 'إغلاق' : 'Close'}
          className={`h-11 w-11 ${glass}`}
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="relative min-h-0 flex-1" onClick={(e) => e.stopPropagation()}>
        <div
          ref={stage}
          dir="ltr"
          className={`absolute inset-0 flex px-4 sm:px-24 ${zoomed ? 'overflow-auto' : 'overflow-hidden'}`}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {failed ? (
            <p className="m-auto text-white/70">{isAr ? 'الصورة غير متوفرة' : 'Image unavailable'}</p>
          ) : (
            <AnimatePresence mode="wait" custom={slide} initial={false}>
              <motion.img
                key={item.src}
                ref={imgEl}
                custom={slide}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                src={item.src}
                alt={item.title}
                draggable={false}
                onError={() => setFailed(true)}
                onClick={onImageClick}
                className={`m-auto select-none rounded-[1.75rem] shadow-[0_30px_80px_-20px_rgba(0,38,35,0.18)] ${
                  zoomed
                    ? 'w-[220%] max-w-none cursor-zoom-out'
                    : 'max-h-full max-w-full cursor-zoom-in object-contain'
                }`}
              />
            </AnimatePresence>
          )}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(isAr ? 1 : -1)}
              aria-label={isAr ? 'التالي' : 'Previous'}
              className={`absolute left-3 top-1/2 h-12 w-12 -translate-y-1/2 sm:left-6 ${glass}`}
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(isAr ? -1 : 1)}
              aria-label={isAr ? 'السابق' : 'Next'}
              className={`absolute right-3 top-1/2 h-12 w-12 -translate-y-1/2 sm:right-6 ${glass}`}
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 px-4 pb-6 pt-4 sm:px-8" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.2, ease: 'easeIn' } }}
            className="max-w-2xl rounded-3xl border border-white/15 bg-white/10 px-6 py-4 text-center backdrop-blur-md"
          >
            <h3 className="text-lg font-light sm:text-xl">{item.title}</h3>
            {item.caption && <p className="mt-1 text-sm font-light text-white/70">{item.caption}</p>}
          </motion.div>
        </AnimatePresence>

        {count > 1 && count <= 12 && (
          <div className="flex items-center gap-2" aria-hidden="true">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                tabIndex={-1}
                onClick={() => goTo(i, i > currentIndex ? 1 : -1)}
                className={`h-2 cursor-pointer rounded-full transition-all duration-500 ${
                  i === currentIndex ? 'w-7 bg-[#b9a779]' : 'w-2 bg-white/35'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>,
    document.body
  );
};
