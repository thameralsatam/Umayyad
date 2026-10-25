import { Bi, Language, NavItem } from '../types';
import { ImageKey } from './images';

/* ============ القائمة ============ */
export const NAV_ITEMS: Record<Language, NavItem[]> = {
  ar: [
    { id: 'home', label: 'الرئيسية' },
    { id: 'history', label: 'التاريخ' },
    { id: 'architecture', label: 'العمارة' },
    { id: 'mosaics', label: 'الفسيفساء' },
    { id: 'gallery', label: 'المعرض' },
    { id: 'visit', label: 'دليل الزيارة' },
  ],
  en: [
    { id: 'home', label: 'Overview' },
    { id: 'history', label: 'History' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'mosaics', label: 'Mosaics' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'visit', label: 'Visitor Guide' },
  ],
};

/* ============ عناوين الأقسام ============ */
export const SECTIONS = {
  history: {
    title: { ar: 'المسار التاريخي', en: 'Historical Timeline' },
    lead: { ar: 'أربع حقب متعاقبة على موقع واحد.', en: 'Four successive eras on a single site.' },
  },
  architecture: {
    title: { ar: 'عمارة الجامع', en: 'The Architecture' },
    lead: { ar: 'ثلاثة عناصر تختصر بناء الصرح.', en: 'Three elements that define the monument.' },
  },
  mosaics: {
    title: { ar: 'الفسيفساء', en: 'Mosaics' },
    lead: {
      ar: 'جداريات من الزجاج المذهب والملوّن، بلا كائنات حيّة.',
      en: 'Murals of gilded and coloured glass, without living figures.',
    },
  },
  gallery: {
    title: { ar: 'المعرض', en: 'Gallery' },
    lead: { ar: 'لقطات من الصرح وأروقته ومآذنه.', en: 'Views of the sanctuary, its arcades and minarets.' },
  },
  visit: {
    title: { ar: 'دليل الزيارة', en: 'Visitor Guide' },
    lead: { ar: 'المداخل الأربعة وآداب الزيارة.', en: 'The four entrances and visiting etiquette.' },
  },
} satisfies Record<string, { title: Bi; lead: Bi }>;

/* ============ الرئيسية ============ */
export const HOME = {
  title: {
    ar: ['الجامع الأموي', 'الكبير بدمشق'],
    en: ['The Great Umayyad', 'Mosque of Damascus'],
  },
  lead: {
    ar: 'شُيّد في عهد الخليفة الوليد بن عبد الملك، ويُعدّ من أهم نماذج المسجد الجامع في العمارة الإسلامية.',
    en: 'Built under Caliph Al-Walid I, it is among the most influential models of the congregational mosque in Islamic architecture.',
  },
  facts: [
    { value: { ar: '705م', en: '705 CE' }, label: { ar: 'التأسيس', en: 'Founded' } },
    { value: { ar: 'الوليد بن عبد الملك', en: 'Al-Walid I' }, label: { ar: 'الخليفة الباني', en: 'The founding caliph' } },
    {
      value: { ar: '1979', en: '1979' },
      label: { ar: 'مدينة دمشق القديمة على قائمة التراث العالمي', en: 'Old Damascus inscribed as World Heritage' },
    },
  ],
} satisfies {
  title: { ar: string[]; en: string[] };
  lead: Bi;
  facts: { value: Bi; label: Bi }[];
};

/* ============ التاريخ ============ */
export interface HistoryItem {
  id: string;
  date: Bi;
  title: Bi;
  text: Bi;
  image: ImageKey;
}

