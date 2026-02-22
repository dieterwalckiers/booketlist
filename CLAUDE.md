# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build (also validates SSG)
npm run lint         # ESLint
npm run lint:fix     # Prettier + ESLint autofix
npm run format       # Prettier only
npm run type-check   # TypeScript type checking (tsc --noEmit)
```

No test framework is configured.

## Project Overview

Booketlist Agency is a literary agency website built with **Next.js 15 (Pages Router)** and **Sanity CMS v3**. All pages are statically generated at build time via `getStaticProps`/`getStaticPaths`. Sanity Studio is embedded at `/studio`.

## Architecture

### Data Flow

All Sanity data flows through a three-layer pipeline:

1. **Fetching** (`helpers/fetching.ts`) — GROQ queries against Sanity, returns raw data. Every fetch function creates an authenticated client with `SANITY_API_READ_TOKEN`. Draft documents are filtered out via `filterOutDrafts`.
2. **Normalizing** (`helpers/normalizing.ts`) — Transforms raw Sanity documents into application types (e.g., resolves `slug.current` to `slug` string, maps `_type` to `type` on page elements).
3. **Contracts** (`shared/contract.ts`) — TypeScript interfaces consumed by components. All domain types live here: `Book`, `Author`, `Publisher`, `Page`, `BookCategory`, `PageElement` variants.

### Content Model

Sanity schema types are in `sanity/schemas/`. Key document types: `book`, `author`, `publisher`, `bookCategory`, `page`. Singleton documents: `home`, `settings`. Pages are composed of polymorphic **page elements** (`richTextElement`, `imageElement`, `galleryElement`, `titleElement`, `highlightedBooksElement`, `joinNewsletterElement`) used by home, pages, authors, and publishers.

### Routing (Pages Router)

- `/` — Homepage (singleton `home` document)
- `/books` — Book listing with client-side filtering (category, author, publisher, age, language rights)
- `/books/[slug]` — Book detail
- `/cat/[slug]` — Books by category
- `/authors/[slug]`, `/publishers/[slug]` — Author/publisher detail
- `/page/[slug]` — CMS-driven custom pages
- `/studio` — Sanity Studio

### Styling

Mixed approach: **Chakra UI** for layout/components, **Tailwind CSS** (used in Sanity Studio area), **styled-components** in some components. Chakra theme is in `theme.ts` (light mode only).

### Navigation

Menu items are built dynamically from Sanity data in `components/navbar/helpers.ts` via `buildNavItems()`, assembling categories, publishers, authors, and pages into the nav structure.

## Code Conventions

- **Prettier**: no semicolons, single quotes
- **ESLint**: `simple-import-sort` plugin enforces sorted imports (warn), `react-hooks/exhaustive-deps` is an error
- **TypeScript**: strict mode is off; `baseUrl: "."` enables bare imports like `"components/..."`, `"shared/..."`, `"helpers/..."`
- **Package manager**: npm with `legacy-peer-deps=true` (.npmrc)

## Environment Variables

Required in `.env.local` (see `.env.local.example`):

- `NEXT_PUBLIC_SANITY_PROJECT_ID` — Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` — Sanity dataset name
- `SANITY_API_READ_TOKEN` — Server-side Sanity read token (used in `getStaticProps`)
