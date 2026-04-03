import type { Transaction } from './types';
import { SEED_TRANSACTIONS } from './mock-data';
import { STORAGE_KEYS, CURRENT_DATA_VERSION } from './constants';
import { generateId } from './formatters';

// simulates network delay between 200-600ms
function networkDelay(): Promise<void> {
  const ms = 200 + Math.random() * 400;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readStorage(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupted storage, reset
  }
  return [];
}

function writeStorage(txns: Transaction[]) {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns));
}

function needsReseed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.DATA_VERSION) !== CURRENT_DATA_VERSION;
  } catch { return true; }
}

function markVersion() {
  localStorage.setItem(STORAGE_KEYS.DATA_VERSION, CURRENT_DATA_VERSION);
}

export const api = {
  async fetchTransactions(): Promise<Transaction[]> {
    await networkDelay();

    let stored = readStorage();
    if (stored.length === 0 || needsReseed()) {
      // seed with latest mock data (includes investment transactions)
      writeStorage(SEED_TRANSACTIONS);
      markVersion();
      stored = SEED_TRANSACTIONS;
    }
    return structuredClone(stored);
  },

  async addTransaction(payload: Omit<Transaction, 'id'>): Promise<Transaction> {
    await networkDelay();

    const newTxn: Transaction = { ...payload, id: `txn_${generateId()}` };
    const stored = readStorage();
    stored.unshift(newTxn);
    writeStorage(stored);
    return structuredClone(newTxn);
  },

  async updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id'>>): Promise<Transaction> {
    await networkDelay();

    const stored = readStorage();
    const idx = stored.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error(`Transaction ${id} not found`);

    stored[idx] = { ...stored[idx], ...updates };
    writeStorage(stored);
    return structuredClone(stored[idx]);
  },

  async deleteTransaction(id: string): Promise<void> {
    await networkDelay();

    const stored = readStorage();
    const filtered = stored.filter((t) => t.id !== id);
    if (filtered.length === stored.length) throw new Error(`Transaction ${id} not found`);
    writeStorage(filtered);
  },
};
