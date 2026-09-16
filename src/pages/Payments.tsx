import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Button, Input, Select, Badge, Modal, SearchInput, Pagination, formatCurrency, formatDate, StatCard } from '../components/ui';
import { Plus, CreditCard, DollarSign } from 'lucide-react';

export function Payments() {
  const { payments, invoices, customers, createPayment } = useStore();
  const [search, setSearch] = useState('');
  const [showRecord, setShowRecord] = useState(false);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const perPage = 10;

  const totalReceived = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);

  const filtered = useMemo(() => {
    let result = [...payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (search) { const q = search.toLowerCase(); result = result.filter(p => p.customerName.toLowerCase().includes(q) || p.invoiceNumber?.toLowerCase().includes(q)); }
    return result;
  }, [payments, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const methodLabel = (m: string) => m.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#F2F3F5]">Payments</h1>
          <p className="text-sm text-[#6F747C]">{payments.length} payment records</p>
        </div>
        <Button size="sm" onClick={() => setShowRecord(true)}><Plus size={13} /> Record Payment</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Total Received" value={formatCurrency(totalReceived)} change="This period" changeType="up" icon={<DollarSign size={14} />} />
        <StatCard label="Transactions" value={payments.length.toString()} />
        <StatCard label="Avg. Payment" value={formatCurrency(payments.length > 0 ? totalReceived / payments.length : 0)} />
      </div>

      <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search payments..." className="w-full sm:w-64" />

      <div className="bg-[#101214] border border-[#25282C] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#25282C]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Invoice</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => (
                <tr key={p.id} className="border-b border-[#1E2024] hover:bg-[#0D0E10] transition-default">
                  <td className="px-4 py-3 text-[#F2F3F5]">{p.customerName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#9A9EA5]">{p.invoiceNumber || '-'}</td>
                  <td className="px-4 py-3 text-right font-medium text-[#F2F3F5]">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-3"><Badge variant="default">{methodLabel(p.method)}</Badge></td>
                  <td className="px-4 py-3 text-[#6F747C] text-xs">{formatDate(p.date)}</td>
                  <td className="px-4 py-3"><Badge variant={p.status === 'completed' ? 'success' : p.status === 'pending' ? 'warning' : 'error'}>{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showRecord && <RecordPaymentModal onClose={() => setShowRecord(false)} invoices={invoices} customers={customers} createPayment={createPayment} onSuccess={(msg) => { setToast(msg); setShowRecord(false); setTimeout(() => setToast(''), 3000); }} />}
      {toast && <div className="fixed bottom-4 right-4 z-[100] px-4 py-3 rounded-lg border border-[#064E2B] bg-[#052E16] animate-fade-in"><span className="text-sm font-medium text-[#34D399]">{toast}</span></div>}
    </div>
  );
}

function RecordPaymentModal({ onClose, invoices, customers, createPayment, onSuccess }: {
  onClose: () => void; invoices: any[]; customers: any[]; createPayment: any; onSuccess: (msg: string) => void;
}) {
  const [invoiceId, setInvoiceId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'cash' | 'bank_transfer' | 'upi' | 'card' | 'other'>('bank_transfer');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const selectedInvoice = invoices.find(i => i.id === invoiceId);
  const outstanding = selectedInvoice ? selectedInvoice.total - selectedInvoice.paidAmount : 0;

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) { setError('Enter a valid amount'); return; }
    if (!invoiceId && !selectedInvoice) { setError('Select an invoice or customer'); return; }
    const inv = selectedInvoice;
    if (!inv) return;
    const customer = customers.find(c => c.id === inv.customerId);
    createPayment({
      invoiceId: inv.id, invoiceNumber: inv.invoiceNumber, customerId: inv.customerId,
      customerName: inv.customerName, amount: parseFloat(amount), method, date: new Date().toISOString().split('T')[0],
      status: 'completed' as const, notes,
    });
    onSuccess(`Payment of ${formatCurrency(parseFloat(amount))} recorded`);
  };

  return (
    <Modal open={true} onClose={onClose} title="Record Payment" size="md" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Record Payment</Button>
      </>
    }>
      <div className="space-y-4">
        <Select label="Invoice" value={invoiceId} onChange={e => setInvoiceId(e.target.value)}
          options={[{ value: '', label: 'Select invoice...' }, ...invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').map(i => ({ value: i.id, label: `${i.invoiceNumber} - ${i.customerName} (${formatCurrency(i.total - i.paidAmount)} due)` }))]} />
        {selectedInvoice && (
          <div className="p-3 bg-[#151719] rounded-md border border-[#25282C]">
            <p className="text-xs text-[#6F747C]">Outstanding: <span className="text-[#FBBF24] font-medium">{formatCurrency(outstanding)}</span></p>
          </div>
        )}
        <Input label="Amount (₹) *" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={outstanding > 0 ? outstanding.toString() : '0'} />
        <Select label="Payment Method" value={method} onChange={e => setMethod(e.target.value as any)}
          options={[{ value: 'cash', label: 'Cash' }, { value: 'bank_transfer', label: 'Bank Transfer' }, { value: 'upi', label: 'UPI' }, { value: 'card', label: 'Card' }, { value: 'other', label: 'Other' }]} />
        <Input label="Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Payment notes..." />
        {error && <p className="text-xs text-[#F87171]">{error}</p>}
      </div>
    </Modal>
  );
}
