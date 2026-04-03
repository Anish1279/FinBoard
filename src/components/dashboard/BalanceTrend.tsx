import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '../ui/Card';
import { useFinanceStore, selectMonthlyBreakdown } from '../../store/finance';
import { formatCurrency } from '../../lib/formatters';
import { useMounted } from '../../hooks/use-mounted';

interface TrendPoint {
  label: string;
  balance: number;
  income: number;
  expense: number;
}

export function BalanceTrend() {
  const transactions = useFinanceStore((s) => s.transactions);
  const theme = useFinanceStore((s) => s.theme);
  const isMounted = useMounted();
  const monthly = useMemo(() => selectMonthlyBreakdown(transactions), [transactions]);

  const chartData: TrendPoint[] = useMemo(() => {
    let runningBalance = 0;
    return monthly.map((m) => {
      runningBalance += m.income - m.expense;
      return {
        label: m.label,
        balance: Math.round(runningBalance * 100) / 100,
        income: m.income,
        expense: m.expense,
      };
    });
  }, [monthly]);

  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';

  return (
    <Card className="col-span-full lg:col-span-2">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Balance Trend
      </h3>

      <div className="h-64 sm:h-72">
        {!isMounted ? (
          <div className="w-full h-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>

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
                itemStyle={{ color: theme === 'dark' ? '#e2e8f0' : '#334155', padding: '2px 0' }}
                formatter={(value) => [formatCurrency(Number(value)), '']}
              />

              <Area
                type="monotone"
                dataKey="balance"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#balanceGrad)"
                name="Balance"
                dot={{ fill: '#6366f1', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
