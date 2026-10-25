import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Language, LightboxImageItem } from '../types';
import { MOSAICS, SECTIONS } from '../data/content';
import { imgAlt, imgSrc } from '../data/images';
import { useLightbox } from '../context/LightboxContext';
import { ParallaxImage, Reveal } from './Motion';
import { SectionHead } from './SectionHead';

interface MosaicsSectionProps {
  lang: Language;
}

export const MosaicsSection: React.FC<MosaicsSectionProps> = React.memo(({ lang }) => {
  const isAr = lang === 'ar';
  const { openLightbox } = useLightbox();
  const [index, setIndex] = useState(0);
  const current = MOSAICS[index];

  const slides: LightboxImageItem[] = useMemo(
    () =>
      MOSAICS.map((m) => ({
        src: imgSrc(m.image),
        title: m.title[lang],
        caption: m.text[lang],
      })),
    [lang]
  );

  return (
    <section id="mosaics" aria-labelledby="mosaics-heading" className="bg-ivory px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          id="mosaics-heading"
          no="03"
          title={SECTIONS.mosaics.title[lang]}
          lead={SECTIONS.mosaics.lead[lang]}
          isAr={isAr}
        />

        <Reveal>
          <div role="tablist" className="mb-6 flex gap-3 overflow-x-auto pb-2">
            {MOSAICS.map((m, i) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                id={`mosaic-tab-${m.id}`}
                aria-selected={i === index}
                aria-controls="mosaic-panel"
                onClick={() => setIndex(i)}
                className={`pill cursor-pointer transition-colors duration-300 ${
                  i === index
                    ? 'tint-ink border-transparent text-white'
                    : 'tint-cream text-ink-soft hover:border-gold hover:text-ink'
                }`}
              >
                {m.tab[lang]}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="relative">
            <button
              type="button"
              onClick={() => openLightbox(slides, index)}
              aria-label={isAr ? 'تكبير الصورة' : 'Enlarge image'}
              className="block w-full cursor-zoom-in"
            >
              <ParallaxImage
                src={imgSrc(current.image)}
                alt={imgAlt(current.image, lang)}
                lang={lang}
                className="aspect-[4/5] w-full rounded-[2.5rem] bg-[#ebebeb] shadow-[0_24px_60px_-30px_rgba(0,38,35,0.18)] sm:aspect-[16/10] lg:aspect-[21/9]"
              />
            </button>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-gradient-to-t from-ink/80 via-ink/10 to-transparent"
            />
            <AnimatePresence mode="wait">
              <motion.h3
                key={current.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="pointer-events-none absolute inset-x-6 bottom-6 max-w-2xl text-3xl font-light leading-tight text-white drop-shadow-md sm:inset-x-10 sm:bottom-10 sm:text-5xl"
              >
                {current.title[lang]}
              </motion.h3>
            </AnimatePresence>
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            id="mosaic-panel"
            role="tabpanel"
            aria-labelledby={`mosaic-tab-${current.id}`}
            initial={{ opacity: 0, x: isAr ? -48 : 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isAr ? 48 : -48 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="card-soft mt-6 p-6 sm:p-10"
          >
            <p className="lead max-w-3xl">{current.text[lang]}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
});
