import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Button, Input, Select, Badge, Modal, SearchInput, Pagination, formatCurrency, formatDate, Dropdown, Metric } from '../components/ui';
import { Plus, MoreHorizontal, Truck } from 'lucide-react';
import { PurchaseItem } from '../types';

export function Purchases() {
  const { purchases, products, suppliers, createPurchase, updatePurchaseStatus } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const perPage = 15;

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

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[#EFEFF1] tracking-tight">Purchases</h1>
          <p className="text-[13px] text-[#6B6B76] mt-0.5">{purchases.length} purchase orders</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}><Plus size={12} /> New purchase</Button>
      </div>

      <div className="grid grid-cols-3 gap-x-8 gap-y-5 pb-5 mb-5 border-b border-[#1A1A1D]">
        <Metric label="Total value" value={formatCurrency(totalValue)} />
        <Metric label="Received" value={`${received}/${purchases.length}`} hint="Orders fulfilled" trend="up" />
        <Metric label="Pending" value={(purchases.filter(p => p.status === 'ordered').length).toString()} hint="Awaiting delivery" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search purchases..." className="w-64" />
        <Select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          options={[{ value: '', label: 'All status' }, { value: 'draft', label: 'Draft' }, { value: 'ordered', label: 'Ordered' }, { value: 'received', label: 'Received' }, { value: 'cancelled', label: 'Cancelled' }]} className="w-32" />
      </div>

      <div className="border border-[#1A1A1D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#1A1A1D]">
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">PO</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Supplier</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Items</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium text-[#6B6B76]">Total</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Status</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Date</th>
                <th className="px-3 py-2.5 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => (
                <tr key={p.id} className="border-b border-[#1A1A1D] last:border-0 hover:bg-[#111113] transition-colors">
                  <td className="px-3 py-2 font-mono text-[11px] text-[#A1A1AA]">{p.purchaseNumber}</td>
                  <td className="px-3 py-2 text-[#EFEFF1]">{p.supplierName}</td>
                  <td className="px-3 py-2 text-[#6B6B76]">{p.items.length}</td>
                  <td className="px-3 py-2 text-right text-[#EFEFF1] font-medium tabular-nums">{formatCurrency(p.total)}</td>
                  <td className="px-3 py-2"><Badge variant={p.status === 'received' ? 'success' : p.status === 'ordered' ? 'info' : p.status === 'cancelled' ? 'error' : 'neutral'}>{p.status.replace('_', ' ')}</Badge></td>
                  <td className="px-3 py-2 text-[#6B6B76]">{formatDate(p.date)}</td>
                  <td className="px-3 py-2 text-right">
                    <Dropdown trigger={<button className="p-1 rounded hover:bg-[#1C1C1F] text-[#6B6B76]"><MoreHorizontal size={13} /></button>}
                      items={[
                        ...(p.status === 'ordered' ? [{ label: 'Mark received', icon: <Truck size={12} />, onClick: () => { updatePurchaseStatus(p.id, 'received'); setToast('Purchase received - stock updated'); setTimeout(() => setToast(''), 3000); } }] : []),
                        ...(p.status === 'draft' ? [{ label: 'Mark ordered', icon: <Truck size={12} />, onClick: () => updatePurchaseStatus(p.id, 'ordered') }] : []),
                      ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showCreate && <CreatePurchaseModal onClose={() => setShowCreate(false)} products={products} suppliers={suppliers} createPurchase={createPurchase} onSuccess={(msg: string) => { setToast(msg); setShowCreate(false); setTimeout(() => setToast(''), 3000); }} />}
      {toast && <div className="fixed bottom-4 right-4 z-[100] px-3 py-2 rounded-md bg-[#161618] border border-[#242428] animate-toast"><span className="text-[12px] font-medium text-[#4ADE80]">{toast}</span></div>}
    </div>
  );
}

