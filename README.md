# FinBoard - Personal Finance Dashboard

A premium-looking personal finance dashboard built with React, TypeScript, and modern frontend tooling. Inspired by the design langauge of fintech products like CRED and Stripe — clean, minimal, and data-rich.

---

## Table of Content

- [Feature Overview](#feature-overview)
- [Tech Stack and Why](#tech-stack-and-why)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture Decisions](#architecture-decisions)
- [Performance Choices](#performance-choices)
- [UI and UX Details](#ui-and-ux-details)
- [Assumptions Made](#assumptions-made)

---

## Feature Overview

### Dashboard View
- **Summary stat cards** — Balance, Income, Expenses, and Savings Rate with month-over-month trends
- **Balance trend chart** — Area chart showing cumulative balance growth over 6 months
- **Category breakdown** — Donut chart with percentage split across expense categorys
- **Monthly income vs expenses** — Grouped bar chart comparision for each month
- **Quick insights panel** — Key observations like highest spending category, daily average spend, biggest single expense, etc.

### Transactions View
- Full transaction list with category icons, badges, and formated amounts
- **Advanced filtering** — by type (income/expense), category, date range
- **Search** with debounced input to avoid unnessary re-renders
- **Sorting** — by date, amount, or category
- **Pagination** — progressive "show more" loading for large datasets
- **Add / Edit / Delete** transactions (admin role only)
- **Export** — download filtered transactions as CSV or JSON

### Additional Features
- **Dark mode** (default) with smooth toggle to light mode, persisted in localStorage
- **Role-based UI** — Admin gets full CRUD actions; Viewer is read-only. Switchable from sidebar/drawer
- **Responsive design** — works on mobile, tablet, laptop, and large desktop
- **Loading skeletons** — shimmer placeholders while data is fetching
- **Empty states** — helpfull messages when no transactions match filters
- **Mock API layer** — simulates realistic network delays (200-600ms)
- **Data persistence** — all transactions saved in localStorage between sessions
- **Optimistic deletes** — UI updates immediatly, rolls back on failure

---

## Tech Stack and Why

| Technology | Purpose | Reasoning |
|---|---|---|
| **React 18 + Vite** | UI framework & bundler | Fast HMR, instant server startup, optimised production builds |
| **TypeScript** | Type safety | Catches bugs at compile time, improves IDE expirience |
| **Tailwind CSS 3** | Styling | Utility-first approach enables rapid UI building with consistent spacing and colors. Dark mode via class strategy |
| **Zustand** | State management | Minimal boilerplate compared to Redux, no context providers needed, excellent performance with selector-based subscriptions |
| **Recharts** | Data visualization | React-native charting library, highly customisable, responsive containers |
| **Framer Motion** | Animations | Declarative API for smooth page transitions, modal animations, and micro-interactions |
| **Lucide React** | Icons | Consistent, lightweight icon set that matches modern UI aesthetic |
| **date-fns** | Date formatting | Tree-shakeable, much lighter than moment.js |
| **clsx** | Class composition | Conditional classNames without messy template literals |

---

## Getting Started

### Prerequisits

- Node.js 18 or higher
- npm 9+ (or pnpm/yarn)

### Installation

```bash
# clone and enter the project
cd finance-dashboard

# install dependancies
npm install

# start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview   # preview the production build localy
```

---

## Project Structure

```
src/
├── components/
│   ├── layout/          # Shell, Sidebar, TopBar (responsive navigation)
│   ├── dashboard/       # StatCards, BalanceTrend, CategoryBreakdown,
│   │                    # MonthlyComparison, QuickInsights, DashboardView
│   ├── transactions/    # TxnTable, TxnFilters, TxnForm, TxnRow
│   └── ui/              # Reusable primitives — Card, Button, Modal,
│                        # Badge, Skeleton, EmptyState, ThemeToggle
├── store/
│   └── finance.ts       # Zustand store + derived selectors
├── hooks/
│   ├── use-debounce.ts  # Debounce hook for search input
│   └── use-breakpoint.ts # Responsive breakpoint detection
├── lib/
│   ├── types.ts         # TypeScript type definations
│   ├── constants.ts     # Category configs, filter defaults, storage keys
│   ├── formatters.ts    # Currency, date, and percentage formatters
│   ├── export.ts        # CSV and JSON export utilites
│   ├── mock-data.ts     # 99 realistic seed transactions
│   └── mock-api.ts      # Simulated async API with localStorage persistance
├── App.tsx              # Root component, theme sync, data loading
├── main.tsx             # React DOM entry point
└── index.css            # Tailwind directives and custom styles
```

---

## Architecture Decisions

### State Management — Zustand with Derived Selectors

Instead of putting derived data (totals, monthly breakdown, insights) inside the store, I compute them outside using pure selector functions. Components call `useMemo(() => selectTotals(transactions), [transactions])`. This way:

- The store stays lean — only raw transactions, filters, and UI state
- Derived state never goes stale or out of sync
- No unnessary re-renders because selectors are memoized at the component level

### Component Boundaries

The UI is organized by **feature domain** (dashboard, transactions) rather than by component type. Shared primitives live in `ui/`. This keeps related things together and makes it easier to reason about each feature independantly.

### Mock API with localStorage

The mock API layer (`mock-api.ts`) wraps all data operations behind async functions that simulate real network conditions. This makes it trivial to swap in a real backend later — just replace the implementation inside `api.fetchTransactions()`, etc., without touching any component code.

### Optimistic Updates

For deletes, the UI removes the transaction immediatly before the API call completes. If the call fails, we rollback to the previous state. This makes the interface feel snappy while maintaining data integrity.

---

## Performance Choices

1. **Debounced search** — 250ms debounce prevents filtering on every keystroke, reducing compute for large transaction lists
2. **Memoized selectors** — Heavy computations (category breakdown, monthly aggregation, insights) are wrapped in `useMemo` and only recalculate when transactions actually change
3. **`memo()` on TxnRow** — Transaction rows are wrapped in `React.memo` to skip re-render when parent re-renders but individual row data hasn't changed
4. **Progressive loading** — Instead of rendering all 99+ rows at once, we show 15 initially with a "show more" button. This keeps initial render fast
5. **Selector-based store subscriptions** — Each component subscribes to only the specific slice of state it needs (e.g., `useFinanceStore(s => s.theme)`), preventing cascade re-renders
6. **Lightweight dependencies** — Chose date-fns over moment.js, Zustand over Redux Toolkit, clsx over classnames — all for smaller bundle footprint

---

## UI and UX Details

### Design Language
- **Dark-first design** with carefully picked background layers (950 -> 900 -> 800) for depth
- **Glass-morphism cards** with subtle backdrop blur and thin borders
- **Color system**: Indigo accent for interactive elements, Emerald for income/positive, Coral for expenses/negative, Amber for savings
- **Gradient overlays** on stat cards to give each metric a unique visual identiy

### Responsive Strategy
- **Desktop (1024px+)**: Persistent sidebar with navigation, role switcher, and theme toggle. Full grid layouts
- **Tablet (640-1023px)**: Collapsible sidebar, 2-column grid for stat cards
- **Mobile (<640px)**: Hamburger menu with slide-out drawer. Single column layouts. Touch-friendly tap targets

### Micro-interactions
- Staggered card entrance animations (each card slides in 60ms after the previous)
- Smooth theme transition with icon rotation animation
- Layout-aware active indicator on sidebar navigation (shared layout animation)
- Hover-reveal for edit/delete actions on transaction rows
- Modal entrance with scale + fade for premium feel

### Accessibility
- All interactive elements have proper `aria-label` attributes
- Keyboard navigation support — buttons are focusable, modal closes on Escape
- Color contrast ratios maintained across both themes
- Focus-visible rings on all interactive elements

---

## Assumptions Made

Since requirements did not specify these explictly, I made practical decisions:

1. **Currency** — USD ($) as default. The formatter is centralised in one place, easy to change
2. **Date range** — Mock data covers October 2025 to March 2026 (6 months of realistic transactions)
3. **Role switching** — Simple toggle between Admin/Viewer rather than an authentication system. This is a UI-level demo of role-based behaviour
4. **No routing library** — Since there are only 2 views (Dashboard and Transactions), I used state-based navigation instead of React Router. Keeps the bundle smaller and avoids unneeded complexity
5. **Progressive loading over virtualisation** — For ~100 transactions, a "show more" pagination approach is simpler and sufficient. Virtualisation (react-window) would be added if the dataset grows beyond 1000+
6. **localStorage for persistance** — Suitable for a demo/personal tool. A production app would use a backend database
7. **Chart library** — Chose Recharts for its React-native approach and good dark mode support. Alternative would be Visx for more control but higher complexity
