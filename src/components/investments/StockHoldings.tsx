import { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';
import { Card } from '../ui/Card';
import { useFinanceStore } from '../../store/finance';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import type { StockHolding } from '../../lib/types';
import { SparklineChart } from './SparklineChart';

function StockRow({ stock }: { stock: StockHolding }) {
  const invested = stock.quantity * stock.avgBuyPrice;
  const current = stock.quantity * stock.currentPrice;
  const pnl = current - invested;
  const pnlPercent = invested > 0 ? (pnl / invested) * 100 : 0;
  const isProfit = pnl >= 0;

  return (
    <tr className="border-b border-gray-100 dark:border-white/[0.04] last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-xs font-bold text-accent shrink-0">
            {stock.symbol.slice(0, 2)}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">{stock.symbol}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{stock.name}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 hidden md:table-cell">
        <div className="w-20 h-8">
          <SparklineChart data={stock.sparkline} isPositive={isProfit} />
        </div>
      </td>
      <td className="py-3 px-4 text-right">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stock.quantity}</span>
      </td>
      <td className="py-3 px-4 text-right hidden sm:table-cell">
        <span className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(stock.currentPrice)}</span>
      </td>
      <td className="py-3 px-4 text-right hidden lg:table-cell">
        <span className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(invested)}</span>
      </td>
      <td className="py-3 px-4 text-right hidden lg:table-cell">
        <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(current)}</span>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1">
          {isProfit ? <TrendingUp size={13} className="text-mint" /> : <TrendingDown size={13} className="text-coral" />}
          <span className={clsx('text-sm font-semibold', isProfit ? 'text-mint' : 'text-coral')}>
            {formatCurrency(Math.abs(pnl))}
          </span>
        </div>
        <div className={clsx('text-[11px]', isProfit ? 'text-mint/80' : 'text-coral/80')}>
          {formatPercent(pnlPercent)}
        </div>
      </td>
    </tr>
  );
}

export function StockHoldings() {
  const stocks = useFinanceStore((s) => s.investments.stocks);

  const sortedStocks = useMemo(
    () => [...stocks].sort((a, b) => (b.quantity * b.currentPrice) - (a.quantity * a.currentPrice)),
    [stocks]
  );

  const totalInvested = stocks.reduce((s, st) => s + st.quantity * st.avgBuyPrice, 0);
  const totalCurrent = stocks.reduce((s, st) => s + st.quantity * st.currentPrice, 0);

  return (
    <Card padding="sm">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Stock Holdings</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {stocks.length} stocks &middot; {formatCurrency(totalCurrent)} current value
          </p>
        </div>
        <div className="text-right">
          <span className={clsx(
            'text-xs font-medium px-2 py-0.5 rounded',
            totalCurrent >= totalInvested ? 'text-mint bg-mint/10' : 'text-coral bg-coral/10'
          )}>
            P&L: {formatCurrency(totalCurrent - totalInvested)}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px]">
          <thead>
            <tr className="border-b border-gray-200/60 dark:border-white/[0.06]">
              <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider py-2 px-4">Company</th>
              <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider py-2 px-4 hidden md:table-cell">Trend</th>
              <th className="text-right text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider py-2 px-4">Qty</th>
              <th className="text-right text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider py-2 px-4 hidden sm:table-cell">Price</th>
              <th className="text-right text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider py-2 px-4 hidden lg:table-cell">Invested</th>
              <th className="text-right text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider py-2 px-4 hidden lg:table-cell">Current</th>
              <th className="text-right text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider py-2 px-4">Returns</th>
            </tr>
          </thead>
          <tbody>
            {sortedStocks.map((stock) => (
              <StockRow key={stock.symbol} stock={stock} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
