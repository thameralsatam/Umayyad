import React, { useMemo } from 'react';
import { Language, LightboxImageItem } from '../types';
import { HISTORY, SECTIONS } from '../data/content';
import { imgAlt, imgSrc } from '../data/images';
import { useLightbox } from '../context/LightboxContext';
import { Picture } from './Picture';
import { Reveal } from './Motion';
import { SectionHead } from './SectionHead';

interface TimelineSectionProps {
  lang: Language;
}

export const TimelineSection: React.FC<TimelineSectionProps> = React.memo(({ lang }) => {
  const isAr = lang === 'ar';
  const { openLightbox } = useLightbox();

  const slides: LightboxImageItem[] = useMemo(
    () =>
      HISTORY.map((e) => ({
        src: imgSrc(e.image),
        title: e.title[lang],
        caption: e.date[lang],
      })),
    [lang]
  );

  return (
    <section id="history" aria-labelledby="history-heading" className="bg-ivory px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          id="history-heading"
          no="01"
          title={SECTIONS.history.title[lang]}
          lead={SECTIONS.history.lead[lang]}
          isAr={isAr}
        />

        <ol className="relative mx-auto max-w-5xl space-y-8 md:space-y-12">
          <span aria-hidden="true" className="absolute bottom-0 left-1/2 top-0 hidden w-px bg-line md:block" />

          {HISTORY.map((e, i) => {
            const atStart = i % 2 === 0;
            return (
              <li
                key={e.id}
                className={`relative md:w-[calc(50%-2.5rem)] ${atStart ? 'md:me-auto' : 'md:ms-auto'}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-12 hidden h-3 w-3 rounded-full bg-gold ring-4 ring-ivory md:block ${
                    atStart ? '-end-[2.875rem]' : '-start-[2.875rem]'
                  }`}
                />
                <Reveal>
                  <article className="card-soft overflow-hidden">
                    <button
                      type="button"
                      onClick={() => openLightbox(slides, i)}
                      aria-label={isAr ? `تكبير الصورة: ${e.title.ar}` : `Enlarge image: ${e.title.en}`}
                      className="group block aspect-[16/9] w-full cursor-zoom-in overflow-hidden bg-[#ebebeb]"
                    >
                      <Picture
                        src={imgSrc(e.image)}
                        alt={imgAlt(e.image, lang)}
                        lang={lang}
                        className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                    </button>
                    <div className="p-6 sm:p-8">
                      <span className="pill tint-forest text-forest">{e.date[lang]}</span>
                      <h3 className="row-title mt-4">{e.title[lang]}</h3>
                      <p className="lead mt-3">{e.text[lang]}</p>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
});
