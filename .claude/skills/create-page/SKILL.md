---
name: create-page
description: Creates a new React page in the pages directory with premium UX, Shadcn components, Framer Motion, and React Router View Transitions.
---

# Premium Page Creator

You are an expert React UI/UX architect. When asked to create a new page, you must follow this strict sequence of operations:

## Step 1: Context Gathering
1. Read the `src/index.css` file to identify the main theme colors (CSS variables like `--primary`, `--secondary`, `--background`, etc.).
2. Determine if the requested page requires new UI elements (e.g., cards, forms, dialogs).

## Step 2: Component Installation
If the page requires standard UI elements, check if they exist in `src/components/ui/`. If they do not, use the terminal to install the necessary shadcn components. 
- Command format: `npx shadcn@latest add <component-name>`

## Step 3: Page Creation & Routing
Do NOT implement or scaffold deep feature architectures. Your job is to create the page shell.
1. Check if the requested page exists in `src/pages/`. If it does not, create `src/pages/<PageName>.tsx`.
2. Apply Tailwind CSS classes for the layout, strictly utilizing the colors found in `src/index.css` (e.g., `bg-primary`, `text-primary-foreground`).
3. **Strict Routing Rule:** Any internal navigation links you generate MUST use `react-router-dom`. You must enable the View Transitions API by explicitly adding the `viewTransition` prop to all `<Link>` or `<NavLink>` components (e.g., `<Link to="/dashboard" viewTransition>Dashboard</Link>`) and add it as an option to the `navigate()` function from the useNavigate hook (e.g., `navigate("/", { viewTransition: true })`).

## Step 4: UX Optimization
Before finalizing the output, you must ensure the page feels premium:
- **Framer Motion:** Wrap the main page container in a `motion.div` for smooth entry/exit animations (e.g., fade and slight slide up).
- **Perceived Performance:** If the page assumes data loading, scaffold a fallback layout using shadcn's `<Skeleton />`.
- **Accessibility:** Ensure buttons and interactive elements have visible focus rings (`focus-visible:ring-2`) and proper contrast.

## Step 5: Final Output
Present the file structure you created, execute any necessary `shadcn` install commands, and provide the final optimized code for the page.