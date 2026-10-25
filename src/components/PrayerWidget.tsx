import React, { useEffect, useMemo, useState } from 'react';
import { Language } from '../types';
import { calculateDamascusPrayerTimes, formatTimeWithPeriod } from '../utils/prayerTimes';

interface PrayerWidgetProps {
  lang: Language;
}

export const PrayerWidget: React.FC<PrayerWidgetProps> = React.memo(({ lang }) => {
  const [stamp, setStamp] = useState<number>(() => Math.floor(Date.now() / 60000));

  useEffect(() => {
    const timer = setInterval(() => setStamp(Math.floor(Date.now() / 60000)), 15000);
    return () => clearInterval(timer);
  }, []);

  const data = useMemo(() => calculateDamascusPrayerTimes(new Date(), lang), [stamp, lang]);
  const isAr = lang === 'ar';

  const items = [
    { id: 'fajr', name: isAr ? 'الفجر' : 'Fajr', time: data.fajr },
    { id: 'sunrise', name: isAr ? 'الشروق' : 'Sunrise', time: data.sunrise },
    { id: 'dhuhr', name: isAr ? 'الظهر' : 'Dhuhr', time: data.dhuhr },
    { id: 'asr', name: isAr ? 'العصر' : 'Asr', time: data.asr },
    { id: 'maghrib', name: isAr ? 'المغرب' : 'Maghrib', time: data.maghrib },
    { id: 'isha', name: isAr ? 'العشاء' : 'Isha', time: data.isha },
  ];

  return (
    <div id="prayer-times-widget" className="card-soft p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-4">
        <h3 className="text-base font-medium text-ink">
          {isAr ? 'مواقيت الصلاة في دمشق' : 'Prayer times in Damascus'}
        </h3>
        <span className="rounded-full tint-gold px-3 py-1 text-sm text-ink-soft">{data.hijriDate}</span>
      </div>

      <dl className="grid grid-cols-3 gap-2 md:grid-cols-6">
        {items.map((p) => {
          const next = data.nextPrayer?.id === p.id;
          return (
            <div
              key={p.id}
              className={`rounded-2xl px-1 py-4 text-center transition-colors ${
                next ? 'tint-gold ring-1 ring-gold' : 'bg-transparent'
              }`}
            >
              <dt className={`text-sm ${next ? 'font-medium text-gold-deep' : 'text-ink-soft'}`}>{p.name}</dt>
              <dd className="mt-1 text-xl font-light tabular-nums text-ink sm:text-2xl">
                {formatTimeWithPeriod(p.time, lang)}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
});
