import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'motion/react';

export const AnimatedNumber: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}> = ({ value, prefix = '', suffix = '', decimals = 0, duration = 1800 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    let start: number | null = null;
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
    let frameId: number;

    const step = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / duration, 1);
      setDisplayValue(value * easeOutCubic(progress));
      if (progress < 1) frameId = requestAnimationFrame(step);
      else setDisplayValue(value);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, value, duration]);

  const formatted = decimals > 0
    ? displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(displayValue).toLocaleString();

  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
};
