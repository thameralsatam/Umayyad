import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, SectionId } from '../types';
import { NAV_ITEMS } from '../data/content';
import { MosqueLogo } from './MosqueLogo';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
  activeSection: SectionId;
  onNavigate: (sectionId: SectionId) => void;
}

// EASE constant identical to official Ministry app (v.EASE: [0.22, 1, 0.36, 1])
const EASE = [0.22, 1, 0.36, 1] as const;

// Official Globe SVG from mow-identity
const GlobeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="currentColor"
    className={className}
  >
    <path
      d="M22 12C22 17.5228 17.5228 22 12 22M22 12C22 6.47715 17.5228 2 12 2M22 12H2M12 22C6.47715 22 2 17.5228 2 12M12 22C9.43223 19.3038 8 15.7233 8 12C8 8.27674 9.43223 4.69615 12 2M12 22C14.5678 19.3038 16 15.7233 16 12C16 8.27674 14.5678 4.69615 12 2M2 12C2 6.47715 6.47715 2 12 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Official Menu Hamburger SVG from mow-identity with exact 3-bar paths & opacity
const MenuIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="currentColor"
    className={className}
  >
    <path
      opacity="0.4"
      d="M15.7798 4.5H5.2202C4.27169 4.5 3.5 5.06057 3.5 5.75042C3.5 6.43943 4.27169 7 5.2202 7H15.7798C16.7283 7 17.5 6.43943 17.5 5.75042C17.5 5.06054 16.7283 4.5 15.7798 4.5Z"
      fill="currentColor"
    />
    <path
      d="M18.7798 10.75H8.2202C7.27169 10.75 6.5 11.3106 6.5 12.0004C6.5 12.6894 7.27169 13.25 8.2202 13.25H18.7798C19.7283 13.25 20.5 12.6894 20.5 12.0004C20.5 11.3105 19.7283 10.75 18.7798 10.75Z"
      fill="currentColor"
    />
    <path
      d="M15.7798 17H5.2202C4.27169 17 3.5 17.5606 3.5 18.2504C3.5 18.9394 4.27169 19.5 5.2202 19.5H15.7798C16.7283 19.5 17.5 18.9394 17.5 18.2504C17.5 17.5606 16.7283 17 15.7798 17Z"
      fill="currentColor"
    />
  </svg>
);

// Mobile menu animation variants identical to official Ministry codebase (C & j)
const menuContainerVariants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.18, ease: EASE },
  },
  open: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.28, ease: EASE, when: 'beforeChildren', staggerChildren: 0.04 },
  },
};

const menuItemVariants = {
  closed: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.18, ease: EASE },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: EASE },
  },
};

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  activeSection,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const navList = NAV_ITEMS[lang];

  // Handle escape key and click outside
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target) || navRef.current?.contains(target)) {
        return;
      }
      setMobileMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = (id: SectionId) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    onLanguageChange(nextLang);
  };

  return (
    <header
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="shadow-nav relative z-50 flex h-[77px] w-full shrink-0 items-center justify-between border-b border-solid border-primary-12 bg-white px-[10px] md:px-[50px] lg:px-[100px] text-black"
    >
      {/* Official Ministry Logo Brand with exact 162x58 / 181x64 proportions */}
      <a
        href="#home"
        onClick={(e) => {
          e.preventDefault();
          handleLinkClick('home');
        }}
        aria-label={lang === 'ar' ? 'وزارة الأوقاف' : 'Ministry of Endowments'}
        className="flex items-center shrink-0 cursor-pointer focus:outline-none"
      >
        <MosqueLogo
          variant="horizontal"
          lang={lang}
          colorMode="darkgreen"
          size="md"
          className="[&>img]:h-[56px] sm:[&>img]:h-[66px]"
        />
      </a>

      {/* Desktop Navigation matching official Ministry layout */}
      <nav
        aria-label={lang === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}
        className="hidden items-center gap-6 lg:flex"
      >
        {navList.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              id={`nav-link-${item.id}`}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.id);
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex h-[40px] items-center px-[10px] text-[18px] leading-[40px] whitespace-nowrap transition-colors duration-200 cursor-pointer focus:outline-none ${
                isActive
                  ? 'font-medium text-black'
                  : 'font-light text-black/80 hover:text-black'
              }`}
            >
              <span>{item.label}</span>
              {isActive && (
                <motion.span
                  layoutId="header-active-link"
                  aria-hidden="true"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="bg-secondary absolute inset-x-0 bottom-0 h-px"
                />
              )}
            </a>
          );
        })}
      </nav>

      {/* Controls: Locale Switcher & Mobile Menu Button (Perfect Horizontal Alignment) */}
      <div className="flex items-center gap-[10px] lg:gap-[5px]">
        {/* Language Switcher matching official styling: shows 'EN' in Arabic, 'عربي' in English */}
        <button
          id="language-switcher-btn"
          onClick={toggleLanguage}
          dir="ltr"
          className="flex items-center gap-[5px] text-primary transition-colors cursor-pointer px-1 py-1 focus:outline-none"
          title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
        >
          <span className={`text-[20px] font-medium text-center ${lang === 'ar' ? 'leading-none -mb-1' : 'leading-none'}`}>
            {lang === 'ar' ? 'EN' : 'عربي'}
          </span>
          <GlobeIcon size={24} className="shrink-0" />
        </button>

        {/* Mobile Menu Button matching official rotate & whileTap mechanics */}
        <motion.button
          ref={buttonRef}
          type="button"
          id="mobile-menu-toggle-btn"
          aria-label={mobileMenuOpen ? (lang === 'ar' ? 'إغلاق القائمة' : 'Close menu') : (lang === 'ar' ? 'فتح القائمة' : 'Open menu')}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileTap={{ scale: 0.88 }}
          transition={{ duration: 0.15, ease: EASE }}
          className="rounded-full p-2 lg:hidden text-black hover:bg-black/5 transition-colors cursor-pointer focus:outline-none shrink-0"
        >
          <motion.span
            className="block"
            animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <MenuIcon size={24} />
          </motion.span>
        </motion.button>
      </div>

      {/* Mobile Drawer Menu matching official Ministry open/close variants & design */}
      <AnimatePresence initial={false}>
        {mobileMenuOpen && (
          <motion.nav
            ref={navRef}
            id="mobile-menu"
            aria-label={lang === 'ar' ? 'قائمة الجوال' : 'Mobile menu'}
            variants={menuContainerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="absolute inset-x-0 top-full flex flex-col overflow-hidden border-b border-solid border-black/50 bg-white lg:hidden z-50 text-start shadow-xl"
          >
            {navList.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <motion.div key={item.id} variants={menuItemVariants}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item.id);
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex h-[42px] w-full items-center px-4 py-2.5 text-[16px] leading-[30px] transition-colors cursor-pointer text-start ${
                      isActive ? 'text-secondary font-medium' : 'text-black font-normal hover:bg-black/5'
                    }`}
                  >
                    {item.label}
                  </a>
                </motion.div>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};


