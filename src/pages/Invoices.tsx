import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { InvoiceItem } from '../types';
import { Button, Input, Select, Badge, Modal, SearchInput, Pagination, formatCurrency, formatDate, Dropdown } from '../components/ui';
import { Plus, FileText, Download, Printer, MoreHorizontal, Eye } from 'lucide-react';

export function Invoices() {
  const { invoices, products, customers, createInvoice, updateInvoiceStatus, settings } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const perPage = 10;

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

  const statusLabel = (s: string) => s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  const invoice = viewInvoice ? invoices.find(i => i.id === viewInvoice) : null;

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#F2F3F5]">Invoices</h1>
          <p className="text-sm text-[#6F747C]">{invoices.length} invoices</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}><Plus size={13} /> Create Invoice</Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search invoices..." className="w-full sm:w-64" />
        <Select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          options={[{ value: '', label: 'All Status' }, { value: 'draft', label: 'Draft' }, { value: 'sent', label: 'Sent' }, { value: 'paid', label: 'Paid' }, { value: 'partially_paid', label: 'Partially Paid' }, { value: 'overdue', label: 'Overdue' }, { value: 'cancelled', label: 'Cancelled' }]} className="w-40" />
      </div>

      <div className="bg-[#101214] border border-[#25282C] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#25282C]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Customer</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Paid</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Due</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(inv => (
                <tr key={inv.id} className="border-b border-[#1E2024] hover:bg-[#0D0E10] transition-default">
                  <td className="px-4 py-3 font-mono text-xs text-[#F2F3F5]">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 text-[#F2F3F5]">{inv.customerName}</td>
                  <td className="px-4 py-3 text-right font-medium text-[#F2F3F5]">{formatCurrency(inv.total)}</td>
                  <td className="px-4 py-3 text-right text-[#9A9EA5]">{formatCurrency(inv.paidAmount)}</td>
                  <td className="px-4 py-3"><Badge variant={statusVariant(inv.status) as any}>{statusLabel(inv.status)}</Badge></td>
                  <td className="px-4 py-3 text-[#6F747C] text-xs">{formatDate(inv.date)}</td>
                  <td className="px-4 py-3 text-[#6F747C] text-xs">{formatDate(inv.dueDate)}</td>
                  <td className="px-4 py-3 text-right">
                    <Dropdown trigger={<button className="p-1 rounded hover:bg-[#1A1C1F] text-[#6F747C]"><MoreHorizontal size={14} /></button>}
                      items={[
                        { label: 'View', icon: <Eye size={13} />, onClick: () => setViewInvoice(inv.id) },
                        ...(inv.status !== 'paid' && inv.status !== 'cancelled' ? [{ label: 'Mark as Paid', icon: <FileText size={13} />, onClick: () => { updateInvoiceStatus(inv.id, 'paid'); setToast('Invoice marked as paid'); setTimeout(() => setToast(''), 3000); } }] : []),
                        ...(inv.status === 'sent' ? [{ label: 'Mark Overdue', icon: <FileText size={13} />, onClick: () => { updateInvoiceStatus(inv.id, 'overdue'); } }] : []),
                      ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* View Invoice */}
      {invoice && (
        <Modal open={true} onClose={() => setViewInvoice(null)} title={`Invoice ${invoice.invoiceNumber}`} size="lg" footer={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}><Printer size={13} /> Print</Button>
            {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
              <Button size="sm" onClick={() => { updateInvoiceStatus(invoice.id, 'paid'); setViewInvoice(null); setToast('Invoice marked as paid'); setTimeout(() => setToast(''), 3000); }}>Mark as Paid</Button>
            )}
          </div>
        }>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-semibold text-[#F2F3F5]">{settings.name}</p>
                <p className="text-xs text-[#6F747C] mt-1">{settings.address}</p>
                <p className="text-xs text-[#6F747C]">{settings.phone} • {settings.email}</p>
                {settings.gstin && <p className="text-xs text-[#6F747C]">GSTIN: {settings.gstin}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#F2F3F5]">{invoice.invoiceNumber}</p>
                <p className="text-xs text-[#6F747C] mt-1">Date: {formatDate(invoice.date)}</p>
                <p className="text-xs text-[#6F747C]">Due: {formatDate(invoice.dueDate)}</p>
                <Badge variant={statusVariant(invoice.status) as any} className="mt-2">{statusLabel(invoice.status)}</Badge>
              </div>
            </div>
            <div className="p-3 bg-[#151719] rounded-md border border-[#25282C]">
              <p className="text-xs text-[#6F747C] mb-1">Bill To:</p>
              <p className="text-sm font-medium text-[#F2F3F5]">{invoice.customerName}</p>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#25282C]">
                <th className="py-2 text-left text-xs text-[#6F747C]">Item</th>
                <th className="py-2 text-right text-xs text-[#6F747C]">Qty</th>
                <th className="py-2 text-right text-xs text-[#6F747C]">Price</th>
                <th className="py-2 text-right text-xs text-[#6F747C]">Total</th>
              </tr></thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr key={i} className="border-b border-[#1E2024]">
                    <td className="py-2 text-[#F2F3F5]">{item.productName}</td>
                    <td className="py-2 text-right text-[#9A9EA5]">{item.quantity}</td>
                    <td className="py-2 text-right text-[#9A9EA5]">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-2 text-right text-[#F2F3F5]">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end">
              <div className="w-56 space-y-1">
                <div className="flex justify-between text-sm"><span className="text-[#6F747C]">Subtotal</span><span className="text-[#F2F3F5]">{formatCurrency(invoice.subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#6F747C]">Discount</span><span className="text-[#F87171]">-{formatCurrency(invoice.discount)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#6F747C]">Tax</span><span className="text-[#F2F3F5]">+{formatCurrency(invoice.tax)}</span></div>
                <div className="flex justify-between text-sm font-semibold pt-1 border-t border-[#25282C]"><span className="text-[#F2F3F5]">Total</span><span className="text-[#F2F3F5]">{formatCurrency(invoice.total)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#6F747C]">Paid</span><span className="text-[#34D399]">{formatCurrency(invoice.paidAmount)}</span></div>
                <div className="flex justify-between text-sm font-semibold pt-1 border-t border-[#25282C]"><span className="text-[#F2F3F5]">Balance</span><span className="text-[#FBBF24]">{formatCurrency(invoice.total - invoice.paidAmount)}</span></div>
              </div>
            </div>
            {invoice.notes && <p className="text-xs text-[#6F747C] italic">{invoice.notes}</p>}
          </div>
        </Modal>
      )}

      {/* Create Invoice */}
      {showCreate && <CreateInvoiceModal onClose={() => setShowCreate(false)} products={products} customers={customers} createInvoice={createInvoice} settings={settings} onSuccess={(msg) => { setToast(msg); setShowCreate(false); setTimeout(() => setToast(''), 3000); }} />}
      {toast && <div className="fixed bottom-4 right-4 z-[100] px-4 py-3 rounded-lg border border-[#064E2B] bg-[#052E16] animate-fade-in"><span className="text-sm font-medium text-[#34D399]">{toast}</span></div>}
    </div>
  );
}

function CreateInvoiceModal({ onClose, products, customers, createInvoice, settings, onSuccess }: {
  onClose: () => void; products: any[]; customers: any[]; createInvoice: any; settings: any; onSuccess: (msg: string) => void;
}) {
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [qty, setQty] = useState('1');
  const [discount, setDiscount] = useState('0');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const addItem = () => {
    if (!selectedProduct) return;
    const product = products.find(p => p.id === selectedProduct);
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
    if (!customerId) { setError('Please select a customer'); return; }
    if (items.length === 0) { setError('Please add at least one item'); return; }
    const customer = customers.find(c => c.id === customerId);
    const num = createInvoice({
      customerId, customerName: customer?.name || '', items, subtotal, discount: totalDiscount,
      tax: totalTax, total: grandTotal, status: 'sent' as const,
      date: new Date().toISOString().split('T')[0], dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], notes,
    });
    onSuccess(`Invoice ${num} created`);
  };

  return (
    <Modal open={true} onClose={onClose} title="Create Invoice" size="xl" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Create Invoice</Button>
      </>
    }>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Customer *" value={customerId} onChange={e => setCustomerId(e.target.value)}
            options={[{ value: '', label: 'Select customer...' }, ...customers.filter(c => c.status === 'active').map(c => ({ value: c.id, label: c.name }))]} />
          <Input label="Due Date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
        <div className="p-3 bg-[#151719] rounded-md border border-[#25282C] space-y-3">
          <p className="text-xs font-medium text-[#9A9EA5]">Add Items</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <Select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}
              options={[{ value: '', label: 'Select product...' }, ...products.filter(p => p.status === 'active').map(p => ({ value: p.id, label: p.name }))]} />
            <Input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="Qty" min="1" />
            <Input type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="Disc %" />
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
                    <td className="px-3 py-2 text-right text-[#F2F3F5]">{formatCurrency(item.total)}</td>
                    <td className="px-3 py-2"><button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-[#6F747C] hover:text-[#F87171]"><span className="text-xs">✕</span></button></td>
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
              <div className="flex justify-between text-sm"><span className="text-[#6F747C]">Discount</span><span className="text-[#F87171]">-{formatCurrency(totalDiscount)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#6F747C]">Tax</span><span className="text-[#F2F3F5]">+{formatCurrency(totalTax)}</span></div>
              <div className="flex justify-between text-sm font-semibold pt-1.5 border-t border-[#25282C]"><span className="text-[#F2F3F5]">Total</span><span className="text-[#F2F3F5]">{formatCurrency(grandTotal)}</span></div>
            </div>
          </div>
        )}
        <Input label="Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Invoice notes..." />
      </div>
    </Modal>
  );
}
