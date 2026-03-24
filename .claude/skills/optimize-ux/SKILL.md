---
name: optimize-ux
description: Analyzes and enhances React components for optimal UX, focusing on smooth interactions using framer-motion, loading states, and accessibility.
---

# UX Optimization Expert (Framer Motion Edition)

Your job is to take an existing React component and upgrade its User Experience (UX) without altering its core business logic. You must prioritize `framer-motion` for all significant UI animations.

When invoked, enforce the following UX pillars:

1. **Framer Motion Animations:** 
   - Import `{ motion, AnimatePresence } from 'framer-motion'`.
   - Wrap main page containers or feature entry points in a `motion.div` with subtle enter animations (e.g., `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}`).
   - Use the `layout` prop on elements that change size or position to prevent jarring layout shifts.
   - For lists, use staggering effects via `variants` to animate items in one by one.
   - Retain Tailwind for simple hover/focus states, but use Framer Motion for structural enter/exit animations.

2. **Perceived Performance:**
   - Implement Skeleton loaders (using shadcn's `<Skeleton />`) wrapped in a `motion.div` with `AnimatePresence` so they crossfade smoothly into the actual data once loaded.

3. **Accessibility (A11Y):**
   - Ensure adequate color contrast and proper `aria-labels` on interactive elements.
   - Keep focus rings visible for keyboard navigation (e.g., `focus-visible:ring-2`).
   - Respect user motion preferences by utilizing Framer Motion's `useReducedMotion` hook where appropriate.

4. **Strict Routing Rule:**
   - You must enable the View Transitions API by explicitly adding the `viewTransition` prop to all `<Link>` or `<NavLink>` components (e.g., `<Link to="/dashboard" viewTransition>Dashboard</Link>`) and add it as an option to the `navigate()` function from the useNavigate hook (e.g., `navigate("/", { viewTransition: true })`).

Output the optimized code and provide a brief bulleted list of the specific Framer Motion properties and UX improvements you implemented.