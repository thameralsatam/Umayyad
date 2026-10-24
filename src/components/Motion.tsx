import React from 'react';
import { motion } from 'motion/react';

/**
 * Motion tokens identical to the official Ministry of Endowments Next.js codebase (mow-identity)
 */
export const MOTION_TOKENS = {
  DISTANCE: 24,
  DURATION: {
    fast: 0.5,
    base: 0.85,
    slow: 1.2,
  },
  EASE: [0.22, 1, 0.36, 1] as const,
  STAGGER: 0.09,
  VIEWPORT: {
    once: true,
    amount: 0.15,
    margin: '0px 0px -10% 0px',
  },
};

export type Direction = 'top' | 'bottom' | 'start' | 'end' | 'none';

const getOffset = (from?: string, distance: number = MOTION_TOKENS.DISTANCE, isRtl: boolean = true) => {
  switch (from) {
    case 'top':
      return { y: -distance };
    case 'bottom':
      return { y: distance };
    case 'start':
      return { x: isRtl ? distance : -distance };
    case 'end':
      return { x: isRtl ? -distance : distance };
    case 'none':
    default:
      return {};
  }
};

export interface RevealProps {
  children: React.ReactNode;
  as?: string;
  from?: Direction;
  distance?: number;
  delay?: number;
  duration?: number;
  immediate?: boolean;
  className?: string;
  isRtl?: boolean;
  once?: boolean;
  'aria-label'?: string;
  id?: string;
}

/**
 * Reveal: Replicating official Ministry Reveal component
 * Smoothly fades and slides an element into view as user scrolls.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  from = 'bottom',
  distance = MOTION_TOKENS.DISTANCE,
  delay = 0,
  duration = MOTION_TOKENS.DURATION.base,
  immediate = false,
  className = '',
  isRtl = true,
  once = true,
  'aria-label': ariaLabel,
  id,
}) => {
  const initial = {
    opacity: 0,
    ...getOffset(from, distance, isRtl),
  };

  const visible = {
    opacity: 1,
    x: 0,
    y: 0,
  };

  return (
    <motion.div
      id={id}
      data-motion=""
      aria-label={ariaLabel}
      className={`${className} transform-gpu`}
      initial={initial}
      {...(immediate
        ? { animate: visible }
        : {
            whileInView: visible,
            viewport: { ...MOTION_TOKENS.VIEWPORT, once },
          })}
      transition={{
        duration,
        delay,
        ease: MOTION_TOKENS.EASE,
      }}
    >
      {children}
    </motion.div>
  );
};

export interface StaggerProps {
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
  immediate?: boolean;
  className?: string;
  once?: boolean;
  id?: string;
}

/**
 * Stagger: Replicating official Ministry Stagger container
 * Cascades reveal animations across child RevealItem components.
 */
export const Stagger: React.FC<StaggerProps> = ({
  children,
  stagger = MOTION_TOKENS.STAGGER,
  delay = 0,
  immediate = false,
  className = '',
  once = true,
  id,
}) => {
  return (
    <motion.div
      id={id}
      data-motion=""
      className={className}
      initial="hidden"
      {...(immediate
        ? { animate: 'shown' }
        : {
            whileInView: 'shown',
            viewport: { ...MOTION_TOKENS.VIEWPORT, once },
          })}
      variants={{
        hidden: {},
        shown: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export interface RevealItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  from?: Direction;
  distance?: number;
  duration?: number;
  className?: string;
  isRtl?: boolean;
  type?: string;
  disabled?: boolean;
}

/**
 * RevealItem: Child of Stagger
 */
export const RevealItem: React.FC<RevealItemProps> = ({
  children,
  from = 'bottom',
  distance = MOTION_TOKENS.DISTANCE,
  duration = MOTION_TOKENS.DURATION.base,
  className = '',
  isRtl = true,
  ...rest
}) => {
  return (
    <motion.div
      data-motion=""
      className={`${className} transform-gpu`}
      variants={{
        hidden: {
          opacity: 0,
          ...getOffset(from, distance, isRtl),
        },
        shown: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration,
            ease: MOTION_TOKENS.EASE,
          },
        },
      }}
      {...(rest as any)}
    >
      {children}
    </motion.div>
  );
};


export interface RuleProps {
  className?: string;
  isRtl?: boolean;
}

/**
 * Rule: Animated dividing line expanding horizontally from start to end
 */
export const Rule: React.FC<RuleProps> = ({ className = 'h-px bg-primary-12 w-full', isRtl = true }) => {
  return (
    <motion.span
      aria-hidden="true"
      data-motion=""
      className={`block ${className}`}
      style={{ transformOrigin: isRtl ? 'right' : 'left' }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={MOTION_TOKENS.VIEWPORT}
      transition={{
        duration: MOTION_TOKENS.DURATION.slow,
        ease: MOTION_TOKENS.EASE,
      }}
    />
  );
};
