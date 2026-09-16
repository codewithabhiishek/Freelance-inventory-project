import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Button, Input, Select, Badge, Modal, SearchInput, Pagination, formatCurrency, formatDate, Metric } from '../components/ui';
import { Plus } from 'lucide-react';

export function Payments() {
  const { payments, invoices, customers, createPayment } = useStore();
  const [search, setSearch] = useState('');
  const [showRecord, setShowRecord] = useState(false);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const perPage = 15;

  const totalReceived = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);

  const filtered = useMemo(() => {
    let result = [...payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (search) { const q = search.toLowerCase(); result = result.filter(p => p.customerName.toLowerCase().includes(q) || p.invoiceNumber?.toLowerCase().includes(q)); }
    return result;
  }, [payments, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[#EFEFF1] tracking-tight">Payments</h1>
          <p className="text-[13px] text-[#6B6B76] mt-0.5">{payments.length} payment records</p>
        </div>
        <Button size="sm" onClick={() => setShowRecord(true)}><Plus size={12} /> Record payment</Button>
      </div>

      <div className="grid grid-cols-3 gap-x-8 gap-y-5 pb-5 mb-5 border-b border-[#1A1A1D]">
        <Metric label="Total received" value={formatCurrency(totalReceived)} hint="This period" trend="up" />
        <Metric label="Transactions" value={payments.length.toString()} />
        <Metric label="Avg. payment" value={formatCurrency(payments.length > 0 ? totalReceived / payments.length : 0)} />
      </div>

      <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search payments..." className="w-64 mb-4" />

      <div className="border border-[#1A1A1D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#1A1A1D]">
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Customer</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Invoice</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium text-[#6B6B76]">Amount</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Method</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Date</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => (
                <tr key={p.id} className="border-b border-[#1A1A1D] last:border-0 hover:bg-[#111113] transition-colors">
                  <td className="px-3 py-2 text-[#EFEFF1]">{p.customerName}</td>
                  <td className="px-3 py-2 font-mono text-[11px] text-[#A1A1AA]">{p.invoiceNumber || '—'}</td>
                  <td className="px-3 py-2 text-right text-[#EFEFF1] font-medium tabular-nums">{formatCurrency(p.amount)}</td>
                  <td className="px-3 py-2 text-[#A1A1AA] text-[12px] capitalize">{p.method.replace('_', ' ')}</td>
                  <td className="px-3 py-2 text-[#6B6B76]">{formatDate(p.date)}</td>
                  <td className="px-3 py-2"><Badge variant={p.status === 'completed' ? 'success' : p.status === 'pending' ? 'warning' : 'error'}>{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showRecord && <RecordPaymentModal onClose={() => setShowRecord(false)} invoices={invoices} customers={customers} createPayment={createPayment} onSuccess={(msg: string) => { setToast(msg); setShowRecord(false); setTimeout(() => setToast(''), 3000); }} />}
      {toast && <div className="fixed bottom-4 right-4 z-[100] px-3 py-2 rounded-md bg-[#161618] border border-[#242428] animate-toast"><span className="text-[12px] font-medium text-[#4ADE80]">{toast}</span></div>}
    </div>
  );
}

function RecordPaymentModal({ onClose, invoices, customers, createPayment, onSuccess }: any) {
  const [invoiceId, setInvoiceId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'cash' | 'bank_transfer' | 'upi' | 'card' | 'other'>('bank_transfer');
  const [error, setError] = useState('');

  const selectedInvoice = invoices.find((i: any) => i.id === invoiceId);
  const outstanding = selectedInvoice ? selectedInvoice.total - selectedInvoice.paidAmount : 0;

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) { setError('Enter a valid amount'); return; }
    if (!selectedInvoice) { setError('Select an invoice'); return; }
    createPayment({
      invoiceId: selectedInvoice.id, invoiceNumber: selectedInvoice.invoiceNumber, customerId: selectedInvoice.customerId,
      customerName: selectedInvoice.customerName, amount: parseFloat(amount), method, date: new Date().toISOString().split('T')[0],
      status: 'completed' as const,
    });
    onSuccess(`Payment of ${formatCurrency(parseFloat(amount))} recorded`);
  };

  return (
    <Modal open={true} onClose={onClose} title="Record payment" size="md" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Record</Button>
      </>
    }>
      <div className="space-y-3">
        <Select label="Invoice" value={invoiceId} onChange={e => setInvoiceId(e.target.value)}
          options={[{ value: '', label: 'Select...' }, ...invoices.filter((i: any) => i.status !== 'paid' && i.status !== 'cancelled').map((i: any) => ({ value: i.id, label: `${i.invoiceNumber} — ${i.customerName} (${formatCurrency(i.total - i.paidAmount)} due)` }))]} />
        {selectedInvoice && (
          <div className="p-2.5 bg-[#0B0B0C] rounded-md border border-[#1A1A1D]">
            <p className="text-[12px] text-[#6B6B76]">Outstanding: <span className="text-[#FBBF24] font-medium tabular-nums">{formatCurrency(outstanding)}</span></p>
          </div>
        )}
        <Input label="Amount (₹)" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={outstanding > 0 ? outstanding.toString() : '0'} />
        <Select label="Method" value={method} onChange={e => setMethod(e.target.value as any)}
          options={[{ value: 'cash', label: 'Cash' }, { value: 'bank_transfer', label: 'Bank transfer' }, { value: 'upi', label: 'UPI' }, { value: 'card', label: 'Card' }, { value: 'other', label: 'Other' }]} />
        {error && <p className="text-[11px] text-[#F87171]">{error}</p>}
      </div>
    </Modal>
  );
}
