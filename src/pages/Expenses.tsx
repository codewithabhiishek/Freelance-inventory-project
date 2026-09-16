import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Button, Input, Select, Badge, Modal, ConfirmDialog, SearchInput, Pagination, formatCurrency, formatDate, Metric } from '../components/ui';
import { Plus, Trash2 } from 'lucide-react';

export function Expenses() {
  const { expenses, addExpense, deleteExpense } = useStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const perPage = 15;

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const filtered = useMemo(() => {
    let result = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (search) { const q = search.toLowerCase(); result = result.filter(e => e.title.toLowerCase().includes(q)); }
    if (categoryFilter) result = result.filter(e => e.category === categoryFilter);
    return result;
  }, [expenses, search, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[#EFEFF1] tracking-tight">Expenses</h1>
          <p className="text-[13px] text-[#6B6B76] mt-0.5">{expenses.length} expense records</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}><Plus size={12} /> Add expense</Button>
      </div>

      <div className="grid grid-cols-3 gap-x-8 gap-y-5 pb-5 mb-5 border-b border-[#1A1A1D]">
        <Metric label="Total expenses" value={formatCurrency(totalExpenses)} />
        <Metric label="This month" value={formatCurrency(expenses.filter(e => { const d = new Date(e.date); const now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).reduce((s, e) => s + e.amount, 0))} />
        <Metric label="Categories" value={new Set(expenses.map(e => e.category)).size.toString()} />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search expenses..." className="w-64" />
        <Select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
          options={[{ value: '', label: 'All categories' }, { value: 'rent', label: 'Rent' }, { value: 'utilities', label: 'Utilities' }, { value: 'salaries', label: 'Salaries' }, { value: 'marketing', label: 'Marketing' }, { value: 'transport', label: 'Transport' }, { value: 'software', label: 'Software' }, { value: 'maintenance', label: 'Maintenance' }, { value: 'other', label: 'Other' }]} className="w-36" />
      </div>

      <div className="border border-[#1A1A1D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#1A1A1D]">
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Title</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Category</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium text-[#6B6B76]">Amount</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Payment</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Date</th>
                <th className="px-3 py-2.5 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(e => (
                <tr key={e.id} className="border-b border-[#1A1A1D] last:border-0 hover:bg-[#111113] transition-colors">
                  <td className="px-3 py-2">
                    <p className="text-[#EFEFF1] font-medium">{e.title}</p>
                    {e.notes && <p className="text-[11px] text-[#6B6B76] mt-0.5">{e.notes}</p>}
                  </td>
                  <td className="px-3 py-2"><Badge variant="default">{e.category}</Badge></td>
                  <td className="px-3 py-2 text-right text-[#EFEFF1] font-medium tabular-nums">{formatCurrency(e.amount)}</td>
                  <td className="px-3 py-2 text-[#A1A1AA] text-[12px] capitalize">{e.paymentMethod.replace('_', ' ')}</td>
                  <td className="px-3 py-2 text-[#6B6B76]">{formatDate(e.date)}</td>
                  <td className="px-3 py-2 text-right">
                    <button onClick={() => setDeleteId(e.id)} className="p-1 rounded hover:bg-[#1C1C1F] text-[#6B6B76] hover:text-[#F87171] transition-colors"><Trash2 size={12} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showForm && <ExpenseForm onClose={() => setShowForm(false)} onSave={(data: any) => { addExpense(data); setShowForm(false); setToast('Expense added'); setTimeout(() => setToast(''), 3000); }} />}
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteExpense(deleteId); setToast('Expense deleted'); setTimeout(() => setToast(''), 3000); } }}
        title="Delete expense" message="Are you sure you want to delete this expense?" confirmText="Delete" danger />
      {toast && <div className="fixed bottom-4 right-4 z-[100] px-3 py-2 rounded-md bg-[#161618] border border-[#242428] animate-toast"><span className="text-[12px] font-medium text-[#4ADE80]">{toast}</span></div>}
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
    <Modal open={true} onClose={onClose} title="Add expense" size="md" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add</Button>
      </>
    }>
      <div className="space-y-3">
        <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} error={errors.title} />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as any })}
            options={[{ value: 'rent', label: 'Rent' }, { value: 'utilities', label: 'Utilities' }, { value: 'salaries', label: 'Salaries' }, { value: 'marketing', label: 'Marketing' }, { value: 'transport', label: 'Transport' }, { value: 'software', label: 'Software' }, { value: 'maintenance', label: 'Maintenance' }, { value: 'other', label: 'Other' }]} />
          <Select label="Payment method" value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value as any })}
            options={[{ value: 'cash', label: 'Cash' }, { value: 'bank_transfer', label: 'Bank transfer' }, { value: 'upi', label: 'UPI' }, { value: 'card', label: 'Card' }]} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Amount (₹)" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} error={errors.amount} />
          <Input label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        </div>
        <Input label="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
      </div>
    </Modal>
  );
}
