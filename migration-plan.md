# OAU Bursary Digital Forms: Next.js App Router Migration Plan

## Executive Summary
This document provides an end-to-end architectural plan to convert the **OAU Bursary Digital Form Submission & Processing System** from an exported Vite/React-Router single-page prototype into a production-ready, industry-standard **Next.js 15+ (App Router)** application with a `src/` directory structure.

---

## Architecture & Technology Stack

| Layer | Previous (Prototype) | Next.js Architecture (Target) |
|---|---|---|
| **Framework** | Vite 6 + React Router 7 | **Next.js (App Router)** with React 19 / 18 |
| **Language** | TypeScript (no tsconfig configured) | **TypeScript** with strict mode & `@/*` path aliases |
| **Styling** | Tailwind CSS v4 (@tailwindcss/vite) | **Tailwind CSS v4** with `@tailwindcss/postcss` & CSS variables |
| **UI Components** | Shadcn UI primitives + Radix UI | **Shadcn UI** structure with `components.json` |
| **Data Tables** | Custom manual filtering & pagination | **TanStack Table (`@tanstack/react-table`)** + Shadcn Table |
| **Validation** | Uncontrolled/manual `useState` forms | **Zod** schema validation + **React Hook Form** (`@hookform/resolvers`) |
| **Directory** | Flat `src/app/` (all mixed together) | Scalable `src/` modular architecture (App Router, components, lib, etc.) |

---

## Target Project Directory Hierarchy

