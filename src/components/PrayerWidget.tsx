import React, { useState, useEffect, useMemo } from 'react';
import { Language, PrayerCalculationResult } from '../types';
import { calculateDamascusPrayerTimes } from '../utils/prayerTimes';

interface PrayerWidgetProps {
  lang: Language;
}

// Helper to separate 12-hour numerical string and period
function parse12HourTime(timeStr: string, lang: Language): { time: string; period: string } {
  const [hoursStr, minutesStr] = timeStr.split(':');
  let h = parseInt(hoursStr, 10);
  const m = minutesStr || '00';

  const isPM = h >= 12;
  const period = lang === 'ar' ? (isPM ? 'م' : 'ص') : (isPM ? 'PM' : 'AM');

  if (h > 12) h -= 12;
  if (h === 0) h = 12;

  return { time: `${h}:${m}`, period };
}

export const PrayerWidget: React.FC<PrayerWidgetProps> = React.memo(({ lang }) => {
  const [minuteStamp, setMinuteStamp] = useState<number>(() => Math.floor(Date.now() / 60000));

  useEffect(() => {
    const timer = setInterval(() => {
      const currentMinute = Math.floor(Date.now() / 60000);
      setMinuteStamp((prev) => (prev !== currentMinute ? currentMinute : prev));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const data: PrayerCalculationResult = useMemo(() => {
    return calculateDamascusPrayerTimes(new Date(), lang);
  }, [minuteStamp, lang]);

  const isAr = lang === 'ar';

  const prayerItems = [
    { id: 'fajr', name: isAr ? 'الفجر' : 'Fajr', time: data.fajr },
    { id: 'sunrise', name: isAr ? 'الشروق' : 'Sunrise', time: data.sunrise },
    { id: 'dhuhr', name: isAr ? 'الظهر' : 'Dhuhr', time: data.dhuhr },
    { id: 'asr', name: isAr ? 'العصر' : 'Asr', time: data.asr },
    { id: 'maghrib', name: isAr ? 'المغرب' : 'Maghrib', time: data.maghrib },
    { id: 'isha', name: isAr ? 'العشاء' : 'Isha', time: data.isha },
  ];

  return (
    <div
      id="prayer-times-widget"
      className="rounded-2xl bg-white border border-[#edebe0] p-6 sm:p-7 text-[#002623] space-y-5 shadow-2xs"
    >
      {/* Calm, Simplified Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#edebe0]">
        <h3 className="text-lg sm:text-xl font-bold font-heading text-[#002623]">
          {isAr ? 'مواقيت الصلاة' : 'Prayer Times'}
        </h3>
        <span className="text-xs text-[#78716c] font-light font-['Qomra',sans-serif]">
          {data.hijriDate}
        </span>
      </div>

      {/* 6 Minimalist Prayer Columns: Pure, Quiet & Direct */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {prayerItems.map((prayer) => {
          const isNext = data.nextPrayer?.id === prayer.id;
          const { time, period } = parse12HourTime(prayer.time, lang);

          return (
            <div
              key={prayer.id}
              className={`rounded-xl py-3.5 px-3 flex flex-col items-center justify-center text-center transition-all duration-200 ${
                isNext
                  ? 'bg-[#002623] text-white'
                  : 'bg-[#fafaf9] text-[#002623]'
              }`}
            >
              <span
                className={`text-xs font-light mb-1 ${
                  isNext ? 'text-[#b9a779]' : 'text-[#78716c]'
                }`}
              >
                {prayer.name}
              </span>

              <div className="flex items-baseline gap-1">
                <span
                  className={`text-2xl sm:text-[26px] font-light font-heading tracking-tight tabular-nums ${
                    isNext ? 'text-white' : 'text-[#002623]'
                  }`}
                >
                  {time}
                </span>
                <span
                  className={`text-[11px] font-light ${
                    isNext ? 'text-[#b9a779]' : 'text-[#78716c]'
                  }`}
                >
                  {period}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
