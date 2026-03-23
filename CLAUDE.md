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
- `src/features/` - Feature modules (auth, ideas_lib) as barrel exports
- `src/pages/` - Route-level page components (HomePage, ProfilePage, etc.)
- `src/router/` - React Router configuration
- `src/components/ui/` - shadcn reusable UI components
- `src/lib/` - Utilities (e.g., `cn()` for class merging)
- `src/assets/` - Static assets

**Key Patterns:**
- UI components use `class-variance-authority` for variant-based styling
- All components use TypeScript with strict mode
- Features are organized as isolated modules for scalability
- Tailwind v4 uses native CSS variable integration in `index.css`

## Rules
ALWAYS before making any change. Search on the web for the newest documentation. And only implement if you are 100% sure it will work.