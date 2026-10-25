import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface AccordionRowProps {
  id: string;
  title: string;
  summary: string;
  eyebrow?: string;
  open: boolean;
  onToggle: () => void;
  tone?: 'white' | 'ivory';
  children: React.ReactNode;
}

/** بطاقة قابلة للفتح: العنوان والملخص ظاهران، والتفاصيل تظهر عند الضغط */
export const AccordionRow: React.FC<AccordionRowProps> = ({
  id,
  title,
  summary,
  eyebrow,
  open,
  onToggle,
  tone = 'white',
  children,
}) => (
  <div className={`card-soft overflow-hidden ${tone === 'ivory' ? '!bg-ivory' : ''}`}>
    <h3>
      <button
        type="button"
        id={`${id}-button`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-6 px-6 py-6 text-start sm:px-8 sm:py-7"
      >
        <span className="flex flex-col items-start gap-2">
          {eyebrow && (
            <span className="rounded-full tint-forest px-3 py-1 text-sm font-medium text-forest">{eyebrow}</span>
          )}
          <span className="row-title">{title}</span>
          <span className="max-w-xl text-base font-light text-ink-soft">{summary}</span>
        </span>
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
            open ? 'border-gold tint-gold' : 'border-line'
          }`}
        >
          <ChevronDown
            aria-hidden="true"
            strokeWidth={1.5}
            className={`h-5 w-5 text-ink transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </button>
    </h3>

    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={`${id}-panel`}
          role="region"
          aria-labelledby={`${id}-button`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-8 sm:px-8">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
