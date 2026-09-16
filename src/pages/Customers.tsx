import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Customer } from '../types';
import { Button, Input, Badge, Modal, ConfirmDialog, SearchInput, Pagination, formatCurrency, Dropdown } from '../components/ui';
import { Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';

export function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const perPage = 15;

  const filtered = useMemo(() => {
    let result = [...customers];
    if (search) { const q = search.toLowerCase(); result = result.filter(c => c.name.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)); }
    return result;
  }, [customers, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[#EFEFF1] tracking-tight">Customers</h1>
          <p className="text-[13px] text-[#6B6B76] mt-0.5">{customers.length} customers</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={12} /> Add customer</Button>
      </div>

      <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search customers..." className="w-64 mb-4" />

      <div className="border border-[#1A1A1D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#1A1A1D]">
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Name</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Company</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Email</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium text-[#6B6B76]">Purchases</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium text-[#6B6B76]">Outstanding</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Status</th>
                <th className="px-3 py-2.5 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(c => (
                <tr key={c.id} className="border-b border-[#1A1A1D] last:border-0 hover:bg-[#111113] transition-colors">
                  <td className="px-3 py-2 text-[#EFEFF1] font-medium">{c.name}</td>
                  <td className="px-3 py-2 text-[#A1A1AA]">{c.company || '—'}</td>
                  <td className="px-3 py-2 text-[#6B6B76] text-[12px]">{c.email}</td>
                  <td className="px-3 py-2 text-right text-[#EFEFF1] tabular-nums">{formatCurrency(c.totalPurchases)}</td>
                  <td className="px-3 py-2 text-right tabular-nums"><span className={c.outstandingBalance > 0 ? 'text-[#FBBF24]' : 'text-[#6B6B76]'}>{formatCurrency(c.outstandingBalance)}</span></td>
                  <td className="px-3 py-2"><Badge variant={c.status === 'active' ? 'success' : 'neutral'}>{c.status}</Badge></td>
                  <td className="px-3 py-2 text-right">
                    <Dropdown trigger={<button className="p-1 rounded hover:bg-[#1C1C1F] text-[#6B6B76]"><MoreHorizontal size={13} /></button>}
                      items={[
                        { label: 'Edit', icon: <Edit2 size={12} />, onClick: () => { setEditing(c); setShowForm(true); } },
                        { label: 'Delete', icon: <Trash2 size={12} />, onClick: () => setDeleteId(c.id), danger: true },
                      ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showForm && <CustomerForm customer={editing} onClose={() => setShowForm(false)} onSave={(data: any) => {
        if (editing) { updateCustomer(editing.id, data); setToast('Customer updated'); }
        else { addCustomer(data); setToast('Customer created'); }
        setShowForm(false); setTimeout(() => setToast(''), 3000);
      }} />}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteCustomer(deleteId); setToast('Customer deleted'); setTimeout(() => setToast(''), 3000); } }}
        title="Delete customer" message="This will remove the customer record." confirmText="Delete" danger />
      {toast && <div className="fixed bottom-4 right-4 z-[100] px-3 py-2 rounded-md bg-[#161618] border border-[#242428] animate-toast"><span className="text-[12px] font-medium text-[#4ADE80]">{toast}</span></div>}
    </div>
  );
}

function CustomerForm({ customer, onClose, onSave }: { customer: Customer | null; onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    name: customer?.name || '', company: customer?.company || '', email: customer?.email || '',
    phone: customer?.phone || '', address: customer?.address || '', gstin: customer?.gstin || '',
    status: customer?.status || 'active' as const, totalPurchases: customer?.totalPurchases || 0,
    outstandingBalance: customer?.outstandingBalance || 0, lastPurchase: customer?.lastPurchase || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    if (!form.phone.trim()) errs.phone = 'Required';
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSave(form);
  };

  return (
    <Modal open={true} onClose={onClose} title={customer ? 'Edit customer' : 'Add customer'} size="md" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{customer ? 'Update' : 'Create'}</Button>
      </>
    }>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={errors.name} />
        <Input label="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
        <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} error={errors.email} />
        <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
        <Input label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        <Input label="GSTIN" value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} />
      </div>
    </Modal>
  );
}
