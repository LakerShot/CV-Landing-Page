# Egor Morozov — CV landing

Animated one-page CV, built from the source résumé in `info.pdf` / `info.png`.
Bilingual (EN/RU), no backend, deploys to Vercel as a static-rendered Next.js app.

## Stack

| Concern   | Choice                                                         |
| --------- | -------------------------------------------------------------- |
| Framework | Next.js 15 (App Router, React 19, TypeScript)                  |
| Styling   | Tailwind CSS v4 (CSS-first `@theme` tokens)                    |
| Motion    | GSAP 3 (ScrollTrigger, SplitText) + Lenis smooth scroll        |
| i18n      | next-intl, `/en` and `/ru` prerendered                         |
| Icons     | Lucide (UI) + Simple Icons via react-icons (brands)            |
| Type      | Outfit (display) + Manrope (body), self-hosted via `next/font` |
| Tests     | Vitest + Testing Library (unit), Cypress (e2e)                 |

Gilroy was requested but is a commercial typeface and is not on Google Fonts.
**Outfit** is the closest free geometric substitute, paired with Manrope for body
copy.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000 → redirects to /en
```

The portrait and downloadable CV are committed in `public/`, so local dev and
Vercel builds do not need to extract assets on every run. If `info.pdf` changes,
run `npm run extract:avatar` and commit the regenerated public assets.

### Scripts

| Script                   | Does                                        |
| ------------------------ | ------------------------------------------- |
| `npm run dev`            | Dev server                                  |
| `npm run build`          | Production build                            |
| `npm run lint`           | ESLint                                      |
| `npm run format`         | Prettier write                              |
| `npm run typecheck`      | `tsc --noEmit`                              |
| `npm run test:unit`      | Vitest                                      |
| `npm run test:e2e`       | Build-free Cypress run against `npm start`  |
| `npm run test:e2e:open`  | Cypress UI against the dev server           |
| `npm run extract:avatar` | Regenerate `public/` assets from `info.pdf` |

## Architecture notes

**Content split.** Language-neutral facts (ids, dates, URLs, tags, skill levels)
live in `src/content/cv.ts`; all prose lives in `messages/{en,ru}.json` keyed by
the same id. Sections iterate the data and resolve copy with `useTranslations`,
so adding a locale never touches component code. `src/test/cv-data.test.ts`
enforces that every data entry has copy in both languages.

**The portrait.** `info.pdf` stores the photo as a JPEG plus a separate
grayscale `/SMask` holding its alpha. Decoding the JPEG to bake the alpha in
would need an image library, so `extract-avatar.mjs` emits the JPEG untouched
alongside the mask as an RGBA PNG (mask value in the _alpha_ channel, because
CSS `mask-image` treats an alpha-less image as fully opaque). `Hero` recombines
the committed `public/avatar.jpg` and `public/avatar-mask.png` with
`mask-image`. Both files are 809×1080 and are rendered into the same box at
`100% 100%`, so they line up by construction.

**Motion and accessibility.** Animated elements are pre-hidden by CSS gated
behind a `.js` class that an inline script adds before first paint — with JS
disabled nothing is ever hidden. `prefers-reduced-motion` is a real code path,
not a token gesture: Lenis is never constructed, every timeline is skipped, and
CSS forces the finished state.

**Breakpoints.** Base styles target 360 px; `--breakpoint-*` tokens define
768/1024/1440/1600/1920/2560. `cypress/e2e/responsive.cy.ts` asserts no
horizontal overflow at all seven widths.

## Deployment

Import the repo on Vercel; no environment variables are required. Once a custom
domain is attached, set `NEXT_PUBLIC_SITE_URL` so canonical URLs, `hreflang`
alternates and the sitemap point at it (see `src/lib/site.ts`).

## Known follow-up

The CodeSandbox link in `src/content/cv.ts` is the private workspace URL taken
from the résumé — visitors hit a login screen. Replace it with a public profile
URL, or delete the entry to drop it from the site.