export const HISTORY: HistoryItem[] = [
  {
    id: 'aramean',
    date: { ar: 'الألفية الأولى قبل الميلاد', en: '1st millennium BCE' },
    title: { ar: 'معبد الإله حدد', en: 'The Temple of Hadad' },
    text: {
      ar: 'أُقيم في الموقع معبد للإله الآرامي حدد، فصار حرماً مقدساً في قلب دمشق، وتوارثت الحضارات اللاحقة هذا المكان.',
      en: 'A temple of the Aramean god Hadad stood here, making the site a sacred precinct in the heart of Damascus, one that later civilisations inherited.',
    },
    image: 'aramean',
  },
  {
    id: 'roman',
    date: { ar: 'القرن الأول ق.م – القرن الرابع م', en: '1st century BCE – 4th century CE' },
    title: { ar: 'معبد جوبيتر', en: 'The Temple of Jupiter' },
    text: {
      ar: 'وسّع الرومان الحرم إلى معبد جوبيتر الدمشقي، وأحاطوه بسور حجري وأروقة. وتتطابق حدود الجامع اليوم مع حدود ذلك الحرم، وتبقى من بوابته الغربية أعمدة وقوس قرب سوق الحميدية.',
      en: 'The Romans expanded the precinct into the Temple of Jupiter, enclosed by a stone wall and colonnades. The mosque today follows the same outline, and columns and an arch of its western gate survive near Souq al-Hamidiyah.',
    },
    image: 'roman',
  },
  {
    id: 'byzantine',
    date: { ar: 'القرن الرابع – 635م', en: '4th century – 635 CE' },
    title: { ar: 'كاتدرائية القديس يوحنا المعمدان', en: 'The Cathedral of St. John the Baptist' },
    text: {
      ar: 'حُوّل الحرم إلى كاتدرائية على اسم القديس يوحنا المعمدان (النبي يحيى). وبعد الفتح الإسلامي استُخدم المكان مشتركاً بين المسلمين والمسيحيين نحو سبعة عقود، وبقي مقام رأس النبي يحيى داخل الحرم حتى اليوم.',
      en: 'The precinct became a cathedral dedicated to St. John the Baptist (the Prophet Yahya). After the Muslim conquest it was shared by Muslims and Christians for about seven decades, and the shrine of the Prophet Yahya remains inside the prayer hall today.',
    },
    image: 'byzantine',
  },
  {
    id: 'umayyad',
    date: { ar: '705 – 715م', en: '705 – 715 CE' },
    title: { ar: 'بناء الجامع في عهد الوليد بن عبد الملك', en: 'Construction under Al-Walid I' },
    text: {
      ar: 'شيّد الخليفة الوليد بن عبد الملك الجامع صرحاً لعاصمة الخلافة: حرم ذو ثلاثة أروقة يقطعه مجاز أوسط تعلوه قبة النسر، وصحن رخامي تحيط به الأروقة، وجداريات من الفسيفساء المذهبة.',
      en: 'Caliph Al-Walid I built the mosque as the monument of his capital: a prayer hall of three aisles crossed by a central transept under the Eagle Dome, a marble courtyard framed by arcades, and gilded mosaic murals.',
    },
    image: 'umayyad',
  },
];

/* ============ العمارة ============ */
export interface ArchItem {
  id: string;
  title: Bi;
  summary: Bi;
  body: Bi;
  image: ImageKey;
}

export const ARCHITECTURE: ArchItem[] = [
  {
    id: 'prayer-hall',
    title: { ar: 'حرم الصلاة وقبة النسر', en: 'The Prayer Hall and the Eagle Dome' },
    summary: {
      ar: 'صالة الصلاة الفسيحة الموازية لجدار القبلة، تعلوها قبة النسر.',
      en: 'The spacious hall running parallel to the qibla wall, crowned by the Eagle Dome.',
    },
    body: {
      ar: 'ينقسم الحرم إلى ثلاثة أروقة طولية تحملها أعمدة كورنثية قديمة، ويقطعها مجاز أوسط تعلوه قبة النسر.',
      en: 'The hall is divided into three long aisles carried on ancient Corinthian columns, crossed by a central transept under the Eagle Dome.',
    },
    image: 'prayerHall',
  },
  {
    id: 'sahn',
    title: { ar: 'الصحن الرخامي', en: 'The Marble Courtyard' },
    summary: {
      ar: 'ساحة مفتوحة مبلّطة بالرخام، تحيط بها أروقة مزدوجة.',
      en: 'An open courtyard paved in marble and framed by double arcades.',
    },
    body: {
      ar: 'يشكل الصحن قلب الصرح وملتقى الحركة بين أروقته، وتقوم في جانبه الغربي قبة الخزنة المثمنة على أعمدة قديمة.',
      en: 'The courtyard is the heart of the monument. On its western side stands the octagonal Dome of the Treasury, raised on ancient columns.',
    },
    image: 'sahn',
  },
  {
    id: 'minarets',
    title: { ar: 'المآذن', en: 'The Minarets' },
    summary: {
      ar: 'ثلاث مآذن ترسم أفق دمشق القديمة: العروس وعيسى وقايتباي.',
      en: 'Three minarets shape the skyline of Old Damascus: the Bride, Jesus and Qaitbay.',
    },
    body: {
      ar: 'مئذنة العروس في الجدار الشمالي، ومئذنة عيسى في الزاوية الجنوبية الشرقية، ومئذنة قايتباي في الجهة الغربية، وقد أُعيد بناؤها في العهد المملوكي بأمر السلطان قايتباي.',
      en: 'The Minaret of the Bride stands on the northern wall, the Minaret of Jesus at the south-east corner, and the Qaitbay Minaret on the western side, rebuilt in the Mamluk period by order of Sultan Qaitbay.',
    },
    image: 'minaretBride',
  },
];

