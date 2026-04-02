import { create } from 'zustand';
import type {
  Transaction,
  Role,
  ThemeMode,
  ViewTab,
  FilterState,
  CategorySlug,
  MonthlySummary,
  CategorySummary,
} from '../lib/types';
import { INITIAL_FILTERS, CATEGORIES, STORAGE_KEYS } from '../lib/constants';
import { api } from '../lib/mock-api';
import { formatShortMonth } from '../lib/formatters';

interface FinanceState {
  // data
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  // ui
  activeView: ViewTab;
  role: Role;
  theme: ThemeMode;
  sidebarOpen: boolean;
  filters: FilterState;

  // modal state
  editingTxn: Transaction | null;
  showTxnForm: boolean;

  // actions
  loadTransactions: () => Promise<void>;
  addTransaction: (txn: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id'>>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  setActiveView: (v: ViewTab) => void;
  setRole: (r: Role) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setFilters: (patch: Partial<FilterState>) => void;
  resetFilters: () => void;
  openTxnForm: (txn?: Transaction) => void;
  closeTxnForm: () => void;
}

// helper: read persisted theme or default to dark
function getInitialTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch { /* ignore */ }
  return 'dark';
}

function getInitialRole(): Role {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ROLE);
    if (stored === 'admin' || stored === 'viewer') return stored;
  } catch { /* ignore */ }
  return 'admin';
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,

  activeView: 'dashboard',
  role: getInitialRole(),
  theme: getInitialTheme(),
  sidebarOpen: true,
  filters: { ...INITIAL_FILTERS },

  editingTxn: null,
  showTxnForm: false,

  async loadTransactions() {
    set({ isLoading: true, error: null });
    try {
      const data = await api.fetchTransactions();
      set({ transactions: data, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  async addTransaction(payload) {
    try {
      const created = await api.addTransaction(payload);
      set((s) => ({ transactions: [created, ...s.transactions], showTxnForm: false }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  async updateTransaction(id, updates) {
    try {
      const updated = await api.updateTransaction(id, updates);
      set((s) => ({
        transactions: s.transactions.map((t) => (t.id === id ? updated : t)),
        showTxnForm: false,
        editingTxn: null,
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  async deleteTransaction(id) {
    // optimistic removal
    const prev = get().transactions;
    set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) }));
    try {
      await api.deleteTransaction(id);
    } catch {
      // rollback on failure
      set({ transactions: prev });
    }
  },

  setActiveView(v) { set({ activeView: v }); },

  setRole(r) {
    localStorage.setItem(STORAGE_KEYS.ROLE, r);
    set({ role: r });
  },

  toggleTheme() {
    set((s) => {
      const next = s.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEYS.THEME, next);
      return { theme: next };
    });
  },

  toggleSidebar() {
    set((s) => ({ sidebarOpen: !s.sidebarOpen }));
  },

  setFilters(patch) {
    set((s) => ({ filters: { ...s.filters, ...patch } }));
  },

  resetFilters() {
    set({ filters: { ...INITIAL_FILTERS } });
  },

  openTxnForm(txn) {
    set({ showTxnForm: true, editingTxn: txn ?? null });
  },

  closeTxnForm() {
    set({ showTxnForm: false, editingTxn: null });
  },
}));

// ── Derived selectors (computed outside the store to avoid re-render churn) ──

export function selectFilteredTransactions(state: FinanceState): Transaction[] {
  let result = [...state.transactions];
  const f = state.filters;

  if (f.search) {
    const q = f.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        CATEGORIES[t.category]?.label.toLowerCase().includes(q)
    );
  }

  if (f.category !== 'all') {
    result = result.filter((t) => t.category === f.category);
  }

  if (f.type !== 'all') {
    result = result.filter((t) => t.type === f.type);
  }

  if (f.dateFrom) {
    result = result.filter((t) => t.date >= f.dateFrom);
  }
  if (f.dateTo) {
    result = result.filter((t) => t.date <= f.dateTo);
  }

  // sorting
  result.sort((a, b) => {
    let cmp = 0;
    if (f.sortBy === 'date') cmp = a.date.localeCompare(b.date);
    else if (f.sortBy === 'amount') cmp = a.amount - b.amount;
    else if (f.sortBy === 'category') cmp = a.category.localeCompare(b.category);

    return f.sortDir === 'desc' ? -cmp : cmp;
  });

  return result;
}

export function selectTotals(transactions: Transaction[]) {
  let income = 0;
  let expense = 0;

  for (const t of transactions) {
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  }

  return {
    income,
    expense,
    balance: income - expense,
    savingsRate: income > 0 ? ((income - expense) / income) * 100 : 0,
  };
}

export function selectMonthlyBreakdown(transactions: Transaction[]): MonthlySummary[] {
  const map = new Map<string, { income: number; expense: number }>();

  for (const t of transactions) {
    const monthKey = t.date.slice(0, 7); // 'YYYY-MM'
    const entry = map.get(monthKey) ?? { income: 0, expense: 0 };
    if (t.type === 'income') entry.income += t.amount;
    else entry.expense += t.amount;
    map.set(monthKey, entry);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      label: formatShortMonth(month),
      income: Math.round(data.income * 100) / 100,
      expense: Math.round(data.expense * 100) / 100,
      balance: Math.round((data.income - data.expense) * 100) / 100,
    }));
}

export function selectCategoryBreakdown(transactions: Transaction[]): CategorySummary[] {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const map = new Map<CategorySlug, { total: number; count: number }>();

  for (const t of expenses) {
    const entry = map.get(t.category) ?? { total: 0, count: 0 };
    entry.total += t.amount;
    entry.count += 1;
    map.set(t.category, entry);
  }

  return Array.from(map.entries())
    .map(([slug, data]) => ({
      slug,
      label: CATEGORIES[slug]?.label ?? slug,
      color: CATEGORIES[slug]?.color ?? '#94a3b8',
      total: Math.round(data.total * 100) / 100,
      percentage: totalExpense > 0 ? (data.total / totalExpense) * 100 : 0,
      count: data.count,
    }))
    .sort((a, b) => b.total - a.total);
}

export function selectInsights(transactions: Transaction[], monthly: MonthlySummary[]) {
  const categories = selectCategoryBreakdown(transactions);
  const topCategory = categories[0] ?? null;

  // month over month comparison
  let momChange: number | null = null;
  if (monthly.length >= 2) {
    const curr = monthly[monthly.length - 1];
    const prev = monthly[monthly.length - 2];
    if (prev.expense > 0) {
      momChange = ((curr.expense - prev.expense) / prev.expense) * 100;
    }
  }

  // average daily spend
  const expenses = transactions.filter((t) => t.type === 'expense');
  const dates = expenses.map((t) => t.date);
  let avgDailySpend = 0;
  if (dates.length > 0) {
    const earliest = new Date(dates.reduce((a, b) => (a < b ? a : b)));
    const latest = new Date(dates.reduce((a, b) => (a > b ? a : b)));
    const daySpan = Math.max(1, (latest.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24));
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
    avgDailySpend = totalExpense / daySpan;
  }

  // biggest single transaction
  const biggestExpense = expenses.length > 0
    ? expenses.reduce((max, t) => (t.amount > max.amount ? t : max), expenses[0])
    : null;

  return {
    topCategory,
    momChange,
    avgDailySpend: Math.round(avgDailySpend * 100) / 100,
    biggestExpense,
    totalCategories: categories.length,
  };
}
