import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Button, Input, Select, Badge, Modal, SearchInput, Pagination, formatCurrency, formatDate, Dropdown, Metric } from '../components/ui';
import { Plus, MoreHorizontal, Eye, Check, Printer } from 'lucide-react';
import { InvoiceItem } from '../types';

export function Invoices() {
  const { invoices, products, customers, createInvoice, updateInvoiceStatus, settings } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const perPage = 15;

  const filtered = useMemo(() => {
    let result = [...invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (search) { const q = search.toLowerCase(); result = result.filter(i => i.invoiceNumber.toLowerCase().includes(q) || i.customerName.toLowerCase().includes(q)); }
    if (statusFilter) result = result.filter(i => i.status === statusFilter);
    return result;
  }, [invoices, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const statusVariant = (s: string) => {
    switch (s) {
      case 'paid': return 'success';
      case 'sent': return 'info';
      case 'draft': return 'neutral';
      case 'partially_paid': return 'warning';
      case 'overdue': return 'error';
      case 'cancelled': return 'neutral';
      default: return 'default';
    }
  };

  const invoice = viewInvoice ? invoices.find(i => i.id === viewInvoice) : null;

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[#EFEFF1] tracking-tight">Invoices</h1>
          <p className="text-[13px] text-[#6B6B76] mt-0.5">{invoices.length} invoices</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}><Plus size={12} /> Create invoice</Button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search invoices..." className="w-64" />
        <Select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          options={[{ value: '', label: 'All status' }, { value: 'draft', label: 'Draft' }, { value: 'sent', label: 'Sent' }, { value: 'paid', label: 'Paid' }, { value: 'partially_paid', label: 'Partial' }, { value: 'overdue', label: 'Overdue' }, { value: 'cancelled', label: 'Cancelled' }]} className="w-32" />
      </div>

      <div className="border border-[#1A1A1D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#1A1A1D]">
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Invoice</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Customer</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium text-[#6B6B76]">Amount</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium text-[#6B6B76]">Paid</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Status</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Date</th>
                <th className="px-3 py-2.5 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(inv => (
                <tr key={inv.id} className="border-b border-[#1A1A1D] last:border-0 hover:bg-[#111113] transition-colors">
                  <td className="px-3 py-2 font-mono text-[11px] text-[#A1A1AA]">{inv.invoiceNumber}</td>
                  <td className="px-3 py-2 text-[#EFEFF1]">{inv.customerName}</td>
                  <td className="px-3 py-2 text-right text-[#EFEFF1] font-medium tabular-nums">{formatCurrency(inv.total)}</td>
                  <td className="px-3 py-2 text-right text-[#A1A1AA] tabular-nums">{formatCurrency(inv.paidAmount)}</td>
                  <td className="px-3 py-2"><Badge variant={statusVariant(inv.status) as any}>{inv.status.replace('_', ' ')}</Badge></td>
                  <td className="px-3 py-2 text-[#6B6B76]">{formatDate(inv.date)}</td>
                  <td className="px-3 py-2 text-right">
                    <Dropdown trigger={<button className="p-1 rounded hover:bg-[#1C1C1F] text-[#6B6B76]"><MoreHorizontal size={13} /></button>}
                      items={[
                        { label: 'View', icon: <Eye size={12} />, onClick: () => setViewInvoice(inv.id) },
                        ...(inv.status !== 'paid' && inv.status !== 'cancelled' ? [{ label: 'Mark paid', icon: <Check size={12} />, onClick: () => { updateInvoiceStatus(inv.id, 'paid'); setToast('Invoice marked as paid'); setTimeout(() => setToast(''), 3000); } }] : []),
                      ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {invoice && (
        <Modal open={true} onClose={() => setViewInvoice(null)} title={`Invoice ${invoice.invoiceNumber}`} size="lg" footer={
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => window.print()}><Printer size={12} /> Print</Button>
            {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
              <Button size="sm" onClick={() => { updateInvoiceStatus(invoice.id, 'paid'); setViewInvoice(null); setToast('Invoice marked as paid'); setTimeout(() => setToast(''), 3000); }}>Mark as paid</Button>
            )}
          </div>
        }>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[14px] font-semibold text-[#EFEFF1]">{settings.name}</p>
                <p className="text-[12px] text-[#6B6B76] mt-1">{settings.address}</p>
                <p className="text-[12px] text-[#6B6B76]">{settings.phone} · {settings.email}</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-semibold text-[#EFEFF1]">{invoice.invoiceNumber}</p>
                <p className="text-[12px] text-[#6B6B76] mt-1">Date: {formatDate(invoice.date)}</p>
                <p className="text-[12px] text-[#6B6B76]">Due: {formatDate(invoice.dueDate)}</p>
                <Badge variant={statusVariant(invoice.status) as any} className="mt-2">{invoice.status.replace('_', ' ')}</Badge>
              </div>
            </div>
            <div className="p-3 bg-[#0B0B0C] rounded-md border border-[#1A1A1D]">
              <p className="text-[11px] text-[#6B6B76] mb-1">Bill to:</p>
              <p className="text-[13px] font-medium text-[#EFEFF1]">{invoice.customerName}</p>
            </div>
            <table className="w-full text-[12px]">
              <thead><tr className="border-b border-[#1A1A1D]">
                <th className="py-2 text-left text-[10px] text-[#6B6B76]">Item</th>
                <th className="py-2 text-right text-[10px] text-[#6B6B76]">Qty</th>
                <th className="py-2 text-right text-[10px] text-[#6B6B76]">Price</th>
                <th className="py-2 text-right text-[10px] text-[#6B6B76]">Total</th>
              </tr></thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr key={i} className="border-b border-[#1A1A1D] last:border-0">
                    <td className="py-2 text-[#EFEFF1]">{item.productName}</td>
                    <td className="py-2 text-right text-[#A1A1AA] font-mono">{item.quantity}</td>
                    <td className="py-2 text-right text-[#A1A1AA] tabular-nums">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-2 text-right text-[#EFEFF1] tabular-nums">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end">
              <div className="w-48 space-y-1">
                <div className="flex justify-between text-[12px]"><span className="text-[#6B6B76]">Subtotal</span><span className="text-[#EFEFF1] tabular-nums">{formatCurrency(invoice.subtotal)}</span></div>
                <div className="flex justify-between text-[12px]"><span className="text-[#6B6B76]">Discount</span><span className="text-[#F87171] tabular-nums">−{formatCurrency(invoice.discount)}</span></div>
                <div className="flex justify-between text-[12px]"><span className="text-[#6B6B76]">Tax</span><span className="text-[#EFEFF1] tabular-nums">+{formatCurrency(invoice.tax)}</span></div>
                <div className="flex justify-between text-[13px] font-semibold pt-1 border-t border-[#1A1A1D]"><span className="text-[#EFEFF1]">Total</span><span className="text-[#EFEFF1] tabular-nums">{formatCurrency(invoice.total)}</span></div>
                <div className="flex justify-between text-[12px]"><span className="text-[#6B6B76]">Paid</span><span className="text-[#4ADE80] tabular-nums">{formatCurrency(invoice.paidAmount)}</span></div>
                <div className="flex justify-between text-[13px] font-semibold pt-1 border-t border-[#1A1A1D]"><span className="text-[#EFEFF1]">Balance</span><span className="text-[#FBBF24] tabular-nums">{formatCurrency(invoice.total - invoice.paidAmount)}</span></div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {showCreate && <CreateInvoiceModal onClose={() => setShowCreate(false)} products={products} customers={customers} createInvoice={createInvoice} onSuccess={(msg: string) => { setToast(msg); setShowCreate(false); setTimeout(() => setToast(''), 3000); }} />}
      {toast && <div className="fixed bottom-4 right-4 z-[100] px-3 py-2 rounded-md bg-[#161618] border border-[#242428] animate-toast"><span className="text-[12px] font-medium text-[#4ADE80]">{toast}</span></div>}
    </div>
  );
}

function CreateInvoiceModal({ onClose, products, customers, createInvoice, onSuccess }: any) {
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [qty, setQty] = useState('1');
  const [discount, setDiscount] = useState('0');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const addItem = () => {
    if (!selectedProduct) return;
    const product = products.find((p: any) => p.id === selectedProduct);
    if (!product) return;
    const quantity = parseInt(qty) || 1;
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
    const num = createInvoice({
      customerId, customerName: customer?.name || '', items, subtotal, discount: totalDiscount,
      tax: totalTax, total: grandTotal, status: 'sent' as const,
      date: new Date().toISOString().split('T')[0], dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    });
    onSuccess(`Invoice ${num} created`);
  };

  return (
    <Modal open={true} onClose={onClose} title="Create invoice" size="xl" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Create</Button>
      </>
    }>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Select label="Customer" value={customerId} onChange={e => setCustomerId(e.target.value)}
            options={[{ value: '', label: 'Select...' }, ...customers.filter((c: any) => c.status === 'active').map((c: any) => ({ value: c.id, label: c.name }))]} />
          <Input label="Due date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
        <div className="p-3 bg-[#0B0B0C] rounded-md border border-[#1A1A1D]">
          <div className="grid grid-cols-4 gap-2">
            <Select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}
              options={[{ value: '', label: 'Product...' }, ...products.map((p: any) => ({ value: p.id, label: p.name }))]} />
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
