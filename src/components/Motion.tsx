import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Language } from '../types';
import { Picture } from './Picture';

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  immediate?: boolean;
  /** إزاحة أفقية بالبكسل (موجب = من اليمين، سالب = من اليسار). بدونها يكون الظهور من الأسفل */
  x?: number;
  from?: string; // مقبول للتوافق مع Footer، ولا يُستخدم
}

/** ظهور ناعم: تلاشي مع انزلاق من الأسفل أو من أحد الجانبين */
export const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className = '', immediate = false, x = 0 }) => {
  const reduce = useReducedMotion();
  const hidden = x
    ? { opacity: 0, x: reduce ? 0 : x }
    : { opacity: 0, y: reduce ? 0 : 24 };
  const shown = { opacity: 1, x: 0, y: 0 };

  return (
    <motion.div
      className={className}
      initial={hidden}
      {...(immediate
        ? { animate: shown }
        : { whileInView: shown, viewport: { once: true, amount: 0.3, margin: '0px 0px -12% 0px' } })}
      transition={{ duration: 0.95, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};

/** عدّاد يصعد من الصفر مرة واحدة عند ظهوره */
export const CountUp: React.FC<{ value: number; duration?: number; className?: string }> = ({
  value,
  duration = 1600,
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    let frame = 0;
    let start: number | null = null;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / duration, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {n}
    </span>
  );
};

/** خط ذهبي رفيع يمتد عند الظهور */
export const GoldRule: React.FC<{ isAr: boolean; className?: string }> = ({ isAr, className = '' }) => (
  <motion.span
    aria-hidden="true"
    className={`block h-[2px] rounded-full bg-gold ${className}`}
    style={{ transformOrigin: isAr ? 'right center' : 'left center' }}
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true, amount: 0.8 }}
    transition={{ duration: 0.9, ease: EASE }}
  />
);

interface ParallaxImageProps {
  src: string;
  alt: string;
  lang: Language;
  className?: string;
  eager?: boolean;
}

/**
 * صورة بحركة موازية خفيفة (±5%) مع انتقال تدريجي عند تغيّر الصورة.
 * تتعطل على الشاشات الصغيرة وعند تفعيل "تقليل الحركة".
 */
export const ParallaxImage: React.FC<ParallaxImageProps> = ({ src, alt, lang, className = '', eager = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 0px)');
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const active = wide && !reduce;

  return (
    <div ref={ref} className={`relative isolate overflow-hidden ${className}`}>
      <AnimatePresence initial={false}>
        <motion.div
          key={src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div className="h-full w-full will-change-transform" style={active ? { y, scale: 1.2 } : undefined}>
            <Picture src={src} alt={alt} lang={lang} eager={eager} className="h-full w-full" />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
