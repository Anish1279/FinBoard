import { motion } from 'framer-motion';
import { StatCards } from './StatCards';
import { BalanceTrend } from './BalanceTrend';
import { CategoryBreakdown } from './CategoryBreakdown';
import { MonthlyComparison } from './MonthlyComparison';
import { QuickInsights } from './QuickInsights';
import { useFinanceStore } from '../../store/finance';
import { SkeletonCard, SkeletonChart } from '../ui/Skeleton';

export function DashboardView() {
  const isLoading = useFinanceStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-[1400px]"
    >
      {/* page heading */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Your financial overview at a glance
        </p>
      </div>

      {/* summary cards */}
      <StatCards />

      {/* charts row: balance trend (2/3) + category breakdown (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BalanceTrend />
        <CategoryBreakdown />
      </div>

      {/* bottom row: monthly comparison + insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MonthlyComparison />
        <QuickInsights />
      </div>
    </motion.div>
  );
}
