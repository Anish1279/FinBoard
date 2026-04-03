import { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import clsx from 'clsx';
import { Card } from '../ui/Card';
import { useFinanceStore } from '../../store/finance';
import { formatCurrency } from '../../lib/formatters';
import { useMounted } from '../../hooks/use-mounted';

const PERIODS = [
  { key: '1M', days: 22 },
  { key: '3M', days: 65 },
  { key: '6M', days: 130 },
  { key: 'ALL', days: Infinity },
] as const;

type PeriodKey = (typeof PERIODS)[number]['key'];

export function PerformanceChart() {
  const theme = useFinanceStore((s) => s.theme);
  const performance = useFinanceStore((s) => s.investments.performance);
  const isMounted = useMounted();
  const [period, setPeriod] = useState<PeriodKey>('6M');

  const data = useMemo(() => {
    const p = PERIODS.find((x) => x.key === period)!;
    if (p.days === Infinity) return performance;
    return performance.slice(-p.days);
  }, [performance, period]);

  const gridStroke = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
  const axisColor = theme === 'dark' ? '#94a3b8' : '#64748b';

  const minValue = Math.min(...data.map((d) => d.value));
  const maxValue = Math.max(...data.map((d) => d.value));
  const padding = (maxValue - minValue) * 0.05;

  return (
    <Card className="lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Portfolio Performance
        </h3>
        <div className="flex gap-1 p-0.5 bg-gray-100 dark:bg-white/[0.04] rounded-lg">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={clsx(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                period === p.key
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              {p.key}
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
                <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis
                dataKey="date"
                tick={{ fill: axisColor, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: string) => {
                  const d = new Date(v);
                  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
                interval={Math.max(1, Math.floor(data.length / 6))}
              />
              <YAxis
                domain={[minValue - padding, maxValue + padding]}
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
                labelFormatter={(v: any) => new Date(v).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                formatter={(value: any) => [formatCurrency(Number(value)), 'Portfolio Value']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#perfGradient)"
                dot={false}
                activeDot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: theme === 'dark' ? '#1a2035' : '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
