import React, { useState } from 'react';
import { Camera, Footprints, Shirt, VolumeX } from 'lucide-react';
import { Language } from '../types';
import { CONDUCT, GATES, HOURS, SECTIONS, VISIT_LABELS } from '../data/content';
import { AccordionRow } from './AccordionRow';
import { Reveal } from './Motion';
import { SectionHead } from './SectionHead';

interface VisitSectionProps {
  lang: Language;
}

const CONDUCT_ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  dress: Shirt,
  shoes: Footprints,
  quiet: VolumeX,
  photo: Camera,
};

export const VisitSection: React.FC<VisitSectionProps> = React.memo(({ lang }) => {
  const isAr = lang === 'ar';
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="visit" aria-labelledby="visit-heading" className="bg-ivory px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          id="visit-heading"
          no="05"
          title={SECTIONS.visit.title[lang]}
          lead={SECTIONS.visit.lead[lang]}
          isAr={isAr}
        />

        <h3 className="sr-only">{VISIT_LABELS.gates[lang]}</h3>
        <div className="space-y-4">
          {GATES.map((g) => (
            <Reveal key={g.id}>
              <AccordionRow
                id={`gate-${g.id}`}
                eyebrow={g.direction[lang]}
                title={g.name[lang]}
                summary={g.summary[lang]}
                open={openId === g.id}
                onToggle={() => setOpenId(openId === g.id ? null : g.id)}
              >
                <p className="lead max-w-2xl">{g.more[lang]}</p>
              </AccordionRow>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 sm:mt-24">
          <Reveal>
            <h3 className="row-title mb-8">{VISIT_LABELS.conduct[lang]}</h3>
          </Reveal>
          <Reveal>
            <ul className="card-soft grid sm:grid-cols-2">
              {CONDUCT.map((c, i) => {
                const Icon = CONDUCT_ICONS[c.id] ?? Shirt;
                return (
                  <li
                    key={c.id}
                    className={`flex items-start gap-5 p-6 sm:p-8 ${i > 0 ? 'border-t border-line' : ''} ${
                      i === 1 ? 'sm:border-t-0' : ''
                    } ${i % 2 === 1 ? 'sm:border-s sm:border-line' : ''}`}
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/60 text-ink">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <div>
                      <h4 className="text-lg font-medium text-ink">{c.title[lang]}</h4>
                      <p className="mt-1 text-base font-light leading-8 text-ink-soft">{c.text[lang]}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>

        <Reveal className="mt-10 sm:mt-14">
          <div className="card-soft flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
            <h4 className="shrink-0 text-lg font-medium text-ink">{VISIT_LABELS.hours[lang]}</h4>
            <p className="lead">{HOURS[lang]}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
});
