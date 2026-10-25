# الملف الحادي عشر — وزن العنوان، المعرض، ترويسات الأقسام، ونافذة الصور

نفّذ بعد العاشر. لا تعِد تشغيل أي ملف سابق.

## قواعد صارمة

1. نفّذ بالترتيب. انسخ حرفياً. لا إبداع ولا تغيير ولا إضافة.
2. في "استبدال نص": ابحث عن النص القديم بالضبط واستبدله. إذا لم تجده أو وجدته أكثر من مرة، توقف وأخبر المستخدم ولا تخمّن.
3. لا لون خارج قائمة الهوية: `#002623` و`#003D30` و`#B9A779` و`#FFFFFF` و`#EBEBEB` و`#F5F5F5` و`#637381` وما يشتق منها بالشفافية.
4. لا وضع داكن. لا تلمس `Header.tsx` ولا `Footer.tsx`. لا تستخدم `text-stroke` ولا `text-shadow` ولا أي حيلة لتسمين الخط.
5. في النهاية فقط: `npm run lint` ثم `npm run build`.
6. تقرير من خمسة أسطر كحد أقصى.

---

## الخطوة 1: وزن العنوان الرئيسي (`src/index.css`)

وزن حقيقي من ملف الخط نفسه (Bold = 700). الملف `itfQomraArabic-Bold.ttf` معرّف في `@font-face` أصلاً.

ابحث عن:
```
  font-size: clamp(2.75rem, 1.4rem + 6vw, 6rem);
  font-weight: 500;
```
استبدل بـ:
```
  font-size: clamp(2.75rem, 1.4rem + 6vw, 6rem);
  font-weight: 700;
```

---

## الخطوة 2: `src/components/PhotoGallerySection.tsx` (استبدالات نصية)

مساحة أوسع عند البداية والنهاية ونقطة التوقف، حركة أهدأ، وإخفاء شريط التمرير.

| ابحث عن | استبدل بـ |
|---|---|
| `className="flex snap-x snap-proximity scroll-px-5 items-start gap-4 overflow-x-auto px-5 pb-6 pt-4 sm:scroll-px-8 sm:gap-6 sm:px-8"` | `className="flex snap-x snap-proximity scroll-px-8 items-start gap-5 overflow-x-auto px-8 pb-6 pt-4 [scrollbar-width:none] sm:scroll-px-20 sm:gap-8 sm:px-20 [&::-webkit-scrollbar]:hidden"` |
| `<span aria-hidden="true" className="w-4 shrink-0 sm:w-8" />` | `<span aria-hidden="true" className="w-4 shrink-0 sm:w-12" />` |
| `[0.95, 1, 0.98]` | `[0.97, 1, 0.99]` |
| `{ opacity: 0, scale: 1.08 }` | `{ opacity: 0, scale: 1.03 }` |
| `duration: 0.9, delay: (index % 3) * 0.08` | `duration: 1.3, delay: (index % 3) * 0.05` |
| `const amount = el.clientWidth * 0.8;` | `const amount = el.clientWidth * 0.6;` |

---

## الخطوة 3: `src/components/SectionHead.tsx` (استبدال كامل)

الرقم صار رقماً ضخماً شفافاً بتدرج ذهبي خلف العنوان، بدل الوسم الصغير بجانبه.

```tsx
import React from 'react';
import { GoldRule, Reveal } from './Motion';

interface SectionHeadProps {
  id: string;
  no: string;
  title: string;
  lead?: string;
  isAr: boolean;
}

const toArabicDigits = (s: string) => s.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

export const SectionHead: React.FC<SectionHeadProps> = ({ id, no, title, lead, isAr }) => (
  <header className="relative mb-12 sm:mb-16">
    <Reveal>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute start-0 top-0 select-none bg-gradient-to-b from-gold/45 to-gold/0 bg-clip-text text-[8.5rem] font-bold leading-none text-transparent sm:text-[15rem] ${
          isAr ? '' : '[font-family:system-ui,sans-serif]'
        }`}
      >
        {isAr ? toArabicDigits(no) : no}
      </span>
    </Reveal>

    <div className="relative pt-16 sm:pt-28">
      <Reveal delay={0.05}>
        <h2 id={id} className="display-title">
          {title}
        </h2>
      </Reveal>
      <GoldRule isAr={isAr} className="mt-6 w-16" />
      {lead && (
        <Reveal delay={0.1}>
          <p className="lead mt-6 max-w-2xl">{lead}</p>
        </Reveal>
      )}
    </div>
  </header>
);
```

---

## الخطوة 4: `src/components/UniversalLightbox.tsx` (استبدال كامل)

انتقال هادئ بين الصور (تخرج الصورة بنعومة ثم تدخل الجديدة من جهة التنقل)، والتكبير يتمركز على النقطة التي ضغط عليها المستخدم.

```tsx
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
  enter: (d: number) => ({ opacity: 0, x: d * 56, scale: 0.98 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (d: number) => ({ opacity: 0, x: -d * 56, scale: 0.98 }),
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
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl rounded-3xl border border-white/15 bg-white/10 px-6 py-4 text-center backdrop-blur-md"
        >
          <h3 className="text-lg font-light sm:text-xl">{item.title}</h3>
          {item.caption && <p className="mt-1 text-sm font-light text-white/70">{item.caption}</p>}
        </motion.div>

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
```

الأزرار الجانبية موضوعة بحسب الشاشة (يسار ويمين) وليس بحسب اللغة، فلا تغيّر `aria-label` فيهما.

---

## الخطوة 5: الفحص النهائي

1. `npm run lint` ثم `npm run build`، وأصلح الأخطاء بأقل تعديل دون تغيير التصميم.
2. أجب بـ "نعم" أو "لا" بعد التحقق الفعلي:
   - العنوان الرئيسي `font-weight: 700` بلا أي حيلة (stroke أو shadow)
   - شريط التمرير الأفقي في المعرض مخفي
   - الرقم الكبير الشفاف يظهر خلف عنوان كل قسم من الأقسام الخمسة
   - الانتقال بين الصور في نافذة العرض متحرك وهادئ
   - التكبير بالضغط يتمركز على نقطة الضغط
3. تقرير من خمسة أسطر كحد أقصى.

---

انتهى الملف الحادي عشر.
