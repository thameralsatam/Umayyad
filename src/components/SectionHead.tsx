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
  <header className="mb-12 sm:mb-16">
    <Reveal>
      <div className="flex items-center gap-4 sm:gap-5">
        <span
          aria-hidden="true"
          className="mb-1.5 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/70 text-lg font-light leading-none text-ink sm:h-14 sm:w-14 sm:text-xl"
        >
          <span className="block -translate-x-[0.05em] translate-y-[0.13em]">{isAr ? toArabicDigits(no) : no}</span>
        </span>

        <div className="relative pb-1.5">
          <h2 id={id} className="display-title">
            {title}
          </h2>
          <GoldRule isAr={isAr} className="absolute inset-x-0 bottom-0 w-full" />
        </div>
      </div>
    </Reveal>

    {lead && (
      <Reveal delay={0.1}>
        <p className="lead mt-6 max-w-2xl">{lead}</p>
      </Reveal>
    )}
  </header>
);
