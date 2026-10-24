import React, { useCallback, useMemo, useRef } from 'react';
import { Language, LightboxImageItem, TimelineEvent } from '../types';
import { TIMELINE_EVENTS } from '../data/content';
import { SafeImage } from './SafeImage';
import { useLightbox } from '../context/LightboxContext';
import { motion, useScroll, useTransform } from 'motion/react';
import { Reveal } from './Motion';
import { Maximize2 } from 'lucide-react';

interface TimelineCardProps {
  event: TimelineEvent;
  idx: number;
  lang: Language;
  onOpenImage: (index: number) => void;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ event, idx, lang, onOpenImage }) => {
  const isAr = lang === 'ar';
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollRef = useScroll({ target: cardRef, offset: ['start end', 'end start'] });
  // Smooth parallax range ensuring image is larger than container so boundaries never show
  const imgY = useTransform(scrollRef.scrollYProgress, [0, 1], ['-12%', '12%'], { clamp: true });

  return (
    <div className="relative space-y-4 sm:space-y-5">
      {/* Milestone Node on the Continuous Timeline Spine */}
      <div className="absolute -start-7 sm:-start-12 md:-start-16 top-1 flex items-center justify-center w-6 sm:w-10 h-8 z-20">
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-2 border-[#b9a779] shadow-xs flex items-center justify-center shrink-0">
          <div className="w-2 h-2 rounded-full bg-[#002623]" />
        </div>
      </div>

      {/* Unified Milestone Top Header: Index + Era Name + Period Date */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-0.5">
        <div className="flex items-center gap-3">
          <span className="font-heading font-bold text-sm sm:text-base text-[#b9a779] tracking-wider">
            0{idx + 1}
          </span>
          <span className="h-4 w-px bg-[#b9a779]/30" aria-hidden="true" />
          <h3 className="font-heading text-lg sm:text-2xl font-bold text-[#002623]">
            {event.eraName}
          </h3>
        </div>

        {/* Date Display - Clean free-flowing typography without capsule */}
        <span className="text-xs sm:text-sm font-medium text-[#b9a779] font-heading tracking-wide">
          {event.dateDisplay}
        </span>
      </div>

      {/* Parallax Image Card */}
      <motion.article
        ref={cardRef}
        id={`milestone-${event.id}`}
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        onClick={() => onOpenImage(idx)}
        className="relative h-[400px] sm:h-[500px] lg:h-[560px] w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl bg-[#002623] cursor-pointer select-none group border border-[#b9a779]/20"
      >
        <motion.div
          style={{ y: imgY }}
          className="absolute top-[-15%] left-0 w-full h-[130%] will-change-transform"
        >
          <SafeImage
            src={event.imageUrl}
            alt={event.title}
            category={event.eraName}
            era={event.dateDisplay}
            className="w-full h-full object-cover"
            lang={lang}
          />
        </motion.div>

        {/* Gradient overlay for clear bottom text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#002623]/95 via-[#002623]/40 to-transparent pointer-events-none z-10" />

        {/* Top Hover Hint to view in full resolution */}
        <div className="absolute top-4 end-4 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 text-[#F4EFE6] text-xs font-heading font-medium border border-white/15 backdrop-blur-xs">
            <Maximize2 className="w-3.5 h-3.5 text-[#b9a779]" />
            <span>{isAr ? 'تكبير بدقة كاملة' : 'Full Resolution'}</span>
          </span>
        </div>

        {/* Bottom Content Area: Milestone Subject Title & Narrative */}
        <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 z-20 text-[#F4EFE6] space-y-2.5">
          <h4 className="font-heading text-2xl sm:text-3xl lg:text-4xl leading-tight font-light drop-shadow-md">
            {event.title}
          </h4>
          <p
            className="text-sm sm:text-base text-[#F4EFE6]/90 leading-relaxed font-light font-['Qomra',sans-serif] line-clamp-2 max-w-2xl"
            style={{ fontWeight: 300 }}
          >
            {event.narrative.replace(/\*\*/g, '')}
          </p>
        </div>
      </motion.article>
    </div>
  );
};

interface TimelineSectionProps {
  lang: Language;
}

export const TimelineSection: React.FC<TimelineSectionProps> = React.memo(({ lang }) => {
  // 4 foundational monumental eras: Aramean, Roman, Byzantine, Umayyad
  const events = useMemo(() => TIMELINE_EVENTS[lang].slice(0, 4), [lang]);
  const isAr = lang === 'ar';
  const { openLightbox } = useLightbox();

  // Lightbox items for the 4 core eras
  const allLightboxImages: LightboxImageItem[] = useMemo(
    () =>
      events.map((e) => ({
        id: e.id,
        src: e.imageUrl || '',
        title: e.title,
        category: e.eraName,
        description: e.narrative.replace(/\*\*/g, ''),
        location: isAr ? 'الجامع الأموي الكبير بدمشق' : 'The Umayyad Mosque of Damascus',
        year: e.dateDisplay,
        citation: e.academicCitation || (isAr ? 'المديرية العامة للآثار والمتاحف' : 'DGAM Syria Archives'),
      })),
    [events, isAr]
  );

  const handleOpenImage = useCallback(
    (index: number) => {
      openLightbox(allLightboxImages, index);
    },
    [allLightboxImages, openLightbox]
  );

  return (
    <section
      id="history"
      aria-labelledby="history-heading"
      className="py-24 sm:py-32 bg-white text-[#002623] relative scroll-mt-20 sm:scroll-mt-24 border-b border-primary-12 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 space-y-16 sm:space-y-20">
        {/* Section Header */}
        <Reveal from="bottom" className="text-center max-w-2xl mx-auto space-y-3">
          <h2
            id="history-heading"
            className="text-fluid-h2 font-bold font-heading text-[#002623]"
          >
            {isAr ? 'المسار التاريخي' : 'Historical Timeline'}
          </h2>
          <p
            className="text-sm sm:text-base font-light leading-relaxed text-[#33312E] max-w-xl mx-auto font-['Qomra',sans-serif]"
            style={{ fontWeight: 300 }}
          >
            {isAr
              ? 'رحلة بصرية في محطات تعاقب الطبقات الحضارية الكبرى على موقع الجامع الأموي.'
              : 'A visual journey through the major civilizational strata of the Umayyad Mosque.'}
          </p>
        </Reveal>

        {/* Continuous Timeline Pathway (Spine + Milestone Nodes) */}
        <div className="relative ps-7 sm:ps-12 md:ps-16">
          {/* Vertical Timeline Spine Line */}
          <div
            className="absolute start-3 sm:start-5 md:start-7 top-4 bottom-12 w-[2px] bg-gradient-to-b from-[#b9a779]/20 via-[#b9a779]/60 to-[#b9a779]/20"
            aria-hidden="true"
          />

          {/* Sequence of Timeline Milestones */}
          <div className="space-y-16 sm:space-y-24">
            {events.map((event, idx) => (
              <TimelineCard
                key={event.id}
                event={event}
                idx={idx}
                lang={lang}
                onOpenImage={handleOpenImage}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
