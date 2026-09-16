import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Metric, Badge, Button, Input, Select, Modal, SearchInput, Pagination, formatCurrency, formatDate } from '../components/ui';
import { ArrowUpDown } from 'lucide-react';

export function Inventory() {
  const { products, inventoryTransactions, adjustStock } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAdjust, setShowAdjust] = useState(false);
  const [adjustProduct, setAdjustProduct] = useState('');
  const [adjustType, setAdjustType] = useState<'stock_in' | 'stock_out' | 'damage' | 'return' | 'adjustment'>('stock_in');
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const perPage = 15;

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const inventoryValue = products.reduce((s, p) => s + (p.stock * p.costPrice), 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) { const q = search.toLowerCase(); result = result.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)); }
    if (statusFilter === 'low') result = result.filter(p => p.stock > 0 && p.stock <= p.minStock);
    else if (statusFilter === 'out') result = result.filter(p => p.stock === 0);
    else if (statusFilter === 'ok') result = result.filter(p => p.stock > p.minStock);
    return result;
  }, [products, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleAdjust = () => {
    if (!adjustProduct || !adjustQty || parseInt(adjustQty) <= 0) return;
    adjustStock(adjustProduct, adjustType, parseInt(adjustQty), adjustReason || 'Manual adjustment');
    setShowAdjust(false); setAdjustProduct(''); setAdjustQty(''); setAdjustReason('');
    setToast('Stock adjusted'); setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[#EFEFF1] tracking-tight">Inventory</h1>
          <p className="text-[13px] text-[#6B6B76] mt-0.5">Track stock levels and adjustments</p>
        </div>
        <Button size="sm" onClick={() => setShowAdjust(true)}><ArrowUpDown size={12} /> Adjust stock</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5 pb-5 mb-5 border-b border-[#1A1A1D]">
        <Metric label="Total stock" value={totalStock.toLocaleString()} />
        <Metric label="Inventory value" value={formatCurrency(inventoryValue)} />
        <Metric label="Low stock" value={lowStockCount.toString()} hint="Needs attention" trend="down" />
        <Metric label="Out of stock" value={outOfStockCount.toString()} hint="Requires reorder" trend="down" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search inventory..." className="w-64" />
        <Select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          options={[{ value: '', label: 'All status' }, { value: 'ok', label: 'In stock' }, { value: 'low', label: 'Low stock' }, { value: 'out', label: 'Out of stock' }]} className="w-32" />
      </div>

      <div className="border border-[#1A1A1D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#1A1A1D]">
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Product</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">SKU</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium text-[#6B6B76]">Current</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium text-[#6B6B76]">Min</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Status</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium text-[#6B6B76]">Value</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => {
                const status = p.stock === 0 ? 'out' : p.stock <= p.minStock ? 'low' : 'ok';
                return (
                  <tr key={p.id} className="border-b border-[#1A1A1D] last:border-0 hover:bg-[#111113] transition-colors">
                    <td className="px-3 py-2 text-[#EFEFF1] font-medium">{p.name}</td>
                    <td className="px-3 py-2 text-[#6B6B76] font-mono text-[11px]">{p.sku}</td>
                    <td className="px-3 py-2 text-right text-[#EFEFF1] font-mono tabular-nums">{p.stock}</td>
                    <td className="px-3 py-2 text-right text-[#6B6B76] font-mono tabular-nums">{p.minStock}</td>
                    <td className="px-3 py-2"><Badge variant={status === 'out' ? 'error' : status === 'low' ? 'warning' : 'success'}>{status === 'out' ? 'Out of stock' : status === 'low' ? 'Low stock' : 'In stock'}</Badge></td>
                    <td className="px-3 py-2 text-right text-[#A1A1AA] tabular-nums">{formatCurrency(p.stock * p.costPrice)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* Activity */}
      <div className="mt-8">
        <h2 className="text-[14px] font-semibold text-[#EFEFF1] mb-3">Recent activity</h2>
        <div className="divide-y divide-[#1A1A1D]">
          {inventoryTransactions.slice(0, 8).map(t => (
            <div key={t.id} className="py-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-1.5 h-1.5 rounded-full ${t.type === 'stock_in' || t.type === 'return' ? 'bg-[#4ADE80]' : 'bg-[#F87171]'}`} />
                <div>
                  <p className="text-[13px] text-[#EFEFF1]">{t.productName}</p>
                  <p className="text-[11px] text-[#6B6B76]">{t.reason} · {t.performedBy}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-[13px] font-mono tabular-nums ${t.type === 'stock_in' || t.type === 'return' ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                  {t.type === 'stock_in' || t.type === 'return' ? '+' : '−'}{t.quantity}
                </p>
                <p className="text-[11px] text-[#6B6B76]">{formatDate(t.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={showAdjust} onClose={() => setShowAdjust(false)} title="Adjust stock" size="md" footer={
        <>
          <Button variant="ghost" onClick={() => setShowAdjust(false)}>Cancel</Button>
          <Button onClick={handleAdjust}>Apply</Button>
        </>
      }>
        <div className="space-y-3">
          <Select label="Product" value={adjustProduct} onChange={e => setAdjustProduct(e.target.value)}
            options={[{ value: '', label: 'Select...' }, ...products.map(p => ({ value: p.id, label: `${p.name} (${p.stock})` }))]} />
          <Select label="Type" value={adjustType} onChange={e => setAdjustType(e.target.value as any)}
            options={[{ value: 'stock_in', label: 'Stock in' }, { value: 'stock_out', label: 'Stock out' }, { value: 'damage', label: 'Damage' }, { value: 'return', label: 'Return' }, { value: 'adjustment', label: 'Adjustment' }]} />
          <Input label="Quantity" type="number" value={adjustQty} onChange={e => setAdjustQty(e.target.value)} />
          <Input label="Reason" value={adjustReason} onChange={e => setAdjustReason(e.target.value)} />
        </div>
      </Modal>

      {toast && <div className="fixed bottom-4 right-4 z-[100] px-3 py-2 rounded-md bg-[#161618] border border-[#242428] animate-toast"><span className="text-[12px] font-medium text-[#4ADE80]">{toast}</span></div>}
    </div>
  );
}
