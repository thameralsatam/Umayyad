import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UniversalLightbox } from '../components/UniversalLightbox';
import { LightboxImageItem, Language } from '../types';

interface LightboxContextType {
  openLightbox: (images: LightboxImageItem[], startIndex?: number) => void;
  closeLightbox: () => void;
}

const LightboxContext = createContext<LightboxContextType | undefined>(undefined);

export const LightboxProvider: React.FC<{ children: ReactNode; lang: Language }> = ({
  children,
  lang,
}) => {
  const [images, setImages] = useState<LightboxImageItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openLightbox = useCallback((imgs: LightboxImageItem[], startIndex: number = 0) => {
    if (!imgs || imgs.length === 0) return;
    setImages(imgs);
    setCurrentIndex(startIndex);
    setIsOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <LightboxContext.Provider value={{ openLightbox, closeLightbox }}>
      {children}
      {isOpen && images.length > 0 && (
        <UniversalLightbox
          images={images}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onNavigate={setCurrentIndex}
          lang={lang}
        />
      )}
    </LightboxContext.Provider>
  );
};

export const useLightbox = (): LightboxContextType => {
  const ctx = useContext(LightboxContext);
  if (!ctx) {
    throw new Error('useLightbox must be used within a LightboxProvider');
  }
  return ctx;
};
