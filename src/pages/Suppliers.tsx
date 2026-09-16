import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Supplier } from '../types';
import { Button, Input, Badge, Modal, ConfirmDialog, SearchInput, Pagination, formatCurrency, Dropdown } from '../components/ui';
import { Plus, MoreHorizontal, Edit2, Trash2, Building2 } from 'lucide-react';

export function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const perPage = 10;

  const filtered = useMemo(() => {
    let result = [...suppliers];
    if (search) { const q = search.toLowerCase(); result = result.filter(s => s.name.toLowerCase().includes(q) || s.company.toLowerCase().includes(q)); }
    return result;
  }, [suppliers, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#F2F3F5]">Suppliers</h1>
          <p className="text-sm text-[#6F747C]">{suppliers.length} suppliers</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={13} /> Add Supplier</Button>
      </div>

      <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search suppliers..." className="w-full sm:w-64" />

      <div className="bg-[#101214] border border-[#25282C] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#25282C]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Company</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Phone</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Total Purchases</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Payable</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(s => (
                <tr key={s.id} className="border-b border-[#1E2024] hover:bg-[#0D0E10] transition-default">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-[#1A1C1F] border border-[#25282C] flex items-center justify-center"><Building2 size={12} className="text-[#6F747C]" /></div>
                      <div>
                        <p className="font-medium text-[#F2F3F5]">{s.company}</p>
                        <p className="text-[10px] text-[#6F747C]">{s.productsSupplied.length} products</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#9A9EA5]">{s.name}</td>
                  <td className="px-4 py-3 text-[#9A9EA5] text-xs">{s.email}</td>
                  <td className="px-4 py-3 text-[#9A9EA5] text-xs">{s.phone}</td>
                  <td className="px-4 py-3 text-right text-[#F2F3F5]">{formatCurrency(s.totalPurchases)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={s.outstandingPayable > 0 ? 'text-[#FBBF24]' : 'text-[#6F747C]'}>{formatCurrency(s.outstandingPayable)}</span>
                  </td>
                  <td className="px-4 py-3"><Badge variant={s.status === 'active' ? 'success' : 'neutral'}>{s.status}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <Dropdown trigger={<button className="p-1 rounded hover:bg-[#1A1C1F] text-[#6F747C]"><MoreHorizontal size={14} /></button>}
                      items={[
                        { label: 'Edit', icon: <Edit2 size={13} />, onClick: () => { setEditing(s); setShowForm(true); } },
                        { label: 'Delete', icon: <Trash2 size={13} />, onClick: () => setDeleteId(s.id), danger: true },
                      ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showForm && <SupplierForm supplier={editing} onClose={() => setShowForm(false)} onSave={(data) => {
        if (editing) { updateSupplier(editing.id, data); setToast('Supplier updated'); }
        else { addSupplier(data as any); setToast('Supplier created'); }
        setShowForm(false); setTimeout(() => setToast(''), 3000);
      }} />}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteSupplier(deleteId); setToast('Supplier deleted'); setTimeout(() => setToast(''), 3000); } }}
        title="Delete Supplier" message="Are you sure? This will remove the supplier record." confirmText="Delete" danger />
      {toast && <div className="fixed bottom-4 right-4 z-[100] px-4 py-3 rounded-lg border border-[#064E2B] bg-[#052E16] animate-fade-in"><span className="text-sm font-medium text-[#34D399]">{toast}</span></div>}
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
    <Modal open={true} onClose={onClose} title={supplier ? 'Edit Supplier' : 'Add Supplier'} size="md" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{supplier ? 'Update' : 'Create'}</Button>
      </>
    }>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Contact Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={errors.name} />
          <Input label="Company *" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} error={errors.company} />
          <Input label="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} error={errors.email} />
          <Input label="Phone *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
          <Input label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          <Input label="GSTIN" value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} />
        </div>
      </div>
    </Modal>
  );
}
