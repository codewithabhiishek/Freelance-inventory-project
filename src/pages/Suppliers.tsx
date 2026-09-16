import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Supplier } from '../types';
import { Button, Input, Badge, Modal, ConfirmDialog, SearchInput, Pagination, formatCurrency, Dropdown } from '../components/ui';
import { Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';

export function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const perPage = 15;

  const filtered = useMemo(() => {
    let result = [...suppliers];
    if (search) { const q = search.toLowerCase(); result = result.filter(s => s.name.toLowerCase().includes(q) || s.company.toLowerCase().includes(q)); }
    return result;
  }, [suppliers, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[#EFEFF1] tracking-tight">Suppliers</h1>
          <p className="text-[13px] text-[#6B6B76] mt-0.5">{suppliers.length} suppliers</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={12} /> Add supplier</Button>
      </div>

      <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search suppliers..." className="w-64 mb-4" />

      <div className="border border-[#1A1A1D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#1A1A1D]">
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Company</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Contact</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Email</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium text-[#6B6B76]">Purchases</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium text-[#6B6B76]">Payable</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Status</th>
                <th className="px-3 py-2.5 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(s => (
                <tr key={s.id} className="border-b border-[#1A1A1D] last:border-0 hover:bg-[#111113] transition-colors">
                  <td className="px-3 py-2 text-[#EFEFF1] font-medium">{s.company}</td>
                  <td className="px-3 py-2 text-[#A1A1AA]">{s.name}</td>
                  <td className="px-3 py-2 text-[#6B6B76] text-[12px]">{s.email}</td>
                  <td className="px-3 py-2 text-right text-[#EFEFF1] tabular-nums">{formatCurrency(s.totalPurchases)}</td>
                  <td className="px-3 py-2 text-right tabular-nums"><span className={s.outstandingPayable > 0 ? 'text-[#FBBF24]' : 'text-[#6B6B76]'}>{formatCurrency(s.outstandingPayable)}</span></td>
                  <td className="px-3 py-2"><Badge variant={s.status === 'active' ? 'success' : 'neutral'}>{s.status}</Badge></td>
                  <td className="px-3 py-2 text-right">
                    <Dropdown trigger={<button className="p-1 rounded hover:bg-[#1C1C1F] text-[#6B6B76]"><MoreHorizontal size={13} /></button>}
                      items={[
                        { label: 'Edit', icon: <Edit2 size={12} />, onClick: () => { setEditing(s); setShowForm(true); } },
                        { label: 'Delete', icon: <Trash2 size={12} />, onClick: () => setDeleteId(s.id), danger: true },
                      ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showForm && <SupplierForm supplier={editing} onClose={() => setShowForm(false)} onSave={(data: any) => {
        if (editing) { updateSupplier(editing.id, data); setToast('Supplier updated'); }
        else { addSupplier(data); setToast('Supplier created'); }
        setShowForm(false); setTimeout(() => setToast(''), 3000);
      }} />}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteSupplier(deleteId); setToast('Supplier deleted'); setTimeout(() => setToast(''), 3000); } }}
        title="Delete supplier" message="This will remove the supplier record." confirmText="Delete" danger />
      {toast && <div className="fixed bottom-4 right-4 z-[100] px-3 py-2 rounded-md bg-[#161618] border border-[#242428] animate-toast"><span className="text-[12px] font-medium text-[#4ADE80]">{toast}</span></div>}
    </div>
  );
}

function SupplierForm({ supplier, onClose, onSave }: { supplier: Supplier | null; onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    name: supplier?.name || '', company: supplier?.company || '', email: supplier?.email || '',
    phone: supplier?.phone || '', address: supplier?.address || '', gstin: supplier?.gstin || '',
    productsSupplied: supplier?.productsSupplied || [], totalPurchases: supplier?.totalPurchases || 0,
    outstandingPayable: supplier?.outstandingPayable || 0, status: supplier?.status || 'active' as const,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.company.trim()) errs.company = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    if (!form.phone.trim()) errs.phone = 'Required';
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSave(form);
  };

  return (
    <Modal open={true} onClose={onClose} title={supplier ? 'Edit supplier' : 'Add supplier'} size="md" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{supplier ? 'Update' : 'Create'}</Button>
      </>
    }>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Contact name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={errors.name} />
        <Input label="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} error={errors.company} />
        <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} error={errors.email} />
        <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
        <Input label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        <Input label="GSTIN" value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} />
      </div>
    </Modal>
  );
}
