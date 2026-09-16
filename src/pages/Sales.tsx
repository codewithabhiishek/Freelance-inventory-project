import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { SaleItem } from '../types';
import { Button, Input, Select, Badge, Modal, SearchInput, Pagination, formatCurrency, formatDate, StatCard } from '../components/ui';
import { Plus, ShoppingCart, X, Minus } from 'lucide-react';

export function Sales() {
  const { sales, products, customers, createSale, settings } = useStore();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const perPage = 10;

  const totalSales = sales.reduce((s, sale) => s + sale.total, 0);
  const completedSales = sales.filter(s => s.status === 'completed');
  const avgOrderValue = completedSales.length > 0 ? totalSales / completedSales.length : 0;

  const filtered = useMemo(() => {
    let result = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (search) { const q = search.toLowerCase(); result = result.filter(s => s.invoiceNumber.toLowerCase().includes(q) || s.customerName.toLowerCase().includes(q)); }
    return result;
  }, [sales, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#F2F3F5]">Sales</h1>
          <p className="text-sm text-[#6F747C]">{sales.length} total transactions</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}><Plus size={13} /> New Sale</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Total Sales" value={formatCurrency(totalSales)} change={`${completedSales.length} completed`} changeType="up" icon={<ShoppingCart size={14} />} />
        <StatCard label="Transactions" value={sales.length.toString()} />
        <StatCard label="Avg. Order Value" value={formatCurrency(avgOrderValue)} />
      </div>

      <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search sales..." className="w-full sm:w-64" />

      <div className="bg-[#101214] border border-[#25282C] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#25282C]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Items</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(sale => (
                <tr key={sale.id} className="border-b border-[#1E2024] hover:bg-[#0D0E10] transition-default">
                  <td className="px-4 py-3 font-mono text-xs text-[#F2F3F5]">{sale.invoiceNumber}</td>
                  <td className="px-4 py-3 text-[#F2F3F5]">{sale.customerName}</td>
                  <td className="px-4 py-3 text-[#9A9EA5]">{sale.items.length} item{sale.items.length > 1 ? 's' : ''}</td>
                  <td className="px-4 py-3 text-right font-medium text-[#F2F3F5]">{formatCurrency(sale.total)}</td>
                  <td className="px-4 py-3"><Badge variant="success">Completed</Badge></td>
                  <td className="px-4 py-3 text-[#6F747C] text-xs">{formatDate(sale.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showCreate && <CreateSaleModal onClose={() => setShowCreate(false)} products={products} customers={customers} createSale={createSale} settings={settings} onSuccess={(msg) => { setToast(msg); setShowCreate(false); setTimeout(() => setToast(''), 3000); }} />}
      {toast && <div className="fixed bottom-4 right-4 z-[100] px-4 py-3 rounded-lg border border-[#064E2B] bg-[#052E16] animate-fade-in"><span className="text-sm font-medium text-[#34D399]">{toast}</span></div>}
    </div>
  );
}

function CreateSaleModal({ onClose, products, customers, createSale, settings, onSuccess }: {
  onClose: () => void; products: any[]; customers: any[]; createSale: any; settings: any; onSuccess: (msg: string) => void;
}) {
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<SaleItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [qty, setQty] = useState('1');
  const [discount, setDiscount] = useState('0');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const addItem = () => {
    if (!selectedProduct) return;
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;
    const quantity = parseInt(qty) || 1;
    if (quantity > product.stock) { setError(`Only ${product.stock} available in stock`); return; }
    const subtotal = product.sellingPrice * quantity;
    const itemDiscount = parseFloat(discount) || 0;
    const afterDiscount = subtotal * (1 - itemDiscount / 100);
    const tax = afterDiscount * (product.taxRate / 100);
    const total = afterDiscount + tax;

    setItems([...items, { productId: product.id, productName: product.name, quantity, unitPrice: product.sellingPrice, discount: itemDiscount, taxRate: product.taxRate, total }]);
    setSelectedProduct(''); setQty('1'); setDiscount('0'); setError('');
  };

  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const subtotal = items.reduce((s, i) => s + (i.unitPrice * i.quantity), 0);
  const totalDiscount = items.reduce((s, i) => s + ((i.unitPrice * i.quantity) * i.discount / 100), 0);
  const totalTax = items.reduce((s, i) => { const after = (i.unitPrice * i.quantity) * (1 - i.discount / 100); return s + (after * i.taxRate / 100); }, 0);
  const grandTotal = subtotal - totalDiscount + totalTax;

  const handleSubmit = () => {
    if (!customerId) { setError('Please select a customer'); return; }
    if (items.length === 0) { setError('Please add at least one item'); return; }
    const customer = customers.find(c => c.id === customerId);
    const invoiceNumber = createSale({
      customerId, customerName: customer?.name || '', items, subtotal, discount: totalDiscount,
      tax: totalTax, total: grandTotal, status: 'completed' as const,
      date: new Date().toISOString().split('T')[0], notes,
    });
    onSuccess(`Sale ${invoiceNumber} created successfully`);
  };

  return (
    <Modal open={true} onClose={onClose} title="New Sale" size="xl" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Complete Sale</Button>
      </>
    }>
      <div className="space-y-4">
        <Select label="Customer *" value={customerId} onChange={e => setCustomerId(e.target.value)}
          options={[{ value: '', label: 'Select customer...' }, ...customers.filter(c => c.status === 'active').map(c => ({ value: c.id, label: `${c.name}${c.company ? ` (${c.company})` : ''}` }))]} />
        
        {/* Add items */}
        <div className="p-3 bg-[#151719] rounded-md border border-[#25282C] space-y-3">
          <p className="text-xs font-medium text-[#9A9EA5]">Add Products</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <Select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}
              options={[{ value: '', label: 'Select product...' }, ...products.filter(p => p.stock > 0 && p.status === 'active').map(p => ({ value: p.id, label: `${p.name} (${p.stock})` }))]} />
            <Input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="Qty" min="1" />
            <Input type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="Disc %" />
            <Button size="sm" onClick={addItem}><Plus size={13} /> Add</Button>
          </div>
          {error && <p className="text-xs text-[#F87171]">{error}</p>}
        </div>

        {/* Items list */}
        {items.length > 0 && (
          <div className="border border-[#25282C] rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#25282C] bg-[#151719]">
                <th className="px-3 py-2 text-left text-xs text-[#6F747C]">Product</th>
                <th className="px-3 py-2 text-right text-xs text-[#6F747C]">Qty</th>
                <th className="px-3 py-2 text-right text-xs text-[#6F747C]">Price</th>
                <th className="px-3 py-2 text-right text-xs text-[#6F747C]">Total</th>
                <th className="px-3 py-2 w-8"></th>
              </tr></thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-b border-[#1E2024]">
                    <td className="px-3 py-2 text-[#F2F3F5]">{item.productName}</td>
                    <td className="px-3 py-2 text-right text-[#9A9EA5]">{item.quantity}</td>
                    <td className="px-3 py-2 text-right text-[#9A9EA5]">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-3 py-2 text-right text-[#F2F3F5] font-medium">{formatCurrency(item.total)}</td>
                    <td className="px-3 py-2"><button onClick={() => removeItem(i)} className="text-[#6F747C] hover:text-[#F87171]"><X size={13} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Totals */}
        {items.length > 0 && (
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5">
              <div className="flex justify-between text-sm"><span className="text-[#6F747C]">Subtotal</span><span className="text-[#F2F3F5]">{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#6F747C]">Discount</span><span className="text-[#F87171]">-{formatCurrency(totalDiscount)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#6F747C]">Tax</span><span className="text-[#F2F3F5]">+{formatCurrency(totalTax)}</span></div>
              <div className="flex justify-between text-sm font-semibold pt-1.5 border-t border-[#25282C]"><span className="text-[#F2F3F5]">Total</span><span className="text-[#F2F3F5]">{formatCurrency(grandTotal)}</span></div>
            </div>
          </div>
        )}

        <Input label="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Sale notes..." />
      </div>
    </Modal>
  );
}
