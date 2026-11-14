# OAU Bursary Digital Form Submission & Processing System

A digital form submission, routing, and bursary administration system for Obafemi Awolowo University (OAU), built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Shadcn UI**, **Zod**, and **TanStack Table**.

---

## 🛠️ Tech Stack & Key Libraries

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode, ES2022)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + `@tailwindcss/postcss`
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) + Radix UI Primitives
- **Data Tables**: [TanStack Table v8](https://tanstack.com/table/v8) (`@tanstack/react-table`)
- **Validation**: [Zod v3](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/) (`@hookform/resolvers`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- pnpm (recommended) or npm / yarn

### Installation
```bash
pnpm install
```

### Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
pnpm build
pnpm start
```

---

## 📂 Project Structure

```text
oau-bursary-forms/
├── public/                       # Static public assets
├── src/
│   ├── app/                      # Next.js App Router (pages & layouts)
│   │   ├── globals.css           # Tailwind v4 theme, variables & print stylesheets
│   │   ├── layout.tsx            # Root HTML layout with providers (Auth, Toaster)
│   │   ├── page.tsx              # Portal landing / Role selection
│   │   ├── (auth)/               # Auth routes
│   │   │   ├── department-login/ # Department staff login
│   │   │   └── bursary-login/    # Bursary staff login
│   │   ├── department/           # Department User Portal
│   │   │   ├── layout.tsx        # Portal navigation header & layout guard
│   │   │   ├── dashboard/        # Available forms selection
│   │   │   ├── submissions/      # My Submissions list & filter
│   │   │   ├── submission/[id]/  # Submission detail
│   │   │   ├── forms/            # Department dynamic forms
│   │   │   │   ├── cash-advance/
│   │   │   │   ├── dlpo/
│   │   │   │   ├── expenditure-authorization/
│   │   │   │   ├── duty-mileage/
│   │   │   │   └── imprest-holder/
│   │   │   └── submission-success/
│   │   └── bursary/              # Bursary Administration Portal
│   │       ├── layout.tsx        # Administration sidebar & layout guard
│   │       ├── dashboard/        # Metrics, statistics & recent submissions
│   │       ├── cash-advance/     # Filterable Cash Advance submissions
│   │       ├── dlpo/             # Filterable DLPO submissions
│   │       ├── expenditure/      # Filterable Expenditure Auth submissions
│   │       ├── duty-mileage/     # Filterable Duty Mileage submissions
│   │       ├── imprest/          # Filterable Imprest Holder submissions
│   │       └── submission/[id]/  # Review, process, voucher allocation & print
│   ├── components/               # Presentation & UI components
│   │   ├── ui/                   # Atomic Shadcn components (button, card, dialog...)
│   │   │   └── data-table.tsx    # Reusable TanStack Table component
│   │   ├── shared/               # Shared components (ProtectedRoute, SubmissionsTable)
│   │   └── forms/                # Department form components
│   ├── context/                  # React context providers (AuthContext)
│   ├── hooks/                    # Reusable React hooks (use-mobile, etc.)
│   ├── lib/                      # Utilities, business logic, mock data & schemas
│   │   ├── utils.ts              # Styling cn helper (clsx + twMerge)
│   │   ├── data.ts               # Domain seed and mock records
│   │   └── validations/          # Zod validation schemas
│   └── types/                    # Core TypeScript definitions & models
├── components.json               # Shadcn UI configuration
├── next.config.ts                # Next.js build and runtime configuration
├── package.json                  # Cleaned modern dependencies
├── postcss.config.mjs            # PostCSS configuration for Tailwind v4
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## 🔒 User Roles & Workflows

### 1. Department User Workflow
- **Login**: `/department-login`
- **Dashboard**: Browse all 5 available digital forms (`/department/dashboard`)
- **Forms**: Fill, calculate, and submit requests (`/department/forms/*`)
- **Tracking**: Track status in real time (`/department/submissions`)

### 2. Bursary Staff Workflow
- **Login**: `/bursary-login`
- **Dashboard**: High-level overview of submissions and statistics (`/bursary/dashboard`)
- **Processing**: Filter submissions, update status (Submitted, In Review, Processed, Rejected), assign voucher numbers, and add notes (`/bursary/submission/[id]`)
- **Print / Export**: Native print stylesheets formatted for official university vouchers.
