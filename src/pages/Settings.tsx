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
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold text-[#F2F3F5]">Settings</h1>
        <p className="text-sm text-[#6F747C]">Manage your business configuration</p>
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'company' && (
        <div className="bg-[#101214] border border-[#25282C] rounded-lg p-5 space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Company Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <Input label="GSTIN" value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} />
          </div>
          <Input label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Currency" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value, currencySymbol: e.target.value === 'INR' ? '₹' : '$' })}
              options={[{ value: 'INR', label: 'INR (₹)' }, { value: 'USD', label: 'USD ($)' }, { value: 'EUR', label: 'EUR (€)' }, { value: 'GBP', label: 'GBP (£)' }]} />
          </div>
          <div className="pt-2">
            <Button onClick={handleSave}><Save size={13} /> Save Changes</Button>
          </div>
        </div>
      )}

      {activeTab === 'invoice' && (
        <div className="bg-[#101214] border border-[#25282C] rounded-lg p-5 space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Invoice Prefix" value={form.invoicePrefix} onChange={e => setForm({ ...form, invoicePrefix: e.target.value })} />
            <Input label="Next Invoice #" value={form.invoiceCounter.toString()} onChange={e => setForm({ ...form, invoiceCounter: parseInt(e.target.value) || 1 })} type="number" />
            <Input label="Purchase Order Prefix" value={form.purchasePrefix} onChange={e => setForm({ ...form, purchasePrefix: e.target.value })} />
            <Input label="Next PO #" value={form.purchaseCounter.toString()} onChange={e => setForm({ ...form, purchaseCounter: parseInt(e.target.value) || 1 })} type="number" />
          </div>
          <div className="p-3 bg-[#151719] rounded-md border border-[#25282C]">
            <p className="text-xs text-[#6F747C]">Preview: Next invoice will be <span className="text-[#F2F3F5] font-mono">{form.invoicePrefix}{String(form.invoiceCounter).padStart(4, '0')}</span></p>
          </div>
          <div className="pt-2">
            <Button onClick={handleSave}><Save size={13} /> Save Changes</Button>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="bg-[#101214] border border-[#25282C] rounded-lg p-5 space-y-4 max-w-2xl">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input label="New Category" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Category name..." />
            </div>
            <Button onClick={() => { if (newCategory.trim()) { addCategory(newCategory.trim()); setNewCategory(''); setToast('Category added'); setTimeout(() => setToast(''), 3000); } }}>Add</Button>
          </div>
          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-[#151719] rounded-md border border-[#25282C]">
                <div>
                  <p className="text-sm text-[#F2F3F5]">{cat.name}</p>
                  <p className="text-[10px] text-[#6F747C]">{cat.productCount} products{cat.description ? ` • ${cat.description}` : ''}</p>
                </div>
                <button onClick={() => { deleteCategory(cat.id); setToast('Category deleted'); setTimeout(() => setToast(''), 3000); }}
                  className="text-xs text-[#6F747C] hover:text-[#F87171] transition-default">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tax' && (
        <div className="bg-[#101214] border border-[#25282C] rounded-lg p-5 space-y-4 max-w-2xl">
          <Input label="Default Tax Rate (%)" type="number" value={form.taxDefault.toString()} onChange={e => setForm({ ...form, taxDefault: parseFloat(e.target.value) || 0 })} />
          <div className="p-3 bg-[#151719] rounded-md border border-[#25282C]">
            <p className="text-xs text-[#6F747C]">This rate will be applied to new products by default. Individual products can override this.</p>
          </div>
          <div className="pt-2">
            <Button onClick={handleSave}><Save size={13} /> Save Changes</Button>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-4 right-4 z-[100] px-4 py-3 rounded-lg border border-[#064E2B] bg-[#052E16] animate-fade-in"><span className="text-sm font-medium text-[#34D399]">{toast}</span></div>}
    </div>
  );
}
