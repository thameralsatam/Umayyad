import React, { useMemo, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Language, LightboxImageItem } from '../types';
import { SECTIONS } from '../data/content';
import { GALLERY_KEYS, IMAGES, ImageKey, imgSrc } from '../data/images';
import { useLightbox } from '../context/LightboxContext';
import { Picture } from './Picture';
import { SectionHead } from './SectionHead';

interface PhotoGallerySectionProps {
  lang: Language;
}

interface ItemProps {
  imageKey: ImageKey;
  index: number;
  lang: Language;
  onOpen: (i: number) => void;
}

const GalleryItem: React.FC<ItemProps> = ({ imageKey, index, lang, onOpen }) => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 0.99]);

  return (
    <motion.figure ref={ref} style={reduce ? undefined : { scale }} className="w-60 shrink-0 snap-start sm:w-72">
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={IMAGES[imageKey][lang]}
        className="group block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-[2rem] bg-[#ebebeb] shadow-[0_18px_40px_-24px_rgba(0,38,35,0.18)]"
      >
        <motion.div
          className="h-full w-full"
          initial={reduce ? false : { opacity: 0, scale: 1.03 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.3, delay: (index % 3) * 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <Picture
            src={imgSrc(imageKey)}
            alt={IMAGES[imageKey][lang]}
            lang={lang}
            className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]"
          />
        </motion.div>
      </button>
      <figcaption className="mt-3 px-2 text-sm text-ink-soft">{IMAGES[imageKey][lang]}</figcaption>
    </motion.figure>
  );
};

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = React.memo(({ lang }) => {
  const isAr = lang === 'ar';
  const { openLightbox } = useLightbox();
  const scroller = useRef<HTMLDivElement>(null);

  const slides: LightboxImageItem[] = useMemo(
    () => GALLERY_KEYS.map((key) => ({ src: imgSrc(key), title: IMAGES[key][lang] })),
    [lang]
  );

  const scrollByStep = (next: boolean) => {
    const el = scroller.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    const toRight = isAr ? !next : next;
    el.scrollBy({ left: toRight ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHead
          id="gallery-heading"
          no="04"
          title={SECTIONS.gallery.title[lang]}
          lead={SECTIONS.gallery.lead[lang]}
          isAr={isAr}
        />
      </div>

      <div
        ref={scroller}
        tabIndex={0}
        aria-label={isAr ? 'صور المعرض، مرّر أفقياً' : 'Gallery photos, scroll horizontally'}
        className="flex snap-x snap-proximity scroll-px-8 items-start gap-5 overflow-x-auto px-8 pb-6 pt-4 [scrollbar-width:none] sm:scroll-px-20 sm:gap-8 sm:px-20 [&::-webkit-scrollbar]:hidden"
      >
        {GALLERY_KEYS.map((key, i) => (
          <GalleryItem
            key={key}
            imageKey={key}
            index={i}
            lang={lang}
            onOpen={(n) => openLightbox(slides, n)}
          />
        ))}
      </div>

      <div className="mx-auto mt-4 flex max-w-6xl gap-3 px-5 sm:px-8">
        <button
          type="button"
          onClick={() => scrollByStep(false)}
          aria-label={isAr ? 'السابق' : 'Previous'}
          className="tint-cream grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-line text-ink transition-colors hover:border-gold"
        >
          {isAr ? (
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          ) : (
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          )}
        </button>
        <button
          type="button"
          onClick={() => scrollByStep(true)}
          aria-label={isAr ? 'التالي' : 'Next'}
          className="tint-cream grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-line text-ink transition-colors hover:border-gold"
        >
          {isAr ? (
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          ) : (
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          )}
        </button>
      </div>
    </section>
  );
});
