import React from 'react';
import { Language, SectionId } from '../types';
import { Reveal } from './Motion';

interface FooterProps {
  lang: Language;
  onNavigate?: (sectionId: SectionId) => void;
}

export const Footer: React.FC<FooterProps> = React.memo(({ lang }) => {
  const isAr = lang === 'ar';

  return (
    <footer className="bg-primary mt-auto w-full text-white border-t border-white/10 relative z-20">
      <div className="mx-auto w-full max-w-[1337px] px-6 py-[35px] md:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          
          {/* العمود الأول: الشعار، النبذة، وروابط التواصل الاجتماعي */}
          <Reveal from="bottom" className="flex flex-col items-center gap-6 text-center md:col-span-2 lg:col-span-1 lg:items-start lg:text-start">
            <img
              alt={isAr ? 'شعار وزارة الأوقاف' : 'Ministry of Endowments Logo'}
              width="162"
              height="58"
              decoding="async"
              className="h-[58px] w-auto"
              src={isAr ? '/logo/ar-dark.svg' : '/logo/en-dark.svg'}
            />
            <p className="text-body-medium text-white/80 max-w-sm">
              {isAr
                ? 'منارة الهداية والإرشاد، نسعى لخدمة المجتمع من خلال رعاية المساجد ونشر القيم الإسلامية السمحة.'
                : 'Beacon of guidance, dedicated to serving society through mosque stewardship and promoting compassionate Islamic values.'}
            </p>
            <div dir="ltr" className="flex gap-3">
              {/* يوتيوب */}
              <a
                href="https://youtube.com/@syrianmofe?si=TIYoqJwTWAKwMNOy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={isAr ? 'يوتيوب' : 'YouTube'}
                className="flex size-10 items-center justify-center rounded-md bg-white/10 text-white hover:bg-secondary hover:text-primary transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                  <path d="M2.08333 14.1667C1.50119 11.8333 1.5 8.16667 2.08333 5.83333C2.33333 4.83333 3.16667 4 4.16667 3.75C6.5 3.16667 13.5 3.16667 15.8333 3.75C16.8333 4 17.6667 4.83333 17.9167 5.83333C18.5 8.16667 18.5 11.8333 17.9167 14.1667C17.6667 15.1667 16.8333 16 15.8333 16.25C13.5 16.8333 6.5 16.8333 4.16667 16.25C3.16667 16 2.33333 15.1667 2.08333 14.1667Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  <polygon points="8.33333,7.5 12.5,10 8.33333,12.5" fill="currentColor" />
                </svg>
              </a>

              {/* إنستغرام */}
              <a
                href="https://www.instagram.com/syrianmofe?igsh=MWF5ZXdvdmp5cmYyMQ=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label={isAr ? 'إنستغرام' : 'Instagram'}
                className="flex size-10 items-center justify-center rounded-md bg-white/10 text-white hover:bg-secondary hover:text-primary transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                  <path d="M14.1667 1.66667H5.83333C3.53215 1.66667 1.66667 3.53215 1.66667 5.83333V14.1667C1.66667 16.4679 3.53215 18.3333 5.83333 18.3333H14.1667C16.4679 18.3333 18.3333 16.4679 18.3333 14.1667V5.83333C18.3333 3.53215 16.4679 1.66667 14.1667 1.66667Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.3333 9.475C13.4362 10.1685 13.3177 10.8768 12.9948 11.4992C12.6719 12.1215 12.161 12.6262 11.5347 12.9414C10.9084 13.2566 10.1987 13.3663 9.50649 13.2549C8.81427 13.1436 8.1748 12.8167 7.67903 12.321C7.18326 11.8252 6.85644 11.1857 6.74506 10.4935C6.63367 9.80129 6.74339 9.09158 7.05861 8.46531C7.37382 7.83905 7.87849 7.32812 8.50082 7.0052C9.12315 6.68229 9.83146 6.56382 10.525 6.66667C11.2324 6.77157 11.8874 7.10122 12.3931 7.60692C12.8988 8.11262 13.2284 8.76756 13.3333 9.475Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14.5833 5.41667H14.5917" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              {/* تويتر / X */}
              <a
                href="https://x.com/SyMOfE"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={isAr ? 'تويتر' : 'Twitter / X'}
                className="flex size-10 items-center justify-center rounded-md bg-white/10 text-white hover:bg-secondary hover:text-primary transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                  <path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z" fill="currentColor" />
                </svg>
              </a>

              {/* فيسبوك */}
              <a
                href="https://www.facebook.com/share/1CrFBKzs4d"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={isAr ? 'فيسبوك' : 'Facebook'}
                className="flex size-10 items-center justify-center rounded-md bg-white/10 text-white hover:bg-secondary hover:text-primary transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                  <path d="M15 1.66667H12.5C11.3949 1.66667 10.3351 2.10565 9.55372 2.88706C8.77232 3.66846 8.33333 4.72826 8.33333 5.83333V8.33333H5.83333V11.6667H8.33333V18.3333H11.6667V11.6667H14.1667L15 8.33333H11.6667V5.83333C11.6667 5.61232 11.7545 5.40036 11.9107 5.24408C12.067 5.0878 12.279 5 12.5 5H15V1.66667Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </Reveal>

          {/* العمود الثاني: روابط سريعة */}
          <Reveal from="bottom" delay={0.1} className="flex flex-col gap-6">
            <h2 className="text-h4 font-bold text-white">
              {isAr ? 'روابط سريعة' : 'Quick Links'}
            </h2>
            <ul className="flex flex-col gap-3">
              <li>
                <a className="text-body-medium text-white/80 hover:text-secondary transition-colors" href="https://mow.gov.sy" target="_blank" rel="noopener noreferrer">
                  {isAr ? 'عن الوزارة' : 'About the Ministry'}
                </a>
              </li>
              <li>
                <a className="text-body-medium text-white/80 hover:text-secondary transition-colors" href="https://mow.gov.sy" target="_blank" rel="noopener noreferrer">
                  {isAr ? 'الأخبار' : 'News'}
                </a>
              </li>
              <li>
                <a className="text-body-medium text-white/80 hover:text-secondary transition-colors" href="https://mow.gov.sy/media-center" target="_blank" rel="noopener noreferrer">
                  {isAr ? 'المركز الإعلامي' : 'Media Center'}
                </a>
              </li>
              <li>
                <a className="text-body-medium text-white/80 hover:text-secondary transition-colors" href="https://mow.gov.sy" target="_blank" rel="noopener noreferrer">
                  {isAr ? 'اتصل بنا' : 'Contact Us'}
                </a>
              </li>
            </ul>
          </Reveal>

          {/* العمود الثالث: معلومات التواصل */}
          <Reveal from="bottom" delay={0.2} className="flex flex-col gap-6">
            <h2 className="text-h4 font-bold text-white">
              {isAr ? 'تواصل معنا' : 'Contact Us'}
            </h2>
            <ul className="flex flex-col gap-4">
              {/* العنوان */}
              <li className="flex items-start gap-3">
                <span className="text-secondary flex size-9 shrink-0 items-center justify-center rounded-md bg-white/10">
                  <svg width="20" height="20" viewBox="0 0 15 16.8053" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                    <path d="M7.5 0C9.48912 0 11.3968 0.790176 12.8033 2.1967C14.2098 3.60322 15 5.51088 15 7.5C15 10.0617 13.6033 12.1583 12.1317 13.6625C11.3963 14.4057 10.594 15.0797 9.735 15.6758L9.38 15.9175L9.21333 16.0283L8.89917 16.2283L8.61917 16.3992L8.2725 16.6008C8.03709 16.7348 7.77087 16.8053 7.5 16.8053C7.22913 16.8053 6.96291 16.7348 6.7275 16.6008L6.38083 16.3992L5.9475 16.1325L5.7875 16.0283L5.44583 15.8008C4.51915 15.1736 3.65589 14.4574 2.86833 13.6625C1.39667 12.1567 0 10.0617 0 7.5C0 5.51088 0.790176 3.60322 2.1967 2.1967C3.60322 0.790176 5.51088 0 7.5 0ZM7.5 5C7.1717 5 6.84661 5.06466 6.54329 5.1903C6.23998 5.31594 5.96438 5.50009 5.73223 5.73223C5.50009 5.96438 5.31594 6.23998 5.1903 6.54329C5.06466 6.84661 5 7.1717 5 7.5C5 7.82831 5.06466 8.15339 5.1903 8.45671C5.31594 8.76002 5.50009 9.03562 5.73223 9.26777C5.96438 9.49991 6.23998 9.68406 6.54329 9.8097C6.84661 9.93534 7.1717 10 7.5 10C8.16304 10 8.79893 9.73661 9.26777 9.26777C9.73661 8.79893 10 8.16304 10 7.5C10 6.83696 9.73661 6.20107 9.26777 5.73223C8.79893 5.26339 8.16304 5 7.5 5Z" fill="currentColor" />
                  </svg>
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-caption font-bold text-white">{isAr ? 'العنوان' : 'Address'}</span>
                  <span className="text-body-small text-white/80">
                    {isAr ? 'ساحة الميسات، دمشق، الجمهورية العربية السورية' : 'Maysat Square, Damascus, Syrian Arab Republic'}
                  </span>
                </span>
              </li>

              {/* الهاتف */}
              <li className="flex items-start gap-3">
                <span className="text-secondary flex size-9 shrink-0 items-center justify-center rounded-md bg-white/10">
                  <svg width="20" height="20" viewBox="0 0 15.0001 14.1666" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                    <path d="M10.464 9.08832L10.0849 9.46582C10.0849 9.46582 9.18238 10.3625 6.71988 7.91415C4.25738 5.46582 5.15988 4.56915 5.15988 4.56915L5.39821 4.33082C5.98738 3.74582 6.04321 2.80582 5.52905 2.11915L4.47905 0.71665C3.84238 -0.13335 2.61321 -0.24585 1.88405 0.47915L0.575714 1.77915C0.21488 2.13915 -0.0267867 2.60415 0.00238 3.12082C0.07738 4.44332 0.675713 7.28748 4.01238 10.6058C7.55155 14.1242 10.8724 14.2641 12.2299 14.1375C12.6599 14.0975 13.0332 13.8791 13.334 13.5791L14.5174 12.4025C15.3174 11.6083 15.0924 10.2458 14.069 9.68998L12.4774 8.82415C11.8057 8.45915 10.989 8.56665 10.464 9.08832Z" fill="currentColor" />
                  </svg>
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-caption font-bold text-white">{isAr ? 'الهاتف' : 'Phone'}</span>
                  <a href="tel:+963909091037" dir="ltr" className="text-body-small text-white/80 hover:text-secondary text-start transition-colors">
                    +963 909 091 037
                  </a>
                </span>
              </li>

              {/* البريد الإلكتروني */}
              <li className="flex items-start gap-3">
                <span className="text-secondary flex size-9 shrink-0 items-center justify-center rounded-md bg-white/10">
                  <svg width="20" height="20" viewBox="0 0 16.6667 13.3333" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0.976667 0.976667C-9.93411e-08 1.9525 0 3.52417 0 6.66667C0 9.80917 -9.93411e-08 11.3808 0.976667 12.3567C1.95333 13.3325 3.52417 13.3333 6.66667 13.3333H10C13.1425 13.3333 14.7142 13.3333 15.69 12.3567C16.6658 11.38 16.6667 9.80917 16.6667 6.66667C16.6667 3.52417 16.6667 1.9525 15.69 0.976667C14.7133 0.000833273 13.1425 0 10 0H6.66667C3.52417 0 1.9525 -9.93411e-08 0.976667 0.976667ZM13.8133 2.93333C13.9194 3.06066 13.9705 3.22488 13.9555 3.38989C13.9405 3.55491 13.8606 3.70722 13.7333 3.81333L11.9033 5.33833C11.1642 5.955 10.5658 6.45333 10.0367 6.79333C9.48667 7.1475 8.95083 7.37083 8.33333 7.37083C7.71583 7.37083 7.18 7.14667 6.62917 6.79333C6.10083 6.45333 5.5025 5.95417 4.76333 5.33917L2.93333 3.81417C2.80592 3.70808 2.72587 3.55572 2.71078 3.39061C2.6957 3.2255 2.74683 3.06116 2.85292 2.93375C2.959 2.80634 3.11136 2.72628 3.27647 2.7112C3.44158 2.69612 3.60592 2.74725 3.73333 2.85333L5.53333 4.3525C6.31083 5 6.85 5.44833 7.30667 5.74167C7.7475 6.025 8.04667 6.12083 8.33417 6.12083C8.62167 6.12083 8.92083 6.02583 9.36167 5.74167C9.8175 5.44833 10.3575 5 11.135 4.3525L12.9342 2.8525C13.0616 2.74656 13.2259 2.69556 13.3909 2.71071C13.5559 2.72587 13.7073 2.80595 13.8133 2.93333Z" fill="currentColor" />
                  </svg>
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-caption font-bold text-white">{isAr ? 'البريد الإلكتروني' : 'Email'}</span>
                  <a href="mailto:dept.gov.communication@mow.gov.sy" dir="ltr" className="text-body-small text-white/80 hover:text-secondary text-start transition-colors">
                    dept.gov.communication@mow.gov.sy
                  </a>
                </span>
              </li>
            </ul>
          </Reveal>

        </div>

        {/* شريط حقوق النشر السفلي */}
        <div className="mt-[35px] border-t border-solid border-white/10 pt-[35px]">
          <p className="text-body-small text-white/70 text-center sm:text-start">
            {isAr
              ? '© 2026 وزارة الأوقاف السورية. جميع الحقوق محفوظة.'
              : '© 2026 Syrian Ministry of Endowments. All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
});
