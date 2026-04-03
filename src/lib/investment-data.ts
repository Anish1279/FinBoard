import type {
  StockHolding,
  FnOPosition,
  MutualFundHolding,
  PortfolioSummary,
  PerformancePoint,
  InvestmentState,
} from './types';

// ── Helper: generate sparkline data ──
function sparkline(base: number, volatility: number, points = 30): number[] {
  const data: number[] = [];
  let v = base;
  for (let i = 0; i < points; i++) {
    v += (Math.random() - 0.48) * volatility;
    v = Math.max(v * 0.85, v); // prevent going too negative
    data.push(Math.round(v * 100) / 100);
  }
  return data;
}

// ── Stock Holdings ──
export const MOCK_STOCKS: StockHolding[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    quantity: 15,
    avgBuyPrice: 172.50,
    currentPrice: 189.84,
    change: 1.24,
    sector: 'Technology',
    sparkline: sparkline(175, 4),
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    quantity: 8,
    avgBuyPrice: 242.00,
    currentPrice: 271.30,
    change: -2.15,
    sector: 'Automotive',
    sparkline: sparkline(245, 12),
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp',
    quantity: 12,
    avgBuyPrice: 378.20,
    currentPrice: 415.60,
    change: 0.87,
    sector: 'Technology',
    sparkline: sparkline(380, 6),
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    quantity: 5,
    avgBuyPrice: 480.00,
    currentPrice: 547.20,
    change: 3.42,
    sector: 'Technology',
    sparkline: sparkline(490, 18),
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    quantity: 10,
    avgBuyPrice: 178.40,
    currentPrice: 192.75,
    change: 0.56,
    sector: 'E-Commerce',
    sparkline: sparkline(180, 5),
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    quantity: 7,
    avgBuyPrice: 141.20,
    currentPrice: 158.90,
    change: -0.32,
    sector: 'Technology',
    sparkline: sparkline(143, 4),
  },
  {
    symbol: 'META',
    name: 'Meta Platforms',
    quantity: 6,
    avgBuyPrice: 485.50,
    currentPrice: 523.40,
    change: 1.78,
    sector: 'Technology',
    sparkline: sparkline(490, 10),
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase',
    quantity: 20,
    avgBuyPrice: 195.80,
    currentPrice: 208.15,
    change: 0.45,
    sector: 'Banking',
    sparkline: sparkline(197, 3),
  },
];

// ── F&O Positions ──
export const MOCK_FNO: FnOPosition[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'call',
    strikePrice: 195,
    premium: 4.20,
    lots: 2,
    expiry: '2026-04-18',
    ltp: 5.85,
    pnl: 330,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    type: 'put',
    strikePrice: 250,
    premium: 8.50,
    lots: 1,
    expiry: '2026-04-18',
    ltp: 3.20,
    pnl: 530,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    type: 'call',
    strikePrice: 560,
    premium: 12.00,
    lots: 1,
    expiry: '2026-05-16',
    ltp: 15.40,
    pnl: 340,
  },
  {
    symbol: 'SPY',
    name: 'S&P 500 ETF',
    type: 'future',
    strikePrice: 5280,
    premium: 0,
    lots: 1,
    expiry: '2026-06-20',
    ltp: 5340,
    pnl: 600,
  },
];

// ── Mutual Funds ──
export const MOCK_MUTUAL_FUNDS: MutualFundHolding[] = [
  {
    scheme: 'Vanguard Total Stock Market Index',
    category: 'Large Cap',
    nav: 112.45,
    units: 85.32,
    invested: 8500,
    currentValue: 9593.23,
    returns: 12.86,
    sipAmount: 500,
  },
  {
    scheme: 'Fidelity Growth Fund',
    category: 'Mid Cap',
    nav: 78.90,
    units: 63.37,
    invested: 4200,
    currentValue: 4999.89,
    returns: 19.04,
    sipAmount: 300,
  },
  {
    scheme: 'Schwab US Bond Index',
    category: 'Debt',
    nav: 48.20,
    units: 103.73,
    invested: 5000,
    currentValue: 4999.79,
    returns: -0.004,
  },
  {
    scheme: 'BlackRock International Growth',
    category: 'International',
    nav: 65.30,
    units: 46.09,
    invested: 2800,
    currentValue: 3009.68,
    returns: 7.49,
    sipAmount: 200,
  },
  {
    scheme: 'T. Rowe Price Blue Chip Growth',
    category: 'Large Cap',
    nav: 145.80,
    units: 20.58,
    invested: 2750,
    currentValue: 3000.56,
    returns: 9.11,
  },
];

// ── Performance History (6 months of daily data) ──
function generatePerformance(): PerformancePoint[] {
  const points: PerformancePoint[] = [];
  const startDate = new Date('2025-10-01');
  const endDate = new Date('2026-03-31');
  let value = 42000;

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 0 || d.getDay() === 6) continue; // skip weekends
    value += (Math.random() - 0.46) * 350; // slight upward bias
    value = Math.max(value, 35000);
    points.push({
      date: d.toISOString().slice(0, 10),
      value: Math.round(value * 100) / 100,
    });
  }
  return points;
}

const performance = generatePerformance();

// ── Portfolio Summary (computed from holdings) ──
function computePortfolio(): PortfolioSummary {
  let currentValue = 0;
  let invested = 0;

  for (const s of MOCK_STOCKS) {
    currentValue += s.quantity * s.currentPrice;
    invested += s.quantity * s.avgBuyPrice;
  }
  for (const f of MOCK_MUTUAL_FUNDS) {
    currentValue += f.currentValue;
    invested += f.invested;
  }
  for (const o of MOCK_FNO) {
    currentValue += o.pnl; // net P&L from options
  }

  const totalReturns = currentValue - invested;
  const totalReturnsPercent = invested > 0 ? (totalReturns / invested) * 100 : 0;
  const dayChange = currentValue * 0.0068; // ~0.68% daily change
  const dayChangePercent = 0.68;

  return {
    currentValue: Math.round(currentValue * 100) / 100,
    invested: Math.round(invested * 100) / 100,
    totalReturns: Math.round(totalReturns * 100) / 100,
    totalReturnsPercent: Math.round(totalReturnsPercent * 100) / 100,
    dayChange: Math.round(dayChange * 100) / 100,
    dayChangePercent,
  };
}

// ── Exported investment state ──
export const MOCK_INVESTMENT_STATE: InvestmentState = {
  stocks: MOCK_STOCKS,
  fno: MOCK_FNO,
  mutualFunds: MOCK_MUTUAL_FUNDS,
  portfolio: computePortfolio(),
  performance,
};

// ── Sector breakdown for insights ──
export function getStockSectorBreakdown(): { sector: string; value: number; count: number }[] {
  const map = new Map<string, { value: number; count: number }>();
  for (const s of MOCK_STOCKS) {
    const entry = map.get(s.sector) ?? { value: 0, count: 0 };
    entry.value += s.quantity * s.currentPrice;
    entry.count += 1;
    map.set(s.sector, entry);
  }
  return Array.from(map.entries())
    .map(([sector, data]) => ({ sector, ...data }))
    .sort((a, b) => b.value - a.value);
}