/* ============ الفسيفساء ============ */
export interface MosaicItem {
  id: string;
  tab: Bi;
  title: Bi;
  text: Bi;
  image: ImageKey;
}

export const MOSAICS: MosaicItem[] = [
  {
    id: 'barada',
    tab: { ar: 'وادي بردى', en: 'Barada Valley' },
    title: { ar: 'جدارية وادي بردى', en: 'The Barada Valley Mural' },
    text: {
      ar: 'تمتد على الرواق الغربي للصحن، وتصوّر نهر بردى وبساتين الغوطة وعمائر دمشق بفصوص من الزجاج المذهب والملوّن، وهي من أهم ما بقي من الفسيفساء الإسلامية المبكرة، وتجمع بين أجزاء أصلية وأخرى رُمّمت لاحقاً.',
      en: 'Along the western arcade of the courtyard, it depicts the Barada river, the orchards of the Ghouta and the buildings of Damascus in gilded and coloured glass, one of the most important surviving early Islamic mosaics, combining original sections with later restorations.',
    },
    image: 'mosaicBarada',
  },
  {
    id: 'trees',
    tab: { ar: 'الأشجار', en: 'The Trees' },
    title: { ar: 'أشجار الفسيفساء', en: 'The Mosaic Trees' },
    text: {
      ar: 'أشجار وارفة من الزجاج الأخضر والذهبي تضفي على الجدران معنى الوفرة والسكينة، وهي من أبرز ما يميّز زخارف الجامع.',
      en: 'Leafy trees in green and gold glass lend the walls a sense of abundance and serenity, and are among the most distinctive features of the mosque’s decoration.',
    },
    image: 'mosaicTree',
  },
  {
    id: 'treasury',
    tab: { ar: 'قبة الخزنة', en: 'Dome of the Treasury' },
    title: { ar: 'فسيفساء قبة الخزنة', en: 'Mosaics of the Treasury Dome' },
    text: {
      ar: 'حجرة مثمنة قائمة على ثمانية أعمدة قديمة في الصحن، بُنيت في العصر العباسي نحو سنة 789م. تكسو جدرانها الخارجية فسيفساء أُعيد تنفيذ معظمها في أواخر القرن العشرين على نمط فسيفساء الجامع الأموية.',
      en: 'An octagonal chamber raised on eight ancient columns in the courtyard, built in the Abbasid period around 789 CE. Its outer walls are covered in mosaics, most of them recreated in the late 20th century in the manner of the mosque’s Umayyad mosaics.',
    },
    image: 'domeTreasury',
  },
];

/* ============ الزيارة ============ */
export interface GateItem {
  id: string;
  direction: Bi;
  name: Bi;
  summary: Bi;
  more: Bi;
}

