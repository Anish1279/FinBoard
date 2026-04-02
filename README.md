<div align="center">

```
███████╗██╗███╗   ██╗██████╗  ██████╗  █████╗ ██████╗ ██████╗ 
██╔════╝██║████╗  ██║██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔══██╗
█████╗  ██║██╔██╗ ██║██████╔╝██║   ██║███████║██████╔╝██║  ██║
██╔══╝  ██║██║╚██╗██║██╔══██╗██║   ██║██╔══██║██╔══██╗██║  ██║
██║     ██║██║ ╚████║██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝
╚═╝     ╚═╝╚═╝  ╚═══╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ 
```

### *Your financial story, beautifully told.*

<br />

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Recharts](https://img.shields.io/badge/Recharts-2.x-22C55E?style=for-the-badge)](https://recharts.org)

<br/>

![Dashboard Preview](./public/preview-dashboard.png)

</div>

---

## ✦ What is FinBoard?

**FinBoard** is a production-ready, role-aware finance dashboard that transforms raw transaction data into a living picture of your financial health. Built as a frontend-first application with zero backend dependency, it delivers an experience that feels anything but mock — dark by default, insight-forward by design, and polished at every pixel.

> Built for a Personal Project — but designed like a product you'd actually ship.

---

## ✦ Feature Highlights

### 🏠 Dashboard Overview
The nerve center of your finances. At a glance:

| Card | What it tells you |
|---|---|
| **Total Balance** | Your cumulative net position |
| **Total Income** | Aggregated earnings across all sources |
| **Total Expenses** | Spend totals with month-over-month delta |
| **Savings Rate** | The percentage of income actually saved |

Three live visualizations back these numbers up:
- **Balance Trend** — A smooth area chart tracing your financial trajectory over 6 months
- **Spending Breakdown** — A donut chart slicing expenses across 9 categories (Rent, Shopping, Bills & Utilities, Food & Dining, Travel, Health, and more)
- **Monthly Income vs Expenses** — Side-by-side grouped bars for each month, making surpluses and deficits instantly readable

### 💳 Transactions
A searchable, filterable, sortable list of **99 transactions** — with everything you need:

- 🔍 **Search** by description, merchant, or keyword
- 🏷️ **Filter** by type (Income / Expense) and by category
- 📅 **Date range** picker to scope any window of time
- ↕️ **Sort** by: Newest First · Oldest First · Highest Amount · Lowest Amount · Category A–Z
- 📤 **Export** transactions to CSV/JSON with one click

Every transaction shows its date, category badge (color-coded), icon, description, and signed amount — green for income, red for expense.

### 🔐 Role-Based UI
No backend needed. Roles are simulated on the frontend and toggle instantly from the sidebar:

| Role | Capabilities |
|---|---|
| **Admin** | View all data · Add transactions · Edit existing entries |
| **Viewer** | Read-only access · No mutation controls shown |

Switch between roles mid-session — the UI adapts in real time.

### 💡 Quick Insights
Auto-computed observations that surface what matters:

- 🏷️ **Highest Spending Category** — with total and transaction count
- 📈 **Monthly Change** — expenses vs prior month, signed and colored
- 💸 **Avg Daily Spend** — calculated across entire transaction history
- 🔺 **Largest Single Expense** — flagged with its description
- 📂 **Active Categories** — count of categories with at least one expense

---

## ✦ Tech Stack

```
FinBoard
├── React 19             → Component model & rendering
├── TypeScript           → End-to-end type safety
├── Vite 6               → Lightning-fast dev server & bundler
├── Tailwind CSS 3       → Utility-first styling with dark mode
├── Recharts 2           → Composable, animated data visualizations
├── React Context API    → Global state (transactions, filters, role)
└── localStorage         → Persistence across sessions
```

---

## ✦ Architecture & Design Decisions

### State Management — Context + Reducer
Rather than reaching for Redux, FinBoard uses React's built-in **Context API** paired with `useReducer`. This keeps the state logic centralized and predictable without the boilerplate overhead — the right tool for this scope.

```
AppContext
├── transactions[]       → Source of truth for all financial data
├── filters              → { type, category, dateFrom, dateTo, sortBy, query }
├── role                 → 'admin' | 'viewer'
└── theme                → 'dark' | 'light'
```

Derived values (totals, insights, chart data) are computed via `useMemo` to avoid redundant recalculation on every render.

### Data Persistence — localStorage
All transactions added or edited by Admin are written to `localStorage`. On mount, the app hydrates from storage — falling back gracefully to the bundled mock dataset if nothing is found. This means your data survives page refreshes.

### Role-Based Rendering
RBAC is implemented as a simple conditional rendering pattern. A `useRole()` hook exposes the current role, and components use it to gate Admin-only controls (Add Transaction button, Edit/Delete actions). No routes are hidden — the UI simply removes affordances the Viewer has no business seeing.

### Responsive Layout
- **Mobile** (`< 768px`): Single column, collapsible sidebar, stacked cards
- **Tablet** (`768px–1024px`): Two-column grid, condensed charts
- **Laptop / Desktop** (`> 1024px`): Full sidebar + multi-column dashboard
- **Large Screens** (`> 1440px`): Expanded chart canvases, wider spacing

---

## ✦ Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or pnpm / yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/finboard.git
cd finboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — the dashboard loads instantly with mock data.

### Build for Production

```bash
npm run build       # Outputs to /dist
npm run preview     # Locally preview the production build
```

### Lint

```bash
npm run lint        # ESLint with TypeScript-aware rules
```

---

## ✦ Project Structure

```
finboard/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── dashboard/       # SummaryCards, BalanceTrend, SpendingBreakdown,
│   │   │                    #   MonthlyComparison, QuickInsights
│   │   ├── transactions/    # TransactionList, TransactionRow, Filters,
│   │   │                    #   SearchBar, SortDropdown, ExportButton
│   │   ├── layout/          # Sidebar, Navbar, RoleSwitcher, ThemeToggle
│   │   └── ui/              # Button, Badge, Card, Modal, EmptyState
│   ├── context/
│   │   └── AppContext.tsx   # Global state: transactions, filters, role, theme
│   ├── hooks/
│   │   ├── useTransactions.ts
│   │   ├── useInsights.ts
│   │   └── useRole.ts
│   ├── data/
│   │   └── mockTransactions.ts   # 99 seeded transactions across 6 months
│   ├── types/
│   │   └── index.ts              # Transaction, Role, Filter, Category types
│   ├── utils/
│   │   ├── formatCurrency.ts
│   │   ├── exportData.ts         # CSV + JSON export logic
│   │   └── computeInsights.ts
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── tailwind.config.ts
├── tsconfig.app.json
└── vite.config.ts
```

---

## ✦ Mock Data

The app ships with **99 realistic transactions** spanning October 2025 – March 2026, distributed across 9 categories:

| Category | Color |
|---|---|
| Rent | 🔵 Blue-gray |
| Shopping | 🩷 Pink |
| Bills & Utilities | 🔴 Red |
| Food & Dining | 🟠 Orange |
| Travel | 🔵 Indigo |
| Health | 🩵 Teal |
| Entertainment | 🟣 Purple |
| Education | 🟡 Yellow |
| Investments / Refunds | 🟢 Green |

---

## ✦ Screenshots

| Dashboard | Transactions | Insights |
|---|---|---|
| ![Dashboard](./public/screenshots/dashboard.png) | ![Transactions](./public/screenshots/transactions.png) | ![Insights](./public/screenshots/insights.png) |

---

## ✦ License

© 2026 Anish Singh. All Rights Reserved.

---

<div align="center">

*Crafted with care — because good finance tools should feel good to use.*

**FinBoard** · React + TypeScript + Vite · Built to impress

</div>
