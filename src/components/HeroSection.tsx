import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Clock, Compass, ChevronDown } from 'lucide-react';
import { Language, SectionId } from '../types';
import { HERO_CONTENT } from '../data/content';
import { PrayerWidget } from './PrayerWidget';
import { Reveal, Stagger, RevealItem } from './Motion';

interface HeroSectionProps {
  lang: Language;
  onNavigate?: (sectionId: SectionId) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = React.memo(({ lang, onNavigate }) => {
  const content = HERO_CONTENT[lang];
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Fade out early and swiftly to prevent colliding with cards below when scrolling down
  const textY = useTransform(scrollYProgress, [0, 0.35], ['0%', '-30px']);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const pointerEvents = useTransform(opacity, (o) => (o <= 0.02 ? 'none' : 'auto'));
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 50], [1, 0]);

  const handleScrollToNext = () => {
    const el = document.getElementById('hero-pillars') || document.getElementById('architecture');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPrayers = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('prayer-times-widget');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToArchitecture = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('architecture');
    } else {
      const el = document.getElementById('architecture');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      aria-labelledby="hero-main-title"
      className="relative bg-[#faf8f5] text-[#002623] px-4 sm:px-6 lg:px-12 overflow-hidden scroll-mt-20 sm:scroll-mt-24 border-b border-primary-12"
    >
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Main Hero Header: First Viewport Presence with Balanced Vertical Flow */}
        <div
          ref={containerRef}
          className="relative min-h-[calc(95svh-77px)] flex flex-col justify-between items-center pt-14 sm:pt-20 md:pt-24 pb-6 sm:pb-8 text-center"
        >
          <motion.div
            style={{ y: textY, opacity, pointerEvents }}
            className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center flex-1 my-auto"
          >
            <Reveal from="bottom" immediate={true} className="w-full flex flex-col items-center">
            {/* Monumental Grand Title - Bold Architectural Weight (700) */}
            <h1
              id="hero-main-title"
              className="text-display-medium md:text-hero font-heading tracking-tight font-bold"
              style={{ fontWeight: 700 }}
            >
              <span className="block text-[#b9a779] font-bold" style={{ fontWeight: 700 }}>
                {lang === 'ar' ? 'الجامع الأموي' : 'The Great Umayyad'}
              </span>
              <span className="block text-[#002623] mt-2 sm:mt-3 font-bold" style={{ fontWeight: 700 }}>
                {lang === 'ar' ? 'الكبير بدمشق' : 'Mosque of Damascus'}
              </span>
            </h1>

