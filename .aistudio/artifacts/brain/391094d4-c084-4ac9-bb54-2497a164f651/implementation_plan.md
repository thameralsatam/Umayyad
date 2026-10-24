# Comprehensive Codebase Cleanup & Optimization Plan

A systematic cleanup plan to audit, sanitize, and optimize the Umayyad Mosque website repository. This plan removes all unreferenced source files, dead components, legacy data structures, and unused dependencies (`gsap`) to ensure a lean, pristine, and high-performance production codebase with zero impact on application behavior.

## User Review & Critical Decisions

> [!IMPORTANT]
> The scope and targets of this cleanup have been fully confirmed in Phase 1:

- **Unused Dependencies**: Confirmed removal of non-utilized npm dependencies (such as `gsap`) from `package.json`.
- **Legacy Components & Data**: Confirmed removal of unreferenced components (e.g. `ParallaxStatsSection.tsx`, `FormattedText.tsx`) and legacy unread data exports (e.g. `VISITING_GATES` in `content.ts` and `MosaicPerspective` in `types.ts`).
- **Safety Guarantee**: Every deletion candidate has been verified via full-text workspace dependency tracing to ensure no active view, hook, or section is affected.

---

## 1. Overview & Core Concept

- **What It Does**: Conducts a full purge of dead code, redundant file artifacts, unused npm packages, and unreferenced TypeScript definitions.
- **Goal**: Establish a pristine, 100% active codebase where every file, function, asset, and dependency serves a clear functional or visual purpose.
- **Key Value**: Reduces bundle footprint, improves build times, eliminates developer confusion, and streamlines maintenance without altering any visual or interactive feature.

---

## 2. User Experience & Visual Design

- **Visual Preservation**: Zero visual regressions. All sections (Hero, Timeline, Sanctuary Architecture, Mosaics, Photo Gallery, Visit & Entrances, Lightbox, and Footer) will retain their exact layout, typography, animations, and interactive behavior.
- **Performance Benefits**: Leaner JavaScript bundle delivery resulting in faster initial paint times and snappier runtime performance across mobile and desktop viewports.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Removal of `gsap` Package**
  - *Chosen Approach*: Uninstall `gsap` from `package.json`.
  - *Why*: All animations in the project are powered by Framer Motion (`motion`). `gsap` is entirely unused and adds unnecessary weight.
  - *Impact*: Reduced `node_modules` and package lock overhead.

- **Decision 2: Elimination of Dead Components (`ParallaxStatsSection` & `FormattedText`)**
  - *Chosen Approach*: Safely delete `src/components/ParallaxStatsSection.tsx` and `src/components/FormattedText.tsx`, and clean up any lingering unused imports.
  - *Why*: `ParallaxStatsSection` is not imported by `App.tsx` or any parent view. `FormattedText` was superseded by uniform typography handling.
  - *Impact*: Clean component directory with zero orphaned source files.

- **Decision 3: Pruning Legacy Data Exports in `content.ts` and `types.ts`**
  - *Chosen Approach*: Remove `VISITING_GATES` from `content.ts` (replaced by rich internal gate structures in `VisitSection.tsx`) and remove unused interfaces (`MosaicPerspective`) from `types.ts`.
  - *Why*: Prevents dead data structures from polluting bundle size and intellisense auto-completes.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLEANED APPLICATION TREE                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [ App.tsx (Root Container) ]                                         │
│    │                                                                   │
│    ├── [ Header.tsx ] ──────────────► Language & Navigation Control    │
│    ├── [ HeroSection.tsx ] ─────────► [ PrayerWidget.tsx ]             │
│    ├── [ TimelineSection.tsx ] ──────► Historical Strata Showcase      │
│    ├── [ ArchitectureSection.tsx ] ─► Landmark Carousel & Features     │
│    ├── [ MosaicsSection.tsx ] ──────► Mosaic Masterpieces Showcase    │
│    ├── [ PhotoGallerySection.tsx ] ─► Photographic Archive             │
│    ├── [ VisitSection.tsx ] ────────► Gates & Visitor Guidelines      │
│    └── [ Footer.tsx ] ──────────────► Colophon & Quick Links          │
│                                                                        │
│  [ Shared Services & Utilities ]                                       │
│    ├── [ LightboxContext.tsx ] ─────► [ UniversalLightbox.tsx ]       │
│    ├── [ Motion.tsx ] ──────────────► Framer Motion Wrappers           │
│    ├── [ SafeImage.tsx ] ───────────► Robust Image Loading & Fallback  │
│    └── [ data/content.ts ] ─────────► Active Multilingual Content Data │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Execution Steps
1. **Uninstall Unused Packages**: Remove `gsap` via package configuration cleanup.
2. **Delete Dead Component Files**: Delete `src/components/ParallaxStatsSection.tsx` and `src/components/FormattedText.tsx`.
3. **Clean Unused Imports**: Remove stale `FormattedText` import from `src/components/VisitSection.tsx`.
4. **Purge Legacy Data & Types**: Remove `VISITING_GATES` from `src/data/content.ts` and `MosaicPerspective` from `src/types.ts`.
5. **Compilation Verification**: Execute `npm run lint` and `compile_applet` to confirm zero build or type errors.
