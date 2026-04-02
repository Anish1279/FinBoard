import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Shield,
  Eye,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import clsx from 'clsx';
import { useFinanceStore } from '../../store/finance';
import { ThemeToggle } from '../ui/ThemeToggle';
import type { ViewTab, Role } from '../../lib/types';

interface NavItem {
  key: ViewTab;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
];

export function Sidebar() {
  const activeView = useFinanceStore((s) => s.activeView);
  const setActiveView = useFinanceStore((s) => s.setActiveView);
  const sidebarOpen = useFinanceStore((s) => s.sidebarOpen);
  const toggleSidebar = useFinanceStore((s) => s.toggleSidebar);
  const role = useFinanceStore((s) => s.role);
  const setRole = useFinanceStore((s) => s.setRole);

  const roleOptions: { value: Role; label: string; icon: typeof Shield }[] = useMemo(
    () => [
      { value: 'admin', label: 'Admin', icon: Shield },
      { value: 'viewer', label: 'Viewer', icon: Eye },
    ],
    []
  );

  return (
    <aside
      className={clsx(
        'hidden lg:flex flex-col shrink-0 h-screen sticky top-0',
        'bg-white dark:bg-surface-900 border-r border-gray-200/80 dark:border-white/[0.06]',
        'transition-[width] duration-300 ease-in-out',
        sidebarOpen ? 'w-60' : 'w-[68px]'
      )}
    >
      {/* branding */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-100 dark:border-white/[0.04]">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent/10 text-accent shrink-0">
          <Wallet size={20} />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="text-base font-semibold text-gray-900 dark:text-white whitespace-nowrap overflow-hidden"
            >
              FinBoard
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveView(item.key)}
              className={clsx(
                'relative flex items-center gap-3 w-full rounded-xl px-3 h-10 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.04]'
              )}
              title={item.label}
            >
              <item.icon size={19} className="shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-accent/10 -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* bottom section */}
      <div className="px-3 pb-4 space-y-2 border-t border-gray-100 dark:border-white/[0.04] pt-3">
        {/* role switcher */}
        <div className={clsx('space-y-1', !sidebarOpen && 'flex flex-col items-center')}>
          {sidebarOpen && (
            <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-1 block">
              Role
            </span>
          )}
          {roleOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRole(opt.value)}
              className={clsx(
                'flex items-center gap-2.5 w-full rounded-lg px-3 h-8 text-xs font-medium transition-colors',
                role === opt.value
                  ? 'bg-accent/10 text-accent'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.04]'
              )}
              title={opt.label}
            >
              <opt.icon size={15} className="shrink-0" />
              {sidebarOpen && <span>{opt.label}</span>}
            </button>
          ))}
        </div>

        {/* theme + collapse */}
        <div className="flex items-center justify-between pt-1">
          <ThemeToggle />
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
