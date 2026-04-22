# GEMINI.md

This file provides guidance to Atigravity when working with code in this repository.

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
- `src/assets/` - Static assets (SVG illustrations in `src/assets/imgs/svg/`)
- `src/utils/` - Helper functions

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
- `src/router/index.tsx` - Main router using `createRoutesFromElements`
- `AuthRoutes` - Unauthenticated routes (login, register, etc.) - redirects to profile if already authenticated
- `ProtectedRoutes` - Authenticated route wrapper - redirects to /login if not authenticated
- `StudentRoutes` - Role-based route guard - only allows `role === 'student'` through
- `TaRoutes` - Role-based route guard - only allows `role === 'ta'` through
- Two layout wrappers: `RootLayout` (includes NavBar) and `WithoutNavLayout` (full-screen pages like settings)

**State Management:**
- `useAuthStore` in `src/features/auth/store/useAuthStore.ts` - authentication state (`isAuthenticated`, `id`)
- `useProfileStore` in `src/features/profile/store/useProfileStore.ts` - user profile including role (`'student'` or `'ta'`)

**Theme & Styling:**
- Custom theme variables defined in `src/index.css` with light/dark mode variants
- Tailwind v4 `@theme inline` block defines design tokens (colors, typography, spacing, shadows, radii)
- Use `shadcn/tailwind.css` for component styles
- `tw-animate-css` for animations

**Additional Stores:**
- `usePreferencesStore` in `src/store/usePreferencesStore.ts` - theme and animations settings

**Global Types:**
- `src/types/index.ts` - shared type definitions (Role, UserSkill, etc.)

## Rules
ALWAYS before making any change. Search on the web for the newest documentation. And only implement if you are 100% sure it will work.