```text
oau-bursary-forms/
├── public/                       # Static public assets (favicons, university seal, logos)
├── src/
│   ├── app/                      # Next.js App Router routes & layouts
│   │   ├── globals.css           # Tailwind v4 theme, CSS variables & print styles
│   │   ├── layout.tsx            # Root HTML layout with providers (Auth, Toaster)
│   │   ├── page.tsx              # Role selection / portal landing (/)
│   │   ├── (auth)/               # Auth route group
│   │   │   ├── department-login/ # Department login route
│   │   │   │   └── page.tsx
│   │   │   └── bursary-login/    # Bursary staff login route
│   │   │       └── page.tsx
│   │   ├── department/           # Department User Portal
│   │   │   ├── layout.tsx        # Department portal navigation header
│   │   │   ├── dashboard/        # Form selection dashboard
│   │   │   │   └── page.tsx
│   │   │   ├── submissions/      # My Submissions list
│   │   │   │   └── page.tsx
│   │   │   ├── submission/
│   │   │   │   └── [id]/         # Department submission detail
│   │   │   │       └── page.tsx
│   │   │   ├── forms/            # Department dynamic forms
│   │   │   │   ├── cash-advance/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── dlpo/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── expenditure-authorization/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── duty-mileage/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── imprest-holder/
│   │   │   │       └── page.tsx
│   │   │   └── submission-success/
│   │   │       └── page.tsx
│   │   └── bursary/              # Bursary Administration Portal
│   │       ├── layout.tsx        # Bursary administration layout
│   │       ├── dashboard/        # Overview dashboard with metrics
│   │       │   └── page.tsx
│   │       ├── cash-advance/     # Filterable Cash Advance list
│   │       │   └── page.tsx
│   │       ├── dlpo/             # Filterable DLPO list
│   │       │   └── page.tsx
│   │       ├── expenditure/      # Filterable Expenditure Auth list
│   │       │   └── page.tsx
│   │       ├── duty-mileage/     # Filterable Duty Mileage list
│   │       │   └── page.tsx
│   │       ├── imprest/          # Filterable Imprest Holder list
│   │       │   └── page.tsx
│   │       └── submission/       # Bursary review/action detail
│   │           └── [id]/
│   │               └── page.tsx
│   ├── components/               # Presentation & UI components
│   │   ├── ui/                   # Atomic Shadcn components (button, card, dialog...)
│   │   │   └── data-table.tsx    # TanStack Table foundation
│   │   ├── shared/               # Cross-cutting components (ImageWithFallback, ProtectedRoute)
│   │   ├── forms/                # Form step/section reusable components
│   │   ├── bursary/              # Bursary specific presentation widgets
│   │   └── department/           # Department specific presentation widgets
│   ├── context/                  # React context providers (AuthContext, etc.)
│   │   └── AuthContext.tsx
│   ├── hooks/                    # Reusable React hooks
│   │   └── use-mobile.ts
│   ├── lib/                      # Utilities, business logic, mock data
│   │   ├── utils.ts              # Styling cn helper (clsx + twMerge)
│   │   ├── data.ts               # Domain seed and mock records
│   │   └── validations/          # Zod validation schemas
│   │       ├── auth.ts
│   │       ├── cash-advance.ts
│   │       ├── dlpo.ts
│   │       ├── expenditure.ts
│   │       ├── duty-mileage.ts
│   │       └── imprest.ts
│   └── types/                    # Core TypeScript definitions & models
│       └── index.ts
├── components.json               # Shadcn UI configuration
├── next.config.ts                # Next.js build and runtime configuration
├── package.json                  # Cleaned modern dependencies
├── postcss.config.mjs            # PostCSS configuration for Tailwind v4
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## Detailed Implementation Phases

### Phase 1: Dependency Cleanup and Installation
- **Remove legacy & unused dependencies**: `@emotion/react`, `@emotion/styled`, `@mui/icons-material`, `@mui/material`, `@popperjs/core`, `react-popper`, `react-dnd`, `react-dnd-html5-backend`, `react-responsive-masonry`, `react-slick`, `@tailwindcss/vite`, `vite`, `@vitejs/plugin-react`.
- **Install modern stack**:
  - `next`: Latest stable App Router framework
  - `react`, `react-dom`: React 19 / 18 runtime
  - `typescript`, `@types/node`, `@types/react`, `@types/react-dom`: Type safety
  - `tailwindcss`, `@tailwindcss/postcss`, `postcss`: Tailwind CSS v4 support
  - `zod`, `@hookform/resolvers`, `react-hook-form`: Schema validation and forms
  - `@tanstack/react-table`: Modern headless table management
  - Radix UI primitives & Lucide icons for shadcn/ui

### Phase 2: Configuration Setup
1. **`tsconfig.json`**:
   - Set `"moduleResolution": "bundler"`, `"target": "ES2022"`, `"strict": true`
   - Set path aliases: `"@/*": ["./src/*"]`
   - Add `"plugins": [{ "name": "next" }]`
2. **`next.config.ts`**:
   - Modern Next.js configuration with support for SVG/assets and React compiler/strict mode.
3. **`postcss.config.mjs`**:
   - Modern PostCSS configuration configuring `@tailwindcss/postcss`.
4. **`components.json`**:
   - Standard shadcn configuration matching the `@/components/ui` and `@/lib/utils` convention.

### Phase 3: Project Restructuring & Asset Migration
1. Move atomic UI components from `src/app/components/ui` to `src/components/ui`.
2. Move utility `cn` function to `src/lib/utils.ts` and ensure shadcn imports resolve smoothly.
3. Move `types/index.ts` to `src/types/index.ts`.
4. Move `data.ts` to `src/lib/data.ts`.
5. Move `AuthContext.tsx` to `src/context/AuthContext.tsx`.
6. Consolidate CSS styles into `src/app/globals.css` (combining Tailwind v4 directives, design system variables, and print stylesheets).

### Phase 4: Route Migration (App Router Parity)
1. Convert Vite React Router navigation (`react-router`) to Next.js navigation:
   - `Link` from `react-router` -> `Link` from `next/link`
   - `useNavigate` -> `useRouter` from `next/navigation`
   - `useLocation` -> `usePathname` from `next/navigation`
   - `useParams` -> `useParams` from `next/navigation` or page param props.
2. Structure App Router pages:
   - `src/app/layout.tsx`: Root layout with `AuthProvider`, `<Toaster />`, and global CSS.
   - `src/app/page.tsx`: Role selection landing.
   - `src/app/(auth)/department-login/page.tsx` & `src/app/(auth)/bursary-login/page.tsx`.
   - `src/app/department/layout.tsx` & all subpages (`dashboard`, `submissions`, `submission/[id]`, `forms/*`, `submission-success`).
   - `src/app/bursary/layout.tsx` & all subpages (`dashboard`, `cash-advance`, `dlpo`, `expenditure`, `duty-mileage`, `imprest`, `submission/[id]`).

### Phase 5: Form Validation Schemas (Zod Foundation)
- Establish standard Zod schemas in `src/lib/validations/` for:
  - Cash Advance Form
  - DLPO Form
  - Expenditure Authorization Form
  - Duty Mileage Form
  - Imprest Holder Form
  - Login authentication forms

### Phase 6: Headless Data Tables with TanStack Table
- Build `src/components/ui/data-table.tsx` implementing `@tanstack/react-table` with:
  - Column sorting
  - Global & faceted search/filtering
  - Pagination controls
  - Reusable generic typed interface

### Phase 7: Verification & Build Validation
- Run TypeScript diagnostics (`tsc --noEmit`) to verify zero type mismatches.
- Run `pnpm build` to verify Next.js static and dynamic route compilation.
- Ensure all pages are accessible and ready for further feature expansions.
