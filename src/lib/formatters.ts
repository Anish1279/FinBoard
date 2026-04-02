import { format, parseISO, isValid } from 'date-fns';
import { CURRENCY } from './constants';

export function formatCurrency(value: number, compact = false): string {
  if (compact && Math.abs(value) >= 1000) {
    const formatted = new Intl.NumberFormat(CURRENCY.locale, {
      style: 'currency',
      currency: CURRENCY.code,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
    return formatted;
  }

  return new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(dateStr: string, pattern = 'MMM dd, yyyy'): string {
  const parsed = parseISO(dateStr);
  if (!isValid(parsed)) return dateStr;
  return format(parsed, pattern);
}

export function formatMonth(dateStr: string): string {
  const parsed = parseISO(dateStr + '-01');
  if (!isValid(parsed)) return dateStr;
  return format(parsed, 'MMM yyyy');
}

export function formatShortMonth(dateStr: string): string {
  const parsed = parseISO(dateStr + '-01');
  if (!isValid(parsed)) return dateStr;
  return format(parsed, 'MMM');
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function clampString(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + '…';
}
