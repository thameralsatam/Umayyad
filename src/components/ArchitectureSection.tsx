import React, { useMemo, useCallback, useState, useRef } from 'react';
import { Language, LightboxImageItem } from '../types';
import { MOSQUE_IMAGES } from '../data/content';
import { SafeImage } from './SafeImage';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useLightbox } from '../context/LightboxContext';
import { AnimatedNumber } from './AnimatedNumber';
import { Maximize2, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';

interface ArchitectureSectionProps {
  lang: Language;
}

interface ExpandableFeatureCardProps {
  title: string;
  description: string;
  metricLabel: string;
  metricValue: React.ReactNode;
  isAr: boolean;
}

const ExpandableFeatureCard: React.FC<ExpandableFeatureCardProps> = ({
  title,
  description,
  metricLabel,
  metricValue,
  isAr,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onClick={() => setIsExpanded((prev) => !prev)}
      className="p-5 sm:p-6 rounded-[1.8rem] bg-[#faf8f5] border border-[#002623]/10 shadow-2xs hover:border-[#002623]/25 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Header: Title and Arrow inline on the same row */}
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-heading text-lg sm:text-xl text-[#002623] font-bold group-hover:text-[#b9a779] transition-colors">
            {title}
          </h4>
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full border border-[#002623]/15 flex items-center justify-center text-[#524e47] group-hover:border-[#002623] group-hover:text-[#002623] transition-all duration-200 ${
              isExpanded ? 'bg-[#002623] text-[#faf8f5] border-[#002623]' : 'bg-transparent'
            }`}
            aria-label={isExpanded ? (isAr ? 'إغلاق' : 'Collapse') : (isAr ? 'فتح' : 'Expand')}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isExpanded ? 'rotate-180 text-white' : ''
              }`}
            />
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

interface LandmarkImageCardProps {
  image: string;
  title: string;
  category: string;
  caption: string;
  lang: Language;
  onOpenLightbox: () => void;
}

const LandmarkImageCard: React.FC<LandmarkImageCardProps> = ({
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

      {/* Caption on image - White & Larger, matching Timeline section */}
      <div className="absolute bottom-6 start-6 end-6 sm:bottom-8 sm:start-8 sm:end-8 z-20 text-white space-y-1.5 drop-shadow-md pointer-events-none">
        <h4 className="font-heading text-xl sm:text-2xl lg:text-3xl leading-snug font-light text-white drop-shadow-md">
          {caption}
        </h4>
      </div>
    </article>
  );
};

export const ArchitectureSection: React.FC<ArchitectureSectionProps> = React.memo(({ lang }) => {
  const isAr = lang === 'ar';
  const { openLightbox } = useLightbox();

  const [[activeIndex, direction], setSlide] = useState<[number, number]>([0, 1]);

  const architectureLightboxImages: LightboxImageItem[] = useMemo(
    () => [
      {
        id: 'arch-prayer-hall',
        src: MOSQUE_IMAGES.prayerHall,
        title: isAr ? 'حرم الصلاة الشريف وقبة النسر' : 'Sanctuary and Eagle Dome',
        category: isAr ? 'عمارة الحرم' : 'Prayer Hall',
        description: isAr
          ? 'يمتد فضاء الصلاة بطول 136 متراً موازياً لجدار القبلة العظيم، مقسماً على ثلاثة أروقة طولية متوازية تستند إلى أعمدة رخامية أثرية.'
          : 'Spans 136 meters parallel to the great Qibla wall across three longitudinal aisles on ancient Corinthian marble columns.',
        location: isAr ? 'الجامع الأموي الكبير بدمشق' : 'The Umayyad Mosque of Damascus',
        year: '705 – 715 م',
        citation: isAr ? 'أرشيف التوثيق المعماري' : 'Architectural Heritage Documentation',
      },
      {
        id: 'arch-sahn',
        src: MOSQUE_IMAGES.sahn,
        title: isAr ? 'الصحن الرخامي وعقود الصرح' : 'Marble Sahn and Arcades',
        category: isAr ? 'الصحن الرخامي' : 'Courtyard',
        description: isAr
          ? 'صحن مبلط بالرخام الأبيض الفسيح محاط بأروقة مزدوجة مع قبة الخزنة الأثرية المثمنة.'
          : 'Expansive white marble paved courtyard surrounded by tiered arcades and the octagonal Treasury Dome.',
        location: isAr ? 'الجامع الأموي الكبير بدمشق' : 'The Umayyad Mosque of Damascus',
        year: '705 – 715 م',
        citation: isAr ? 'أرشيف التوثيق المعماري' : 'Architectural Heritage Documentation',
      },
      {
        id: 'arch-minaret-bride',
        src: MOSQUE_IMAGES.minaretBride,
        title: isAr ? 'المآذن التاريخية الكبرى' : 'The Historic Landmark Minarets',
        category: isAr ? 'المآذن التاريخية' : 'Minarets',
        description: isAr
          ? 'مئذنة العروس المربعة أقدم مئذنة قائمة في الإسلام، شكلت النموذج والملهم المعماري لمآذن بلاد الشام والمغرب العربي والأندلس.'
          : 'The square Bride Minaret is the oldest standing minaret in Islam, serving as the architectural paradigm across the Levant and al-Andalus.',
        location: isAr ? 'الجامع الأموي الكبير بدمشق' : 'The Umayyad Mosque of Damascus',
        year: 'القرن الثامن الميلادي',
        citation: isAr ? 'أرشيف التوثيق المعماري' : 'Architectural Heritage Documentation',
      },
    ],
    [isAr]
  );

  const landmarks = useMemo(
    () => [
      {
        id: 'prayer-hall',
        title: isAr ? 'حرم الصلاة الشريف وقبة النسر' : 'The Grand Prayer Hall & Eagle Dome',
        lead: isAr
          ? 'صالة الصلاة الفسيحة الممتدة موازية لجدار القبلة، تعلوها قبة النسر الشاهقة فوق أروقة وأعمدة كلاسيكية عتيقة.'
          : 'Expansive prayer hall parallel to the Qibla wall, crowned by the soaring Eagle Dome above ancient colonnades.',
        image: MOSQUE_IMAGES.prayerHall,
        caption: isAr ? 'حرم الصلاة الداخلي وقبة النسر' : 'Sanctuary Interior & Eagle Dome',
        category: isAr ? 'حرم الصلاة' : 'Prayer Hall',
        pillars: [
          {
            title: isAr ? 'أروقة الحرم الثلاثية' : 'Three Longitudinal Aisles',
            description: isAr
              ? 'يمتد فضاء الصلاة مقسماً على ثلاثة أروقة طولية متوازية تستند إلى صفين من الأعمدة الكورنثية الأثرية.'
              : 'Spans parallel to the Qibla wall, divided across three longitudinal aisles supported by ancient Corinthian columns.',
            metricLabel: isAr ? 'طول الحرم' : 'Hall Length',
            metricValue: <AnimatedNumber value={136} suffix={isAr ? ' م' : 'm'} />,
          },
          {
            title: isAr ? 'قبة النسر المركزية' : 'Central Eagle Dome',
            description: isAr
              ? 'قبة حجرية ترتفع على أربعة عقود ضخمة لتنير المجاز القاطع لصالة الصلاة كتاج معماري وهندسي شامخ.'
              : 'Soaring stone dome resting on four monumental arches, illuminating the axial transept of the hall.',
            metricLabel: isAr ? 'ارتفاع القبة' : 'Dome Height',
            metricValue: <AnimatedNumber value={45} suffix={isAr ? ' م' : 'm'} />,
          },
        ],
      },
      {
        id: 'sahn',
        title: isAr ? 'الصحن الرخامي وعقود الصرح' : 'The Marble Courtyard & Arcades',
        lead: isAr
          ? 'ساحة مفتوحة مبلطة بالرخام الأبيض المصقول، محاطة بأروقة حجرية مزدوجة وقبة الخزنة الأثرية.'
          : 'Open courtyard paved in polished white marble, framed by historic tiered arcades and the octagonal Treasury Dome.',
        image: MOSQUE_IMAGES.sahn,
        caption: isAr ? 'صحن الجامع الأموي وقبة الخزنة' : 'Umayyad Sahn & Treasury Dome',
        category: isAr ? 'الصحن' : 'Courtyard',
        pillars: [
          {
            title: isAr ? 'الباحة الرخامية الفسيحة' : 'The Marble Courtyard',
            description: isAr
              ? 'صحن مفتوح فسيح مبلط بالرخام الأبيض المصقول يشكل قلب الصرح وملتقى الحركة بين أروقته وقاعاته.'
              : 'Expansive open court paved in polished white marble, serving as the central sanctuary gathering hub.',
            metricLabel: isAr ? 'المساحة الكلية' : 'Total Surface',
            metricValue: <AnimatedNumber value={15722} suffix={isAr ? ' م²' : ' m²'} />,
          },
          {
            title: isAr ? 'قبة الخزنة (بيت المال)' : 'Octagonal Treasury Dome',
            description: isAr
              ? 'حجرة مثمنة ترتفع غرب الصحن على أعمدة رومانية عتيقة، خُصصت تاريخياً لحفظ أموال بيت مال المسلمين بأمان.'
              : 'An octagonal chamber standing on ancient Corinthian columns, historically dedicated to safeguarding the treasury.',
            metricLabel: isAr ? 'أعمدة الارتكاز' : 'Supporting Columns',
            metricValue: <AnimatedNumber value={8} suffix={isAr ? ' أعمدة' : ' columns'} />,
          },
        ],
      },
      {
        id: 'minarets',
        title: isAr ? 'المآذن التاريخية الكبرى' : 'The Historic Landmark Minarets',
        lead: isAr
          ? 'ثلاث مآذن تاريخية شامخة ترسم أفق دمشق القديمة: مئذنة العروس الأموية الأقدم، ومئذنتا عيسى وقايتباي.'
          : 'Three monumental minarets defining Damascus’s skyline: the ancient Umayyad Bride Minaret, Jesus Minaret, and Qaitbay Minaret.',
        image: MOSQUE_IMAGES.minaretBride,
        caption: isAr ? 'مئذنة العروس (أقدم مئذنة قائمة في الإسلام)' : 'Minaret of the Bride',
        category: isAr ? 'المآذن' : 'Minarets',
        pillars: [
          {
            title: isAr ? 'مئذنة العروس الأموية' : 'Minaret of the Bride',
            description: isAr
              ? 'المئذنة الشمالية المربعة وتعد أقدم مئذنة قائمة في العالم الإسلامي، وكانت الملهم الهندسي لمآذن بلاد الشام والمغرب والأندلس.'
              : 'The oldest standing square minaret in Islam, serving as the architectural paradigm across the Levant and al-Andalus.',
            metricLabel: isAr ? 'تاريخ التأسيس' : 'Commissioned',
            metricValue: isAr ? 'القرن 8 م' : '8th C.',
          },
          {
            title: isAr ? 'مئذنتا عيسى وقايتباي' : 'Jesus & Qaitbay Minarets',
            description: isAr
              ? 'مئذنة عيسى الشاهقة شرقاً، ومئذنة قايتباي المملوكية غرباً بأحجار الأبلق المتناوبة وشرفات المقرنصات البديعة.'
              : 'Soaring Jesus Minaret to the east and Mamluk Qaitbay Minaret with black-and-white ablaq stone to the west.',
            metricLabel: isAr ? 'مآذن الصرح' : 'Total Minarets',
            metricValue: <AnimatedNumber value={3} suffix={isAr ? ' مآذن' : ' minarets'} />,
          },
        ],
      },
    ],
    [isAr]
  );

  const handleNavigateRight = useCallback(() => {
    setSlide(([prev]) => {
      const nextIdx = isAr
        ? (prev > 0 ? prev - 1 : landmarks.length - 1)
        : (prev < landmarks.length - 1 ? prev + 1 : 0);
      return [nextIdx, 1];
    });
  }, [isAr, landmarks.length]);

  const handleNavigateLeft = useCallback(() => {
    setSlide(([prev]) => {
      const nextIdx = isAr
        ? (prev < landmarks.length - 1 ? prev + 1 : 0)
        : (prev > 0 ? prev - 1 : landmarks.length - 1);
      return [nextIdx, -1];
    });
  }, [isAr, landmarks.length]);

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

  const handleOpenLightbox = useCallback(() => {
    openLightbox(architectureLightboxImages, activeIndex);
  }, [activeIndex, architectureLightboxImages, openLightbox]);

  const currentLandmark = landmarks[activeIndex];

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

  return (
    <section
      id="architecture"
      aria-labelledby="architecture-heading"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-white text-[#002623] relative scroll-mt-20 sm:scroll-mt-24 border-b border-primary-12 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12">
        {/* Main Section Header - Clean, Focused, No Subtitle */}
        <div className="text-center max-w-xl mx-auto">
          <h2
            id="architecture-heading"
            className="text-fluid-h2 font-bold font-heading text-[#002623]"
          >
            {isAr ? 'عمارة الجامع' : 'Sanctuary Architecture'}
          </h2>
        </div>

        {/* Horizontal Navigation Landmark Showcase */}
        <div
          className="relative space-y-6 sm:space-y-8"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentLandmark.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ willChange: 'transform, opacity' }}
                className="space-y-6 sm:space-y-8"
              >
                {/* Landmark Header Info */}
                <div className="space-y-2">
                  <h3 className="font-heading text-2xl sm:text-3xl text-[#002623] leading-snug font-bold">
                    {currentLandmark.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#524e47] leading-relaxed font-light font-['Qomra',sans-serif] max-w-3xl">
                    {currentLandmark.lead}
                  </p>
                </div>

                {/* Large Image Frame with Timeline Scroll-Reveal & Parallax */}
                <LandmarkImageCard
                  key={currentLandmark.id}
                  image={currentLandmark.image}
                  title={currentLandmark.title}
                  category={currentLandmark.category}
                  caption={currentLandmark.caption}
                  lang={lang}
                  onOpenLightbox={handleOpenLightbox}
                />

                {/* 2 Expandable Feature Cards for current landmark */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-1">
                  {currentLandmark.pillars.map((pillar) => (
                    <ExpandableFeatureCard
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
                  0{landmarks.length}
                </span>
              </div>
              <div className="h-4 w-px bg-[#b9a779]/30 hidden sm:block" />
              <span className="text-xs sm:text-[13px] text-[#524e47] hidden sm:inline font-['Qomra',sans-serif] font-light">
                {currentLandmark.title}
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
                aria-label={isAr ? 'المعلم السابق' : 'Previous landmark'}
                title={isAr ? 'المعلم السابق' : 'Previous landmark'}
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
                aria-label={isAr ? 'المعلم التالي' : 'Next landmark'}
                title={isAr ? 'المعلم التالي' : 'Next landmark'}
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
