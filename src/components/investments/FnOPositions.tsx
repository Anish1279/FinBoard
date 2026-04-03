import { TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';
import { Card } from '../ui/Card';
import { useFinanceStore } from '../../store/finance';
import { formatCurrency, formatDate } from '../../lib/formatters';

export function FnOPositions() {
  const fno = useFinanceStore((s) => s.investments.fno);

  const totalPnl = fno.reduce((s, p) => s + p.pnl, 0);

  return (
    <Card padding="sm">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">F&O Positions</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {fno.length} active positions
          </p>
        </div>
        <span className={clsx(
          'text-xs font-medium px-2 py-0.5 rounded',
          totalPnl >= 0 ? 'text-mint bg-mint/10' : 'text-coral bg-coral/10'
        )}>
          Net P&L: {formatCurrency(totalPnl)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 pt-2">
        {fno.map((pos, i) => {
          const isProfit = pos.pnl >= 0;
          return (
            <div
              key={i}
              className="p-3 rounded-lg border border-gray-200/60 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.02] hover:border-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{pos.symbol}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{pos.name}</div>
                </div>
                <span className={clsx(
                  'text-[10px] font-bold uppercase px-1.5 py-0.5 rounded',
                  pos.type === 'call' ? 'bg-mint/10 text-mint' :
                  pos.type === 'put' ? 'bg-coral/10 text-coral' :
                  'bg-accent/10 text-accent'
                )}>
                  {pos.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400 dark:text-gray-500">Strike</span>
                  <div className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(pos.strikePrice)}</div>
                </div>
                <div>
                  <span className="text-gray-400 dark:text-gray-500">LTP</span>
                  <div className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(pos.ltp)}</div>
                </div>
                <div>
                  <span className="text-gray-400 dark:text-gray-500">Lots</span>
                  <div className="font-medium text-gray-700 dark:text-gray-300">{pos.lots}</div>
                </div>
                <div>
                  <span className="text-gray-400 dark:text-gray-500">Expiry</span>
                  <div className="font-medium text-gray-700 dark:text-gray-300">{formatDate(pos.expiry, 'MMM dd')}</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/60 dark:border-white/[0.04]">
                <span className="text-xs text-gray-400">P&L</span>
                <div className="flex items-center gap-1">
                  {isProfit ? <TrendingUp size={12} className="text-mint" /> : <TrendingDown size={12} className="text-coral" />}
                  <span className={clsx('text-sm font-bold', isProfit ? 'text-mint' : 'text-coral')}>
                    {formatCurrency(pos.pnl)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
