import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Button, Input, Select, Badge, Modal, ConfirmDialog, SearchInput, Pagination, formatCurrency, formatDate, StatCard } from '../components/ui';
import { Plus, Receipt, Trash2 } from 'lucide-react';

export function Expenses() {
  const { expenses, addExpense, deleteExpense } = useStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const perPage = 10;

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const thisMonth = expenses.filter(e => { const d = new Date(e.date); const now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).reduce((s, e) => s + e.amount, 0);

  const filtered = useMemo(() => {
    let result = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (search) { const q = search.toLowerCase(); result = result.filter(e => e.title.toLowerCase().includes(q)); }
    if (categoryFilter) result = result.filter(e => e.category === categoryFilter);
    return result;
  }, [expenses, search, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const categoryLabel = (c: string) => c.charAt(0).toUpperCase() + c.slice(1);

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#F2F3F5]">Expenses</h1>
          <p className="text-sm text-[#6F747C]">{expenses.length} expense records</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}><Plus size={13} /> Add Expense</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Total Expenses" value={formatCurrency(totalExpenses)} icon={<Receipt size={14} />} />
        <StatCard label="This Month" value={formatCurrency(thisMonth)} />
        <StatCard label="Categories" value={new Set(expenses.map(e => e.category)).size.toString()} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search expenses..." className="w-full sm:w-64" />
        <Select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
          options={[{ value: '', label: 'All Categories' }, { value: 'rent', label: 'Rent' }, { value: 'utilities', label: 'Utilities' }, { value: 'salaries', label: 'Salaries' }, { value: 'marketing', label: 'Marketing' }, { value: 'transport', label: 'Transport' }, { value: 'software', label: 'Software' }, { value: 'maintenance', label: 'Maintenance' }, { value: 'other', label: 'Other' }]} className="w-40" />
      </div>

      <div className="bg-[#101214] border border-[#25282C] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#25282C]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Category</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(e => (
                <tr key={e.id} className="border-b border-[#1E2024] hover:bg-[#0D0E10] transition-default">
                  <td className="px-4 py-3">
                    <p className="text-[#F2F3F5] font-medium">{e.title}</p>
                    {e.notes && <p className="text-[10px] text-[#6F747C] mt-0.5">{e.notes}</p>}
                  </td>
                  <td className="px-4 py-3"><Badge variant="default">{categoryLabel(e.category)}</Badge></td>
                  <td className="px-4 py-3 text-right font-medium text-[#F2F3F5]">{formatCurrency(e.amount)}</td>
                  <td className="px-4 py-3 text-[#9A9EA5] text-xs capitalize">{e.paymentMethod.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-[#6F747C] text-xs">{formatDate(e.date)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDeleteId(e.id)} className="p-1 rounded hover:bg-[#1A1C1F] text-[#6F747C] hover:text-[#F87171]"><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showForm && <ExpenseForm onClose={() => setShowForm(false)} onSave={(data) => { addExpense(data as any); setShowForm(false); setToast('Expense added'); setTimeout(() => setToast(''), 3000); }} />}
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteExpense(deleteId); setToast('Expense deleted'); setTimeout(() => setToast(''), 3000); } }}
        title="Delete Expense" message="Are you sure you want to delete this expense?" confirmText="Delete" danger />
      {toast && <div className="fixed bottom-4 right-4 z-[100] px-4 py-3 rounded-lg border border-[#064E2B] bg-[#052E16] animate-fade-in"><span className="text-sm font-medium text-[#34D399]">{toast}</span></div>}
    </div>
  );
}

function ExpenseForm({ onClose, onSave }: { onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    title: '', category: 'other' as const, amount: '', date: new Date().toISOString().split('T')[0],
    paymentMethod: 'bank_transfer' as const, notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Required';
    if (!form.amount || parseFloat(form.amount) <= 0) errs.amount = 'Must be positive';
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSave({ ...form, amount: parseFloat(form.amount) });
  };

  return (
    <Modal open={true} onClose={onClose} title="Add Expense" size="md" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add Expense</Button>
      </>
    }>
      <div className="space-y-4">
        <Input label="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} error={errors.title} placeholder="e.g. Office supplies" />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as any })}
            options={[{ value: 'rent', label: 'Rent' }, { value: 'utilities', label: 'Utilities' }, { value: 'salaries', label: 'Salaries' }, { value: 'marketing', label: 'Marketing' }, { value: 'transport', label: 'Transport' }, { value: 'software', label: 'Software' }, { value: 'maintenance', label: 'Maintenance' }, { value: 'other', label: 'Other' }]} />
          <Select label="Payment Method" value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value as any })}
            options={[{ value: 'cash', label: 'Cash' }, { value: 'bank_transfer', label: 'Bank Transfer' }, { value: 'upi', label: 'UPI' }, { value: 'card', label: 'Card' }]} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Amount (₹) *" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} error={errors.amount} />
          <Input label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        </div>
        <Input label="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes..." />
      </div>
    </Modal>
  );
}
