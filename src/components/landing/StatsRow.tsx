import { useRef, useMemo, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useFinanceStore, selectTotals, selectCategoryBreakdown } from '../../store/finance';

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
}

function CounterStat({ stat }: { stat: StatItem }) {
  const elRef = useRef<HTMLSpanElement>(null);
  const proxy = useRef({ val: 0 }); // hold previous value across re-renders

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = elRef.current;
    if (!el) return;

    const isFloat = stat.value % 1 !== 0;

    if (prefersReduced) {
      const display = isFloat ? stat.value.toFixed(1) : Math.round(stat.value);
      el.textContent = `${stat.prefix ?? ''}${display}${stat.suffix}`;
      return;
    }

    gsap.to(proxy.current, {
      val: stat.value,
      duration: 2.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        once: true,
      },
      onUpdate() {
        const display = isFloat ? proxy.current.val.toFixed(1) : Math.round(proxy.current.val);
        el.textContent = `${stat.prefix ?? ''}${display}${stat.suffix}`;
      },
    });
  }, { scope: elRef, dependencies: [stat.value] });

  return (
    <div className="flex flex-col items-center">
      <span
        ref={elRef}
        className="text-5xl sm:text-6xl font-extrabold text-white mb-2 tabular-nums"
        style={{ fontFamily: 'Syne, sans-serif' }}
      >
        0
      </span>
      <span
        className="text-sm text-gray-500 uppercase tracking-wider"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        {stat.label}
      </span>
    </div>
  );
}

export function StatsRow() {
  const transactions = useFinanceStore((state) => state.transactions);
  const loadTransactions = useFinanceStore((state) => state.loadTransactions);

  useEffect(() => {
    // If store is empty, fetch the data so it isn't orphaned on the landing page
    if (transactions.length === 0) {
      loadTransactions();
    }
  }, [loadTransactions, transactions.length]);

  const statsData: StatItem[] = useMemo(() => {
    // If no transactions yet, fallback to the stylized placeholder dummy values
    // to keep the landing page looking premium when empty.
    if (transactions.length === 0) {
      return [
        { label: 'Transactions tracked', value: 99, suffix: '', prefix: '' },
        { label: 'Spending categories', value: 9, suffix: '', prefix: '' },
        { label: 'Savings rate', value: 61.8, suffix: '%', prefix: '' },
      ];
    }

    const totals = selectTotals(transactions);
    const categories = selectCategoryBreakdown(transactions);
    
    // We round savings logic just in case it yields a long decimal natively
    const savingsDisplay = totals.savingsRate <= 0 ? 0 : Math.round(totals.savingsRate * 10) / 10;

    return [
      { label: 'Transactions tracked', value: transactions.length, suffix: '', prefix: '' },
      { label: 'Spending categories', value: categories.length, suffix: '', prefix: '' },
      { label: 'Savings rate', value: savingsDisplay, suffix: '%', prefix: '' },
    ];
  }, [transactions]);

  return (
    <section className="relative py-28 sm:py-36 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-6 text-center">
          {statsData.map((stat) => (
            <CounterStat key={stat.label} stat={stat} />
          ))}
        </div>
      </div>

      {/* subtle divider */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
