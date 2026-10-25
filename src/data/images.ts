export interface ImageEntry {
  file: string; // اسم الملف داخل public/images
  ar: string;   // الوصف بالعربية (يُستخدم كنص بديل وكتعليق)
  en: string;   // الوصف بالإنجليزية
}

export const IMAGES = {
  hero: { file: 'hero-damascus.webp', ar: 'الجامع الأموي الكبير في أفق دمشق القديمة', en: 'The Great Umayyad Mosque on the skyline of Old Damascus' },
  aramean: { file: 'history-aramean.webp', ar: 'العصر الآرامي', en: 'The Aramean era' },
  roman: { file: 'history-roman.webp', ar: 'العصر الروماني', en: 'The Roman era' },
  byzantine: { file: 'history-byzantine.webp', ar: 'العصر البيزنطي', en: 'The Byzantine era' },
  umayyad: { file: 'history-umayyad.webp', ar: 'العصر الأموي', en: 'The Umayyad era' },
  prayerHall: { file: 'prayer-hall.webp', ar: 'حرم الصلاة', en: 'The prayer hall' },
  sahn: { file: 'sahn-courtyard.webp', ar: 'الصحن الرخامي', en: 'The marble courtyard' },
  sahnArcade: { file: 'sahn-arcade.webp', ar: 'أروقة الصحن', en: 'The courtyard arcades' },
  minaretBride: { file: 'minaret-bride.webp', ar: 'مئذنة العروس', en: 'The Minaret of the Bride' },
  minaretJesus: { file: 'minaret-jesus.webp', ar: 'مئذنة عيسى', en: 'The Minaret of Jesus' },
  minaretQaitbay: { file: 'minaret-qaitbay.webp', ar: 'مئذنة قايتباي', en: 'The Qaitbay Minaret' },
  domeTreasury: { file: 'dome-treasury.webp', ar: 'قبة الخزنة', en: 'The Dome of the Treasury' },
  saladinTomb: { file: 'saladin-tomb.webp', ar: 'ضريح صلاح الدين الأيوبي', en: 'The Mausoleum of Saladin' },
  mosaicBarada: { file: 'mosaic-barada.webp', ar: 'جدارية وادي بردى', en: 'The Barada Valley mosaic' },
  mosaicTree: { file: 'mosaic-tree.webp', ar: 'أشجار الفسيفساء', en: 'The mosaic trees' },
} as const satisfies Record<string, ImageEntry>;

export type ImageKey = keyof typeof IMAGES;

export const imgSrc = (key: ImageKey): string => `/images/${IMAGES[key].file}`;
export const imgAlt = (key: ImageKey, lang: 'ar' | 'en'): string => IMAGES[key][lang];

/** صور المعرض بالترتيب (بدون تكرار) */
export const GALLERY_KEYS: ImageKey[] = [
  'sahn',
  'prayerHall',
  'mosaicBarada',
  'minaretBride',
  'sahnArcade',
  'domeTreasury',
  'minaretJesus',
  'mosaicTree',
  'saladinTomb',
  'minaretQaitbay',
];
