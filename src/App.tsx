import { useEffect } from 'react';
import { useFinanceStore } from './store/finance';
import { Shell } from './components/layout/Shell';
import { DashboardView } from './components/dashboard/DashboardView';
import { TxnTable } from './components/transactions/TxnTable';

export default function App() {
  const theme = useFinanceStore((s) => s.theme);
  const activeView = useFinanceStore((s) => s.activeView);
  const loadTransactions = useFinanceStore((s) => s.loadTransactions);

  // sync dark class on <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // load transactions on mount
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <Shell>
      {activeView === 'dashboard' && <DashboardView />}
      {activeView === 'transactions' && <TxnTable />}
    </Shell>
  );
}
