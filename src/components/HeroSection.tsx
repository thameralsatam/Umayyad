import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Language, LightboxImageItem } from '../types';
import { GATES, HISTORY, HOME } from '../data/content';
import { imgAlt, imgSrc } from '../data/images';
import { useLightbox } from '../context/LightboxContext';
import { PrayerWidget } from './PrayerWidget';
import { CountUp, ParallaxImage, Reveal } from './Motion';

interface HeroSectionProps {
  lang: Language;
}

const STATS = [
  { value: HISTORY.length, label: { ar: 'حقب تاريخية', en: 'Historical eras' } },
  { value: 3, label: { ar: 'مآذن', en: 'Minarets' } },
  { value: GATES.length, label: { ar: 'مداخل', en: 'Entrances' } },
];

export const HeroSection: React.FC<HeroSectionProps> = React.memo(({ lang }) => {
  const isAr = lang === 'ar';
  const lines = HOME.title[lang];
  const firstScreen = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { openLightbox } = useLightbox();

  const { scrollYProgress } = useScroll({ target: firstScreen, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 0.7], ['0%', '18%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const goNext = () => {
    document.getElementById('history')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const slides: LightboxImageItem[] = [{ src: imgSrc('hero'), title: imgAlt('hero', lang) }];

  return (
    <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl sm:h-[28rem] sm:w-[28rem]"
      />

      <div
        ref={firstScreen}
        className="relative mx-auto flex min-h-[calc(100svh-77px)] max-w-6xl flex-col items-center justify-center px-5 pt-8 pb-12 text-center sm:px-8 sm:pt-10 sm:pb-16"
      >
        <motion.div
          style={reduce ? undefined : { y: textY, opacity: textOpacity }}
          className="flex w-full flex-col items-center"
        >
          <Reveal immediate>
            <h1 id="hero-title" className="hero-title">
              <span className="block text-gold">{lines[0]}</span>
              <span className="block">{lines[1]}</span>
            </h1>
          </Reveal>

          <Reveal immediate delay={0.08}>
            <p className="lead mx-auto mt-6 max-w-2xl">{HOME.lead[lang]}</p>
          </Reveal>

          <Reveal immediate delay={0.16} className="mt-12 sm:mt-16 w-full">
            <ul className="mx-auto flex max-w-xl items-stretch justify-center">
              {STATS.map((s, i) => (
                <li key={i} className={`flex-1 px-3 ${i > 0 ? 'border-s border-gold/50' : ''}`}>
                  <div className="text-4xl font-light text-ink sm:text-5xl">
                    <CountUp value={s.value} />
                  </div>
                  <p className="mt-1 text-sm text-ink-soft sm:text-base">{s.label[lang]}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <motion.button
            type="button"
            onClick={goNext}
            aria-label={isAr ? 'انتقل إلى القسم التالي' : 'Go to the next section'}
            initial={{ opacity: 0, y: 10 }}
            animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, 8, 0] }}
            transition={{
              opacity: { delay: 0.6, duration: 0.8 },
              y: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' },
            }}
            className="pill tint-cream mt-12 sm:mt-16 cursor-pointer text-ink-soft transition-colors hover:border-gold"
          >
            <span>{isAr ? 'تابع التمرير' : 'Scroll to explore'}</span>
            <ChevronDown className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </motion.button>
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-4 sm:px-8 sm:pb-32">
        <Reveal>
          <div className="relative">
            <button
              type="button"
              onClick={() => openLightbox(slides, 0)}
              aria-label={isAr ? 'تكبير الصورة' : 'Enlarge image'}
              className="block w-full cursor-zoom-in"
            >
              <ParallaxImage
                src={imgSrc('hero')}
                alt={imgAlt('hero', lang)}
                lang={lang}
                className="h-[56svh] min-h-[320px] w-full rounded-[2.5rem] bg-[#ebebeb] shadow-[0_24px_60px_-30px_rgba(0,38,35,0.18)] sm:h-[66svh]"
              />
            </button>
            <span className="pointer-events-none absolute start-5 top-5 max-w-[85%] truncate rounded-full border border-white/30 bg-ink/45 px-4 py-2 text-sm text-white backdrop-blur-md">
              {imgAlt('hero', lang)}
            </span>
          </div>
        </Reveal>

        <Reveal className="mt-6 sm:mt-8">
          <PrayerWidget lang={lang} />
        </Reveal>
      </div>
    </section>
  );
});
