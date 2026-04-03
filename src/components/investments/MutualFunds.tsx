import { TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';
import { Card } from '../ui/Card';
import { useFinanceStore } from '../../store/finance';
import { formatCurrency, formatPercent } from '../../lib/formatters';

export function MutualFunds() {
  const funds = useFinanceStore((s) => s.investments.mutualFunds);

  const totalInvested = funds.reduce((s, f) => s + f.invested, 0);
  const totalCurrent = funds.reduce((s, f) => s + f.currentValue, 0);
  const totalSip = funds.filter((f) => f.sipAmount).reduce((s, f) => s + (f.sipAmount ?? 0), 0);

  return (
    <Card padding="sm">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Mutual Funds</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {funds.length} funds &middot; Monthly SIP: {formatCurrency(totalSip)}
          </p>
        </div>
        <span className={clsx(
          'text-xs font-medium px-2 py-0.5 rounded',
          totalCurrent >= totalInvested ? 'text-mint bg-mint/10' : 'text-coral bg-coral/10'
        )}>
          P&L: {formatCurrency(totalCurrent - totalInvested)}
        </span>
      </div>

      <div className="space-y-2 p-4 pt-2">
        {funds.map((fund, i) => {
          const pnl = fund.currentValue - fund.invested;
          const isProfit = pnl >= 0;

          return (
            <div
              key={i}
              className="p-3 rounded-lg border border-gray-200/60 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.02] hover:border-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{fund.scheme}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                      {fund.category}
                    </span>
                    {fund.sipAmount && (
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        SIP: {formatCurrency(fund.sipAmount)}/mo
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-gray-400 dark:text-gray-500">NAV</span>
                  <div className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(fund.nav)}</div>
                </div>
                <div>
                  <span className="text-gray-400 dark:text-gray-500">Invested</span>
                  <div className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(fund.invested, true)}</div>
                </div>
                <div>
                  <span className="text-gray-400 dark:text-gray-500">Current</span>
                  <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(fund.currentValue, true)}</div>
                </div>
                <div>
                  <span className="text-gray-400 dark:text-gray-500">Returns</span>
                  <div className="flex items-center gap-0.5">
                    {isProfit ? <TrendingUp size={11} className="text-mint" /> : <TrendingDown size={11} className="text-coral" />}
                    <span className={clsx('font-semibold', isProfit ? 'text-mint' : 'text-coral')}>
                      {formatPercent(fund.returns)}
                    </span>
                  </div>
                </div>
              </div>

              {/* progress bar showing invested vs current with accessible text labels */}
              <div className="mt-2 pt-2 border-t border-gray-200/40 dark:border-white/[0.03]">
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>P&L Health Component</span>
                  <span className={clsx('font-medium', isProfit ? 'text-mint' : 'text-coral')}>
                    {isProfit ? 'PROFIT: ' : 'LOSS: '}
                    {formatCurrency(pnl)}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200/60 dark:bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className={clsx('h-full rounded-full transition-all', isProfit ? 'bg-mint' : 'bg-coral')}
                    style={{ width: `${Math.min(100, Math.max(5, (fund.currentValue / fund.invested) * 50))}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
