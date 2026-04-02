import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '../ui/Card';
import { useFinanceStore, selectMonthlyBreakdown } from '../../store/finance';
import { formatCurrency } from '../../lib/formatters';

export function MonthlyComparison() {
  const transactions = useFinanceStore((s) => s.transactions);
  const theme = useFinanceStore((s) => s.theme);
  const monthly = useMemo(() => selectMonthlyBreakdown(transactions), [transactions]);

  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Monthly Income vs Expenses
      </h3>

      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthly} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barGap={4}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: textColor }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{ fontSize: 11, fill: textColor }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => formatCurrency(v, true)}
              width={60}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1a2035' : '#fff',
                border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                borderRadius: 12,
                padding: '10px 14px',
                boxShadow: '0 4px 16px rgba(0,0,0,.12)',
                fontSize: 13,
              }}
              labelStyle={{ color: textColor, fontWeight: 600, marginBottom: 4 }}
              formatter={(value) => formatCurrency(Number(value))}
            />

            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, paddingTop: 8, color: textColor }}
            />

            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={36} />
            <Bar dataKey="expense" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
