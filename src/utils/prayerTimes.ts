import { Language, PrayerCalculationResult } from '../types';

// Damascus Coordinates
const DAMASCUS_LATITUDE = 33.5117;
const DAMASCUS_LONGITUDE = 36.3065;
const DAMASCUS_TIMEZONE = 3; // UTC+3

export function damascusNow(): Date {
  return damascusWall(new Date());
}

export function damascusWall(now: Date): Date {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Damascus',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  };
  const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(now);
  const map: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      map[part.type] = parseInt(part.value, 10);
    }
  }
  return new Date(map.year, map.month - 1, map.day, map.hour === 24 ? 0 : map.hour, map.minute, map.second);
}

// Trigonometric helper functions in degrees
const dSin = (d: number) => Math.sin((d * Math.PI) / 180);
const dCos = (d: number) => Math.cos((d * Math.PI) / 180);
const dArcsin = (x: number) => (Math.asin(x) * 180) / Math.PI;
const dArccos = (x: number) => (Math.acos(x) * 180) / Math.PI;
const dArctan2 = (y: number, x: number) => (Math.atan2(y, x) * 180) / Math.PI;

function julianDay(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function sunCoordinates(d: number) {
  const M = (357.5291 + 0.98560028 * d) % 360;
  const L0 = (280.459 + 0.98564736 * d) % 360;
  const C = (1.9146 - 0.00005 * (d / 36525)) * dSin(M) + (0.019993 - 0.000101 * (d / 36525)) * dSin(2 * M) + 0.000289 * dSin(3 * M);
  const L = (L0 + C) % 360;
  const epsilon = 23.439 - 0.0000004 * d;
  const delta = dArcsin(dSin(epsilon) * dSin(L));
  const alpha = (dArctan2(dCos(epsilon) * dSin(L), dCos(L)) + 360) % 360;
  const eqTime = (L0 - alpha) * 4;

  return { delta, eqTime };
}

function computeHourAngle(angleBelowHorizon: number, latitude: number, delta: number): number | null {
  const cosH = (dSin(-angleBelowHorizon) - dSin(latitude) * dSin(delta)) / (dCos(latitude) * dCos(delta));
  if (cosH < -1 || cosH > 1) return null;
  return dArccos(cosH);
}

function asrHourAngle(latitude: number, delta: number, shadowFactor = 1): number | null {
  const cotElevation = shadowFactor + Math.tan(Math.abs((latitude - delta) * Math.PI / 180));
  const elevation = (Math.atan(1 / cotElevation) * 180) / Math.PI;
  const cosH = (dSin(elevation) - dSin(latitude) * dSin(delta)) / (dCos(latitude) * dCos(delta));
  if (cosH < -1 || cosH > 1) return null;
  return dArccos(cosH);
}

function decimalHoursToTimeString(decimalHours: number): string {
  let h = Math.floor(decimalHours);
  let m = Math.floor((decimalHours - h) * 60);
  const s = Math.round(((decimalHours - h) * 60 - m) * 60);

  if (s >= 30) m += 1;
  if (m >= 60) {
    m = 0;
    h = (h + 1) % 24;
  }

  const hh = h.toString().padStart(2, '0');
  const mm = m.toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

export function formatTimeWithPeriod(timeStr: string, lang: Language): string {
  const [hoursStr, minutesStr] = timeStr.split(':');
  let h = parseInt(hoursStr, 10);
  const m = minutesStr;

  const isPM = h >= 12;
  const periodArabic = isPM ? 'م' : 'ص';
  const periodEnglish = isPM ? 'PM' : 'AM';

  if (h > 12) h -= 12;
  if (h === 0) h = 12;

  if (lang === 'ar') {
    return `${h}:${m} ${periodArabic}`;
  }
  return `${h}:${m} ${periodEnglish}`;
}

export function getHijriDate(date: Date = damascusNow(), lang: Language = 'ar'): string {
  try {
    const locale = lang === 'ar' ? 'ar-u-ca-islamic-umalqura' : 'en-u-ca-islamic-umalqura';
    return new Intl.DateTimeFormat(locale, {
      timeZone: 'Asia/Damascus',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    const arabicMonths = [
      'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
      'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
      'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
    ];
    const englishMonths = [
      'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
      'Jumada al-Ula', 'Jumada al-Akhira', 'Rajab', 'Sha\'ban',
      'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
    ];

    const jd = Math.floor(julianDay(date.getFullYear(), date.getMonth() + 1, date.getDate()));
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l_rem = l - 10631 * n + 354;
    const j = (Math.floor((10985 - l_rem) / 5316)) * (Math.floor((50 * l_rem) / 17719)) +
              (Math.floor(l_rem / 5670)) * (Math.floor((43 * l_rem) / 15238));
    const l_adj = l_rem - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) -
                  (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
    const m = Math.floor((24 * l_adj) / 709);
    const d = Math.floor(l_adj - Math.floor((709 * m) / 24));
    const y = 30 * n + j - 30;

    const monthIndex = Math.max(0, Math.min(11, m - 1));
    const monthName = lang === 'ar' ? arabicMonths[monthIndex] : englishMonths[monthIndex];

    if (lang === 'ar') {
      return `${d} ${monthName} ${y} هـ`;
    }
    return `${d} ${monthName} ${y} AH`;
  }
}

export function calculateDamascusPrayerTimes(date: Date = damascusNow(), lang: Language = 'ar'): PrayerCalculationResult {
  const isAr = lang === 'ar';
  const gregorianDateStr = date.toLocaleDateString(isAr ? 'ar-SY' : 'en-US', {
    timeZone: 'Asia/Damascus',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const disclaimer = isAr
    ? 'الأذان الموحد لمدينة دمشق — توقيت الجامع الأموي الكبير'
    : 'Unified Damascus Adhan Schedule — Great Umayyad Mosque';

  const wall = damascusWall(date);
  const jd = julianDay(wall.getFullYear(), wall.getMonth() + 1, wall.getDate());
  const d = jd - 2451545.0;
  const { delta, eqTime } = sunCoordinates(d);

  const solarNoon = 12 + DAMASCUS_TIMEZONE - (DAMASCUS_LONGITUDE / 15) - (eqTime / 60);

  const fajrHA = computeHourAngle(18, DAMASCUS_LATITUDE, delta);
  const fajrHours = fajrHA !== null ? solarNoon - (fajrHA / 15) : 4.75;

  const sunriseHA = computeHourAngle(0.833, DAMASCUS_LATITUDE, delta);
  const sunriseHours = sunriseHA !== null ? solarNoon - (sunriseHA / 15) : 6.25;

  const asrHA = asrHourAngle(DAMASCUS_LATITUDE, delta, 1);
  const asrHours = asrHA !== null ? solarNoon + (asrHA / 15) : 15.75;

  const maghribHA = computeHourAngle(0.833, DAMASCUS_LATITUDE, delta);
  const maghribHours = maghribHA !== null ? solarNoon + (maghribHA / 15) : 18.5;

  const ishaHA = computeHourAngle(17.5, DAMASCUS_LATITUDE, delta);
  const ishaHours = ishaHA !== null ? solarNoon + (ishaHA / 15) : 20.0;

  const fajrStr = decimalHoursToTimeString(fajrHours);
  const sunriseStr = decimalHoursToTimeString(sunriseHours);
  const dhuhrStr = decimalHoursToTimeString(solarNoon);
  const asrStr = decimalHoursToTimeString(asrHours);
  const maghribStr = decimalHoursToTimeString(maghribHours);
  const ishaStr = decimalHoursToTimeString(ishaHours);

  const currentMinutesFromMidnight = wall.getHours() * 60 + wall.getMinutes() + wall.getSeconds() / 60;

  const prayerSchedule = [
    { id: 'fajr', name: isAr ? 'الفجر' : 'Fajr', minutes: fajrHours * 60, timeStr: fajrStr },
    { id: 'sunrise', name: isAr ? 'الشروق' : 'Sunrise', minutes: sunriseHours * 60, timeStr: sunriseStr },
    { id: 'dhuhr', name: isAr ? 'الظهر' : 'Dhuhr', minutes: solarNoon * 60, timeStr: dhuhrStr },
    { id: 'asr', name: isAr ? 'العصر' : 'Asr', minutes: asrHours * 60, timeStr: asrStr },
    { id: 'maghrib', name: isAr ? 'المغرب' : 'Maghrib', minutes: maghribHours * 60, timeStr: maghribStr },
    { id: 'isha', name: isAr ? 'العشاء' : 'Isha', minutes: ishaHours * 60, timeStr: ishaStr },
  ];

  let next = prayerSchedule.find((p) => p.minutes > currentMinutesFromMidnight);
  let remainingMinutes = 0;

  if (next) {
    remainingMinutes = Math.round(next.minutes - currentMinutesFromMidnight);
  } else {
    next = prayerSchedule[0];
    remainingMinutes = Math.round(24 * 60 - currentMinutesFromMidnight + next.minutes);
  }

  const hoursRem = Math.floor(remainingMinutes / 60);
  const minsRem = remainingMinutes % 60;

  let timeRemainingFormatted = '';
  if (isAr) {
    if (hoursRem > 0 && minsRem > 0) {
      timeRemainingFormatted = `متبقي ${hoursRem} س و ${minsRem} د`;
    } else if (hoursRem > 0) {
      timeRemainingFormatted = `متبقي ${hoursRem} ساعة`;
    } else {
      timeRemainingFormatted = `متبقي ${minsRem} دقيقة`;
    }
  } else {
    if (hoursRem > 0 && minsRem > 0) {
      timeRemainingFormatted = `${hoursRem}h ${minsRem}m remaining`;
    } else if (hoursRem > 0) {
      timeRemainingFormatted = `${hoursRem}h remaining`;
    } else {
      timeRemainingFormatted = `${minsRem}m remaining`;
    }
  }

  return {
    fajr: fajrStr,
    sunrise: sunriseStr,
    dhuhr: dhuhrStr,
    asr: asrStr,
    maghrib: maghribStr,
    isha: ishaStr,
    nextPrayer: {
      id: next.id,
      name: next.name,
      timeStr: next.timeStr,
      timeRemainingFormatted,
      remainingMinutes,
    },
    hijriDate: getHijriDate(date, lang),
    gregorianDate: gregorianDateStr,
    disclaimer,
  };
}
