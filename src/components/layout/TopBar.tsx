import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LayoutDashboard,
  ArrowLeftRight,
  Shield,
  Eye,
  Wallet,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useFinanceStore } from '../../store/finance';
import { ThemeToggle } from '../ui/ThemeToggle';

export function TopBar() {
  const location = useLocation();
  const role = useFinanceStore((s) => s.role);
  const setRole = useFinanceStore((s) => s.setRole);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  ];

  return (
    <>
      {/* sticky top bar for mobile/tablet */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-white/90 dark:bg-surface-900/90 backdrop-blur-md border-b border-gray-200/60 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 -ml-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06]"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <Wallet size={16} />
            </div>
            <span className="font-semibold text-sm text-gray-900 dark:text-white">FinBoard</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
        </div>
      </header>

      {/* mobile drawer overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 bg-white dark:bg-surface-900 border-r border-gray-200 dark:border-white/[0.06] flex flex-col lg:hidden"
            >
              {/* drawer header */}
              <div className="flex items-center justify-between h-14 px-4 border-b border-gray-100 dark:border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Wallet size={18} />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">FinBoard</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* drawer nav */}
              <nav className="flex-1 p-3 space-y-1">
                {navItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setDrawerOpen(false)}
                      className={clsx(
                        'flex items-center gap-3 w-full rounded-xl px-3 h-11 text-sm font-medium transition-colors',
                        active
                          ? 'bg-accent/10 text-accent'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.04]'
                      )}
                    >
                      <item.icon size={19} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* drawer bottom */}
              <div className="p-3 border-t border-gray-100 dark:border-white/[0.04] space-y-1">
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider px-3 mb-1 block">
                  Role
                </span>
                <button
                  onClick={() => setRole('admin')}
                  className={clsx(
                    'flex items-center gap-2.5 w-full rounded-lg px-3 h-9 text-sm font-medium transition-colors',
                    role === 'admin' ? 'bg-accent/10 text-accent' : 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  <Shield size={16} /> Admin
                </button>
                <button
                  onClick={() => setRole('viewer')}
                  className={clsx(
                    'flex items-center gap-2.5 w-full rounded-lg px-3 h-9 text-sm font-medium transition-colors',
                    role === 'viewer' ? 'bg-accent/10 text-accent' : 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  <Eye size={16} /> Viewer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
