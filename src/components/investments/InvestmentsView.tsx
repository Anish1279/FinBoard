import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Activity, PieChart } from 'lucide-react';
import clsx from 'clsx';
import { PortfolioSummary } from './PortfolioSummary';
import { PerformanceChart } from './PerformanceChart';
import { StockHoldings } from './StockHoldings';
import { FnOPositions } from './FnOPositions';
import { MutualFunds } from './MutualFunds';
import { useFinanceStore } from '../../store/finance';
import { SkeletonCard, SkeletonChart } from '../ui/Skeleton';

type InvestmentTab = 'stocks' | 'fno' | 'mutual-funds';

const TABS: { key: InvestmentTab; label: string; icon: typeof BarChart3 }[] = [
  { key: 'stocks', label: 'Stocks', icon: BarChart3 },
  { key: 'fno', label: 'F&O', icon: Activity },
  { key: 'mutual-funds', label: 'Mutual Funds', icon: PieChart },
];

export function InvestmentsView() {
  const isLoading = useFinanceStore((s) => s.isLoading);
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as InvestmentTab | null;
  const [activeTab, setActiveTab] = useState<InvestmentTab>(tabParam || 'stocks');

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam, activeTab]);

  const handleTabChange = (tab: InvestmentTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <SkeletonChart />
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
          Investments
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Track your portfolio performance and holdings
        </p>
      </div>

      {/* portfolio summary cards */}
      <PortfolioSummary />

      {/* performance chart */}
      <PerformanceChart />

      {/* tab switcher */}
      <div className="flex items-center gap-1 p-1 bg-white/80 dark:bg-surface-800/60 backdrop-blur-sm border border-gray-200/60 dark:border-white/[0.06] rounded-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === tab.key
                ? 'bg-accent text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.04]'
            )}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'stocks' && <StockHoldings />}
        {activeTab === 'fno' && <FnOPositions />}
        {activeTab === 'mutual-funds' && <MutualFunds />}
      </motion.div>
    </motion.div>
  );
}
