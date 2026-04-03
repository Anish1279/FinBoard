import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from 'lucide-react';
import clsx from 'clsx';
import { Card } from '../ui/Card';
import { useFinanceStore } from '../../store/finance';
import { formatCurrency, formatPercent } from '../../lib/formatters';

export function PortfolioSummary() {
  const portfolio = useFinanceStore((s) => s.investments.portfolio);

  const stats = [
    {
      key: 'current',
      label: 'Current Value',
      value: formatCurrency(portfolio.currentValue, true),
      icon: Wallet,
      gradientClass: 'stat-gradient-balance',
      iconColor: 'text-accent',
    },
    {
      key: 'invested',
      label: 'Invested',
      value: formatCurrency(portfolio.invested, true),
      icon: BarChart3,
      gradientClass: 'stat-gradient-investment',
      iconColor: 'text-cyan-400',
    },
    {
      key: 'returns',
      label: 'Total Returns',
      value: formatCurrency(portfolio.totalReturns, true),
      sub: formatPercent(portfolio.totalReturnsPercent),
      isPositive: portfolio.totalReturns >= 0,
      icon: portfolio.totalReturns >= 0 ? TrendingUp : TrendingDown,
      gradientClass: portfolio.totalReturns >= 0 ? 'stat-gradient-income' : 'stat-gradient-expense',
      iconColor: portfolio.totalReturns >= 0 ? 'text-mint' : 'text-coral',
    },
    {
      key: 'dayChange',
      label: '1 Day Change',
      value: formatCurrency(portfolio.dayChange, true),
      sub: formatPercent(portfolio.dayChangePercent),
      isPositive: portfolio.dayChange >= 0,
      icon: portfolio.dayChange >= 0 ? TrendingUp : TrendingDown,
      gradientClass: portfolio.dayChange >= 0 ? 'stat-gradient-income' : 'stat-gradient-expense',
      iconColor: portfolio.dayChange >= 0 ? 'text-mint' : 'text-coral',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
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
                {stat.value}
              </span>
              {stat.sub && (
                <span
                  className={clsx(
                    'text-xs font-medium mb-1 px-1.5 py-0.5 rounded',
                    stat.isPositive ? 'text-mint bg-mint/10' : 'text-coral bg-coral/10'
                  )}
                >
                  {stat.sub}
                </span>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
