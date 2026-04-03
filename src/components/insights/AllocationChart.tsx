import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/Card';
import { useFinanceStore } from '../../store/finance';
import { formatCurrency } from '../../lib/formatters';
import { useMounted } from '../../hooks/use-mounted';

interface AllocationChartProps {
  expense: number;
  invested: number;
  income: number;
}

const COLORS = ['#f43f5e', '#6366f1', '#10b981'];

export function AllocationChart({ expense, invested, income }: AllocationChartProps) {
  const theme = useFinanceStore((s) => s.theme);
  const isMounted = useMounted();

  const savings = Math.max(0, income - expense - invested);
  const data = [
    { name: 'Expenses', value: expense },
    { name: 'Invested', value: invested },
    { name: 'Savings', value: savings },
  ].filter((d) => d.value > 0);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        Money Allocation
      </h3>
      <div className="h-48">
        {!isMounted ? (
          <div className="w-full h-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1a2035' : '#fff',
                  border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                  borderRadius: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,.15)',
                  fontSize: 12,
                }}
                formatter={(value: any) => formatCurrency(Number(value))}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* legend */}
      <div className="space-y-2 mt-2">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-xs text-gray-600 dark:text-gray-400">{item.name}</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {formatCurrency(item.value, true)}
              </span>
              <span className="text-[10px] text-gray-400 ml-1">
                ({total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
