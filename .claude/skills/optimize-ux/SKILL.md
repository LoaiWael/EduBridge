---
name: optimize-ux
description: Analyzes and enhances React components for optimal UX, focusing on smooth interactions using framer-motion, loading states, accessibility, user feedback (tooltips), and strict type safety.
---

# UX Optimization Expert (Framer Motion Edition)

Your job is to take an existing React component and upgrade its User Experience (UX) without altering its core business logic. You must prioritize `framer-motion` for all significant UI animations, ensure robust user feedback, and resolve any type issues.

When invoked, enforce the following UX pillars:

1. **Framer Motion Animations:**
   - Import `{ motion, AnimatePresence } from 'framer-motion'`.
   - Wrap main page containers or feature entry points in a `motion.div` with subtle enter animations (e.g., `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}`).
   - Use the `layout` prop on elements that change size or position to prevent jarring layout shifts.
   - For lists, use staggering effects via `variants` to animate items in one by one.
   - Retain Tailwind for simple hover/focus states, but use Framer Motion for structural enter/exit animations.

2. **Perceived Performance & Feedback:**
   - Implement Skeleton loaders (using shadcn's `<Skeleton />`) wrapped in a `motion.div` with `AnimatePresence` so they crossfade smoothly into the actual data once loaded.
   - **Async Operations:** Ensure any asynchronous operation (fetches, form submissions, database mutations) clearly displays `loading`, `success`, and `error` states to the user using the application's existing notification or feedback patterns.

3. **Accessibility (A11Y) & Guidance:**
   - Ensure adequate color contrast and proper `aria-labels` on interactive elements.
   - Keep focus rings visible for keyboard navigation (e.g., `focus-visible:ring-2`).
   - **Tooltips:** Implement the shadcn/ui `<Tooltip>` component (utilizing `TooltipProvider`, `Tooltip`, `TooltipTrigger`, and `TooltipContent`) on any icon-only buttons, truncated text elements, or complex actions that require additional context for the user.

4. **Strict Routing Rule:**
   - You must enable the View Transitions API by explicitly adding the `viewTransition` prop to all `<Link>` or `<NavLink>` components (e.g., `<Link to="/dashboard" viewTransition>Dashboard</Link>`) and add it as an option to the navigate function from the `useNavigate` hook (e.g., `Maps("/", { viewTransition: true })`).

5. **Type Safety:**
   - Carefully inspect the provided code for any existing type errors, missing interfaces, or TypeScript warnings.
   - You must fix these type errors alongside your UX updates to ensure the final component is completely type-safe and ready for production.

Output the optimized code and provide a brief bulleted list of the specific Framer Motion properties, shadcn integrations, type errors fixed, and overall UX improvements you implemented.