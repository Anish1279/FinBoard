export type TransactionType = 'income' | 'expense' | 'investment';

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
  | 'other'
  | 'stocks'
  | 'fno'
  | 'mutual_funds';

export interface Category {
  slug: CategorySlug;
  label: string;
  type: TransactionType;
  color: string;
  icon: string; // lucide icon name
}

export type InvestmentDirection = 'inflow' | 'outflow';

export interface Transaction {
  id: string;
  date: string; // ISO date string
  description: string;
  amount: number;
  type: TransactionType;
  category: CategorySlug;
  note?: string;
  investmentDirection?: InvestmentDirection; // for investment txns: cash flow direction
}

export type Role = 'admin' | 'viewer';
export type ThemeMode = 'dark' | 'light';
export type ViewTab = 'dashboard' | 'transactions' | 'investments' | 'insights';

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
  investment: number; // net investment cash flow
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

// ── Investment-specific types ──

export interface StockHolding {
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  change: number;       // daily change %
  sector: string;
  sparkline: number[];  // last 30 data points for mini chart
}

export interface FnOPosition {
  symbol: string;
  name: string;
  type: 'call' | 'put' | 'future';
  strikePrice: number;
  premium: number;
  lots: number;
  expiry: string;       // ISO date
  ltp: number;          // last traded price
  pnl: number;          // profit/loss
}

export interface MutualFundHolding {
  scheme: string;
  category: string;     // e.g. 'Large Cap', 'Mid Cap', 'Debt'
  nav: number;
  units: number;
  invested: number;
  currentValue: number;
  returns: number;      // percentage
  sipAmount?: number;
}

export interface PortfolioSummary {
  currentValue: number;
  invested: number;
  totalReturns: number;
  totalReturnsPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

export interface PerformancePoint {
  date: string;
  value: number;
}

export interface InvestmentState {
  stocks: StockHolding[];
  fno: FnOPosition[];
  mutualFunds: MutualFundHolding[];
  portfolio: PortfolioSummary;
  performance: PerformancePoint[];
}