            {/* Official Lead Paragraph - Exact 3-line structure with balanced measured spacing */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
              className="mt-6 sm:mt-8 text-center max-w-[700px] mx-auto text-[#003d30] text-xl sm:text-2xl md:text-[25px] leading-[1.8] sm:leading-[1.85] font-light font-['Qomra',sans-serif] space-y-1"
              style={{ fontFamily: "'Qomra', sans-serif", fontWeight: 300 }}
            >
              {content.description.split('\n').map((line, idx) => (
                <span key={idx} className="block">
                  {line}
                </span>
              ))}
            </motion.p>

            {/* Two Distinctive Action Buttons: Enlarged, Side by Side, Refined Rounded-[14px] Corners */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
              className="mt-8 sm:mt-10 flex flex-row items-center justify-center gap-3 sm:gap-4.5 flex-nowrap max-w-full"
            >
              {/* Button 1: Dark Deep Green Primary Button (مواقيت الصلاة) */}
              <button
                type="button"
                onClick={scrollToPrayers}
                className="group inline-flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-8 md:px-9 py-3 sm:py-3.5 md:py-4 rounded-[14px] bg-[#002623] hover:bg-[#003d30] text-[#f7f6f0] border border-[#002623] hover:border-[#003d30] font-light text-base sm:text-lg tracking-normal shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer focus:outline-none whitespace-nowrap"
              >
                <Clock className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#b9a779] shrink-0 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-light">{lang === 'ar' ? 'مواقيت الصلاة' : 'Prayer Times'}</span>
              </button>

              {/* Button 2: Contrasting Ivory White & Gold Border Button (معالم الصرح المعماري) */}
              <button
                type="button"
                onClick={scrollToArchitecture}
                className="group inline-flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-8 md:px-9 py-3 sm:py-3.5 md:py-4 rounded-[14px] bg-white hover:bg-[#f7f6f0] text-[#002623] border border-[#b9a779]/60 hover:border-[#b9a779] font-light text-base sm:text-lg tracking-normal shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer focus:outline-none whitespace-nowrap"
              >
                <Compass className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#002623] shrink-0 transition-transform duration-200 group-hover:rotate-45" />
                <span className="font-light">{lang === 'ar' ? 'معالم الصرح المعماري' : 'Sanctuary Architecture'}</span>
              </button>
            </motion.div>

            {/* Key Heritage Landmarks Strip: Clear, Bold, Architectural Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
              className="mt-10 sm:mt-12 pt-7 sm:pt-9 border-t border-[#b9a779]/25 w-full max-w-2xl mx-auto"
            >
              <div className="grid grid-cols-3 gap-2 sm:gap-6 items-center">
                {/* Metric 1 */}
                <div className="flex flex-col items-center text-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-light font-heading text-[#002623] tracking-tight">
                    {lang === 'ar' ? '705 م' : '705 CE'}
                  </span>
                  <span className="text-xs sm:text-sm text-[#524e47] font-light mt-1">
                    {lang === 'ar' ? 'سنة التأسيس (86 هـ)' : 'Founded (86 AH)'}
                  </span>
                </div>

                {/* Metric 2 */}
                <div className="flex flex-col items-center text-center border-x border-[#b9a779]/25 px-2">
                  <span className="text-xl sm:text-2xl md:text-3xl font-light font-heading text-[#b9a779] tracking-tight">
                    {lang === 'ar' ? 'الوليد بن عبد الملك' : 'Al-Walid I'}
                  </span>
                  <span className="text-xs sm:text-sm text-[#524e47] font-light mt-1">
                    {lang === 'ar' ? 'الخليفة الباني' : 'Caliph & Founder'}
                  </span>
                </div>

                {/* Metric 3 */}
                <div className="flex flex-col items-center text-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-light font-heading text-[#002623] tracking-tight">
                    {lang === 'ar' ? 'UNESCO' : 'UNESCO'}
                  </span>
                  <span className="text-xs sm:text-sm text-[#524e47] font-light mt-1">
                    {lang === 'ar' ? 'تراث عالمي (1979)' : 'World Heritage (1979)'}
                  </span>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </motion.div>

        {/* مؤشر السكرول النابض بالأسفل - متناسق وهادئ ومضبوط بصرياً */}
        <motion.button
          type="button"
          onClick={handleScrollToNext}
          style={{ opacity: scrollIndicatorOpacity }}
          animate={{ y: [0, 5, 0] }}
          transition={{
            y: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
          }}
          className="mt-6 sm:mt-8 mb-3 sm:mb-4 flex flex-col items-center gap-1 text-[#002623]/65 hover:text-[#002623] transition-colors cursor-pointer group focus:outline-none select-none z-20 py-2 px-4 mx-auto"
          aria-label={lang === 'ar' ? 'مرر للاستكشاف' : 'Scroll to explore'}
        >
          <span className="text-xs sm:text-[13px] font-light tracking-wider text-[#002623]/75 group-hover:text-[#002623]">
            {lang === 'ar' ? 'مرر للاستكشاف' : 'Scroll to explore'}
          </span>
          <ChevronDown className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#b9a779] transition-transform duration-300 group-hover:translate-y-0.5" />
        </motion.button>
      </div>

      {/* Core Pillars & Prayer Schedule Widget - Placed Cleanly on Scroll */}
      <div id="hero-pillars" className="pt-12 sm:pt-16 pb-16 sm:pb-20 space-y-12 sm:space-y-16">
        {/* 3 Core Pillars: Centered, Polished, Editorial Cards with Refined Architectural Index */}
        <Stagger stagger={0.08} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.pillars.map((pillar, idx) => (
            <RevealItem
              key={idx}
              className="p-7 sm:p-8 rounded-2xl bg-white border border-primary-12 shadow-2xs flex flex-col items-center justify-between text-center hover:border-[#b9a779]/50 hover:shadow-xs transition-all duration-300 group"
            >
              <div className="flex flex-col items-center space-y-3 w-full">
                {/* Refined Architectural Chapter Index - font-light */}
                <div className="flex items-center justify-center gap-2.5 mb-1">
                  <span className="w-6 h-px bg-[#b9a779]/50 transition-all duration-300 group-hover:w-9 group-hover:bg-[#b9a779]" aria-hidden="true" />
                  <span
                    className="text-xs sm:text-sm font-light font-heading text-[#b9a779] tracking-widest px-1"
                    style={{ fontFamily: "'Qomra', sans-serif" }}
                  >
                    0{idx + 1}
                  </span>
                  <span className="w-6 h-px bg-[#b9a779]/50 transition-all duration-300 group-hover:w-9 group-hover:bg-[#b9a779]" aria-hidden="true" />
                </div>

                {/* Title remains bold */}
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#002623] group-hover:text-[#b9a779] transition-colors">
                  {pillar.title}
                </h3>

                {/* Description in lightest font-light weight */}
                <p
                  className="text-sm sm:text-[15px] text-[#2D2A26] leading-relaxed font-light font-['Qomra',sans-serif] max-w-xs mx-auto"
                  style={{ fontWeight: 300 }}
                >
                  {pillar.desc}
                </p>
              </div>

              {/* Centered Polished Tag Badge in lightest font-light weight */}
              <div
                className="mt-5 pt-4 w-full border-t border-[#f2efe9] flex items-center justify-center gap-2 text-xs font-light text-[#524e47]"
                style={{ fontWeight: 300 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#b9a779]" aria-hidden="true" />
                <span className="font-light">{pillar.tag}</span>
              </div>
            </RevealItem>
          ))}
        </Stagger>

          {/* Integrated Prayer Schedule Widget with Reveal */}
          <Reveal from="bottom">
            <PrayerWidget lang={lang} />
          </Reveal>
        </div>
      </div>
    </section>
  );
});
