import { memo, useCallback } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import type { Transaction } from '../../lib/types';
import { CATEGORIES } from '../../lib/constants';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { Badge } from '../ui/Badge';

interface TxnRowProps {
  txn: Transaction;
  isAdmin: boolean;
  onEdit: (txn: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TxnRow = memo(function TxnRow({ txn, isAdmin, onEdit, onDelete }: TxnRowProps) {
  const cat = CATEGORIES[txn.category];

  const handleEdit = useCallback(() => onEdit(txn), [txn, onEdit]);
  const handleDelete = useCallback(() => onDelete(txn.id), [txn.id, onDelete]);

  return (
    <div
      className={clsx(
        'group flex items-center gap-3 sm:gap-4 px-4 py-3',
        'border-b border-gray-100 dark:border-white/[0.04]',
        'hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors'
      )}
    >
      {/* category icon bubble */}
      <div
        className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 text-sm"
        style={{ backgroundColor: `${cat?.color ?? '#94a3b8'}15`, color: cat?.color ?? '#94a3b8' }}
      >
        <span className="text-base">{getCategoryEmoji(txn.category)}</span>
      </div>

      {/* description + category */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
          {txn.description}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {formatDate(txn.date)}
          </span>
          <Badge label={cat?.label ?? txn.category} color={cat?.color} variant="outline" />
        </div>
      </div>

      {/* amount */}
      <div className="text-right shrink-0">
        <span
          className={clsx(
            'text-sm font-semibold tabular-nums',
            txn.type === 'income'
              ? 'text-mint dark:text-mint-light'
              : txn.type === 'investment'
              ? 'text-accent dark:text-accent-light'
              : 'text-gray-800 dark:text-gray-200'
          )}
        >
          {txn.type === 'income' ? '+' : txn.type === 'investment' ? (txn.investmentDirection === 'inflow' ? '+' : '-') : '-'}{formatCurrency(txn.amount)}
        </span>
        {txn.type === 'investment' && (
          <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
            {txn.investmentDirection === 'inflow' ? 'Returns' : 'Deployed'}
          </div>
        )}
      </div>

      {/* admin actions */}
      {isAdmin && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-accent/10 transition-colors"
            aria-label="Edit transaction"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-gray-400 hover:text-coral hover:bg-coral/10 transition-colors"
            aria-label="Delete transaction"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
});

// simple emoji mapper instead of importing heavy icon components per row
function getCategoryEmoji(cat: string): string {
  const map: Record<string, string> = {
    salary: '💼',
    freelance: '💻',
    investments: '📈',
    refunds: '↩️',
    food: '🍽️',
    shopping: '🛍️',
    bills: '⚡',
    entertainment: '🎮',
    travel: '✈️',
    health: '❤️',
    education: '🎓',
    rent: '🏠',
    subscriptions: '💳',
    other: '📦',
    stocks: '📊',
    fno: '⚡',
    mutual_funds: '🥧',
  };
  return map[cat] ?? '📦';
}
