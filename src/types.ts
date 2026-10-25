export type Language = 'ar' | 'en';

export type SectionId = 'home' | 'history' | 'architecture' | 'mosaics' | 'gallery' | 'visit';

/** نص ثنائي اللغة */
export interface Bi {
  ar: string;
  en: string;
}

export interface NavItem {
  id: SectionId;
  label: string;
}

export interface PrayerCalculationResult {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  nextPrayer: {
    id: string;
    name: string;
    timeStr: string;
    timeRemainingFormatted: string;
    remainingMinutes: number;
  } | null;
  hijriDate: string;
  gregorianDate: string;
  disclaimer: string;
}

export interface LightboxImageItem {
  src: string;
  title: string;
  caption?: string;
}
