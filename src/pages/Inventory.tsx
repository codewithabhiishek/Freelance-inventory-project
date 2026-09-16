import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Badge, Button, Input, Select, Modal, SearchInput, Pagination, formatCurrency, formatDate, StatCard } from '../components/ui';
import { Package, AlertTriangle, TrendingDown, ArrowUpDown } from 'lucide-react';

export function Inventory() {
  const { products, categories, inventoryTransactions, adjustStock, currentUser } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAdjust, setShowAdjust] = useState(false);
  const [adjustProduct, setAdjustProduct] = useState('');
  const [adjustType, setAdjustType] = useState<'stock_in' | 'stock_out' | 'damage' | 'return' | 'adjustment'>('stock_in');
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const perPage = 10;

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
    adjustStock(adjustProduct, adjustType, parseInt(adjustQty), adjustReason || 'Manual adjustment', adjustNotes);
    setShowAdjust(false);
    setAdjustProduct(''); setAdjustQty(''); setAdjustReason(''); setAdjustNotes('');
    setToast('Stock adjusted successfully');
    setTimeout(() => setToast(''), 3000);
  };

  const getStatus = (p: typeof products[0]) => p.stock === 0 ? 'out' : p.stock <= p.minStock ? 'low' : 'ok';

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#F2F3F5]">Inventory</h1>
          <p className="text-sm text-[#6F747C]">Manage stock levels and adjustments</p>
        </div>
        <Button size="sm" onClick={() => setShowAdjust(true)}><ArrowUpDown size={13} /> Adjust Stock</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Stock" value={totalStock.toLocaleString()} icon={<Package size={14} />} />
        <StatCard label="Inventory Value" value={formatCurrency(inventoryValue)} />
        <StatCard label="Low Stock" value={lowStockCount.toString()} change="Needs attention" changeType="down" icon={<AlertTriangle size={14} />} />
        <StatCard label="Out of Stock" value={outOfStockCount.toString()} change="Requires reorder" changeType="down" icon={<TrendingDown size={14} />} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search inventory..." className="w-64" />
        <Select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          options={[{ value: '', label: 'All Status' }, { value: 'ok', label: 'In Stock' }, { value: 'low', label: 'Low Stock' }, { value: 'out', label: 'Out of Stock' }]} className="w-36" />
      </div>

      {/* Table */}
      <div className="bg-[#101214] border border-[#25282C] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#25282C]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">SKU</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Current Stock</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Min Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Stock Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => {
                const status = getStatus(p);
                return (
                  <tr key={p.id} className="border-b border-[#1E2024] hover:bg-[#0D0E10] transition-default">
                    <td className="px-4 py-3 font-medium text-[#F2F3F5]">{p.name}</td>
                    <td className="px-4 py-3 text-[#9A9EA5] font-mono text-xs">{p.sku}</td>
                    <td className="px-4 py-3 text-right text-[#F2F3F5] font-medium">{p.stock}</td>
                    <td className="px-4 py-3 text-right text-[#6F747C]">{p.minStock}</td>
                    <td className="px-4 py-3">
                      <Badge variant={status === 'out' ? 'error' : status === 'low' ? 'warning' : 'success'}>
                        {status === 'out' ? 'Out of Stock' : status === 'low' ? 'Low Stock' : 'In Stock'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-[#9A9EA5]">{formatCurrency(p.stock * p.costPrice)}</td>
                    <td className="px-4 py-3 text-[#6F747C] text-xs">{formatDate(p.updatedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* Recent Activity */}
      <div className="bg-[#101214] border border-[#25282C] rounded-lg p-4">
        <h3 className="text-sm font-medium text-[#F2F3F5] mb-3">Recent Activity</h3>
        <div className="space-y-2">
          {inventoryTransactions.slice(0, 8).map(t => (
            <div key={t.id} className="flex items-center justify-between py-2 border-b border-[#1E2024] last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${t.type === 'stock_in' || t.type === 'return' ? 'bg-[#34D399]' : 'bg-[#F87171]'}`} />
                <div>
                  <p className="text-xs text-[#F2F3F5]">{t.productName}</p>
                  <p className="text-[10px] text-[#6F747C]">{t.reason} • {t.performedBy}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-medium ${t.type === 'stock_in' || t.type === 'return' ? 'text-[#34D399]' : 'text-[#F87171]'}`}>
                  {t.type === 'stock_in' || t.type === 'return' ? '+' : '-'}{t.quantity}
                </p>
                <p className="text-[10px] text-[#6F747C]">{formatDate(t.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adjust Stock Modal */}
      <Modal open={showAdjust} onClose={() => setShowAdjust(false)} title="Adjust Stock" size="md" footer={
        <>
          <Button variant="ghost" onClick={() => setShowAdjust(false)}>Cancel</Button>
          <Button onClick={handleAdjust}>Apply Adjustment</Button>
        </>
      }>
        <div className="space-y-4">
          <Select label="Product" value={adjustProduct} onChange={e => setAdjustProduct(e.target.value)}
            options={[{ value: '', label: 'Select product...' }, ...products.map(p => ({ value: p.id, label: `${p.name} (${p.stock} in stock)` }))]} />
          <Select label="Adjustment Type" value={adjustType} onChange={e => setAdjustType(e.target.value as any)}
            options={[
              { value: 'stock_in', label: 'Stock In' }, { value: 'stock_out', label: 'Stock Out' },
              { value: 'damage', label: 'Damage' }, { value: 'return', label: 'Return' }, { value: 'adjustment', label: 'Manual Adjustment' },
            ]} />
          <Input label="Quantity" type="number" value={adjustQty} onChange={e => setAdjustQty(e.target.value)} placeholder="Enter quantity" />
          <Input label="Reason" value={adjustReason} onChange={e => setAdjustReason(e.target.value)} placeholder="e.g. Damaged in transit" />
          <Input label="Notes (optional)" value={adjustNotes} onChange={e => setAdjustNotes(e.target.value)} placeholder="Additional notes" />
          {adjustProduct && (
            <div className="p-3 bg-[#151719] rounded-md border border-[#25282C]">
              <p className="text-xs text-[#6F747C]">Current stock: <span className="text-[#F2F3F5] font-medium">{products.find(p => p.id === adjustProduct)?.stock || 0}</span></p>
              {adjustQty && (
                <p className="text-xs text-[#6F747C] mt-1">After adjustment: <span className="text-[#F2F3F5] font-medium">
                  {(() => { const p = products.find(pr => pr.id === adjustProduct); if (!p) return 0; const q = parseInt(adjustQty) || 0;
                    return (adjustType === 'stock_in' || adjustType === 'return') ? p.stock + q : p.stock - q;
                  })()}
                </span></p>
              )}
            </div>
          )}
        </div>
      </Modal>

      {toast && <div className="fixed bottom-4 right-4 z-[100] px-4 py-3 rounded-lg border border-[#064E2B] bg-[#052E16] animate-fade-in"><span className="text-sm font-medium text-[#34D399]">{toast}</span></div>}
    </div>
  );
}
