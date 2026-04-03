import type { Transaction, CategorySlug, InvestmentDirection } from './types';

// realistic transaction data spanning Oct 2025 to Mar 2026
type TxnTuple = [string, string, number, 'income' | 'expense' | 'investment', CategorySlug, InvestmentDirection?];
const RAW: TxnTuple[] = [
  // October 2025
  ['2025-10-01', 'Monthly Salary - Acme Corp',        5200,   'income',  'salary'],
  ['2025-10-02', 'Grocery run at Whole Foods',          87.43, 'expense', 'food'],
  ['2025-10-03', 'Netflix subscription',                15.99, 'expense', 'subscriptions'],
  ['2025-10-05', 'Electric bill payment',              124.50, 'expense', 'bills'],
  ['2025-10-06', 'New running shoes - Nike',           149.99, 'expense', 'shopping'],
  ['2025-10-08', 'Freelance logo design',              450,    'income',  'freelance'],
  ['2025-10-10', 'Dinner at Italian Kitchen',           62.30, 'expense', 'food'],
  ['2025-10-12', 'Uber ride to downtown',               18.75, 'expense', 'travel'],
  ['2025-10-14', 'Monthly rent payment',              1400,    'expense', 'rent'],
  ['2025-10-15', 'Spotify premium',                      9.99, 'expense', 'subscriptions'],
  ['2025-10-17', 'Dental checkup copay',                35,    'expense', 'health'],
  ['2025-10-19', 'Movie tickets x2',                    28.50, 'expense', 'entertainment'],
  ['2025-10-21', 'Online course - Advanced React',      49.99, 'expense', 'education'],
  ['2025-10-23', 'Gas station fill up',                  52.10, 'expense', 'travel'],
  ['2025-10-25', 'Dividend payout - VTSAX',            132.45, 'income',  'investments'],
  ['2025-10-27', 'Coffee beans subscription',           24.99, 'expense', 'food'],
  ['2025-10-29', 'Internet bill',                       79.99, 'expense', 'bills'],
  ['2025-10-30', 'Gym membership renewal',              45,    'expense', 'health'],

  // November 2025
  ['2025-11-01', 'Monthly Salary - Acme Corp',        5200,   'income',  'salary'],
  ['2025-11-02', 'Thanksgiving groceries',             156.78, 'expense', 'food'],
  ['2025-11-04', 'AWS hosting charges',                 42.30, 'expense', 'bills'],
  ['2025-11-05', 'Freelance web dev project',          800,    'income',  'freelance'],
  ['2025-11-07', 'Winter jacket - Uniqlo',             129.99, 'expense', 'shopping'],
  ['2025-11-09', 'Concert tickets',                     85,    'expense', 'entertainment'],
  ['2025-11-11', 'Phone bill',                          65,    'expense', 'bills'],
  ['2025-11-13', 'Lunch with colleagues',               34.20, 'expense', 'food'],
  ['2025-11-14', 'Monthly rent payment',              1400,    'expense', 'rent'],
  ['2025-11-16', 'Uber rides (weekly)',                  43.50, 'expense', 'travel'],
  ['2025-11-18', 'Book purchase - System Design',       39.99, 'expense', 'education'],
  ['2025-11-20', 'Netflix subscription',                15.99, 'expense', 'subscriptions'],
  ['2025-11-22', 'Black Friday haul - electronics',    324.99, 'expense', 'shopping'],
  ['2025-11-24', 'Pharmacy and vitamins',               28.45, 'expense', 'health'],
  ['2025-11-26', 'Parking pass renewal',                60,    'expense', 'travel'],
  ['2025-11-28', 'Amazon refund - wrong item',          49.99, 'income',  'refunds'],
  ['2025-11-30', 'Spotify premium',                      9.99, 'expense', 'subscriptions'],

  // December 2025
  ['2025-12-01', 'Monthly Salary - Acme Corp',        5200,   'income',  'salary'],
  ['2025-12-02', 'Year end bonus',                    2500,    'income',  'salary'],
  ['2025-12-03', 'Holiday gifts shopping',             287.50, 'expense', 'shopping'],
  ['2025-12-05', 'Electric bill payment',              138.20, 'expense', 'bills'],
  ['2025-12-06', 'Christmas dinner party groceries',   112.30, 'expense', 'food'],
  ['2025-12-08', 'Flight tickets home',                380,    'expense', 'travel'],
  ['2025-12-10', 'Freelance consulting',               600,    'income',  'freelance'],
  ['2025-12-12', 'Monthly rent payment',              1400,    'expense', 'rent'],
  ['2025-12-14', 'Streaming bundle renewal',            29.99, 'expense', 'subscriptions'],
  ['2025-12-16', 'Museum visit and lunch',              55.40, 'expense', 'entertainment'],
  ['2025-12-18', 'Eye exam and new glasses',           245,    'expense', 'health'],
  ['2025-12-20', 'Investment dividend - ETFs',         178.90, 'income',  'investments'],
  ['2025-12-22', 'Uber rides holiday week',             67.80, 'expense', 'travel'],
  ['2025-12-24', 'Last minute grocery run',             43.25, 'expense', 'food'],
  ['2025-12-28', 'Post-christmas sale shoes',           89.99, 'expense', 'shopping'],
  ['2025-12-30', 'Internet bill',                       79.99, 'expense', 'bills'],

  // January 2026
  ['2026-01-01', 'Monthly Salary - Acme Corp',        5400,   'income',  'salary'],
  ['2026-01-03', 'New Year dinner out',                 78.50, 'expense', 'food'],
  ['2026-01-04', 'Gym membership renewal',              45,    'expense', 'health'],
  ['2026-01-06', 'Online ML specialization',           199.99, 'expense', 'education'],
  ['2026-01-08', 'Freelance UI design work',           550,    'income',  'freelance'],
  ['2026-01-10', 'Grocery weekly run',                   92.15, 'expense', 'food'],
  ['2026-01-12', 'Monthly rent payment',              1400,    'expense', 'rent'],
  ['2026-01-14', 'Electric and gas bill',              155.30, 'expense', 'bills'],
  ['2026-01-15', 'Phone bill',                          65,    'expense', 'bills'],
  ['2026-01-17', 'Netflix and Spotify',                  25.98, 'expense', 'subscriptions'],
  ['2026-01-19', 'Weekend trip gas',                    48.60, 'expense', 'travel'],
  ['2026-01-21', 'Clothing clearance sale',            175.00, 'expense', 'shopping'],
  ['2026-01-23', 'Board game night supplies',           32.40, 'expense', 'entertainment'],
  ['2026-01-25', 'Investment return - bonds',          210.30, 'income',  'investments'],
  ['2026-01-27', 'Dentist cleaning',                    75,    'expense', 'health'],
  ['2026-01-29', 'Refund from airline',                120,    'income',  'refunds'],
  ['2026-01-31', 'Internet bill',                       79.99, 'expense', 'bills'],

  // February 2026
  ['2026-02-01', 'Monthly Salary - Acme Corp',        5400,   'income',  'salary'],
  ['2026-02-03', 'Valentine dinner reservation',       125.00, 'expense', 'food'],
  ['2026-02-05', 'AWS and cloud services',              56.80, 'expense', 'bills'],
  ['2026-02-07', 'Freelance mobile app project',       950,    'income',  'freelance'],
  ['2026-02-09', 'Sneakers - limited edition',         220,    'expense', 'shopping'],
  ['2026-02-11', 'Monthly rent payment',              1400,    'expense', 'rent'],
  ['2026-02-13', 'Concert and drinks',                  98.50, 'expense', 'entertainment'],
  ['2026-02-15', 'Grocery and household',              104.30, 'expense', 'food'],
  ['2026-02-17', 'Uber monthly pass',                   35,    'expense', 'travel'],
  ['2026-02-19', 'Annual health checkup',              150,    'expense', 'health'],
  ['2026-02-21', 'Udemy courses bundle',                29.99, 'expense', 'education'],
  ['2026-02-23', 'Streaming services',                  25.98, 'expense', 'subscriptions'],
  ['2026-02-25', 'Dividend payout - VTSAX',            145.60, 'income',  'investments'],
  ['2026-02-27', 'Weekend brunch out',                  42.75, 'expense', 'food'],
  ['2026-02-28', 'Phone and internet bundle',          134.99, 'expense', 'bills'],

  // March 2026
  ['2026-03-01', 'Monthly Salary - Acme Corp',        5400,   'income',  'salary'],
  ['2026-03-03', 'Spring wardrobe refresh',            195.50, 'expense', 'shopping'],
  ['2026-03-05', 'Grocery run',                         88.20, 'expense', 'food'],
  ['2026-03-07', 'Freelance brand identity project',   700,    'income',  'freelance'],
  ['2026-03-09', 'Electric bill',                      118.40, 'expense', 'bills'],
  ['2026-03-11', 'Monthly rent payment',              1400,    'expense', 'rent'],
  ['2026-03-13', 'Movie premiere tickets',              36.00, 'expense', 'entertainment'],
  ['2026-03-15', 'Gym quarterly renewal',              120,    'expense', 'health'],
  ['2026-03-17', 'Flight for conference',              290,    'expense', 'travel'],
  ['2026-03-19', 'Tech conference ticket',             199,    'expense', 'education'],
  ['2026-03-21', 'Coffee shop tabs this week',          31.40, 'expense', 'food'],
  ['2026-03-23', 'Amazon order refund',                 65.99, 'income',  'refunds'],
  ['2026-03-25', 'Subscriptions renewal',               25.98, 'expense', 'subscriptions'],
  ['2026-03-27', 'Taxi rides - conference week',        54.20, 'expense', 'travel'],
  ['2026-03-29', 'Investment payout - ETFs',           168.75, 'income',  'investments'],
  ['2026-03-31', 'Phone bill',                          65,    'expense', 'bills'],

  // ── Investment Transactions ──

  // October 2025
  ['2025-10-05', 'Bought 15 shares AAPL',             2587.50, 'investment', 'stocks',       'outflow'],
  ['2025-10-10', 'SIP - Vanguard Total Stock Market',  500,    'investment', 'mutual_funds', 'outflow'],
  ['2025-10-18', 'Bought 5 shares NVDA',              2400.00, 'investment', 'stocks',       'outflow'],

  // November 2025
  ['2025-11-03', 'Bought 8 shares TSLA',              1936.00, 'investment', 'stocks',       'outflow'],
  ['2025-11-10', 'SIP - Vanguard Total Stock Market',  500,    'investment', 'mutual_funds', 'outflow'],
  ['2025-11-15', 'SIP - Fidelity Growth Fund',         300,    'investment', 'mutual_funds', 'outflow'],
  ['2025-11-22', 'Sold AAPL Call Option - Premium',     420,   'investment', 'fno',          'inflow'],

  // December 2025
  ['2025-12-04', 'Bought 12 shares MSFT',             4538.40, 'investment', 'stocks',       'outflow'],
  ['2025-12-10', 'SIP - Vanguard Total Stock Market',  500,    'investment', 'mutual_funds', 'outflow'],
  ['2025-12-15', 'SIP - Fidelity Growth Fund',         300,    'investment', 'mutual_funds', 'outflow'],
  ['2025-12-20', 'Bought 10 shares AMZN',             1784.00, 'investment', 'stocks',       'outflow'],

  // January 2026
  ['2026-01-06', 'Bought 7 shares GOOGL',              988.40, 'investment', 'stocks',       'outflow'],
  ['2026-01-10', 'SIP - Vanguard Total Stock Market',  500,    'investment', 'mutual_funds', 'outflow'],
  ['2026-01-15', 'SIP - Fidelity Growth Fund',         300,    'investment', 'mutual_funds', 'outflow'],
  ['2026-01-20', 'Bought NVDA Call $560 Apr',          1200,   'investment', 'fno',          'outflow'],
  ['2026-01-28', 'Bought 20 shares JPM',              3916.00, 'investment', 'stocks',       'outflow'],

  // February 2026
  ['2026-02-05', 'Bought 6 shares META',              2913.00, 'investment', 'stocks',       'outflow'],
  ['2026-02-10', 'SIP - Vanguard Total Stock Market',  500,    'investment', 'mutual_funds', 'outflow'],
  ['2026-02-15', 'SIP - BlackRock International',       200,   'investment', 'mutual_funds', 'outflow'],
  ['2026-02-20', 'Sold TSLA Put Option - Profit',       850,   'investment', 'fno',          'inflow'],
  ['2026-02-26', 'SIP - Fidelity Growth Fund',          300,   'investment', 'mutual_funds', 'outflow'],

  // March 2026
  ['2026-03-05', 'SIP - Vanguard Total Stock Market',  500,    'investment', 'mutual_funds', 'outflow'],
  ['2026-03-10', 'Sold 3 shares AAPL - Profit',        569.52, 'investment', 'stocks',       'inflow'],
  ['2026-03-15', 'SIP - Fidelity Growth Fund',          300,   'investment', 'mutual_funds', 'outflow'],
  ['2026-03-20', 'SPY Future - Margin',                5280,   'investment', 'fno',          'outflow'],
  ['2026-03-25', 'SIP - BlackRock International',        200,  'investment', 'mutual_funds', 'outflow'],
  ['2026-03-30', 'Dividend - MSFT',                     156,   'investment', 'stocks',       'inflow'],
];

let counter = 1;

export const SEED_TRANSACTIONS: Transaction[] = RAW.map(([date, description, amount, type, category, investmentDirection]) => ({
  id: `txn_${String(counter++).padStart(3, '0')}`,
  date,
  description,
  amount,
  type,
  category,
  ...(investmentDirection ? { investmentDirection } : {}),
}));
