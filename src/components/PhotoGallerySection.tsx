import React, { useState } from 'react';
import { Language, LightboxImageItem } from '../types';
import { PHOTO_GALLERY_ITEMS } from '../data/content';
import { Maximize2 } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { useLightbox } from '../context/LightboxContext';
import { Reveal } from './Motion';

interface PhotoGallerySectionProps {
  lang: Language;
}

type GalleryCategory = 'all' | 'courtyard' | 'interior' | 'mosaics' | 'minarets' | 'damascus';

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = React.memo(({ lang }) => {
  const allItems = PHOTO_GALLERY_ITEMS[lang];
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all');
  const { openLightbox } = useLightbox();

  const isAr = lang === 'ar';

  const categories: { id: GalleryCategory; label: string }[] = [
    { id: 'all', label: isAr ? 'جميع الصور' : 'All Photos' },
    { id: 'courtyard', label: isAr ? 'الصحن والفناء' : 'Courtyard' },
    { id: 'interior', label: isAr ? 'الحرم والداخل' : 'Sanctuary' },
    { id: 'mosaics', label: isAr ? 'الفسيفساء' : 'Mosaics' },
    { id: 'minarets', label: isAr ? 'المآذن' : 'Minarets' },
    { id: 'damascus', label: isAr ? 'دمشق القديمة' : 'Old Damascus' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? allItems
    : allItems.filter((item) => item.category === selectedCategory);

  const handleOpenPhoto = (index: number) => {
    const lightboxImages: LightboxImageItem[] = filteredItems.map((item) => ({
      id: item.id,
      src: item.imageUrl,
      title: item.title,
      category: item.categoryName,
      description: item.description,
      location: item.location,
      year: item.yearTaken,
      citation: isAr ? 'أرشيف التوثيق البصري للجامع الأموي' : 'Umayyad Mosque Photographic Archive',
    }));

    openLightbox(lightboxImages, index);
  };

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-[#faf8f5] text-[#002623] relative scroll-mt-20 sm:scroll-mt-24 border-b border-primary-12"
    >
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
        {/* Unified Section Header & Introduction */}
        <Reveal from="bottom" className="text-center max-w-2xl mx-auto space-y-3">
          <h2
            id="gallery-heading"
            className="text-fluid-h2 font-bold font-heading text-[#002623]"
          >
            {isAr ? 'المعرض التوثيقي' : 'Photographic Archive'}
          </h2>

          <p
            className="text-sm sm:text-base font-light leading-relaxed text-[#666666] max-w-xl mx-auto font-['Qomra',sans-serif]"
            style={{ fontWeight: 300 }}
          >
            {isAr
              ? 'مجموعة فوتوغرافية توثق معالم الجامع وتفاصيله المعمارية بدقة عالية.'
              : 'A photographic collection documenting the mosque’s architectural landmarks in high definition.'}
          </p>
        </Reveal>

        {/* Category Filters */}
        <Reveal from="bottom" delay={0.1} className="flex items-center justify-center flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-light font-['Qomra',sans-serif] transition-all duration-200 cursor-pointer border select-none ${
                  isSelected
                    ? 'bg-[#002623] text-white border-[#002623] shadow-2xs'
                    : 'bg-white text-[#637381] border-primary-12 hover:bg-[#002623]/5 hover:text-[#002623]'
                }`}
                style={{ fontWeight: isSelected ? 400 : 300 }}
              >
                {cat.label}
              </button>
            );
          })}
        </Reveal>

        {/* Unified Photo Mosaic Grid (Compact, Seamless, Zero Lag, Information in Lightbox) */}
        <Reveal from="bottom" delay={0.15}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleOpenPhoto(idx)}
                title={isAr ? `${item.title} — اضغط للتكبير والتفاصيل` : `${item.title} — Click to view details`}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-[#e8e6df] hover:shadow-lg transition-all duration-300 cursor-pointer shadow-2xs"
              >
                {/* Image */}
                <SafeImage
                  src={item.imageUrl}
                  alt={item.title}
                  category={item.categoryName}
                  era={item.yearTaken}
                  variant="architectural"
                  aspectRatio="aspect-square"
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  objectPosition={item.objectPosition || 'object-center'}
                  showOverlay={false}
                  lang={lang}
                />

                {/* Subtle Hover Zoom Preview */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 flex items-start justify-end">
                  <div className="w-8 h-8 rounded-full bg-white/40 backdrop-blur-md text-[#002623] flex items-center justify-center shadow-xs">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
});

