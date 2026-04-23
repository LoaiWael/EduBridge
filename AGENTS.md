# Repository Guidelines

## Project Structure & Module Organization
`src/` contains the application. Use `pages/` for route screens, `layouts/` for shared page shells, `router/` for route guards and route trees, and `features/<domain>/` for domain code split into `components/`, `store/`, `types/`, and `api/`. Shared UI primitives live in `src/components/ui/`; reusable app-wide pieces live in `src/components/`. Static assets are in `public/` and `src/assets/`. Production output is generated in `dist/`.

## Build, Test, and Development Commands
- `npm run dev`: start the Vite dev server with HMR.
- `npm run build`: run TypeScript project checks, then create the production bundle.
- `npm run lint`: run ESLint across the repo.
- `npm run preview`: serve the built app locally for a final smoke check.

## Coding Style & Naming Conventions
Use TypeScript with strict compiler settings and 2-space indentation where formatting is applied. Prefer functional React components, the `@/` import alias, and feature-local modules before adding new global utilities. Use `PascalCase` for components and pages (`AboutUsPage.tsx`), `camelCase` for hooks and helpers (`useAuthStore.ts`, `maskEmail.ts`), and keep types in `types/index.ts` when shared within a feature. Styling is Tailwind-first through `src/index.css`, with shadcn UI primitives under `src/components/ui/`.

## Testing Guidelines
There is no test runner configured yet. Until one is added, treat `npm run lint` and `npm run build` as the minimum validation for every change. When introducing tests, place them beside the feature they cover using `*.test.ts` or `*.test.tsx`, and prioritize store logic, route protection, and form flows.

## Commit & Pull Request Guidelines
Recent history uses short, imperative subjects with prefixes such as `feat:`, `ADD`, and `UPD`. Keep commits focused and descriptive, for example `feat: add student team filters`. PRs should summarize the user-visible change, list validation performed (`npm run lint`, `npm run build`), link related issues, and include screenshots for UI updates.

## Configuration Notes
Do not commit secrets. Keep environment-specific values out of source, preserve the `@` path alias, and verify PWA-related changes in `vite.config.ts` and `src/main.tsx` when touching app startup or offline behavior.

## Rules
ALWAYS before making any change. Search on the web for the newest documentation. And only implement if you are 100% sure it will work.