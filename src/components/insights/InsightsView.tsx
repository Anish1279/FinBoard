import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  PieChart,
  BarChart3,
  Zap,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  DollarSign,
} from 'lucide-react';
import clsx from 'clsx';
import { Card } from '../ui/Card';
import { useFinanceStore, selectTotals, selectMonthlyBreakdown, selectCategoryBreakdown, selectInvestmentBreakdown } from '../../store/finance';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import { ActivityChart } from './ActivityChart';
import { AllocationChart } from './AllocationChart';
import { SkeletonCard, SkeletonChart } from '../ui/Skeleton';

function HealthScore({ score }: { score: number }) {
  const color = score >= 75 ? 'text-mint' : score >= 50 ? 'text-amber-400' : 'text-coral';
  const bg = score >= 75 ? 'bg-mint' : score >= 50 ? 'bg-amber-400' : 'bg-coral';
  const label = score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Attention';

  return (
    <Card className="stat-gradient-balance">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Financial Health
        </span>
        <Heart size={16} className={color} />
      </div>
      <div className="flex items-end gap-3 mb-3">
        <span className={clsx('text-4xl font-bold tracking-tight', color)}>{score}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">/ 100</span>
      </div>
      <div className="h-2 bg-gray-200/60 dark:bg-white/[0.06] rounded-full overflow-hidden mb-2">
        <div className={clsx('h-full rounded-full transition-all', bg)} style={{ width: `${score}%` }} />
      </div>
      <span className={clsx('text-xs font-medium', color)}>{label}</span>
    </Card>
  );
}

interface InsightCardProps {
  icon: typeof TrendingUp;
  iconColor: string;
  title: string;
  value: string;
  description: string;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}

