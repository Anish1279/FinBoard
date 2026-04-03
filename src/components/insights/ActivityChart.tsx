import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import clsx from 'clsx';
import { Card } from '../ui/Card';
import { useFinanceStore } from '../../store/finance';
import { formatCurrency } from '../../lib/formatters';
import type { MonthlySummary } from '../../lib/types';
import { useMounted } from '../../hooks/use-mounted';

type ViewMode = 'monthly' | 'cumulative';

interface ActivityChartProps {
  monthly: MonthlySummary[];
}

export function ActivityChart({ monthly }: ActivityChartProps) {
  const theme = useFinanceStore((s) => s.theme);
  const isMounted = useMounted();
  const [view, setView] = useState<ViewMode>('monthly');

  const data = view === 'cumulative'
    ? monthly.reduce<(MonthlySummary & { cumIncome: number; cumExpense: number; cumInvestment: number })[]>((acc, m) => {
        const prev = acc[acc.length - 1];
        acc.push({
          ...m,
          cumIncome: (prev?.cumIncome ?? 0) + m.income,
          cumExpense: (prev?.cumExpense ?? 0) + m.expense,
          cumInvestment: (prev?.cumInvestment ?? 0) + Math.abs(m.investment),
        });
        return acc;
      }, [])
    : monthly;

  const gridStroke = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
  const axisColor = theme === 'dark' ? '#94a3b8' : '#64748b';

  const incomeKey = view === 'cumulative' ? 'cumIncome' : 'income';
  const expenseKey = view === 'cumulative' ? 'cumExpense' : 'expense';

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Activity Summary
        </h3>
        <div className="flex gap-1 p-0.5 bg-gray-100 dark:bg-white/[0.04] rounded-lg">
          {(['monthly', 'cumulative'] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={clsx(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-all capitalize',
                view === v
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 sm:h-72">
        {!isMounted ? (
          <div className="w-full h-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis
                dataKey="label"
                tick={{ fill: axisColor, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: axisColor, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => formatCurrency(v, true)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1a2035' : '#fff',
                  border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                  borderRadius: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,.15)',
                  fontSize: 12,
                }}
                formatter={(value: any, name: any) => {
                  const label = name?.includes('ncome') ? 'Income' : name?.includes('xpense') ? 'Expense' : 'Investment';
                  return [formatCurrency(value), label];
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              />
              <Area
                type="monotone"
                dataKey={incomeKey}
                name="Income"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#incomeGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#6366f1' }}
              />
              <Area
                type="monotone"
                dataKey={expenseKey}
                name="Expense"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#expenseGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#10b981' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
