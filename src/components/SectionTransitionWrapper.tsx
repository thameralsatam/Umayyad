import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface SectionTransitionWrapperProps {
  sectionId: string;
  navTimestamp?: number;
  children: React.ReactNode;
}

/**
 * SectionTransitionWrapper:
 * Delivers immediate position navigation without rolling scroll,
 * accompanied by an instant, silky smooth entrance reveal (fade + subtle upward glide + soft ambient gold aura)
 * exactly as requested: "يظهر مباشرة بنفس الصفحة بس كأنو عمل سكرول مع الظهور السلس طبعا".
 */
export const SectionTransitionWrapper: React.FC<SectionTransitionWrapperProps> = ({
  sectionId,
  navTimestamp,
  children,
}) => {
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);

  useEffect(() => {
    if (navTimestamp) {
      setIsHighlighted(true);
      const timer = window.setTimeout(() => {
        setIsHighlighted(false);
      }, 1200);
      return () => window.clearTimeout(timer);
    }
  }, [navTimestamp]);

  return (
    <motion.div
      key={navTimestamp ? `${sectionId}-${navTimestamp}` : `${sectionId}-init`}
      initial={navTimestamp ? { opacity: 0.2, y: 18 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative transition-all duration-700 ${
        isHighlighted
          ? 'ring-1 ring-[#b9a779]/40 shadow-sm shadow-[#b9a779]/10 rounded-3xl'
          : ''
      }`}
    >
      {children}
    </motion.div>
  );
};