function CreatePurchaseModal({ onClose, products, suppliers, createPurchase, onSuccess }: any) {
  const [supplierId, setSupplierId] = useState('');
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [qty, setQty] = useState('1');
  const [costPrice, setCostPrice] = useState('');
  const [error, setError] = useState('');

  const addItem = () => {
    if (!selectedProduct || !costPrice) return;
    const product = products.find((p: any) => p.id === selectedProduct);
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
    const supplier = suppliers.find((s: any) => s.id === supplierId);
    const num = createPurchase({
      supplierId, supplierName: supplier?.company || '', items, subtotal, tax, discount: 0, total: grandTotal,
      status: 'ordered' as const, date: new Date().toISOString().split('T')[0],
    });
    onSuccess(`Purchase ${num} created`);
  };

  return (
    <Modal open={true} onClose={onClose} title="New purchase" size="xl" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Create</Button>
      </>
    }>
      <div className="space-y-3">
        <Select label="Supplier" value={supplierId} onChange={e => setSupplierId(e.target.value)}
          options={[{ value: '', label: 'Select...' }, ...suppliers.filter((s: any) => s.status === 'active').map((s: any) => ({ value: s.id, label: s.company }))]} />
        <div className="p-3 bg-[#0B0B0C] rounded-md border border-[#1A1A1D]">
          <div className="grid grid-cols-4 gap-2">
            <Select value={selectedProduct} onChange={e => { setSelectedProduct(e.target.value); const p = products.find((pr: any) => pr.id === e.target.value); if (p) setCostPrice(p.costPrice.toString()); }}
              options={[{ value: '', label: 'Product...' }, ...products.map((p: any) => ({ value: p.id, label: p.name }))]} />
            <Input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="Qty" />
            <Input type="number" value={costPrice} onChange={e => setCostPrice(e.target.value)} placeholder="Cost" />
            <Button size="sm" onClick={addItem}><Plus size={12} /> Add</Button>
          </div>
          {error && <p className="text-[11px] text-[#F87171] mt-2">{error}</p>}
        </div>
        {items.length > 0 && (
          <div className="border border-[#1A1A1D] rounded-md overflow-hidden">
            <table className="w-full text-[12px]">
              <thead><tr className="border-b border-[#1A1A1D] bg-[#0B0B0C]">
                <th className="px-2.5 py-1.5 text-left text-[10px] text-[#6B6B76]">Product</th>
                <th className="px-2.5 py-1.5 text-right text-[10px] text-[#6B6B76]">Qty</th>
                <th className="px-2.5 py-1.5 text-right text-[10px] text-[#6B6B76]">Cost</th>
                <th className="px-2.5 py-1.5 text-right text-[10px] text-[#6B6B76]">Total</th>
                <th className="px-2.5 py-1.5 w-6"></th>
              </tr></thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-b border-[#1A1A1D] last:border-0">
                    <td className="px-2.5 py-1.5 text-[#EFEFF1]">{item.productName}</td>
                    <td className="px-2.5 py-1.5 text-right text-[#A1A1AA] font-mono">{item.quantity}</td>
                    <td className="px-2.5 py-1.5 text-right text-[#A1A1AA] tabular-nums">{formatCurrency(item.costPrice)}</td>
                    <td className="px-2.5 py-1.5 text-right text-[#EFEFF1] tabular-nums">{formatCurrency(item.total)}</td>
                    <td className="px-2.5 py-1.5"><button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-[#6B6B76] hover:text-[#F87171] text-[11px]">✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {items.length > 0 && (
          <div className="flex justify-end">
            <div className="w-48 space-y-1">
              <div className="flex justify-between text-[12px]"><span className="text-[#6B6B76]">Subtotal</span><span className="text-[#EFEFF1] tabular-nums">{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-[#6B6B76]">Tax</span><span className="text-[#EFEFF1] tabular-nums">+{formatCurrency(tax)}</span></div>
              <div className="flex justify-between text-[13px] font-semibold pt-1 border-t border-[#1A1A1D]"><span className="text-[#EFEFF1]">Total</span><span className="text-[#EFEFF1] tabular-nums">{formatCurrency(grandTotal)}</span></div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
