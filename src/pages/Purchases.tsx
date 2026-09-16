import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { PurchaseItem } from '../types';
import { Button, Input, Select, Badge, Modal, SearchInput, Pagination, formatCurrency, formatDate, StatCard, Dropdown } from '../components/ui';
import { Plus, Truck, MoreHorizontal, Package } from 'lucide-react';

export function Purchases() {
  const { purchases, products, suppliers, createPurchase, updatePurchaseStatus } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const perPage = 10;

  const totalValue = purchases.reduce((s, p) => s + p.total, 0);
  const received = purchases.filter(p => p.status === 'received').length;

  const filtered = useMemo(() => {
    let result = [...purchases].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (search) { const q = search.toLowerCase(); result = result.filter(p => p.purchaseNumber.toLowerCase().includes(q) || p.supplierName.toLowerCase().includes(q)); }
    if (statusFilter) result = result.filter(p => p.status === statusFilter);
    return result;
  }, [purchases, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const statusVariant = (s: string) => {
    switch (s) { case 'received': return 'success'; case 'ordered': return 'info'; case 'draft': return 'neutral'; case 'partially_received': return 'warning'; case 'cancelled': return 'error'; default: return 'default'; }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#F2F3F5]">Purchases</h1>
          <p className="text-sm text-[#6F747C]">{purchases.length} purchase orders</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}><Plus size={13} /> New Purchase</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Total Value" value={formatCurrency(totalValue)} icon={<Package size={14} />} />
        <StatCard label="Received" value={`${received}/${purchases.length}`} change="Orders fulfilled" changeType="up" />
        <StatCard label="Pending" value={(purchases.filter(p => p.status === 'ordered').length).toString()} change="Awaiting delivery" />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search purchases..." className="w-full sm:w-64" />
        <Select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          options={[{ value: '', label: 'All Status' }, { value: 'draft', label: 'Draft' }, { value: 'ordered', label: 'Ordered' }, { value: 'received', label: 'Received' }, { value: 'cancelled', label: 'Cancelled' }]} className="w-36" />
      </div>

      <div className="bg-[#101214] border border-[#25282C] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#25282C]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">PO Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Supplier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Items</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => (
                <tr key={p.id} className="border-b border-[#1E2024] hover:bg-[#0D0E10] transition-default">
                  <td className="px-4 py-3 font-mono text-xs text-[#F2F3F5]">{p.purchaseNumber}</td>
                  <td className="px-4 py-3 text-[#F2F3F5]">{p.supplierName}</td>
                  <td className="px-4 py-3 text-[#9A9EA5]">{p.items.length} items</td>
                  <td className="px-4 py-3 text-right font-medium text-[#F2F3F5]">{formatCurrency(p.total)}</td>
                  <td className="px-4 py-3"><Badge variant={statusVariant(p.status) as any}>{p.status.replace('_', ' ')}</Badge></td>
                  <td className="px-4 py-3 text-[#6F747C] text-xs">{formatDate(p.date)}</td>
                  <td className="px-4 py-3 text-right">
                    <Dropdown trigger={<button className="p-1 rounded hover:bg-[#1A1C1F] text-[#6F747C]"><MoreHorizontal size={14} /></button>}
                      items={[
                        ...(p.status === 'ordered' ? [{ label: 'Mark Received', icon: <Truck size={13} />, onClick: () => { updatePurchaseStatus(p.id, 'received'); setToast('Purchase marked as received - stock updated'); setTimeout(() => setToast(''), 3000); } }] : []),
                        ...(p.status === 'draft' ? [{ label: 'Mark Ordered', icon: <Truck size={13} />, onClick: () => updatePurchaseStatus(p.id, 'ordered') }] : []),
                        ...(p.status !== 'received' && p.status !== 'cancelled' ? [{ label: 'Cancel', icon: <Package size={13} />, onClick: () => updatePurchaseStatus(p.id, 'cancelled'), danger: true }] : []),
                      ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showCreate && <CreatePurchaseModal onClose={() => setShowCreate(false)} products={products} suppliers={suppliers} createPurchase={createPurchase} onSuccess={(msg) => { setToast(msg); setShowCreate(false); setTimeout(() => setToast(''), 3000); }} />}
      {toast && <div className="fixed bottom-4 right-4 z-[100] px-4 py-3 rounded-lg border border-[#064E2B] bg-[#052E16] animate-fade-in"><span className="text-sm font-medium text-[#34D399]">{toast}</span></div>}
    </div>
  );
}

function CreatePurchaseModal({ onClose, products, suppliers, createPurchase, onSuccess }: {
  onClose: () => void; products: any[]; suppliers: any[]; createPurchase: any; onSuccess: (msg: string) => void;
}) {
  const [supplierId, setSupplierId] = useState('');
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [qty, setQty] = useState('1');
  const [costPrice, setCostPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const addItem = () => {
    if (!selectedProduct || !costPrice) return;
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;
    const quantity = parseInt(qty) || 1;
    const price = parseFloat(costPrice);
    const tax = price * quantity * (product.taxRate / 100);
    const total = price * quantity + tax;
    setItems([...items, { productId: product.id, productName: product.name, quantity, costPrice: price, taxRate: product.taxRate, total }]);
    setSelectedProduct(''); setQty('1'); setCostPrice(''); setError('');
  };

  const subtotal = items.reduce((s, i) => s + (i.costPrice * i.quantity), 0);
  const tax = items.reduce((s, i) => s + (i.costPrice * i.quantity * i.taxRate / 100), 0);
  const grandTotal = subtotal + tax;

  const handleSubmit = () => {
    if (!supplierId) { setError('Select a supplier'); return; }
    if (items.length === 0) { setError('Add at least one item'); return; }
    const supplier = suppliers.find(s => s.id === supplierId);
    const num = createPurchase({
      supplierId, supplierName: supplier?.company || '', items, subtotal, tax, discount: 0, total: grandTotal,
      status: 'ordered' as const, date: new Date().toISOString().split('T')[0], notes,
    });
    onSuccess(`Purchase ${num} created`);
  };

  return (
    <Modal open={true} onClose={onClose} title="New Purchase Order" size="xl" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Create Purchase</Button>
      </>
    }>
      <div className="space-y-4">
        <Select label="Supplier *" value={supplierId} onChange={e => setSupplierId(e.target.value)}
          options={[{ value: '', label: 'Select supplier...' }, ...suppliers.filter(s => s.status === 'active').map(s => ({ value: s.id, label: s.company }))]} />
        <div className="p-3 bg-[#151719] rounded-md border border-[#25282C] space-y-3">
          <p className="text-xs font-medium text-[#9A9EA5]">Add Products</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <Select value={selectedProduct} onChange={e => { setSelectedProduct(e.target.value); const p = products.find(pr => pr.id === e.target.value); if (p) setCostPrice(p.costPrice.toString()); }}
              options={[{ value: '', label: 'Select product...' }, ...products.map(p => ({ value: p.id, label: p.name }))]} />
            <Input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="Qty" min="1" />
            <Input type="number" value={costPrice} onChange={e => setCostPrice(e.target.value)} placeholder="Cost price" />
            <Button size="sm" onClick={addItem}><Plus size={13} /> Add</Button>
          </div>
          {error && <p className="text-xs text-[#F87171]">{error}</p>}
        </div>
        {items.length > 0 && (
          <div className="border border-[#25282C] rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#25282C] bg-[#151719]">
                <th className="px-3 py-2 text-left text-xs text-[#6F747C]">Product</th>
                <th className="px-3 py-2 text-right text-xs text-[#6F747C]">Qty</th>
                <th className="px-3 py-2 text-right text-xs text-[#6F747C]">Cost</th>
                <th className="px-3 py-2 text-right text-xs text-[#6F747C]">Total</th>
                <th className="px-3 py-2 w-8"></th>
              </tr></thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-b border-[#1E2024]">
                    <td className="px-3 py-2 text-[#F2F3F5]">{item.productName}</td>
                    <td className="px-3 py-2 text-right text-[#9A9EA5]">{item.quantity}</td>
                    <td className="px-3 py-2 text-right text-[#9A9EA5]">{formatCurrency(item.costPrice)}</td>
                    <td className="px-3 py-2 text-right text-[#F2F3F5]">{formatCurrency(item.total)}</td>
                    <td className="px-3 py-2"><button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-[#6F747C] hover:text-[#F87171] text-xs">✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {items.length > 0 && (
          <div className="flex justify-end">
            <div className="w-56 space-y-1.5">
              <div className="flex justify-between text-sm"><span className="text-[#6F747C]">Subtotal</span><span className="text-[#F2F3F5]">{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#6F747C]">Tax</span><span className="text-[#F2F3F5]">+{formatCurrency(tax)}</span></div>
              <div className="flex justify-between text-sm font-semibold pt-1.5 border-t border-[#25282C]"><span className="text-[#F2F3F5]">Total</span><span className="text-[#F2F3F5]">{formatCurrency(grandTotal)}</span></div>
            </div>
          </div>
        )}
        <Input label="Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Purchase notes..." />
      </div>
    </Modal>
  );
}
