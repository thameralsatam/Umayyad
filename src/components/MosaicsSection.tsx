import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Language, LightboxImageItem } from '../types';
import { MOSAIC_ARTWORKS } from '../data/content';
import { SafeImage } from './SafeImage';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { AnimatedNumber } from './AnimatedNumber';
import { useLightbox } from '../context/LightboxContext';

interface MosaicsSectionProps {
  lang: Language;
}

interface MosaicFeatureCardProps {
  title: string;
  description: string;
  metricLabel: string;
  metricValue: React.ReactNode;
  isAr: boolean;
}

/**
 * Expandable feature card matching ArchitectureSection's calm, clean aesthetic.
 * Clean clickable surface with subtle chevron and animated drawer for the metric.
 */
const MosaicFeatureCard: React.FC<MosaicFeatureCardProps> = ({
  title,
  description,
  metricLabel,
  metricValue,
  isAr,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      onClick={() => setIsExpanded((prev) => !prev)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsExpanded((prev) => !prev);
        }
      }}
      className={`p-6 sm:p-7 rounded-[2rem] border transition-all duration-300 flex flex-col justify-between text-start cursor-pointer select-none ${
        isExpanded
          ? 'bg-[#F9F7F2] border-[#b9a779] shadow-xs'
          : 'bg-[#fafaf9] hover:bg-[#F9F7F2] border-[#002623]/10 hover:border-[#b9a779]/60 shadow-2xs'
      }`}
    >
      <div>
        {/* Header with Title and subtle toggle indicator */}
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-heading text-lg sm:text-xl font-bold text-[#002623] leading-snug">
            {title}
          </h4>
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
              isExpanded
                ? 'bg-[#002623] text-white rotate-180'
                : 'bg-black/5 text-[#002623] hover:bg-black/10'
            }`}
            aria-hidden="true"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Narrative Description */}
        <p className="text-xs sm:text-sm text-[#524e47] font-light leading-relaxed font-['Qomra',sans-serif] mt-2.5">
          {description}
        </p>
      </div>

      {/* Drawer: Expands cleanly without adding a dedicated button row */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="pt-3.5 mt-3.5 border-t border-[#002623]/10 flex items-baseline justify-between">
              <span className="text-xs sm:text-sm text-[#524e47] uppercase font-heading font-medium">
                {metricLabel}
              </span>
              <span className="font-heading text-xl sm:text-2xl font-bold text-[#002623]">
                {metricValue}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface MosaicImageCardProps {
  image: string;
  title: string;
  category: string;
  caption: string;
  lang: Language;
  onOpenLightbox: () => void;
}

/**
 * Mosaic image card with scroll reveal and parallax effect,
 * strictly without any maximize button in the corner.
 */
const MosaicImageCard: React.FC<MosaicImageCardProps> = ({
  image,
  title,
  category,
  caption,
  lang,
  onOpenLightbox,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollRef = useScroll({ target: cardRef, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollRef.scrollYProgress, [0, 1], ['-10%', '10%'], { clamp: true });

  return (
    <article
      ref={cardRef}
      onClick={onOpenLightbox}
      className="relative h-[300px] sm:h-[400px] lg:h-[460px] w-full rounded-[2.2rem] sm:rounded-[2.8rem] overflow-hidden shadow-xl border border-[#b9a779]/20 bg-[#002623] cursor-pointer group select-none"
    >
      <motion.div
        style={{ y: imgY }}
        className="absolute top-[-10%] left-0 w-full h-[120%] will-change-transform"
      >
        <SafeImage
          src={image}
          alt={title}
          category={category}
          priority={true}
          className="w-full h-full object-cover"
          lang={lang}
        />
      </motion.div>

      {/* Gradient overlay for clear bottom text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#002623]/95 via-[#002623]/35 to-transparent pointer-events-none z-10" />

      {/* Bottom Caption on image - White & Larger, matching Timeline */}
      <div className="absolute bottom-6 start-6 end-6 sm:bottom-8 sm:start-8 sm:end-8 z-20 text-white space-y-1.5 drop-shadow-md pointer-events-none">
        <h4 className="font-heading text-xl sm:text-2xl lg:text-3xl leading-snug font-light text-white drop-shadow-md">
          {caption}
        </h4>
      </div>
    </article>
  );
};

export const MosaicsSection: React.FC<MosaicsSectionProps> = React.memo(({ lang }) => {
  const isAr = lang === 'ar';
  const { openLightbox } = useLightbox();

  const [[activeIndex, direction], setSlide] = useState<[number, number]>([0, 1]);

  const rawArtworks = useMemo(() => MOSAIC_ARTWORKS[lang], [lang]);

  // Structured concise artworks matching ArchitectureSection pattern
  const artworks = useMemo(
    () => [
      {
        id: 'barada-frieze',
        title: isAr ? 'جدارية بردى البانورامية الكبرى' : 'The Panoramic Barada Mural',
        lead: isAr
          ? 'أضخم جدارية فسيفساء إسلامية باقية في العالم بطول 34 متراً، تصوّر وادي بردى وبساتين الغوطة وقصور دمشق بفصوص الذهب والزجاج الملون دون كائنات حية.'
          : 'The largest surviving Islamic mosaic mural in the world spanning 34 meters, depicting the Barada River, orchards, and palaces of Damascus.',
        image: rawArtworks[0]?.imageUrl || '',
        category: isAr ? 'جداريات الصحن' : 'Courtyard Murals',
        caption: isAr ? 'جدارية بردى الفسيفسائية الممتدة على الرواق الغربي' : 'Panoramic Barada frieze along the western arcade',
        pillars: [
          {
            title: isAr ? 'امتداد الجدارية الكبرى' : 'Mural Dimensions',
            description: isAr
              ? 'تمتد الجدارية على طول الجدار الغربي لصحن الجامع بارتفاع يصل إلى 7 أمتار كأضخم وثيقة بصرية لعاصمة الخلافة.'
              : 'Spans the western wall of the courtyard up to 7 meters high as a monumental visual record of Damascus.',
            metricLabel: isAr ? 'طول الجدارية' : 'Mural Length',
            metricValue: <AnimatedNumber value={34} suffix={isAr ? ' متراً' : ' m'} />,
          },
          {
            title: isAr ? 'المساحة والذهب الخالص' : 'Gilded Tesserae Surface',
            description: isAr
              ? 'كُسيت الجداريات بفصوص زجاجية مذهبة عيار 24 قيراط وعجائن فيروزية وحجر كلسي شامي ملون.'
              : 'Clad in 24k gold foil glass tesserae (smalti), emerald pastes, and native Syrian limestone.',
            metricLabel: isAr ? 'المساحة الأصلية' : 'Original Surface',
            metricValue: <AnimatedNumber value={4000} suffix={isAr ? ' م²' : ' m²'} />,
          },
        ],
      },
      {
        id: 'tree-of-life',
        title: isAr ? 'شجرة الحياة والخلد الوارفة' : 'The Towering Tree of Life',
        lead: isAr
          ? 'تكوين شجري عملاق وارف الأغصان مكسو بورق الذهب الخالص والزجاج الزمردي، يرمز للخلد والوفرة والسكينة في مطلع العصر الأموي.'
          : 'A monumental botanical composition in gold leaf and emerald glass, embodying serenity and abundance at the apex of Umayyad craftsmanship.',
        image: rawArtworks[1]?.imageUrl || '',
        category: isAr ? 'تفاصيل الفسيفساء' : 'Mosaic Details',
        caption: isAr ? 'شجرة الحياة الباسقة بفصوص الذهب والزجاج الأخضر' : 'The towering tree of life in gold and emerald glass',
        pillars: [
          {
            title: isAr ? 'الأبعاد والإتقان الحرفي' : 'Dimensions & Scale',
            description: isAr
              ? 'لوحة تفصيلية بارتفاع 4 أمتار في الواجهة الغربية تجسد براعة فناني دمشق في ترصيع الفصوص الدقيقة.'
              : 'A 4-meter high masterwork in the western portico demonstrating the pinnacle of Damascene glass tesserae setting.',
            metricLabel: isAr ? 'ارتفاع اللوحة' : 'Panel Height',
            metricValue: <AnimatedNumber value={4} suffix={isAr ? ' أمتار' : ' m'} />,
          },
          {
            title: isAr ? 'التجريد والرمزية الإسلامية' : 'Aniconic Symbolism',
            description: isAr
              ? 'صيغت برؤية إسلامية أصيلة خالية تماماً من صور وتماثيل الكائنات الحية، كرمز للفردوس والخلد.'
              : 'Rendered in an iconic aniconic Islamic visual language free of living beings, symbolizing paradise.',
            metricLabel: isAr ? 'نقاء الذهب' : 'Gold Purity',
            metricValue: isAr ? '24 قيراط' : '24 Karat',
          },
        ],
      },
      {
        id: 'damascus-palaces',
        title: isAr ? 'لوحة قصور وعمائر دمشق' : 'Damascus Palaces & Mansions',
        lead: isAr
          ? 'مشهد معماري يوثق القصور والعمائر الشامية ذات الطوابق المتراكبة والأعمدة الرخامية على ضفاف مجاري المياه في مطلع القرن الثامن.'
          : 'Architectural vignettes recording multi-tiered Damascene mansions and classical columns along tranquil waterways.',
        image: rawArtworks[2]?.imageUrl || '',
        category: isAr ? 'العمارة الشامية' : 'Levantine Architecture',
        caption: isAr ? 'قصور ذات طوابق متعددة وأعمدة رشيقة تحاكي العمارة الشامية' : 'Multi-tiered palaces and classical colonnades',
        pillars: [
          {
            title: isAr ? 'توثيق العمارة الدمشقية' : 'Damascene Urbanism',
            description: isAr
              ? 'توثيق بصري فريد للعمران الشامي والقصور الأرستقراطية المتدرجة بين بساتين الغوطة ومياه بردى.'
              : 'A unique visual record of Levantine palatial architecture nested among the orchards and canals.',
            metricLabel: isAr ? 'تاريخ التأسيس' : 'Period',
            metricValue: isAr ? 'القرن 8 م' : '8th C.',
          },
          {
            title: isAr ? 'الأعمدة والرخام الملون' : 'Marbles & Columns',
            description: isAr
              ? 'تدمج الفسيفساء فصوص الزجاج مع مكعبات الرخام والحجر الكلسي الشامي بتناغم لوني بديع.'
              : 'Harmoniously blends gilded smalti with colored marble and limestone cubes for realistic architectural textures.',
            metricLabel: isAr ? 'الموقع بالجامع' : 'Location',
            metricValue: isAr ? 'الرواق الغربي' : 'Western Portico',
          },
        ],
      },
      {
        id: 'treasury-dome-mosaics',
        title: isAr ? 'الكسوة الفسيفسائية لقبة الخزنة' : 'Treasury Dome Mosaics',
        lead: isAr
          ? 'أشرطة مذهبة من عناقيد الكرمة وأوراق الغار تكسو حجرة بيت المال المثمنة المرفوعة على أعمدة رومانية وسط صحن الجامع.'
          : 'Gilded bands of vine clusters and laurel foliage adorning the octagonal treasury elevated on Roman columns in the courtyard.',
        image: rawArtworks[3]?.imageUrl || '',
        category: isAr ? 'قباب الصحن' : 'Courtyard Domes',
        caption: isAr ? 'الكسوة الفسيفسائية لجدران قبة الخزنة بالصحن' : 'Mosaic revetment on the walls of the Treasury Dome',
        pillars: [
          {
            title: isAr ? 'قبة بيت المال بالصحن' : 'Courtyard Treasury',
            description: isAr
              ? 'حجرة مثمنة مكسوة بالفسيفساء ترتفع لحفظ المال بأمان، مستندة إلى أعمدة كورنثية قديمة.'
              : 'An octagonal chamber clad in mosaic revetment, safely elevating the municipal treasury above the courtyard.',
            metricLabel: isAr ? 'أعمدة الارتكاز' : 'Columns',
            metricValue: <AnimatedNumber value={8} suffix={isAr ? ' أعمدة' : ' columns'} />,
          },
          {
            title: isAr ? 'استمرارية التقاليد الشامية' : 'Craft Continuum',
            description: isAr
              ? 'توثق استمرارية تقنيات الفسيفساء الشامية وتناغمها الدائم مع صرح الجامع وصحنه الرخامي.'
              : 'Demonstrates the enduring continuity of Levantine mosaic craft and harmonious integration with the courtyard.',
            metricLabel: isAr ? 'سنة التوثيق' : 'Date',
            metricValue: isAr ? '789 م' : '789 CE',
          },
        ],
      },
    ],
    [isAr, rawArtworks]
  );

  const handleNavigateRight = useCallback(() => {
    setSlide(([prev]) => {
      const nextIdx = isAr
        ? (prev > 0 ? prev - 1 : artworks.length - 1)
        : (prev < artworks.length - 1 ? prev + 1 : 0);
      return [nextIdx, 1];
    });
  }, [artworks.length, isAr]);

  const handleNavigateLeft = useCallback(() => {
    setSlide(([prev]) => {
      const nextIdx = isAr
        ? (prev < artworks.length - 1 ? prev + 1 : 0)
        : (prev > 0 ? prev - 1 : artworks.length - 1);
      return [nextIdx, -1];
    });
  }, [artworks.length, isAr]);

  const slideVariants = useMemo(
    () => ({
      enter: (dir: number) => ({
        opacity: 0,
        x: (dir || 1) === 1 ? 50 : -50,
      }),
      center: {
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.45,
          ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
        },
      },
      exit: (dir: number) => ({
        opacity: 0,
        x: (dir || 1) === 1 ? -50 : 50,
        transition: {
          duration: 0.2,
          ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
        },
      }),
    }),
    []
  );

  const allLightboxImages: LightboxImageItem[] = useMemo(
    () =>
      artworks.map((art) => ({
        id: art.id,
        src: art.image,
        title: art.title,
        category: art.category,
        description: art.lead,
        location: isAr ? 'الجامع الأموي الكبير بدمشق' : 'The Umayyad Mosque of Damascus',
        year: isAr ? 'العصر الأموي (705–715م)' : 'Umayyad Era (705–715 CE)',
        citation: isAr ? 'توثيق فسيفساء الجامع الأموي' : 'Umayyad Great Mosque Mosaic Documentation',
      })),
    [artworks, isAr]
  );

  const handleOpenLightbox = useCallback(() => {
    openLightbox(allLightboxImages, activeIndex);
  }, [activeIndex, allLightboxImages, openLightbox]);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Trigger only on intentional horizontal swipe (>45px and more horizontal than vertical)
    // Moving in natural finger drag direction
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX > 0) {
        handleNavigateLeft();
      } else {
        handleNavigateRight();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const currentArtwork = artworks[activeIndex];

  return (
    <section
      id="mosaics"
      aria-labelledby="mosaics-heading"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-white text-[#002623] relative scroll-mt-20 sm:scroll-mt-24 border-b border-primary-12 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12">
        {/* Main Section Header - Clean, Focused, No Clutter */}
        <div className="text-center max-w-xl mx-auto">
          <h2
            id="mosaics-heading"
            className="text-fluid-h2 font-bold font-heading text-[#002623]"
          >
            {isAr ? 'الفسيفساء' : 'Mosaics'}
          </h2>
        </div>

        {/* Horizontal Navigation Mosaic Showcase */}
        <div
          className="relative space-y-6 sm:space-y-8"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentArtwork.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ willChange: 'transform, opacity' }}
                className="space-y-6 sm:space-y-8"
              >
                {/* Artwork Header Info */}
                <div className="space-y-2">
                  <h3 className="font-heading text-2xl sm:text-3xl text-[#002623] leading-snug font-bold">
                    {currentArtwork.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#524e47] leading-relaxed font-light font-['Qomra',sans-serif] max-w-3xl">
                    {currentArtwork.lead}
                  </p>
                </div>

                {/* Large Image Frame with Timeline Scroll-Reveal & Parallax */}
                <MosaicImageCard
                  key={currentArtwork.id}
                  image={currentArtwork.image}
                  title={currentArtwork.title}
                  category={currentArtwork.category}
                  caption={currentArtwork.caption}
                  lang={lang}
                  onOpenLightbox={handleOpenLightbox}
                />

                {/* 2 Expandable Feature Cards for current artwork */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-1">
                  {currentArtwork.pillars.map((pillar) => (
                    <MosaicFeatureCard
                      key={pillar.title}
                      title={pillar.title}
                      description={pillar.description}
                      metricLabel={pillar.metricLabel}
                      metricValue={pillar.metricValue}
                      isAr={isAr}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Unified Luxury Navigation Bar: Prestigious Counter Opposite Action Buttons (Outside AnimatePresence) */}
          <div className="flex items-center justify-between pt-2 pb-1 px-1">
            {/* Prestigious Counter */}
            <div className="flex items-center gap-3.5 select-none">
              <div className="flex items-baseline gap-1.5 font-heading">
                <span className="text-2xl sm:text-3xl font-bold text-[#002623] tracking-tight">
                  0{activeIndex + 1}
                </span>
                <span className="text-base sm:text-lg text-[#b9a779] font-light opacity-80">
                  /
                </span>
                <span className="text-sm sm:text-base text-[#b9a779] font-normal tracking-wide">
                  0{artworks.length}
                </span>
              </div>
              <div className="h-4 w-px bg-[#b9a779]/30 hidden sm:block" />
              <span className="text-xs sm:text-[13px] text-[#524e47] hidden sm:inline font-['Qomra',sans-serif] font-light">
                {currentArtwork.title}
              </span>
            </div>

            {/* Navigation Buttons Side by Side */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  isAr ? handleNavigateRight() : handleNavigateLeft();
                }}
                className="w-10 h-10 rounded-full border border-primary-12 bg-white hover:bg-[#fafaf9] hover:border-[#b9a779] text-[#002623] flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                aria-label={isAr ? 'اللوحة السابقة' : 'Previous artwork'}
                title={isAr ? 'اللوحة السابقة' : 'Previous artwork'}
              >
                {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  isAr ? handleNavigateLeft() : handleNavigateRight();
                }}
                className="w-10 h-10 rounded-full border border-primary-12 bg-white hover:bg-[#fafaf9] hover:border-[#b9a779] text-[#002623] flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                aria-label={isAr ? 'اللوحة التالية' : 'Next artwork'}
                title={isAr ? 'اللوحة التالية' : 'Next artwork'}
              >
                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
