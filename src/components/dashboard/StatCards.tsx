import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import clsx from 'clsx';
import { Card } from '../ui/Card';
import { useFinanceStore, selectTotals, selectMonthlyBreakdown } from '../../store/finance';
import { formatCurrency, formatPercent } from '../../lib/formatters';

interface StatConfig {
  key: string;
  label: string;
  icon: typeof Wallet;
  gradientClass: string;
  iconColor: string;
  getValue: (totals: ReturnType<typeof selectTotals>) => number;
  isCurrency: boolean;
  suffix?: string;
}

const STATS: StatConfig[] = [
  {
    key: 'balance',
    label: 'Total Balance',
    icon: Wallet,
    gradientClass: 'stat-gradient-balance',
    iconColor: 'text-accent',
    getValue: (t) => t.balance,
    isCurrency: true,
  },
  {
    key: 'income',
    label: 'Total Income',
    icon: TrendingUp,
    gradientClass: 'stat-gradient-income',
    iconColor: 'text-mint',
    getValue: (t) => t.income,
    isCurrency: true,
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
    key: 'savings',
    label: 'Savings Rate',
    icon: PiggyBank,
    gradientClass: 'stat-gradient-savings',
    iconColor: 'text-amber-500',
    getValue: (t) => t.savingsRate,
    isCurrency: false,
    suffix: '%',
  },
];

export function StatCards() {
  const transactions = useFinanceStore((s) => s.transactions);

  const totals = useMemo(() => selectTotals(transactions), [transactions]);
  const monthly = useMemo(() => selectMonthlyBreakdown(transactions), [transactions]);

  // compute month-over-month change for income and expenses
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
        const value = stat.getValue(totals);
        const changeVal =
          stat.key === 'income' ? momChanges.income :
          stat.key === 'expense' ? momChanges.expense : null;

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
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
