import React, { useMemo, useState } from 'react';
import { Language, LightboxImageItem } from '../types';
import { ARCHITECTURE, SECTIONS } from '../data/content';
import { imgAlt, imgSrc } from '../data/images';
import { useLightbox } from '../context/LightboxContext';
import { AccordionRow } from './AccordionRow';
import { Picture } from './Picture';
import { Reveal } from './Motion';
import { SectionHead } from './SectionHead';

interface ArchitectureSectionProps {
  lang: Language;
}

export const ArchitectureSection: React.FC<ArchitectureSectionProps> = React.memo(({ lang }) => {
  const isAr = lang === 'ar';
  const { openLightbox } = useLightbox();
  const [openId, setOpenId] = useState<string | null>(ARCHITECTURE[0].id);

  const slides: LightboxImageItem[] = useMemo(
    () =>
      ARCHITECTURE.map((a) => ({
        src: imgSrc(a.image),
        title: a.title[lang],
        caption: a.summary[lang],
      })),
    [lang]
  );

  return (
    <section
      id="architecture"
      aria-labelledby="architecture-heading"
      className="bg-white px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHead
          id="architecture-heading"
          no="02"
          title={SECTIONS.architecture.title[lang]}
          lead={SECTIONS.architecture.lead[lang]}
          isAr={isAr}
        />

        <div className="space-y-4">
          {ARCHITECTURE.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.08}>
              <AccordionRow
                id={`arch-${a.id}`}
                tone="ivory"
                title={a.title[lang]}
                summary={a.summary[lang]}
                open={openId === a.id}
                onToggle={() => setOpenId(openId === a.id ? null : a.id)}
              >
                <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
                  <button
                    type="button"
                    onClick={() => openLightbox(slides, i)}
                    aria-label={isAr ? 'تكبير الصورة' : 'Enlarge image'}
                    className="block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-[1.5rem] bg-[#ebebeb]"
                  >
                    <Picture src={imgSrc(a.image)} alt={imgAlt(a.image, lang)} lang={lang} className="h-full w-full" />
                  </button>
                  <p className="lead">{a.body[lang]}</p>
                </div>
              </AccordionRow>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
});
