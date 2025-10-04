# Bitstra

Bitstra is an open-source web platform that enables people—especially women—to buy mobile data, airtime, and pay utility bills using Bitcoin (Lightning). The project aims to reduce friction for everyday transactions and improve financial autonomy.

## Why

During protests and political unrest, activists and communities can have banking and payment accounts restricted or frozen. Many women across Africa are unbanked or have limited access to formal financial services and can lose access to accounts. Bitstra provides an alternative payment path so women can reliably pay for household needs—mobile data, airtime, and utility bills—helping them manage essential responsibilities for their families and communities.

## How this helps women

- Provides alternative payment rails for users without traditional banking access.
- Reduces friction for routine purchases like airtime and data.
- Encourages locally relevant integrations that support daily life and work.

## What it is

- A React + TypeScript single-page application.
- Built with Vite and styled with TailwindCSS and shadcn/ui components.
- Integrates with a Lightning payment provider (see `src/lib/bitnob.ts`).

## Architecture - Current MVP Version

Bitstra follows a modern React architecture with the following key components:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: TailwindCSS with custom theme and Shadcn/ui components
- **Routing**: React Router DOM for client-side navigation
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation
- **Payment Integration**: Bitnob API for Bitcoin Lightning payments
- **QR Code Generation**: Mock implementation due to Bitnob sandbox limitations

## Image of Flow and Technical Architecture

![alt text](<Screenshot from 2025-10-03 19-51-39.png>)

## Prerequisites

Before building the project, ensure you have the following installed:

- Node.js (version 18 or higher)
- npm or yarn package manager
- Git for version control

## Tech overview

- Frontend: React + TypeScript
- Build: Vite
- Styling: TailwindCSS and shadcn/ui components (`src/components/ui`)
- Routing: React Router
- API / server state: TanStack Query + Axios
- Forms & validation: React Hook Form + Zod
- Payment integration: `src/lib/bitnob.ts`

## Quick start

Prerequisites:

- Node.js v18+
- npm

Clone and install:

```bash
git clone <repository-url>
cd bitstra
npm install
```

Create a `.env` with at least the API key and base URL for your payment provider. Example:

```env
VITE_BITNOB_API_KEY=your_api_key
VITE_BITNOB_BASE_URL=https://api.example.com
VITE_BITNOB_ENV=production
```

Run locally:

```bash
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

Code quality:

```bash
npm run lint
```

## Contributing

Contributions are welcome. 

Read `doc` folder for better understanding

Common areas:
- Improve UI, accessibility, and mobile experience (`src/components`)
- Add or refine integrations to local airtime/data/utility providers
- Payment integration: Harden payment flows and error handling in `src/lib/bitnob.ts`
- UI components: `src/components`
- Pages: `src/pages`
- App entry: `src/main.tsx`, `src/App.tsx`

### Steps to take for contribution: 

1. Fork and create a branch for your change.
2. Run tests and linting locally.
3. Open a pull request with a clear description and motivation.

Code style: follow TypeScript strict mode and ESLint rules.

## Security

- Keep API keys and secrets out of version control. Use environment variables or secret stores.