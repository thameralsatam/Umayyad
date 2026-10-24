export type Language = 'ar' | 'en';

export type SectionId = 'home' | 'history' | 'architecture' | 'mosaics' | 'visit';

export interface NavItem {
  id: SectionId;
  label: string;
  shortDescription: string;
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

export interface TimelineEvent {
  id: string;
  order: number;
  eraId: 'aramean' | 'roman' | 'byzantine' | 'umayyad' | 'later_history';
  eraName: string;
  dateDisplay: string;
  title: string;
  narrative: string;
  shortSummary: string;
  detailedAnalysis: string[];
  architecturalTransformation: string;
  academicCitation?: string;
  imageUrl?: string;
  imageCaption?: string;
}

export interface MosaicArtwork {
  id: string;
  tabLabel?: string;
  tabEra?: string;
  title: string;
  locationDetail: string;
  period: string;
  technique: string;
  materialsUsed: string[];
  description: string;
  scholarlyAnalysis: string;
  dimensionsEstimate: string;
  citation?: string;
  paletteColors?: string[];
  imageUrl?: string;
  imageCaption?: string;
}

export interface PhotoGalleryItem {
  id: string;
  title: string;
  category: 'courtyard' | 'interior' | 'mosaics' | 'minarets' | 'night' | 'damascus';
  categoryName: string;
  description: string;
  imageUrl: string;
  location: string;
  yearTaken?: string;
  objectPosition?: string;
}

export interface EtiquetteGuideline {
  id: string;
  title: string;
  description: string;
  category: 'dress' | 'conduct' | 'photography' | 'prayer_times';
}

export interface LightboxImageItem {
  id?: string;
  src: string;
  alt?: string;
  title: string;
  category?: string;
  description?: string;
  location?: string;
  year?: string;
  citation?: string;
}

