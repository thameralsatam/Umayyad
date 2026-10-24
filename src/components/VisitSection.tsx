import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Language, LightboxImageItem } from '../types';
import { ETIQUETTE_GUIDELINES, MOSQUE_IMAGES } from '../data/content';
import { ShieldCheck, Footprints, Camera, VolumeX, Shirt, Clock, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { Reveal, Stagger, RevealItem } from './Motion';
import { useLightbox } from '../context/LightboxContext';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

interface VisitSectionProps {
  lang: Language;
}

interface GateFeatureCardProps {
  title: string;
  description: string;
  metricLabel: string;
  metricValue: React.ReactNode;
  isAr: boolean;
}

/**
 * Expandable feature card matching ArchitectureSection & MosaicsSection aesthetic.
 */
const GateFeatureCard: React.FC<GateFeatureCardProps> = ({
  title,
  description,
  metricLabel,
  metricValue,
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

        <p className="text-xs sm:text-sm text-[#524e47] font-light leading-relaxed font-['Qomra',sans-serif] mt-2.5">
          {description}
        </p>
      </div>

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
              <span className="font-heading text-base sm:text-lg font-bold text-[#002623]">
                {metricValue}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface GateImageCardProps {
  image: string;
  title: string;
  category: string;
  caption: string;
  lang: Language;
  onOpenLightbox: () => void;
}

/**
 * Gate image card with scroll reveal and parallax effect,
 * strictly without any maximize button in the corner.
 */
const GateImageCard: React.FC<GateImageCardProps> = ({
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

export const VisitSection: React.FC<VisitSectionProps> = React.memo(({ lang }) => {
  const etiquette = ETIQUETTE_GUIDELINES[lang];
  const { openLightbox } = useLightbox();
  const [[activeIndex, direction], setSlide] = useState<[number, number]>([0, 1]);

  const isAr = lang === 'ar';

  const gates = useMemo(
    () => [
      {
        id: 'bab-barid',
        title: isAr ? 'باب البريد (البوابة الغربية)' : 'Bab al-Barid (Western Gate)',
        lead: isAr
          ? 'المدخل الأبرز للجامع عند نهاية سوق الحميدية المسقوف، تسبقه أعمدة التيمنوس الروماني الشامخة وقوس النصر لمعبد جوبيتر العريق.'
          : 'The foremost visitor entrance opening from the covered Souq al-Hamidiyah past the monumental Roman Corinthian columns.',
        image: MOSQUE_IMAGES.gateBarid,
        category: isAr ? 'الجهة الغربية' : 'Western Direction',
        caption: isAr ? 'باب البريد الغربي وبقايا الأعمدة الرومانية عند نهاية سوق الحميدية' : 'Bab al-Barid opening past ancient Roman columns',
        pillars: [
          {
            title: isAr ? 'أعمدة التيمنوس وقوس النصر' : 'Roman Temenos Colonnade',
            description: isAr
              ? 'تنتصب عند المدخل أعمدة كورنثية باسقة من عهد معبد جوبيتر تفصل بين صخب السوق وهيبة الصرح.'
              : 'Monumental Corinthian columns from the Roman temple of Jupiter marking the threshold between the souq and sanctuary.',
            metricLabel: isAr ? 'الموقع التاريخي' : 'Location',
            metricValue: isAr ? 'سوق الحميدية' : 'Souq al-Hamidiyah',
          },
          {
            title: isAr ? 'إمكانية الوصول والتيسير' : 'Accessibility & Level Access',
            description: isAr
              ? 'مدخل ممهد ومستوٍ بالكامل بدون درجات، مجهز ومناسب للكراسي المتحركة وكبار السن للوصول المباشر للصحن.'
              : 'A barrier-free, level stone threshold fully equipped for wheelchair users and elderly visitors to enter the courtyard.',
            metricLabel: isAr ? 'طبيعة المدخل' : 'Threshold Type',
            metricValue: isAr ? 'ممهد ومستوٍ' : 'Step-free Access',
          },
        ],
      },
      {
        id: 'bab-jayrun',
        title: isAr ? 'باب جيرون / النوفرة (البوابة الشرقية)' : 'Bab Jayrun / Al-Nawfara (Eastern Gate)',
        lead: isAr
          ? 'بوابة مهيبة تفضي إلى درج حجري عريض نصف دائري يطل على سوق النوفرة وأزقة دمشق القديمة ومقهى النوفرة التراثي.'
          : 'Monumental stepped entrance opening onto a wide semicircular basalt staircase leading toward historic Al-Nawfara.',
        image: MOSQUE_IMAGES.gateJayrun,
        category: isAr ? 'الجهة الشرقية' : 'Eastern Direction',
        caption: isAr ? 'درج باب جيرون الشرقي التاريخي المطل على مقهى النوفرة العريق' : 'Stepped monumental approach to eastern Bab Jayrun',
        pillars: [
          {
            title: isAr ? 'الدرج الحجري الصرحي' : 'Monumental Stone Steps',
            description: isAr
              ? 'درج بازلتي عريض نصف دائري يشكل نقطة التقاء تاريخية لعشاق التراث الدمشقي والزوار.'
              : 'A monumental semicircular basalt staircase opening directly onto the historic alleys of Old Damascus.',
            metricLabel: isAr ? 'المعلم التراثي' : 'Historic Landmark',
            metricValue: isAr ? 'مقهى النوفرة' : 'Al-Nawfara Cafe',
          },
          {
            title: isAr ? 'الرواق وقبة الساعات' : 'Courtyard Arcade Entry',
            description: isAr
              ? 'يفضي المدخل مباشرة إلى الرواق الشرقي لصحن الجامع الرخامي بمحاذاة قبة الساعات الأثرية.'
              : 'Provides immediate entry into the eastern marble courtyard arcades adjacent to the historic Clock Dome.',
            metricLabel: isAr ? 'الجهة الأصلية' : 'Cardinal Direction',
            metricValue: isAr ? 'الشرق' : 'East',
          },
        ],
      },
      {
        id: 'bab-amara',
        title: isAr ? 'باب العمارة / الفراديس (البوابة الشمالية)' : 'Bab al-Amara (North Gate)',
        lead: isAr
          ? 'يقع في الجدار الشمالي مباشرة أسفل مئذنة العروس الأثرية، ويفضي لمجمع ضريح السلطان الناصر صلاح الدين الأيوبي.'
          : 'Located beneath the Minaret of the Bride in the north wall, leading directly to the Mausoleum of Sultan Saladin.',
        image: MOSQUE_IMAGES.gateAmara,
        category: isAr ? 'الجهة الشمالية' : 'Northern Direction',
        caption: isAr ? 'باب العمارة الشمالي أسفل مئذنة العروس وقرب ضريح صلاح الدين الأيوبي' : 'North gate beneath Minaret of the Bride leading to Saladin’s tomb',
        pillars: [
          {
            title: isAr ? 'مئذنة العروس الأثرية' : 'Bride Minaret Alignment',
            description: isAr
              ? 'يعلو الباب الجدار الشمالي الأثري تحت أقدم مئذنة قائمة في العالم الإسلامي، محافظاً على عراقته الأموية.'
              : 'Set into the northern perimeter wall directly beneath the oldest standing minaret in the Islamic world.',
            metricLabel: isAr ? 'المعلم الملاصق' : 'Adjoining Monument',
            metricValue: isAr ? 'مئذنة العروس' : 'Bride Minaret',
          },
          {
            title: isAr ? 'مجمع ضريح صلاح الدين' : 'Saladin’s Mausoleum Quarter',
            description: isAr
              ? 'يفتح على أزقة حي العمارة العتيق والمدرسة العزيزية المحتضنة لضريح محرر القدس صلاح الدين.'
              : 'Opens onto the historic alleys of al-Amara and the Aziziya Madrasa containing Saladin’s tomb.',
            metricLabel: isAr ? 'الموقع المجاور' : 'Adjacent Site',
            metricValue: isAr ? 'ضريح صلاح الدين' : 'Saladin Tomb',
          },
        ],
      },
      {
        id: 'bab-ziyadah',
        title: isAr ? 'باب الزيادة (البوابة الجنوبية)' : 'Bab al-Ziyadah (South Gate)',
        lead: isAr
          ? 'البوابة الجنوبية للجامع، تفتح مباشرة على صالة الصلاة المغطاة (الحرم) بجوار جدار القبلة العظيم ومحاريبه التاريخية.'
          : 'Opens directly into the covered prayer hall adjacent to the central Qibla wall and historic mihrabs.',
        image: MOSQUE_IMAGES.gateZiyadah,
        category: isAr ? 'الجهة الجنوبية' : 'Southern Direction',
        caption: isAr ? 'باب الزيادة الجنوبي المؤدي مباشرة إلى جدار القبلة وحرم الصلاة' : 'Southern Bab al-Ziyadah opening into the prayer hall',
        pillars: [
          {
            title: isAr ? 'الدخول المباشر للحرم' : 'Direct Sanctuary Access',
            description: isAr
              ? 'المدخل الجنوبي الوحيد الذي يفضي رأساً إلى داخل صالة الصلاة المغطاة بجوار المحراب ومقصورة الصلاة الرئيسية.'
              : 'The sole southern portal opening directly into the covered prayer hall adjacent to the main Qibla wall.',
            metricLabel: isAr ? 'الوجهة المباشرة' : 'Direct Destination',
            metricValue: isAr ? 'حرم الصلاة' : 'Prayer Hall',
          },
          {
            title: isAr ? 'أسواق العطارة والبزورية' : 'Historic Spice Markets',
            description: isAr
              ? 'يصل الصرح العظيم بأعرق أسواق دمشق التراثية كسوق الصاغة وسوق البزورية ومدحت باشا.'
              : 'Connects the mosque with the ancient perfume and spice souqs of Damascus, including Souq al-Buzuriyah.',
            metricLabel: isAr ? 'الأسواق المجاورة' : 'Neighboring Souq',
            metricValue: isAr ? 'سوق البزورية' : 'Buzuriyah Souq',
          },
        ],
      },
    ],
    [isAr]
  );

  const handleNavigateRight = useCallback(() => {
    setSlide(([prev]) => {
      const nextIdx = isAr
        ? (prev > 0 ? prev - 1 : gates.length - 1)
        : (prev < gates.length - 1 ? prev + 1 : 0);
      return [nextIdx, 1];
    });
  }, [gates.length, isAr]);

  const handleNavigateLeft = useCallback(() => {
    setSlide(([prev]) => {
      const nextIdx = isAr
        ? (prev < gates.length - 1 ? prev + 1 : 0)
        : (prev > 0 ? prev - 1 : gates.length - 1);
      return [nextIdx, -1];
    });
  }, [gates.length, isAr]);

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
      gates.map((g) => ({
        id: g.id,
        src: g.image,
        title: g.title,
        category: g.category,
        description: g.lead,
        location: isAr ? 'الجامع الأموي الكبير بدمشق' : 'The Umayyad Mosque of Damascus',
        year: isAr ? 'أبواب الصرح الأثرية' : 'Historic Sanctuary Gates',
        citation: isAr ? 'وزارة الأوقاف — التوثيق المعماري' : 'Ministry of Endowments — Architectural Record',
      })),
    [gates, isAr]
  );

  const handleOpenLightbox = useCallback(() => {
    openLightbox(allLightboxImages, activeIndex);
  }, [activeIndex, allLightboxImages, openLightbox]);

  const currentGate = gates[activeIndex];

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

  const getEtiquetteIcon = (category: string) => {
    switch (category) {
      case 'dress':
        return <Shirt className="w-5 h-5 text-[#002623]" aria-hidden="true" />;
      case 'conduct':
        return <Footprints className="w-5 h-5 text-[#002623]" aria-hidden="true" />;
      case 'prayer_times':
        return <VolumeX className="w-5 h-5 text-[#002623]" aria-hidden="true" />;
      case 'photography':
      default:
        return <Camera className="w-5 h-5 text-[#002623]" aria-hidden="true" />;
    }
  };

  return (
    <section
      id="visit"
      aria-labelledby="visit-heading"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-white text-[#002623] relative scroll-mt-20 sm:scroll-mt-24 border-b border-primary-12 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto space-y-16 sm:space-y-20 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto">
          <h2
            id="visit-heading"
            className="text-fluid-h2 font-bold font-heading text-[#002623]"
          >
            {isAr ? 'أبواب الجامع ومداخله' : 'Mosque Gates & Entrances'}
          </h2>
        </div>

        {/* Horizontal Navigation Gate Showcase (Identical to Architecture & Mosaics) */}
        <div
          className="relative space-y-6 sm:space-y-8"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentGate.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ willChange: 'transform, opacity' }}
                className="space-y-6 sm:space-y-8"
              >
                {/* Gate Header Info */}
                <div className="space-y-2">
                  <h3 className="font-heading text-2xl sm:text-3xl text-[#002623] leading-snug font-bold">
                    {currentGate.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#524e47] leading-relaxed font-light font-['Qomra',sans-serif] max-w-3xl">
                    {currentGate.lead}
                  </p>
                </div>

                {/* Large Image Frame with Timeline Scroll-Reveal & Parallax */}
                <GateImageCard
                  key={currentGate.id}
                  image={currentGate.image}
                  title={currentGate.title}
                  category={currentGate.category}
                  caption={currentGate.caption}
                  lang={lang}
                  onOpenLightbox={handleOpenLightbox}
                />

                {/* 2 Expandable Feature Cards for current gate */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-1">
                  {currentGate.pillars.map((pillar) => (
                    <GateFeatureCard
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
                  0{gates.length}
                </span>
              </div>
              <div className="h-4 w-px bg-[#b9a779]/30 hidden sm:block" />
              <span className="text-xs sm:text-[13px] text-[#524e47] hidden sm:inline font-['Qomra',sans-serif] font-light">
                {currentGate.title}
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
                aria-label={isAr ? 'الباب السابق' : 'Previous gate'}
                title={isAr ? 'الباب السابق' : 'Previous gate'}
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
                aria-label={isAr ? 'الباب التالي' : 'Next gate'}
                title={isAr ? 'الباب التالي' : 'Next gate'}
              >
                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Visitor Etiquette & Protocol: Open Editorial Columns */}
        <div className="space-y-8 pt-4">
          <Reveal from="bottom">
            <h3 className="text-fluid-h3 font-bold font-heading text-[#002623] flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#002623]" aria-hidden="true" />
              <span>{isAr ? 'ضوابط الزيارة' : 'Visitor Conduct'}</span>
            </h3>
          </Reveal>

          <Stagger stagger={0.06} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {etiquette.map((item) => (
              <RevealItem
                key={item.id}
                className="space-y-3.5 flex flex-col justify-between border-t border-[#002623]/15 pt-5"
              >
                <div className="space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#e5e5e5] flex items-center justify-center shadow-2xs">
                    {getEtiquetteIcon(item.category)}
                  </div>
                  <h4 className="text-base font-bold font-heading text-[#002623]">
                    {item.title}
                  </h4>
                  <p className="text-sm sm:text-[15px] text-[#403c37] leading-relaxed font-light font-['Qomra',sans-serif]">
                    {item.description.replace(/\*\*/g, '')}
                  </p>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>

        {/* Practical Hours & Quiet Prayer Notice Callout with Reveal */}
        <Reveal from="bottom">
          <div className="relative bg-[#002623] rounded-3xl p-8 sm:p-10 text-sm text-white space-y-3.5 shadow-xs overflow-hidden">
            <div className="flex items-center gap-2.5 text-[#b9a779] font-bold text-base relative z-10">
              <Clock className="w-5 h-5 text-[#b9a779]" aria-hidden="true" />
              <span>{isAr ? 'أوقات الزيارة' : 'Visiting Hours'}</span>
            </div>
            <p
              className="leading-relaxed text-white/90 font-light font-['Qomra',sans-serif] relative z-10 text-sm sm:text-base"
              style={{ fontWeight: 300 }}
            >
              {isAr
                ? 'يفتح الجامع أبوابه يوميًا لاستقبال المصلين والزوار من صلاة الفجر وحتى ما بعد صلاة العشاء. يُرجى من الوفود والزوار السياحيين تجنب الحركة داخل صالة الصلاة الرئيسية أثناء إقامة الصلوات الخمس المكتوبة لإتاحة أقصى درجات السكينة للمصلين.'
                : 'The sanctuary is open daily to worshippers and visitors from dawn (Fajr) prayer until after nightfall (Isha) prayer. Tourist groups and visitors are requested to avoid movement across the main prayer hall during active congregational prayer intervals.'}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
});
