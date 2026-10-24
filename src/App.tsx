import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Language, SectionId } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TimelineSection } from './components/TimelineSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { MosaicsSection } from './components/MosaicsSection';
import { PhotoGallerySection } from './components/PhotoGallerySection';
import { VisitSection } from './components/VisitSection';
import { Footer } from './components/Footer';
import { LightboxProvider } from './context/LightboxContext';
import { SectionTransitionWrapper } from './components/SectionTransitionWrapper';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [navTarget, setNavTarget] = useState<{ id: SectionId; timestamp: number } | null>(null);
  const isNavigatingRef = useRef(false);
  const navTimeoutRef = useRef<number | null>(null);

  // Keep HTML document dir and lang attributes in sync
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Track active section via IntersectionObserver for active link highlighting
  useEffect(() => {
    const sections: SectionId[] = ['home', 'history', 'architecture', 'mosaics', 'visit'];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const obs = new IntersectionObserver(
          (entries) => {
            if (isNavigatingRef.current) return;
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection((prev) => (prev !== id ? id : prev));
              }
            });
          },
          { rootMargin: '-20% 0px -50% 0px', threshold: 0.1 }
        );
        obs.observe(el);
        observers.push(obs);
      }
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
      if (navTimeoutRef.current) {
        window.clearTimeout(navTimeoutRef.current);
      }
    };
  }, []);

  const handleNavigate = useCallback((sectionId: SectionId) => {
    if (navTimeoutRef.current) {
      window.clearTimeout(navTimeoutRef.current);
    }
    isNavigatingRef.current = true;
    setActiveSection(sectionId);
    const now = Date.now();
    setNavTarget({ id: sectionId, timestamp: now });

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      navTimeoutRef.current = window.setTimeout(() => {
        isNavigatingRef.current = false;
      }, 100);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 76;
      const elementTop = element.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0);
      const targetY = Math.max(0, Math.round(elementTop - headerOffset));

      // Direct immediate positioning without rolling scroll animation
      window.scrollTo({ top: targetY, left: 0, behavior: 'instant' as ScrollBehavior });

      if (window.location.hash !== `#${sectionId}`) {
        window.history.replaceState(null, '', `#${sectionId}`);
      }
    }

    navTimeoutRef.current = window.setTimeout(() => {
      isNavigatingRef.current = false;
    }, 100);
  }, []);

  return (
    <LightboxProvider lang={lang}>
      <div className="min-h-screen flex flex-col relative text-[#161616]">
        {/* Fixed calm background layer */}
        <div
          className="fixed inset-0 pointer-events-none -z-10 bg-[#faf8f5]"
          aria-hidden="true"
        />

        {/* Sticky Main Navigation */}
        <Header
          lang={lang}
          onLanguageChange={setLang}
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />

        {/* Main Content Sections with Instant Navigation & Silky Smooth Reveal */}
        <main id="main-content" className="flex-1">
          {/* 1. Overview & Astronomical Prayer Schedule */}
          <SectionTransitionWrapper
            sectionId="home"
            navTimestamp={navTarget?.id === 'home' ? navTarget.timestamp : undefined}
          >
            <HeroSection lang={lang} onNavigate={handleNavigate} />
          </SectionTransitionWrapper>

          {/* 2. Continuous Historical Chronology & Strata */}
          <SectionTransitionWrapper
            sectionId="history"
            navTimestamp={navTarget?.id === 'history' ? navTarget.timestamp : undefined}
          >
            <TimelineSection lang={lang} />
          </SectionTransitionWrapper>

          {/* 3. Interactive Architectural Plan & Hotspots */}
          <SectionTransitionWrapper
            sectionId="architecture"
            navTimestamp={navTarget?.id === 'architecture' ? navTarget.timestamp : undefined}
          >
            <ArchitectureSection lang={lang} />
          </SectionTransitionWrapper>

          {/* 4. Umayyad Mosaic Masterpieces & Iconography */}
          <SectionTransitionWrapper
            sectionId="mosaics"
            navTimestamp={navTarget?.id === 'mosaics' ? navTarget.timestamp : undefined}
          >
            <MosaicsSection lang={lang} />
          </SectionTransitionWrapper>

          {/* 5. Photographic & Tourism Gallery */}
          <SectionTransitionWrapper
            sectionId="gallery"
            navTimestamp={navTarget?.id === 'gallery' ? navTarget.timestamp : undefined}
          >
            <PhotoGallerySection lang={lang} />
          </SectionTransitionWrapper>

          {/* 6. Practical Visitor Guide, Gates & Sanctuary Etiquette */}
          <SectionTransitionWrapper
            sectionId="visit"
            navTimestamp={navTarget?.id === 'visit' ? navTarget.timestamp : undefined}
          >
            <VisitSection lang={lang} />
          </SectionTransitionWrapper>
        </main>

        {/* Footer */}
        <Footer lang={lang} onNavigate={handleNavigate} />
      </div>
    </LightboxProvider>
  );
}
