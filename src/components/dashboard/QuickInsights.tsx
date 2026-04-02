import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Tag, Receipt, Layers, CalendarClock } from 'lucide-react';
import clsx from 'clsx';
import { Card } from '../ui/Card';
import { useFinanceStore, selectMonthlyBreakdown, selectInsights } from '../../store/finance';
import { formatCurrency, formatPercent } from '../../lib/formatters';

interface InsightItem {
  key: string;
  icon: typeof TrendingUp;
  iconColor: string;
  title: string;
  value: string;
  detail?: string;
}

export function QuickInsights() {
  const transactions = useFinanceStore((s) => s.transactions);
  const monthly = useMemo(() => selectMonthlyBreakdown(transactions), [transactions]);
  const insights = useMemo(() => selectInsights(transactions, monthly), [transactions, monthly]);

  const items: InsightItem[] = useMemo(() => {
    const result: InsightItem[] = [];

    if (insights.topCategory) {
      result.push({
        key: 'top-cat',
        icon: Tag,
        iconColor: 'text-coral',
        title: 'Highest Spending',
        value: insights.topCategory.label,
        detail: `${formatCurrency(insights.topCategory.total)} across ${insights.topCategory.count} transactions`,
      });
    }

    if (insights.momChange !== null) {
      const up = insights.momChange > 0;
      result.push({
        key: 'mom',
        icon: up ? TrendingUp : TrendingDown,
        iconColor: up ? 'text-coral' : 'text-mint',
        title: 'Monthly Change',
        value: `Expenses ${up ? 'up' : 'down'} ${formatPercent(Math.abs(insights.momChange))}`,
        detail: 'Compared to previous month',
      });
    }

    result.push({
      key: 'daily',
      icon: CalendarClock,
      iconColor: 'text-accent',
      title: 'Avg Daily Spend',
      value: formatCurrency(insights.avgDailySpend),
      detail: 'Based on entire transaction history',
    });

    if (insights.biggestExpense) {
      result.push({
        key: 'biggest',
        icon: Receipt,
        iconColor: 'text-amber-500',
        title: 'Largest Expense',
        value: formatCurrency(insights.biggestExpense.amount),
        detail: insights.biggestExpense.description,
      });
    }

    result.push({
      key: 'cats',
      icon: Layers,
      iconColor: 'text-purple-400',
      title: 'Active Categories',
      value: `${insights.totalCategories} categories`,
      detail: 'With at least one expense',
    });

    return result;
  }, [insights]);

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Quick Insights
      </h3>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.25 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 dark:bg-white/[0.03] hover:bg-gray-100/80 dark:hover:bg-white/[0.05] transition-colors"
          >
            <div className={clsx('mt-0.5 p-1.5 rounded-lg bg-white dark:bg-white/[0.06]', item.iconColor)}>
              <item.icon size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-0.5">{item.title}</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.value}</p>
              {item.detail && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{item.detail}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