function InsightCard({ icon: Icon, iconColor, title, value, description, trend, delay = 0 }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card hover className="h-full">
        <div className="flex items-start gap-3">
          <div className={clsx('p-2 rounded-lg shrink-0', `bg-${iconColor}/10`)}>
            <Icon size={16} className={`text-${iconColor}`} style={{ color: iconColor.startsWith('#') ? iconColor : undefined }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</span>
              {trend && (
                <span className={clsx(
                  'flex items-center gap-0.5 text-xs font-medium',
                  trend === 'up' ? 'text-mint' : trend === 'down' ? 'text-coral' : 'text-gray-400'
                )}>
                  {trend === 'up' ? <ArrowUpRight size={12} /> : trend === 'down' ? <ArrowDownRight size={12} /> : null}
                </span>
              )}
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">{value}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function InsightsView() {
  const transactions = useFinanceStore((s) => s.transactions);
  const isLoading = useFinanceStore((s) => s.isLoading);
  const portfolio = useFinanceStore((s) => s.investments.portfolio);

  const totals = useMemo(() => selectTotals(transactions), [transactions]);
  const monthly = useMemo(() => selectMonthlyBreakdown(transactions), [transactions]);
  const categories = useMemo(() => selectCategoryBreakdown(transactions), [transactions]);
  const investBreakdown = useMemo(() => selectInvestmentBreakdown(transactions), [transactions]);

  const insights = useMemo(() => {
    // 1. Financial health score (0-100)
    const savingsRatio = totals.income > 0 ? Math.max(0, (totals.income - totals.expense) / totals.income) : 0;
    const investmentRatio = totals.income > 0 ? totals.invested / totals.income : 0;
    const diversification = Math.min(1, categories.length / 10);
    // Penalize if spending > 70% of income, reward moderate investment
    const spendingPenalty = totals.expense / Math.max(1, totals.income) > 0.7 ? -10 : 0;
    const investBonus = investmentRatio > 0.15 && investmentRatio < 0.5 ? 12 : investmentRatio >= 0.5 ? 5 : 0;
    const healthScore = Math.round(
      Math.min(0.3, savingsRatio) * 100 + diversification * 15 +
      (portfolio.totalReturnsPercent > 5 ? 18 : portfolio.totalReturnsPercent > 0 ? 12 : 3) +
      investBonus + spendingPenalty + 20 // base score
    );

    // 2. Monthly expense trend
    let expenseTrend: 'up' | 'down' | 'neutral' = 'neutral';
    let expenseChange = 0;
    if (monthly.length >= 2) {
      const curr = monthly[monthly.length - 1];
      const prev = monthly[monthly.length - 2];
      if (prev.expense > 0) {
        expenseChange = ((curr.expense - prev.expense) / prev.expense) * 100;
        expenseTrend = expenseChange > 2 ? 'up' : expenseChange < -2 ? 'down' : 'neutral';
      }
    }

    // 3. Top spending category
    const topCategory = categories[0] ?? null;

    // 4. Investment vs spending ratio
    const investSpendRatio = totals.expense > 0 ? (totals.invested / totals.expense) * 100 : 0;

    // 5. Avg monthly savings
    const avgMonthlySavings = monthly.length > 0
      ? monthly.reduce((s, m) => s + (m.income - m.expense), 0) / monthly.length
      : 0;

    // 6. Best and worst month
    let bestMonth = monthly[0];
    let worstMonth = monthly[0];
    for (const m of monthly) {
      if (m.balance > (bestMonth?.balance ?? -Infinity)) bestMonth = m;
      if (m.balance < (worstMonth?.balance ?? Infinity)) worstMonth = m;
    }

    // 7. Unusual activity detection
    const avgExpense = monthly.reduce((s, m) => s + m.expense, 0) / Math.max(1, monthly.length);
    const latestExpense = monthly[monthly.length - 1]?.expense ?? 0;
    const isUnusual = Math.abs(latestExpense - avgExpense) > avgExpense * 0.3;

    return {
      healthScore: Math.min(100, Math.max(0, healthScore)),
      expenseTrend,
      expenseChange,
      topCategory,
      investSpendRatio,
      avgMonthlySavings,
      bestMonth,
      worstMonth,
      isUnusual,
      latestExpense,
      avgExpense,
    };
  }, [totals, monthly, categories, portfolio, investBreakdown]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
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
          Insights
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Intelligent observations across your income, expenses, and investments
        </p>
      </div>

      {/* Top row: health score + summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <HealthScore score={insights.healthScore} />

        <InsightCard
          icon={DollarSign}
          iconColor="#10b981"
          title="Avg Monthly Savings"
          value={formatCurrency(insights.avgMonthlySavings)}
          description={`Across ${monthly.length} months of tracked activity`}
          trend={insights.avgMonthlySavings > 0 ? 'up' : 'down'}
          delay={0.06}
        />

        <InsightCard
          icon={Target}
          iconColor="#6366f1"
          title="Investment Allocation"
          value={`${insights.investSpendRatio.toFixed(0)}%`}
          description={`You invest ${formatCurrency(totals.invested, true)} for every ${formatCurrency(totals.expense, true)} spent`}
          trend={insights.investSpendRatio > 30 ? 'up' : 'down'}
          delay={0.12}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ActivityChart monthly={monthly} />
        </div>
        <AllocationChart
          expense={totals.expense}
          invested={totals.invested}
          income={totals.income}
        />
      </div>

      {/* Detailed insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InsightCard
          icon={TrendingDown}
          iconColor="#f43f5e"
          title="Expense Trend"
          value={formatPercent(insights.expenseChange)}
          description={
            insights.expenseTrend === 'up'
              ? 'Your spending increased compared to last month'
              : insights.expenseTrend === 'down'
              ? 'Great! You reduced spending this month'
              : 'Spending is stable compared to last month'
          }
          trend={insights.expenseTrend === 'up' ? 'up' : insights.expenseTrend === 'down' ? 'down' : 'neutral'}
          delay={0.06}
        />

        <InsightCard
          icon={PieChart}
          iconColor="#a855f7"
          title="Top Spending"
          value={insights.topCategory?.label ?? 'N/A'}
          description={
            insights.topCategory
              ? `${formatCurrency(insights.topCategory.total)} total (${insights.topCategory.percentage.toFixed(1)}% of expenses)`
              : 'No spending data available'
          }
          delay={0.12}
        />

        <InsightCard
          icon={BarChart3}
          iconColor="#22d3ee"
          title="Portfolio Returns"
          value={formatCurrency(portfolio.totalReturns)}
          description={`${formatPercent(portfolio.totalReturnsPercent)} overall return on ${formatCurrency(portfolio.invested, true)} invested`}
          trend={portfolio.totalReturns >= 0 ? 'up' : 'down'}
          delay={0.18}
        />

        <InsightCard
          icon={Zap}
          iconColor="#f59e0b"
          title="Best Month"
          value={insights.bestMonth?.label ?? 'N/A'}
          description={
            insights.bestMonth
              ? `Net cash flow: ${formatCurrency(insights.bestMonth.balance)}`
              : 'Not enough data'
          }
          trend="up"
          delay={0.24}
        />

        <InsightCard
          icon={Wallet}
          iconColor="#64748b"
          title="Worst Month"
          value={insights.worstMonth?.label ?? 'N/A'}
          description={
            insights.worstMonth
              ? `Net cash flow: ${formatCurrency(insights.worstMonth.balance)}`
              : 'Not enough data'
          }
          trend="down"
          delay={0.30}
        />

        {insights.isUnusual && (
          <InsightCard
            icon={AlertTriangle}
            iconColor="#ef4444"
            title="Unusual Activity"
            value="Detected"
            description={`Latest month spending (${formatCurrency(insights.latestExpense, true)}) deviates >30% from your average (${formatCurrency(insights.avgExpense, true)})`}
            delay={0.36}
          />
        )}
      </div>
    </motion.div>
  );
}
