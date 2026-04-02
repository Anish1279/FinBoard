import type { Transaction } from './types';
import { CATEGORIES } from './constants';
import { formatDate } from './formatters';

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();

  // cleanup after small delay so browser can finish download
  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 100);
}

export function exportToCSV(transactions: Transaction[]) {
  const header = 'Date,Description,Category,Type,Amount\n';
  const rows = transactions
    .map((t) => {
      const cat = CATEGORIES[t.category]?.label ?? t.category;
      const desc = t.description.includes(',')
        ? `"${t.description}"`
        : t.description;
      return `${formatDate(t.date, 'yyyy-MM-dd')},${desc},${cat},${t.type},${t.amount.toFixed(2)}`;
    })
    .join('\n');

  downloadBlob(header + rows, `transactions_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
}

export function exportToJSON(transactions: Transaction[]) {
  const enriched = transactions.map((t) => ({
    ...t,
    categoryLabel: CATEGORIES[t.category]?.label ?? t.category,
    formattedDate: formatDate(t.date, 'yyyy-MM-dd'),
  }));

  const content = JSON.stringify(enriched, null, 2);
  downloadBlob(content, `transactions_${Date.now()}.json`, 'application/json');
}
