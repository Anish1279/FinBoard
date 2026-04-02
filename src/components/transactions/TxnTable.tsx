import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import gsap from 'gsap';
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

const BATCH_SIZE = 30;

function LoadingDots() {
  return (
    <div className="flex items-center justify-center gap-1.5 py-6">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="loading-dot w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500"
        />
      ))}
    </div>
  );
}

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

  // infinite scroll state
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [prevVisible, setPrevVisible] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visibleCount < filtered.length;

  // reset visible count when filters/sort change
  const filterKey = `${store.filters.search}|${store.filters.category}|${store.filters.type}|${store.filters.dateFrom}|${store.filters.dateTo}|${store.filters.sortBy}|${store.filters.sortDir}`;
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
    setPrevVisible(0);
  }, [filterKey]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < filtered.length) {
          setTimeout(() => {
            setPrevVisible(visibleCount);
            setVisibleCount((v) => Math.min(v + BATCH_SIZE, filtered.length));
          }, 120);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filtered.length]);

  // animate newly loaded rows with GSAP
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !listRef.current) return;

    const newRows = listRef.current.querySelectorAll('[data-new="true"]');
    if (!newRows.length) return;

    gsap.fromTo(newRows,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.035,
        ease: 'power2.out',
        onComplete: () => newRows.forEach((r) => r.removeAttribute('data-new')),
      }
    );
  }, [visibleCount]);

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

          {/* rows with infinite scroll */}
          {!isLoading && visible.length > 0 && (
            <div ref={listRef}>
              {visible.map((txn, i) => (
                <div
                  key={txn.id}
                  className="transaction-row"
                  data-new={i >= prevVisible && prevVisible > 0 ? 'true' : undefined}
                  style={{ willChange: i >= prevVisible && prevVisible > 0 ? 'transform, opacity' : undefined }}
                >
                  <TxnRow
                    txn={txn}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}

          {/* sentinel for IntersectionObserver */}
          <div ref={sentinelRef} style={{ height: 1 }} />

          {/* loading dots (no button) */}
          {hasMore && <LoadingDots />}
        </Card>
      </motion.div>

      {/* form modal */}
      {store.showTxnForm && <TxnForm />}
    </>
  );
}
