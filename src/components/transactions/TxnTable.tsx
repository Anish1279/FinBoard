import { useMemo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { useFinanceStore, selectFilteredTransactions } from '../../store/finance';
import { useDebounce } from '../../hooks/use-debounce';
import { exportToCSV, exportToJSON } from '../../lib/export';
import { TxnFilters } from './TxnFilters';
import { TxnRow } from './TxnRow';
import { TxnForm } from './TxnForm';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { SkeletonRow } from '../ui/Skeleton';

const PAGE_SIZE = 15;

export function TxnTable() {
  const store = useFinanceStore();
  const role = store.role;
  const isAdmin = role === 'admin';
  const isLoading = store.isLoading;

  // debounce the search to avoid filtering on every keystroke
  const debouncedSearch = useDebounce(store.filters.search, 250);
  const stateWithDebouncedSearch = useMemo(
    () => ({ ...store, filters: { ...store.filters, search: debouncedSearch } }),
    [store, debouncedSearch]
  );
  const filtered = useMemo(
    () => selectFilteredTransactions(stateWithDebouncedSearch),
    [stateWithDebouncedSearch]
  );

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visibleCount < filtered.length;

  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleEdit = useCallback(
    (txn: Parameters<typeof store.openTxnForm>[0]) => store.openTxnForm(txn),
    [store]
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (window.confirm('Delete this transaction?')) {
        store.deleteTransaction(id);
      }
    },
    [store]
  );

  const handleExportCSV = useCallback(() => {
    exportToCSV(filtered);
    setShowExportMenu(false);
  }, [filtered]);

  const handleExportJSON = useCallback(() => {
    exportToJSON(filtered);
    setShowExportMenu(false);
  }, [filtered]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 max-w-[1400px]"
      >
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Transactions
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* export dropdown */}
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                icon={<Download size={14} />}
                onClick={() => setShowExportMenu((p) => !p)}
              >
                Export
              </Button>
              <AnimatePresence>
                {showExportMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full mt-1 z-20 w-40 py-1.5 rounded-xl bg-white dark:bg-surface-800 border border-gray-200 dark:border-white/[0.08] shadow-lg"
                    >
                      <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                      >
                        <FileSpreadsheet size={14} /> Export CSV
                      </button>
                      <button
                        onClick={handleExportJSON}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                      >
                        <FileJson size={14} /> Export JSON
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* add button (admin only) */}
            {isAdmin && (
              <Button size="sm" icon={<Plus size={15} />} onClick={() => store.openTxnForm()}>
                Add
              </Button>
            )}
          </div>
        </div>

        {/* filters */}
        <Card padding="sm">
          <TxnFilters />
        </Card>

        {/* table */}
        <Card padding="sm" className="overflow-hidden">
          {/* header row */}
          <div className="hidden sm:flex items-center gap-4 px-4 py-2 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-white/[0.04]">
            <span className="w-9" />
            <span className="flex-1">Description</span>
            <span className="w-24 text-right">Amount</span>
            {isAdmin && <span className="w-16" />}
          </div>

          {/* loading state */}
          {isLoading && (
            <div>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          )}

          {/* empty state */}
          {!isLoading && filtered.length === 0 && (
            <EmptyState
              title="No transactions found"
              description="Try adjusting your filters or add a new transaction"
              action={
                isAdmin ? (
                  <Button size="sm" icon={<Plus size={15} />} onClick={() => store.openTxnForm()}>
                    Add Transaction
                  </Button>
                ) : undefined
              }
            />
          )}

          {/* rows */}
          {!isLoading && visible.length > 0 && (
            <div>
              {visible.map((txn) => (
                <TxnRow
                  key={txn.id}
                  txn={txn}
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {/* load more */}
          {hasMore && (
            <div className="flex justify-center py-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              >
                Show more ({filtered.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </Card>
      </motion.div>

      {/* form modal */}
      {store.showTxnForm && <TxnForm />}
    </>
  );
}
