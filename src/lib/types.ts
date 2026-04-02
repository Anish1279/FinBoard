export type TransactionType = 'income' | 'expense';

export type CategorySlug =
  | 'salary'
  | 'freelance'
  | 'investments'
  | 'refunds'
  | 'food'
  | 'shopping'
  | 'bills'
  | 'entertainment'
  | 'travel'
  | 'health'
  | 'education'
  | 'rent'
  | 'subscriptions'
  | 'other';

export interface Category {
  slug: CategorySlug;
  label: string;
  type: TransactionType;
  color: string;
  icon: string; // lucide icon name
}

export interface Transaction {
  id: string;
  date: string; // ISO date string
  description: string;
  amount: number;
  type: TransactionType;
  category: CategorySlug;
  note?: string;
}

export type Role = 'admin' | 'viewer';
export type ThemeMode = 'dark' | 'light';
export type ViewTab = 'dashboard' | 'transactions';

export type SortField = 'date' | 'amount' | 'category';
export type SortDir = 'asc' | 'desc';

export interface FilterState {
  search: string;
  category: CategorySlug | 'all';
  type: TransactionType | 'all';
  dateFrom: string;
  dateTo: string;
  sortBy: SortField;
  sortDir: SortDir;
}

export interface MonthlySummary {
  month: string; // 'YYYY-MM'
  label: string; // 'Jan', 'Feb'...
  income: number;
  expense: number;
  balance: number;
}

export interface CategorySummary {
  slug: CategorySlug;
  label: string;
  color: string;
  total: number;
  percentage: number;
  count: number;
}
