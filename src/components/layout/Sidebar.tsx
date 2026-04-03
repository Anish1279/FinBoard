import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Shield,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Wallet,
  TrendingUp,
  BarChart3,
  Activity,
  PieChart,
  Lightbulb,
} from 'lucide-react';
import clsx from 'clsx';
import { useFinanceStore } from '../../store/finance';
import { ThemeToggle } from '../ui/ThemeToggle';
import type { Role } from '../../lib/types';

interface NavItem {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
  children?: { path: string; label: string; icon: typeof LayoutDashboard }[];
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  {
    path: '/investments',
    label: 'Investments',
    icon: TrendingUp,
    children: [
      { path: '/investments?tab=stocks', label: 'Stocks', icon: BarChart3 },
      { path: '/investments?tab=fno', label: 'F&O', icon: Activity },
      { path: '/investments?tab=mutual-funds', label: 'Mutual Funds', icon: PieChart },
    ],
  },
  { path: '/insights', label: 'Insights', icon: Lightbulb },
];

export function Sidebar() {
  const location = useLocation();
  const sidebarOpen = useFinanceStore((s) => s.sidebarOpen);
  const toggleSidebar = useFinanceStore((s) => s.toggleSidebar);
  const role = useFinanceStore((s) => s.role);
  const setRole = useFinanceStore((s) => s.setRole);
  const [expandedNav, setExpandedNav] = useState<string | null>(
    location.pathname === '/investments' ? '/investments' : null
  );

  const roleOptions: { value: Role; label: string; icon: typeof Shield }[] = useMemo(
    () => [
      { value: 'admin', label: 'Admin', icon: Shield },
      { value: 'viewer', label: 'Viewer', icon: Eye },
    ],
    []
  );

  const isNavActive = (item: NavItem) => {
    if (item.children) return location.pathname === item.path.split('?')[0];
    return location.pathname === item.path;
  };

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
      <Link
        to="/"
        className="flex items-center gap-3 px-4 h-16 border-b border-gray-100 dark:border-white/[0.04] hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent/10 text-accent shrink-0">
          <Wallet size={20} />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="text-base font-semibold text-gray-900 dark:text-white whitespace-nowrap overflow-hidden block"
            >
              FinBoard
            </motion.span>
          )}
        </AnimatePresence>
      </Link>

      {/* navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = isNavActive(item);
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedNav === item.path;

          return (
            <div key={item.path}>
              {hasChildren ? (
                <>
                  <div className="flex items-center">
                    <Link
                      to={item.path.split('?')[0]}
                      className={clsx(
                        'relative flex items-center gap-3 flex-1 rounded-xl px-3 h-10 text-sm font-medium transition-colors',
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
                            className="whitespace-nowrap flex-1"
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
                    </Link>
                    {sidebarOpen && (
                      <button
                        onClick={() => setExpandedNav(isExpanded ? null : item.path)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
                      >
                        <ChevronDown
                          size={14}
                          className={clsx('transition-transform duration-200', isExpanded && 'rotate-180')}
                        />
                      </button>
                    )}
                  </div>
                  <AnimatePresence>
                    {isExpanded && sidebarOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-5 pl-3 border-l border-gray-200/60 dark:border-white/[0.06] space-y-0.5 mt-1">
                          {item.children!.map((child) => {
                            const childActive = location.pathname + location.search === child.path
                              || (location.pathname === '/investments' && child.path.includes(`tab=${new URLSearchParams(location.search).get('tab')}`));
                            return (
                              <Link
                                key={child.path}
                                to={child.path}
                                className={clsx(
                                  'flex items-center gap-2.5 rounded-lg px-2.5 h-8 text-xs font-medium transition-colors',
                                  childActive
                                    ? 'text-accent bg-accent/5'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.04]'
                                )}
                              >
                                <child.icon size={14} className="shrink-0" />
                                <span>{child.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to={item.path}
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
                </Link>
              )}
            </div>
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
