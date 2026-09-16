import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Customer } from '../types';
import { Button, Input, Badge, Modal, ConfirmDialog, SearchInput, Pagination, formatCurrency, formatDate, Dropdown } from '../components/ui';
import { Plus, MoreHorizontal, Edit2, Trash2, Users } from 'lucide-react';

export function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const perPage = 10;

  const filtered = useMemo(() => {
    let result = [...customers];
    if (search) { const q = search.toLowerCase(); result = result.filter(c => c.name.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)); }
    return result;
  }, [customers, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#F2F3F5]">Customers</h1>
          <p className="text-sm text-[#6F747C]">{customers.length} customers</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={13} /> Add Customer</Button>
      </div>

      <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search customers..." className="w-full sm:w-64" />

      <div className="bg-[#101214] border border-[#25282C] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#25282C]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Company</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Phone</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Purchases</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Outstanding</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(c => (
                <tr key={c.id} className="border-b border-[#1E2024] hover:bg-[#0D0E10] transition-default">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#1A1C1F] border border-[#25282C] flex items-center justify-center text-[10px] font-medium text-[#9A9EA5]">{c.name.charAt(0)}</div>
                      <span className="font-medium text-[#F2F3F5]">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#9A9EA5]">{c.company || '-'}</td>
                  <td className="px-4 py-3 text-[#9A9EA5] text-xs">{c.email}</td>
                  <td className="px-4 py-3 text-[#9A9EA5] text-xs">{c.phone}</td>
                  <td className="px-4 py-3 text-right text-[#F2F3F5]">{formatCurrency(c.totalPurchases)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={c.outstandingBalance > 0 ? 'text-[#FBBF24]' : 'text-[#6F747C]'}>{formatCurrency(c.outstandingBalance)}</span>
                  </td>
                  <td className="px-4 py-3"><Badge variant={c.status === 'active' ? 'success' : 'neutral'}>{c.status}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <Dropdown trigger={<button className="p-1 rounded hover:bg-[#1A1C1F] text-[#6F747C]"><MoreHorizontal size={14} /></button>}
                      items={[
                        { label: 'Edit', icon: <Edit2 size={13} />, onClick: () => { setEditing(c); setShowForm(true); } },
                        { label: 'Delete', icon: <Trash2 size={13} />, onClick: () => setDeleteId(c.id), danger: true },
                      ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showForm && <CustomerForm customer={editing} onClose={() => setShowForm(false)} onSave={(data) => {
        if (editing) { updateCustomer(editing.id, data); setToast('Customer updated'); }
        else { addCustomer(data as any); setToast('Customer created'); }
        setShowForm(false); setTimeout(() => setToast(''), 3000);
      }} />}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteCustomer(deleteId); setToast('Customer deleted'); setTimeout(() => setToast(''), 3000); } }}
        title="Delete Customer" message="Are you sure? This will remove the customer record." confirmText="Delete" danger />
      {toast && <div className="fixed bottom-4 right-4 z-[100] px-4 py-3 rounded-lg border border-[#064E2B] bg-[#052E16] animate-fade-in"><span className="text-sm font-medium text-[#34D399]">{toast}</span></div>}
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
    <Modal open={true} onClose={onClose} title={customer ? 'Edit Customer' : 'Add Customer'} size="md" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{customer ? 'Update' : 'Create'}</Button>
      </>
    }>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={errors.name} />
          <Input label="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
          <Input label="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} error={errors.email} />
          <Input label="Phone *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
          <Input label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          <Input label="GSTIN" value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} />
        </div>
      </div>
    </Modal>
  );
}
