---
applyTo: "**"
---

# GitHub Copilot Instructions

You are an expert in TypeScript, Next.js 15, React 19, Shadcn UI, Radix UI, and Tailwind CSS 4, building a bilingual (Arabic RTL) engineering inspection company website.

## Project Architecture

This is a **single-page application** with a fixed sidebar navigation and scroll-based sections. Key architectural decisions:

- **Layout Pattern**: `app/page.tsx` uses `SidebarProvider` wrapping a flex container with `<Sidebar />` and scrollable `<main>`. All sections are direct children in main.
- **State Management**: Client state lives in React Context (see `sidebar-context.tsx`). No external state libraries.
- **Content Architecture**: ALL text content lives in `content.ts` as a typed object exported as default. This is for easy Arabic translation management.
- **Section IDs**: Each section has an `id` attribute for anchor navigation (e.g., `id="hero"`, `id="why-inspectex"`).

## Content Management (Critical)

**NEVER hardcode text content.** All content comes from `content.ts`:

```tsx
import content from "@/content";
// Access like: content.hero.title, content.workflow.steps
```

When adding features, first update `content.ts` with the new data structure, then reference it in components.

## Component Patterns

### Section Components (`components/sections/`)

All page sections follow this pattern:

- Named exports: `export function HeroSection() {}`
- File structure for complex sections: `section-name/index.tsx` + child components
- Example: `workflow/index.tsx` imports `workflow/workflow-step-card.tsx`

### SectionTitle Component (Mandatory)

Every section MUST use `<SectionTitle>` from `@/components/ui/section-title`:

```tsx
<SectionTitle variant="center">{content.sectionName.title}</SectionTitle>
```

**Variants:**

- `"center"`: Centered alignment, two-color divider (default)
- `"start"`: Left-aligned (RTL: right-aligned), gradient from dark to secondary
- `"start-dark"`: For dark backgrounds, gradient from white to secondary

Props: `showDivider`, `showLogo`, `className`, `dividerClassName`, `logoClassName`

### UI Components (`components/ui/`)

Available components to reuse (never recreate):

- `Button`, `AnimatedButton` - Standard and hover-expand buttons
- `Card`, `Accordion`, `Tabs`, `Carousel` - Layout components
- `Form`, `Label` - Form elements with `react-hook-form` + `zod`

**AnimatedButton** has special hover animation that expands background color from 2.5px to full width. Variants: `primary`, `secondary`, `accent`.

## Styling System

### Design Tokens (from `globals.css`)

Use CSS custom properties defined in `:root`:

- Colors: `--primary` (#021a60), `--primary-light` (#032da6), `--secondary` (#f25b06), `--background` (#fafbfd), `--foreground` (#333333)
- Typography: Lama Sans font family (400, 500, 700 weights) loaded via `@font-face`
- Spacing: Use Tailwind utilities, but `.container` class is customized (max-w-7xl, auto margins, px-4)

### Typography

HTML elements are styled globally in `@layer base`:

- `h1` through `h6` have predefined sizes and weights
- `p` uses `text-base leading-relaxed`
- Never override these unless variant styling is required

### RTL Support

This is an Arabic-first site. When needed, use `dir="rtl"` on elements. Gradients and positioning account for RTL (see `SectionTitle` gradient logic).

## Development Workflow

### Running the App

```bash
npm run dev  # Runs on port 3008 with Turbopack
npm run build
npm run lint
```

### SVG Handling

SVGs are imported as React components via `@svgr/webpack` (configured in `next.config.ts`):

```tsx
import Icon from "@/icons/icon-01.svg";
<Icon className="w-6 h-6" />;
```

For static paths, use: `import IconUrl from "@/icons/icon.svg?url"`

Type definitions in `svg.d.ts`.

### Client Components

This project minimizes `"use client"`. Use only when needed:

- Interactive state (sidebar toggle, form interactions)
- Browser APIs (scrolling, localStorage)
- Event handlers (onClick, etc.)

See `sidebar-context.tsx` and `sidebar/index.tsx` for the pattern: Context in one client file, consumed by client components.

## File Structure Conventions

```
components/
  sections/          # Page sections (hero, faq, etc.)
  ui/               # Reusable UI primitives
  layout/           # Layout components (sidebar, navbar)
    sidebar/        # Complex component with subfiles
icons/              # SVG icons organized by feature
public/
  images/           # Organized by section: bg/, sections/inspection-contents/
  fonts/            # Lama Sans font files
```

**Naming:** Lowercase with dashes (e.g., `inspection-contents.tsx`, `workflow-step-card.tsx`)

## Common Patterns

### Mapping Content Arrays

```tsx
{
  content.workflow.steps.map((step, index) => (
    <WorkflowStepCard key={index} {...step} />
  ));
}
```

### Sidebar Navigation

Navigation items reference section IDs. Clicking smoothly scrolls via `scroll-behavior: smooth` in `globals.css`. Active section detection could be added with IntersectionObserver.

### Responsive Design

Mobile-first with Tailwind breakpoints:

- Mobile: Base styles
- Tablet: `md:` prefix (768px+)
- Desktop: `lg:` prefix (1024px+)

Sidebar is full-screen on mobile with overlay, fixed 340px width on desktop. See `sidebar/index.tsx` for the pattern using `useSidebar()` context.

## TypeScript Configuration

- Path alias: `@/*` maps to project root
- Target: ES2017
- Strict mode enabled
- See `tsconfig.json` for full config

## Testing & Quality

Run `npm run lint` before committing. ESLint configured with `eslint-config-next`.

## Common Tasks

**Adding a new section:**

1. Add content to `content.ts` under a new key
2. Create `components/sections/new-section.tsx`
3. Import and add `<NewSection />` to `app/page.tsx`
4. Add section `id` for navigation
5. Update sidebar navigation if needed

**Adding a new UI component:**

1. Check if similar component exists in `components/ui/`
2. If creating new, follow Shadcn UI patterns with CVA variants
3. Use `cn()` utility from `lib/utils.ts` for className merging

---

## Anti-Patterns to Avoid

- ❌ Hardcoding Arabic text instead of using `content.ts`
- ❌ Creating custom buttons/cards when `ui/` components exist
- ❌ Using hardcoded hex colors instead of CSS variables
- ❌ Forgetting `<SectionTitle>` when adding sections
- ❌ Inline styles (use Tailwind)
- ❌ Using `"use client"` unnecessarily (default to server components)
- ❌ Not using `.container` class for section content width
