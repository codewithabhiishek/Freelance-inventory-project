import React, { useState } from 'react';
import { useStore } from '../store';
import { Button, Input, Select, Tabs } from '../components/ui';
import { Save } from 'lucide-react';

export function Settings() {
  const { settings, updateSettings, categories, addCategory, deleteCategory } = useStore();
  const [activeTab, setActiveTab] = useState('company');
  const [form, setForm] = useState({ ...settings });
  const [newCategory, setNewCategory] = useState('');
  const [toast, setToast] = useState('');

  const handleSave = () => {
    updateSettings(form);
    setToast('Settings saved');
    setTimeout(() => setToast(''), 3000);
  };

  const tabs = [
    { key: 'company', label: 'Company' },
    { key: 'invoice', label: 'Invoice' },
    { key: 'categories', label: 'Categories' },
    { key: 'tax', label: 'Tax' },
  ];

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-[20px] font-semibold text-[#EFEFF1] tracking-tight">Settings</h1>
        <p className="text-[13px] text-[#6B6B76] mt-0.5">Manage your business configuration</p>
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="mt-6 max-w-2xl">
        {activeTab === 'company' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Company name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Input label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <Input label="GSTIN" value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} />
            </div>
            <Input label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            <Select label="Currency" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value, currencySymbol: e.target.value === 'INR' ? '₹' : '$' })}
              options={[{ value: 'INR', label: 'INR (₹)' }, { value: 'USD', label: 'USD ($)' }, { value: 'EUR', label: 'EUR (€)' }]} />
            <div className="pt-2">
              <Button onClick={handleSave}><Save size={12} /> Save changes</Button>
            </div>
          </div>
        )}

        {activeTab === 'invoice' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Invoice prefix" value={form.invoicePrefix} onChange={e => setForm({ ...form, invoicePrefix: e.target.value })} />
              <Input label="Next invoice #" value={form.invoiceCounter.toString()} onChange={e => setForm({ ...form, invoiceCounter: parseInt(e.target.value) || 1 })} type="number" />
              <Input label="PO prefix" value={form.purchasePrefix} onChange={e => setForm({ ...form, purchasePrefix: e.target.value })} />
              <Input label="Next PO #" value={form.purchaseCounter.toString()} onChange={e => setForm({ ...form, purchaseCounter: parseInt(e.target.value) || 1 })} type="number" />
            </div>
            <div className="p-3 bg-[#0B0B0C] rounded-md border border-[#1A1A1D]">
              <p className="text-[12px] text-[#6B6B76]">Next invoice: <span className="text-[#EFEFF1] font-mono">{form.invoicePrefix}{String(form.invoiceCounter).padStart(4, '0')}</span></p>
            </div>
            <div className="pt-2">
              <Button onClick={handleSave}><Save size={12} /> Save changes</Button>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-3">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input label="New category" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Category name..." />
              </div>
              <Button onClick={() => { if (newCategory.trim()) { addCategory(newCategory.trim()); setNewCategory(''); setToast('Category added'); setTimeout(() => setToast(''), 3000); } }}>Add</Button>
            </div>
            <div className="space-y-1.5">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-2.5 bg-[#111113] rounded-md border border-[#1A1A1D]">
                  <div>
                    <p className="text-[13px] text-[#EFEFF1]">{cat.name}</p>
                    <p className="text-[11px] text-[#6B6B76]">{cat.productCount} products</p>
                  </div>
                  <button onClick={() => { deleteCategory(cat.id); setToast('Category deleted'); setTimeout(() => setToast(''), 3000); }}
                    className="text-[11px] text-[#6B6B76] hover:text-[#F87171] transition-colors">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tax' && (
          <div className="space-y-3">
            <Input label="Default tax rate (%)" type="number" value={form.taxDefault.toString()} onChange={e => setForm({ ...form, taxDefault: parseFloat(e.target.value) || 0 })} />
            <div className="p-3 bg-[#0B0B0C] rounded-md border border-[#1A1A1D]">
              <p className="text-[12px] text-[#6B6B76]">Applied to new products by default. Individual products can override this.</p>
            </div>
            <div className="pt-2">
              <Button onClick={handleSave}><Save size={12} /> Save changes</Button>
            </div>
          </div>
        )}
      </div>

      {toast && <div className="fixed bottom-4 right-4 z-[100] px-3 py-2 rounded-md bg-[#161618] border border-[#242428] animate-toast"><span className="text-[12px] font-medium text-[#4ADE80]">{toast}</span></div>}
    </div>
  );
}
