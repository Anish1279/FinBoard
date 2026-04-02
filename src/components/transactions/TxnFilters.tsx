import { useCallback } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import clsx from 'clsx';
import { useFinanceStore } from '../../store/finance';
import { CATEGORIES } from '../../lib/constants';
import { Button } from '../ui/Button';
import type { CategorySlug, TransactionType, SortField, SortDir } from '../../lib/types';

export function TxnFilters() {
  const filters = useFinanceStore((s) => s.filters);
  const setFilters = useFinanceStore((s) => s.setFilters);
  const resetFilters = useFinanceStore((s) => s.resetFilters);

  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.type !== 'all' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters({ search: e.target.value });
    },
    [setFilters]
  );

  const handleCategory = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilters({ category: e.target.value as CategorySlug | 'all' });
    },
    [setFilters]
  );

  const handleType = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilters({ type: e.target.value as TransactionType | 'all' });
    },
    [setFilters]
  );

  const handleSort = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      const [field, dir] = val.split(':') as [SortField, SortDir];
      setFilters({ sortBy: field, sortDir: dir });
    },
    [setFilters]
  );

  const selectBase = clsx(
    'h-9 rounded-lg text-sm bg-white dark:bg-surface-800',
    'border border-gray-200 dark:border-white/[0.08]',
    'text-gray-700 dark:text-gray-300',
    'focus:ring-2 focus:ring-accent/30 focus:border-accent/50',
    'transition-colors'
  );

  return (
    <div className="space-y-3">
      {/* search bar + quick actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearch}
            placeholder="Search transactions..."
            className={clsx(
              'w-full h-9 pl-9 pr-3 rounded-lg text-sm',
              'bg-white dark:bg-surface-800',
              'border border-gray-200 dark:border-white/[0.08]',
              'text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'focus:ring-2 focus:ring-accent/30 focus:border-accent/50 focus:outline-none',
              'transition-colors'
            )}
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: '' })}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} icon={<X size={14} />}>
            Clear filters
          </Button>
        )}
      </div>

      {/* filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal size={14} className="text-gray-400 hidden sm:block" />

        <select value={filters.type} onChange={handleType} className={clsx(selectBase, 'w-auto')}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select value={filters.category} onChange={handleCategory} className={clsx(selectBase, 'w-auto')}>
          <option value="all">All Categories</option>
          {Object.values(CATEGORIES).map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({ dateFrom: e.target.value })}
          className={clsx(selectBase, 'w-auto')}
          placeholder="From"
          aria-label="Date from"
        />
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters({ dateTo: e.target.value })}
          className={clsx(selectBase, 'w-auto')}
          placeholder="To"
          aria-label="Date to"
        />

        <select
          value={`${filters.sortBy}:${filters.sortDir}`}
          onChange={handleSort}
          className={clsx(selectBase, 'w-auto ml-auto')}
        >
          <option value="date:desc">Newest First</option>
          <option value="date:asc">Oldest First</option>
          <option value="amount:desc">Highest Amount</option>
          <option value="amount:asc">Lowest Amount</option>
          <option value="category:asc">Category A-Z</option>
        </select>
      </div>
    </div>
  );
}
