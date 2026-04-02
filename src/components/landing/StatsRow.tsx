import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
}

const STATS: StatItem[] = [
  { label: 'Transactions tracked', value: 99, suffix: '', prefix: '' },
  { label: 'Spending categories', value: 9, suffix: '', prefix: '' },
  { label: 'Savings rate', value: 61.8, suffix: '%', prefix: '' },
];

export function StatsRow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    countersRef.current.forEach((el, i) => {
      if (!el) return;
      const stat = STATS[i];
      const isFloat = stat.value % 1 !== 0;

      if (prefersReduced) {
        el.textContent = `${stat.prefix ?? ''}${stat.value}${stat.suffix}`;
        return;
      }

      const proxy = { val: 0 };
      gsap.to(proxy, {
        val: stat.value,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          once: true,
        },
        onUpdate() {
          const display = isFloat ? proxy.val.toFixed(1) : Math.round(proxy.val);
          el.textContent = `${stat.prefix ?? ''}${display}${stat.suffix}`;
        },
      });
    });
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section
      ref={sectionRef}
      className="relative py-28 sm:py-36 px-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-6 text-center">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span
                ref={(el) => { countersRef.current[i] = el; }}
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
          ))}
        </div>
      </div>

      {/* subtle divider */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
