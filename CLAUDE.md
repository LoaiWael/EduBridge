# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server with HMR
npm run build    # Build for production (TypeScript + Vite)
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

**Stack:**
- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 (native `@import 'tailwindcss'`)
- shadcn/ui components (Radix UI primitives + CVA)
- React Router v7 for routing
- Zustand for state management
- React Hook Form for forms
- Axios for HTTP requests
- Motion (Framer Motion) for animations
- Lucide React for icons
- React Compiler enabled (Babel preset)
- Path alias: `@` → `./src`

**Structure:**
- `src/features/` - Feature modules with barrel exports
- `src/pages/` - Route-level page components
- `src/router/` - React Router configuration with route guards
- `src/components/ui/` - shadcn reusable UI components
- `src/lib/` - Utilities (e.g., `cn()` for class merging)
- `src/layouts/` - Layout components (RootLayout, WithoutNavLayout)
- `src/assets/` - Static assets

**Feature Module Pattern:**
Each feature follows a consistent structure:
```
src/features/[feature]/
├── index.ts           # Barrel exports (types, stores, components)
├── types/index.ts     # TypeScript interfaces/types
├── store/             # Zustand stores (e.g., useAuthStore)
└── components/       # Feature-specific components
```

Current features: `auth`, `profile`, `ideas`, `teams`, `notifications`, `supervision`, `chatbot`

**Routing:**
- `AuthRoutes` - Unauthenticated routes (login, register, etc.)
- `ProtectedRoutes` - Authenticated route wrapper
- `StudentRoutes` - Role-based route guard for students
- `TaRoutes` - Role-based route guard for teaching assistants
- Routes use `createRoutesFromElements` with nested layouts

**UI Components:**
- Use `class-variance-authority` (CVA) for variant-based styling
- shadcn components located in `src/components/ui/`
- Custom theme variables in `index.css` (brand colors, shadows, radii)
- Tailwind v4 `@theme inline` block defines design tokens

## Rules
ALWAYS before making any change. Search on the web for the newest documentation. And only implement if you are 100% sure it will work.