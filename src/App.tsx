import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useFinanceStore } from './store/finance';
import { Shell } from './components/layout/Shell';
import { DashboardView } from './components/dashboard/DashboardView';
import { TxnTable } from './components/transactions/TxnTable';
import { InvestmentsView } from './components/investments/InvestmentsView';
import { InsightsView } from './components/insights/InsightsView';
import { LandingPage } from './pages/LandingPage';

function AppShell({ children }: { children: React.ReactNode }) {
  const loadTransactions = useFinanceStore((s) => s.loadTransactions);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return <Shell>{children}</Shell>;
}

export default function App() {
  const theme = useFinanceStore((s) => s.theme);

  // sync dark class on <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<AppShell><DashboardView /></AppShell>} />
        <Route path="/transactions" element={<AppShell><TxnTable /></AppShell>} />
        <Route path="/investments" element={<AppShell><InvestmentsView /></AppShell>} />
        <Route path="/insights" element={<AppShell><InsightsView /></AppShell>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
