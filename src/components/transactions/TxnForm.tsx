import { useState, useCallback, useMemo } from 'react';
import { Save, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useFinanceStore } from '../../store/finance';
import { CATEGORIES } from '../../lib/constants';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import type { TransactionType, CategorySlug, Transaction, InvestmentDirection } from '../../lib/types';

interface FormData {
  description: string;
  amount: string;
  type: TransactionType;
  category: CategorySlug;
  date: string;
  note: string;
  investmentDirection: InvestmentDirection;
}

function toFormData(txn: Transaction | null): FormData {
  if (!txn) {
    return {
      description: '',
      amount: '',
      type: 'expense',
      category: 'food',
      date: new Date().toISOString().slice(0, 10),
      note: '',
      investmentDirection: 'outflow',
    };
  }
  return {
    description: txn.description,
    amount: String(txn.amount),
    type: txn.type,
    category: txn.category,
    date: txn.date,
    note: txn.note ?? '',
    investmentDirection: txn.investmentDirection ?? 'outflow',
  };
}

export function TxnForm() {
  const showForm = useFinanceStore((s) => s.showTxnForm);
  const editingTxn = useFinanceStore((s) => s.editingTxn);
  const closeForm = useFinanceStore((s) => s.closeTxnForm);
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const updateTransaction = useFinanceStore((s) => s.updateTransaction);

  const [form, setForm] = useState<FormData>(() => toFormData(editingTxn));
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // reset form when editingTxn changes
  useMemo(() => {
    setForm(toFormData(editingTxn));
    setErrors({});
  }, [editingTxn]);

  const isEditing = editingTxn !== null;

  const filteredCategories = useMemo(
    () => Object.values(CATEGORIES).filter((c) => c.type === form.type),
    [form.type]
  );

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const validate = useCallback((): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.description.trim()) errs.description = 'Description is required';
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) errs.amount = 'Enter a valid amount';
    if (!form.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setSaving(true);
      const payload = {
        description: form.description.trim(),
        amount: parseFloat(form.amount),
        type: form.type,
        category: form.category,
        date: form.date,
        note: form.note.trim() || undefined,
        ...(form.type === 'investment' ? { investmentDirection: form.investmentDirection } : {}),
      };

      if (isEditing && editingTxn) {
        await updateTransaction(editingTxn.id, payload);
      } else {
        await addTransaction(payload);
      }
      setSaving(false);
    },
    [form, isEditing, editingTxn, validate, addTransaction, updateTransaction]
  );

  const inputBase = clsx(
    'w-full h-10 px-3 rounded-lg text-sm',
    'bg-white dark:bg-surface-800',
    'border border-gray-200 dark:border-white/[0.08]',
    'text-gray-800 dark:text-gray-200',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    'focus:ring-2 focus:ring-accent/30 focus:border-accent/50 focus:outline-none',
    'transition-colors'
  );

  return (
    <Modal
      open={showForm}
      onClose={closeForm}
      title={isEditing ? 'Edit Transaction' : 'Add Transaction'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* type toggle */}
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/[0.04] rounded-lg">
          {(['expense', 'income', 'investment'] as TransactionType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                updateField('type', t);
                const firstCat = Object.values(CATEGORIES).find((c) => c.type === t);
                if (firstCat) updateField('category', firstCat.slug);
              }}
              className={clsx(
                'flex-1 h-8 rounded-md text-sm font-medium transition-all',
                form.type === t
                  ? t === 'income'
                    ? 'bg-mint/10 text-mint shadow-sm'
                    : t === 'investment'
                    ? 'bg-accent/10 text-accent shadow-sm'
                    : 'bg-coral/10 text-coral shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              {t === 'income' ? 'Income' : t === 'investment' ? 'Investment' : 'Expense'}
            </button>
          ))}
        </div>

        {/* description */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
            Description
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="e.g. Grocery run at Trader Joe's"
            className={clsx(inputBase, errors.description && 'border-coral/60')}
            autoFocus
          />
          {errors.description && (
            <p className="text-xs text-coral mt-1">{errors.description}</p>
          )}
        </div>

        {/* amount + date row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={(e) => updateField('amount', e.target.value)}
              placeholder="0.00"
              className={clsx(inputBase, errors.amount && 'border-coral/60')}
            />
            {errors.amount && <p className="text-xs text-coral mt-1">{errors.amount}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => updateField('date', e.target.value)}
              className={clsx(inputBase, errors.date && 'border-coral/60')}
            />
            {errors.date && <p className="text-xs text-coral mt-1">{errors.date}</p>}
          </div>
        </div>

        {/* category */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => updateField('category', e.target.value as CategorySlug)}
            className={inputBase}
          >
            {filteredCategories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* investment direction */}
        {form.type === 'investment' && (
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Cash Flow Direction
            </label>
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/[0.04] rounded-lg">
              {(['outflow', 'inflow'] as InvestmentDirection[]).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => updateField('investmentDirection', dir)}
                  className={clsx(
                    'flex-1 h-8 rounded-md text-xs font-medium transition-all',
                    form.investmentDirection === dir
                      ? dir === 'outflow'
                        ? 'bg-coral/10 text-coral shadow-sm'
                        : 'bg-mint/10 text-mint shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  {dir === 'outflow' ? 'Buy / Deploy' : 'Sell / Returns'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* note */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
            Note <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={form.note}
            onChange={(e) => updateField('note', e.target.value)}
            placeholder="Add a note..."
            className={inputBase}
          />
        </div>

        {/* actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={closeForm}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={saving}
            icon={saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          >
            {isEditing ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
