import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from 'lucide-react';
import clsx from 'clsx';
import { Card } from '../ui/Card';
import { useFinanceStore, selectTotals, selectMonthlyBreakdown } from '../../store/finance';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import type { PortfolioSummary } from '../../lib/types';

type Totals = ReturnType<typeof selectTotals>;

interface StatConfig {
  key: string;
  label: string;
  icon: typeof Wallet;
  gradientClass: string;
  iconColor: string;
  getValue: (totals: Totals, portfolio: PortfolioSummary) => number;
  isCurrency: boolean;
  suffix?: string;
  subtitle?: (totals: Totals, portfolio: PortfolioSummary) => string | null;
}

const STATS: StatConfig[] = [
  {
    key: 'balance',
    label: 'Net Worth',
    icon: Wallet,
    gradientClass: 'stat-gradient-balance',
    iconColor: 'text-accent',
    getValue: (t, p) => (t.income - t.expense) + (p.currentValue - t.invested + t.investmentReturns),
    isCurrency: true,
    subtitle: (t) => {
      const cash = t.income - t.expense;
      return `Cash: ${formatCurrency(cash, true)}`;
    },
  },
  {
    key: 'income',
    label: 'Total Income',
    icon: TrendingUp,
    gradientClass: 'stat-gradient-income',
    iconColor: 'text-mint',
    getValue: (t) => t.income,
    isCurrency: true,
    subtitle: (t) => t.investmentReturns > 0 ? `+${formatCurrency(t.investmentReturns, true)} inv. returns` : null,
  },
  {
    key: 'expense',
    label: 'Total Expenses',
    icon: TrendingDown,
    gradientClass: 'stat-gradient-expense',
    iconColor: 'text-coral',
    getValue: (t) => t.expense,
    isCurrency: true,
  },
  {
    key: 'invested',
    label: 'Portfolio',
    icon: BarChart3,
    gradientClass: 'stat-gradient-investment',
    iconColor: 'text-cyan-400',
    getValue: (_t, p) => p.currentValue,
    isCurrency: true,
    subtitle: (_t, p) => {
      const pnl = p.totalReturns;
      return pnl >= 0
        ? `P&L: +${formatCurrency(pnl, true)} (${formatPercent(p.totalReturnsPercent)})`
        : `P&L: ${formatCurrency(pnl, true)} (${formatPercent(p.totalReturnsPercent)})`;
    },
  },
];

export function StatCards() {
  const transactions = useFinanceStore((s) => s.transactions);
  const portfolio = useFinanceStore((s) => s.investments.portfolio);

  const totals = useMemo(() => selectTotals(transactions), [transactions]);
  const monthly = useMemo(() => selectMonthlyBreakdown(transactions), [transactions]);

  const momChanges = useMemo(() => {
    if (monthly.length < 2) return { income: null, expense: null };
    const curr = monthly[monthly.length - 1];
    const prev = monthly[monthly.length - 2];
    return {
      income: prev.income > 0 ? ((curr.income - prev.income) / prev.income) * 100 : null,
      expense: prev.expense > 0 ? ((curr.expense - prev.expense) / prev.expense) * 100 : null,
    };
  }, [monthly]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {STATS.map((stat, idx) => {
        const value = stat.getValue(totals, portfolio);
        const changeVal =
          stat.key === 'income' ? momChanges.income :
          stat.key === 'expense' ? momChanges.expense : null;
        const subtitle = stat.subtitle?.(totals, portfolio) ?? null;

        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.35 }}
          >
            <Card className={clsx(stat.gradientClass, 'relative overflow-hidden')}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {stat.label}
                </span>
                <div className={clsx('p-1.5 rounded-lg bg-white/60 dark:bg-white/[0.06]', stat.iconColor)}>
                  <stat.icon size={16} />
                </div>
              </div>

              <div className="flex items-end gap-2">
                <span className="text-2xl sm:text-[1.75rem] font-bold text-gray-900 dark:text-white tracking-tight">
                  {stat.isCurrency ? formatCurrency(value, true) : value.toFixed(1)}
                  {stat.suffix && !stat.isCurrency && (
                    <span className="text-lg font-semibold text-gray-400 dark:text-gray-500">{stat.suffix}</span>
                  )}
                </span>

                {changeVal !== null && (
                  <span
                    className={clsx(
                      'text-xs font-medium mb-1 px-1.5 py-0.5 rounded',
                      stat.key === 'expense'
                        ? (changeVal > 0 ? 'text-coral bg-coral/10' : 'text-mint bg-mint/10')
                        : (changeVal > 0 ? 'text-mint bg-mint/10' : 'text-coral bg-coral/10')
                    )}
                  >
                    {formatPercent(changeVal)} vs last month
                  </span>
                )}
              </div>

              {subtitle && (
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">{subtitle}</p>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
