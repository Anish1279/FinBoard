import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/Card';
import { useFinanceStore, selectCategoryBreakdown } from '../../store/finance';
import { formatCurrency } from '../../lib/formatters';
import { useMounted } from '../../hooks/use-mounted';

export function CategoryBreakdown() {
  const transactions = useFinanceStore((s) => s.transactions);
  const theme = useFinanceStore((s) => s.theme);
  const isMounted = useMounted();
  const breakdown = useMemo(() => selectCategoryBreakdown(transactions), [transactions]);

  // show top 6 categories, group rest into "Other"
  const chartData = useMemo(() => {
    if (breakdown.length <= 7) return breakdown;

    const top = breakdown.slice(0, 6);
    const rest = breakdown.slice(6);
    const otherTotal = rest.reduce((s, c) => s + c.total, 0);
    const totalAll = breakdown.reduce((s, c) => s + c.total, 0);

    return [
      ...top,
      {
        slug: 'other' as const,
        label: 'Other',
        color: '#94a3b8',
        total: otherTotal,
        percentage: totalAll > 0 ? (otherTotal / totalAll) * 100 : 0,
        count: rest.reduce((s, c) => s + c.count, 0),
      },
    ];
  }, [breakdown]);

  return (
    <Card className="col-span-full lg:col-span-1">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Spending Breakdown
      </h3>

      <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4">
        {/* donut chart */}
        <div className="w-48 h-48 shrink-0">
          {!isMounted ? (
            <div className="w-full h-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={2}
                  dataKey="total"
                  nameKey="label"
                  stroke="none"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.slug} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1a2035' : '#fff',
                    border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                    borderRadius: 10,
                    padding: '8px 12px',
                    fontSize: 13,
                    boxShadow: '0 4px 12px rgba(0,0,0,.1)',
                  }}
                  formatter={(value) => formatCurrency(Number(value))}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* legend */}
        <div className="flex-1 w-full space-y-2">
          {chartData.map((cat) => (
            <div key={cat.slug} className="flex items-center gap-2 text-sm">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="flex-1 text-gray-600 dark:text-gray-400 truncate">
                {cat.label}
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-200 tabular-nums">
                {cat.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