export const GATES: GateItem[] = [
  {
    id: 'barid',
    direction: { ar: 'الغرب', en: 'West' },
    name: { ar: 'باب البريد', en: 'Bab al-Barid' },
    summary: {
      ar: 'المدخل الرئيسي للزوار من جهة سوق الحميدية.',
      en: 'The main visitor entrance, from the side of Souq al-Hamidiyah.',
    },
    more: {
      ar: 'تقوم عنده بقايا أعمدة وقوس البوابة الرومانية الغربية لمعبد جوبيتر.',
      en: 'Columns and an arch of the Roman western gate of the Temple of Jupiter stand beside it.',
    },
  },
  {
    id: 'jayrun',
    direction: { ar: 'الشرق', en: 'East' },
    name: { ar: 'باب جيرون', en: 'Bab Jayrun' },
    summary: {
      ar: 'المدخل الشرقي للجامع، وكانت تقوم خارجه ساعة جيرون المائية التي بُنيت في عهد نور الدين سنة 1154م.',
      en: 'The eastern entrance. The Jayrun water clock, built under Nur ad-Din in 1154, once stood outside it.',
    },
    more: { ar: 'يفضي إلى الرواق الشرقي للصحن.', en: 'It leads into the eastern arcade of the courtyard.' },
  },
  {
    id: 'amara',
    direction: { ar: 'الشمال', en: 'North' },
    name: { ar: 'باب العمارة', en: 'Bab al-Amara' },
    summary: { ar: 'مدخل شمالي قرب مئذنة العروس.', en: 'The northern entrance, near the Minaret of the Bride.' },
    more: {
      ar: 'يقع بجوار ضريح السلطان صلاح الدين الأيوبي.',
      en: 'It lies beside the mausoleum of Sultan Saladin.',
    },
  },
  {
    id: 'ziyadah',
    direction: { ar: 'الجنوب', en: 'South' },
    name: { ar: 'باب الزيادة', en: 'Bab al-Ziyadah' },
    summary: { ar: 'مدخل جنوبي يفضي نحو حرم الصلاة.', en: 'The southern entrance, leading toward the prayer hall.' },
    more: { ar: 'يقع قرب جدار القبلة.', en: 'It lies close to the qibla wall.' },
  },
];

export const VISIT_LABELS = {
  gates: { ar: 'المداخل', en: 'Entrances' },
  conduct: { ar: 'آداب الزيارة', en: 'Visiting etiquette' },
  hours: { ar: 'أوقات الزيارة', en: 'Visiting hours' },
} satisfies Record<string, Bi>;

export const CONDUCT: { id: string; title: Bi; text: Bi }[] = [
  {
    id: 'dress',
    title: { ar: 'اللباس', en: 'Dress' },
    text: {
      ar: 'يُرجى ارتداء ملابس محتشمة تغطي الكتفين والركبتين.',
      en: 'Please wear modest clothing that covers the shoulders and knees.',
    },
  },
  {
    id: 'shoes',
    title: { ar: 'الأحذية', en: 'Footwear' },
    text: {
      ar: 'يُرجى خلع الأحذية قبل دخول الصحن وحرم الصلاة.',
      en: 'Please remove shoes before entering the courtyard and the prayer hall.',
    },
  },
  {
    id: 'quiet',
    title: { ar: 'الهدوء', en: 'Quiet' },
    text: {
      ar: 'يُرجى خفض الصوت وإسكات الهاتف، وإفساح المجال للمصلين أثناء الصلاة.',
      en: 'Please keep your voice low, silence your phone, and give worshippers space during prayer.',
    },
  },
  {
    id: 'photo',
    title: { ar: 'التصوير', en: 'Photography' },
    text: {
      ar: 'يُسمح بالتصوير الشخصي دون فلاش، ويُمنع تصوير المصلين أثناء الصلاة.',
      en: 'Personal photography is allowed without flash. Photographing worshippers during prayer is not permitted.',
    },
  },
];

export const HOURS: Bi = {
  ar: 'يفتح الجامع أبوابه يومياً للمصلين والزوار. يُرجى من الزوار تجنّب الحركة داخل الحرم أثناء الصلوات المفروضة.',
  en: 'The mosque is open daily to worshippers and visitors. Visitors are kindly asked to avoid moving through the prayer hall during the five daily prayers.',
};
