import type { Category, CategorySlug, FilterState } from './types';

export const CATEGORIES: Record<CategorySlug, Category> = {
  salary:        { slug: 'salary',        label: 'Salary',            type: 'income',     color: '#10b981', icon: 'Briefcase' },
  freelance:     { slug: 'freelance',     label: 'Freelance',         type: 'income',     color: '#6366f1', icon: 'Laptop' },
  investments:   { slug: 'investments',   label: 'Investments',       type: 'income',     color: '#f59e0b', icon: 'TrendingUp' },
  refunds:       { slug: 'refunds',       label: 'Refunds',           type: 'income',     color: '#06b6d4', icon: 'RotateCcw' },
  food:          { slug: 'food',          label: 'Food & Dining',     type: 'expense',    color: '#f97316', icon: 'UtensilsCrossed' },
  shopping:      { slug: 'shopping',      label: 'Shopping',          type: 'expense',    color: '#ec4899', icon: 'ShoppingBag' },
  bills:         { slug: 'bills',         label: 'Bills & Utilities', type: 'expense',    color: '#ef4444', icon: 'Zap' },
  entertainment: { slug: 'entertainment', label: 'Entertainment',     type: 'expense',    color: '#a855f7', icon: 'Gamepad2' },
  travel:        { slug: 'travel',        label: 'Travel',            type: 'expense',    color: '#3b82f6', icon: 'Plane' },
  health:        { slug: 'health',        label: 'Health',            type: 'expense',    color: '#14b8a6', icon: 'Heart' },
  education:     { slug: 'education',     label: 'Education',         type: 'expense',    color: '#8b5cf6', icon: 'GraduationCap' },
  rent:          { slug: 'rent',          label: 'Rent',              type: 'expense',    color: '#64748b', icon: 'Home' },
  subscriptions: { slug: 'subscriptions', label: 'Subscriptions',     type: 'expense',    color: '#0ea5e9', icon: 'CreditCard' },
  other:         { slug: 'other',         label: 'Other',             type: 'expense',    color: '#94a3b8', icon: 'MoreHorizontal' },
  stocks:        { slug: 'stocks',        label: 'Stocks',            type: 'investment', color: '#22d3ee', icon: 'BarChart3' },
  fno:           { slug: 'fno',           label: 'F&O',               type: 'investment', color: '#f472b6', icon: 'Activity' },
  mutual_funds:  { slug: 'mutual_funds',  label: 'Mutual Funds',      type: 'investment', color: '#a78bfa', icon: 'PieChart' },
};

export const INCOME_CATEGORIES = Object.values(CATEGORIES).filter(c => c.type === 'income');
export const EXPENSE_CATEGORIES = Object.values(CATEGORIES).filter(c => c.type === 'expense');
export const INVESTMENT_CATEGORIES = Object.values(CATEGORIES).filter(c => c.type === 'investment');

export const INITIAL_FILTERS: FilterState = {
  search: '',
  category: 'all',
  type: 'all',
  dateFrom: '',
  dateTo: '',
  sortBy: 'date',
  sortDir: 'desc',
};

export const STORAGE_KEYS = {
  TRANSACTIONS: 'finboard_transactions',
  DATA_VERSION: 'finboard_data_version',
  THEME: 'finboard_theme',
  ROLE: 'finboard_role',
  SIDEBAR: 'finboard_sidebar',
} as const;

// bump this when seed data changes to trigger re-seed
export const CURRENT_DATA_VERSION = '2';

export const CURRENCY = {
  code: 'USD',
  symbol: '$',
  locale: 'en-US',
} as const;
