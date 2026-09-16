import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { SaleItem } from '../types';
import { Button, Input, Select, Badge, Modal, SearchInput, Pagination, formatCurrency, formatDate, Metric } from '../components/ui';
import { Plus, X } from 'lucide-react';

export function Sales() {
  const { sales, products, customers, createSale, settings } = useStore();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const perPage = 15;

  const totalSales = sales.reduce((s, sale) => s + sale.total, 0);

  const filtered = useMemo(() => {
    let result = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (search) { const q = search.toLowerCase(); result = result.filter(s => s.invoiceNumber.toLowerCase().includes(q) || s.customerName.toLowerCase().includes(q)); }
    return result;
  }, [sales, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[#EFEFF1] tracking-tight">Sales</h1>
          <p className="text-[13px] text-[#6B6B76] mt-0.5">{sales.length} transactions</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}><Plus size={12} /> New sale</Button>
      </div>

      <div className="grid grid-cols-3 gap-x-8 gap-y-5 pb-5 mb-5 border-b border-[#1A1A1D]">
        <Metric label="Total sales" value={formatCurrency(totalSales)} hint={`${sales.length} completed`} trend="up" />
        <Metric label="Transactions" value={sales.length.toString()} />
        <Metric label="Avg. order" value={formatCurrency(sales.length > 0 ? totalSales / sales.length : 0)} />
      </div>

      <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search sales..." className="w-64 mb-4" />

      <div className="border border-[#1A1A1D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#1A1A1D]">
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Invoice</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Customer</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Items</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium text-[#6B6B76]">Total</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Status</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(sale => (
                <tr key={sale.id} className="border-b border-[#1A1A1D] last:border-0 hover:bg-[#111113] transition-colors">
                  <td className="px-3 py-2 font-mono text-[11px] text-[#A1A1AA]">{sale.invoiceNumber}</td>
                  <td className="px-3 py-2 text-[#EFEFF1]">{sale.customerName}</td>
                  <td className="px-3 py-2 text-[#6B6B76]">{sale.items.length}</td>
                  <td className="px-3 py-2 text-right text-[#EFEFF1] font-medium tabular-nums">{formatCurrency(sale.total)}</td>
                  <td className="px-3 py-2"><Badge variant="success">Completed</Badge></td>
                  <td className="px-3 py-2 text-[#6B6B76]">{formatDate(sale.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showCreate && <CreateSaleModal onClose={() => setShowCreate(false)} products={products} customers={customers} createSale={createSale} onSuccess={(msg: string) => { setToast(msg); setShowCreate(false); setTimeout(() => setToast(''), 3000); }} />}
      {toast && <div className="fixed bottom-4 right-4 z-[100] px-3 py-2 rounded-md bg-[#161618] border border-[#242428] animate-toast"><span className="text-[12px] font-medium text-[#4ADE80]">{toast}</span></div>}
    </div>
  );
}

function CreateSaleModal({ onClose, products, customers, createSale, onSuccess }: any) {
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<SaleItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [qty, setQty] = useState('1');
  const [discount, setDiscount] = useState('0');
  const [error, setError] = useState('');

  const addItem = () => {
    if (!selectedProduct) return;
    const product = products.find((p: any) => p.id === selectedProduct);
    if (!product) return;
    const quantity = parseInt(qty) || 1;
    if (quantity > product.stock) { setError(`Only ${product.stock} available`); return; }
    const subtotal = product.sellingPrice * quantity;
    const itemDiscount = parseFloat(discount) || 0;
    const afterDiscount = subtotal * (1 - itemDiscount / 100);
    const tax = afterDiscount * (product.taxRate / 100);
    const total = afterDiscount + tax;
    setItems([...items, { productId: product.id, productName: product.name, quantity, unitPrice: product.sellingPrice, discount: itemDiscount, taxRate: product.taxRate, total }]);
    setSelectedProduct(''); setQty('1'); setDiscount('0'); setError('');
  };

  const subtotal = items.reduce((s, i) => s + (i.unitPrice * i.quantity), 0);
  const totalDiscount = items.reduce((s, i) => s + ((i.unitPrice * i.quantity) * i.discount / 100), 0);
  const totalTax = items.reduce((s, i) => { const after = (i.unitPrice * i.quantity) * (1 - i.discount / 100); return s + (after * i.taxRate / 100); }, 0);
  const grandTotal = subtotal - totalDiscount + totalTax;

  const handleSubmit = () => {
    if (!customerId) { setError('Select a customer'); return; }
    if (items.length === 0) { setError('Add at least one item'); return; }
    const customer = customers.find((c: any) => c.id === customerId);
    const num = createSale({
      customerId, customerName: customer?.name || '', items, subtotal, discount: totalDiscount,
      tax: totalTax, total: grandTotal, status: 'completed' as const, date: new Date().toISOString().split('T')[0],
    });
    onSuccess(`Sale ${num} created`);
  };

  return (
    <Modal open={true} onClose={onClose} title="New sale" size="xl" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Complete sale</Button>
      </>
    }>
      <div className="space-y-3">
        <Select label="Customer" value={customerId} onChange={e => setCustomerId(e.target.value)}
          options={[{ value: '', label: 'Select...' }, ...customers.filter((c: any) => c.status === 'active').map((c: any) => ({ value: c.id, label: c.name }))]} />
        <div className="p-3 bg-[#0B0B0C] rounded-md border border-[#1A1A1D]">
          <div className="grid grid-cols-4 gap-2">
            <Select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}
              options={[{ value: '', label: 'Product...' }, ...products.filter((p: any) => p.stock > 0).map((p: any) => ({ value: p.id, label: `${p.name} (${p.stock})` }))]} />
            <Input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="Qty" />
            <Input type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="Disc %" />
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
                <th className="px-2.5 py-1.5 text-right text-[10px] text-[#6B6B76]">Price</th>
                <th className="px-2.5 py-1.5 text-right text-[10px] text-[#6B6B76]">Total</th>
                <th className="px-2.5 py-1.5 w-6"></th>
              </tr></thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-b border-[#1A1A1D] last:border-0">
                    <td className="px-2.5 py-1.5 text-[#EFEFF1]">{item.productName}</td>
                    <td className="px-2.5 py-1.5 text-right text-[#A1A1AA] font-mono">{item.quantity}</td>
                    <td className="px-2.5 py-1.5 text-right text-[#A1A1AA] tabular-nums">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-2.5 py-1.5 text-right text-[#EFEFF1] tabular-nums">{formatCurrency(item.total)}</td>
                    <td className="px-2.5 py-1.5"><button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-[#6B6B76] hover:text-[#F87171]"><X size={11} /></button></td>
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
              <div className="flex justify-between text-[12px]"><span className="text-[#6B6B76]">Discount</span><span className="text-[#F87171] tabular-nums">−{formatCurrency(totalDiscount)}</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-[#6B6B76]">Tax</span><span className="text-[#EFEFF1] tabular-nums">+{formatCurrency(totalTax)}</span></div>
              <div className="flex justify-between text-[13px] font-semibold pt-1 border-t border-[#1A1A1D]"><span className="text-[#EFEFF1]">Total</span><span className="text-[#EFEFF1] tabular-nums">{formatCurrency(grandTotal)}</span></div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
