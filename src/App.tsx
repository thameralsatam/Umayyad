import React, { useCallback, useEffect, useRef, useState } from 'react';
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

const SECTION_IDS: SectionId[] = ['home', 'history', 'architecture', 'mosaics', 'gallery', 'visit'];

function getInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem('site_lang');
    if (saved === 'ar' || saved === 'en') {
      return saved;
    }
  } catch {
    // Ignore storage restrictions
  }

  try {
    const browserLang = (navigator.language || (navigator as { userLanguage?: string }).userLanguage || '').toLowerCase();
    if (browserLang.startsWith('ar')) {
      return 'ar';
    }
  } catch {
    // Ignore navigator errors
  }

  // Fallback to English for any language outside the available languages (ar / en)
  return 'en';
}

export default function App() {
  const [lang, setLang] = useState<Language>(getInitialLanguage);
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const locked = useRef(false);
  const lockTimer = useRef<number | null>(null);

  const handleLanguageChange = useCallback((newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem('site_lang', newLang);
    } catch {
      // Ignore storage restrictions
    }
  }, []);

  // اتجاه الصفحة واللغة وعنوان التبويب
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.title =
      lang === 'ar'
        ? 'الجامع الأموي الكبير بدمشق | وزارة الأوقاف'
        : 'The Great Umayyad Mosque of Damascus | Ministry of Endowments';
  }, [lang]);

  // تمييز القسم الظاهر في القائمة أثناء التمرير
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (locked.current) return;
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveSection(id);
          });
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
      if (lockTimer.current) window.clearTimeout(lockTimer.current);
    };
  }, []);

  const handleNavigate = useCallback((id: SectionId) => {
    setActiveSection(id);
    locked.current = true;
    if (lockTimer.current) window.clearTimeout(lockTimer.current);
    lockTimer.current = window.setTimeout(() => {
      locked.current = false;
    }, 600);

    if (id === 'home') {
      window.scrollTo({ top: 0, left: 0 });
      if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);
      return;
    }

    document.getElementById(id)?.scrollIntoView({ block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  }, []);

  return (
    <LightboxProvider lang={lang}>
      <div className="flex min-h-screen flex-col bg-white text-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          {lang === 'ar' ? 'تخطَّ إلى المحتوى' : 'Skip to content'}
        </a>

        <Header
          lang={lang}
          onLanguageChange={handleLanguageChange}
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />

        <main id="main-content" className="flex-1">
          <HeroSection lang={lang} />
          <TimelineSection lang={lang} />
          <ArchitectureSection lang={lang} />
          <MosaicsSection lang={lang} />
          <PhotoGallerySection lang={lang} />
          <VisitSection lang={lang} />
        </main>

        <Footer lang={lang} />
      </div>
    </LightboxProvider>
  );
}
