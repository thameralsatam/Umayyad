# الجامع الأموي الكبير · The Great Umayyad Mosque

A bilingual (Arabic/English) informational website about the Umayyad Mosque in Damascus: history timeline across four eras, architecture, mosaics, a photo gallery, a visitor guide, and a prayer-times widget.

Built as an evaluation prototype prepared as a proposal to the Syrian Ministry of Awqaf (Digital Transformation Directorate) — it is not an official website.

**Live:** https://umayyad.pages.dev

## Features

- Prayer times and next-prayer indicator computed locally for Damascus time
- Historical timeline spanning four eras (Aramean, Roman, Byzantine, Umayyad)
- Architecture and mosaic sections
- Photo gallery with lightbox (10 photos)
- Visitor guide
- Automatic RTL/LTR switching between Arabic and English

## Tech Stack

- React 19 + TypeScript + Vite + Tailwind CSS
- Static content-driven site, no backend
- Local prayer-time computation (`src/utils/prayerTimes.ts`)
- Bundled Qomra Arabic fonts

## Content sources

Images and information are credited to the Syrian Ministry of Awqaf (`mow.gov.sy`); see the links in the site footer.

## Development

```bash
npm install
npm run dev
```
