import React, { useState } from 'react';
import { useStore } from '../store';
import { Button, Select, formatCurrency, Tabs, Metric } from '../components/ui';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';

export function Reports() {
  const { products, sales, invoices, payments, purchases, expenses, customers, suppliers } = useStore();
  const [activeTab, setActiveTab] = useState('sales');
  const [period, setPeriod] = useState('month');

  const totalRevenue = sales.reduce((s, sale) => s + sale.total, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const inventoryValue = products.reduce((s, p) => s + (p.stock * p.costPrice), 0);
  const totalProfit = totalRevenue - totalExpenses;

  const monthlyData = [
    { month: 'Aug', revenue: 42000, expenses: 38000 },
    { month: 'Sep', revenue: 58000, expenses: 42000 },
    { month: 'Oct', revenue: 71000, expenses: 45000 },
    { month: 'Nov', revenue: 85000, expenses: 52000 },
    { month: 'Dec', revenue: 92000, expenses: 48000 },
    { month: 'Jan', revenue: totalRevenue, expenses: totalExpenses },
  ];

  const expenseByCategory: Record<string, number> = {};
  expenses.forEach(e => { expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount; });
  const expenseBreakdown = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));
  const COLORS = ['#4ADE80', '#FBBF24', '#F87171', '#60A5FA', '#A78BFA', '#FB923C'];

  const topCustomers = [...customers].sort((a, b) => b.totalPurchases - a.totalPurchases).slice(0, 5);

  const productRevenue: Record<string, { name: string; units: number; revenue: number }> = {};
  sales.forEach(s => s.items.forEach(item => {
    if (!productRevenue[item.productId]) productRevenue[item.productId] = { name: item.productName, units: 0, revenue: 0 };
    productRevenue[item.productId].units += item.quantity;
    productRevenue[item.productId].revenue += item.total;
  }));
  const topProducts = Object.values(productRevenue).sort((a, b) => b.revenue - a.revenue).slice(0, 8);

  const exportCSV = () => {
    let csv = '';
    if (activeTab === 'sales') {
      csv = 'Date,Invoice,Customer,Total\n' + sales.map(s => `${s.date},${s.invoiceNumber},${s.customerName},${s.total}`).join('\n');
    } else if (activeTab === 'expenses') {
      csv = 'Date,Title,Category,Amount\n' + expenses.map(e => `${e.date},${e.title},${e.category},${e.amount}`).join('\n');
    } else if (activeTab === 'inventory') {
      csv = 'SKU,Product,Stock,Value\n' + products.map(p => `${p.sku},${p.name},${p.stock},${p.stock * p.costPrice}`).join('\n');
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${activeTab}-report.csv`; a.click();
  };

  const tabs = [
    { key: 'sales', label: 'Sales' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'inventory', label: 'Inventory' },
    { key: 'expenses', label: 'Expenses' },
    { key: 'customers', label: 'Customers' },
  ];

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[#EFEFF1] tracking-tight">Reports</h1>
          <p className="text-[13px] text-[#6B6B76] mt-0.5">Business analytics and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onChange={e => setPeriod(e.target.value)}
            options={[{ value: 'week', label: 'This week' }, { value: 'month', label: 'This month' }, { value: 'year', label: 'This year' }]} className="w-28" />
          <Button variant="ghost" size="sm" onClick={exportCSV}><Download size={12} /> Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5 pb-5 mb-5 border-b border-[#1A1A1D]">
        <Metric label="Revenue" value={formatCurrency(totalRevenue)} trend="up" hint="12.5% vs last period" />
        <Metric label="Expenses" value={formatCurrency(totalExpenses)} trend="down" hint="8.2% vs last period" />
        <Metric label="Net profit" value={formatCurrency(totalProfit)} trend={totalProfit >= 0 ? 'up' : 'down'} />
        <Metric label="Inventory value" value={formatCurrency(inventoryValue)} />
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[14px] font-semibold text-[#EFEFF1] mb-4">Revenue trend</h2>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                    <defs>
                      <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EFEFF1" stopOpacity={0.08} />
                        <stop offset="100%" stopColor="#EFEFF1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B6B76', fontSize: 11 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B6B76', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ background: '#161618', border: '1px solid #242428', borderRadius: 6, fontSize: 12 }} formatter={(v: number) => [formatCurrency(v), '']} />
                    <Area type="monotone" dataKey="revenue" stroke="#EFEFF1" strokeWidth={1.5} fill="url(#revGrad2)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-[#EFEFF1] mb-3">Top selling products</h2>
              <div className="divide-y divide-[#1A1A1D]">
                {topProducts.map((p, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#EFEFF1] truncate">{p.name}</p>
                      <p className="text-[11px] text-[#6B6B76]">{p.units} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] text-[#EFEFF1] font-medium tabular-nums">{formatCurrency(p.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div>
            <h2 className="text-[14px] font-semibold text-[#EFEFF1] mb-4">Revenue vs expenses</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barGap={4} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B6B76', fontSize: 11 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B6B76', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: '#161618', border: '1px solid #242428', borderRadius: 6, fontSize: 12 }} formatter={(v: number) => [formatCurrency(v), '']} />
                  <Bar dataKey="revenue" fill="#4ADE80" radius={[2, 2, 0, 0]} barSize={20} name="Revenue" />
                  <Bar dataKey="expenses" fill="#F87171" radius={[2, 2, 0, 0]} barSize={20} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5 pb-5 border-b border-[#1A1A1D]">
              <Metric label="Total products" value={products.length.toString()} />
              <Metric label="Total stock" value={products.reduce((s, p) => s + p.stock, 0).toString()} />
              <Metric label="Inventory value" value={formatCurrency(inventoryValue)} />
              <Metric label="Low stock" value={products.filter(p => p.stock <= p.minStock).length.toString()} trend="down" />
            </div>
            <div className="border border-[#1A1A1D] rounded-lg overflow-hidden">
              <table className="w-full text-[13px]">
                <thead><tr className="border-b border-[#1A1A1D]">
                  <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Product</th>
                  <th className="px-3 py-2.5 text-right text-[11px] font-medium text-[#6B6B76]">Stock</th>
                  <th className="px-3 py-2.5 text-right text-[11px] font-medium text-[#6B6B76]">Value</th>
                  <th className="px-3 py-2.5 text-right text-[11px] font-medium text-[#6B6B76]">% of total</th>
                </tr></thead>
                <tbody>
                  {[...products].sort((a, b) => (b.stock * b.costPrice) - (a.stock * a.costPrice)).slice(0, 10).map(p => (
                    <tr key={p.id} className="border-b border-[#1A1A1D] last:border-0 hover:bg-[#111113] transition-colors">
                      <td className="px-3 py-2 text-[#EFEFF1]">{p.name}</td>
                      <td className="px-3 py-2 text-right text-[#A1A1AA] font-mono tabular-nums">{p.stock}</td>
                      <td className="px-3 py-2 text-right text-[#EFEFF1] tabular-nums">{formatCurrency(p.stock * p.costPrice)}</td>
                      <td className="px-3 py-2 text-right text-[#6B6B76] tabular-nums">{inventoryValue > 0 ? ((p.stock * p.costPrice / inventoryValue) * 100).toFixed(1) : 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-[14px] font-semibold text-[#EFEFF1] mb-4">Expense breakdown</h2>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={2}>
                      {expenseBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#161618', border: '1px solid #242428', borderRadius: 6, fontSize: 12 }} formatter={(v: number) => [formatCurrency(v), '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {expenseBreakdown.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-[11px] text-[#6B6B76]">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-[#EFEFF1] mb-4">By category</h2>
              <div className="space-y-3">
                {expenseBreakdown.sort((a, b) => b.value - a.value).map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="text-[#A1A1AA]">{item.name}</span>
                      <span className="text-[#EFEFF1] tabular-nums">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="h-1 bg-[#161618] rounded-full overflow-hidden">
                      <div className="h-full rounded-full progress-fill" style={{ width: `${(item.value / totalExpenses) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5 pb-5 border-b border-[#1A1A1D]">
              <Metric label="Total customers" value={customers.length.toString()} />
              <Metric label="Active" value={customers.filter(c => c.status === 'active').length.toString()} />
              <Metric label="Total purchases" value={formatCurrency(customers.reduce((s, c) => s + c.totalPurchases, 0))} />
              <Metric label="Outstanding" value={formatCurrency(customers.reduce((s, c) => s + c.outstandingBalance, 0))} />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-[#EFEFF1] mb-3">Top customers</h2>
              <div className="divide-y divide-[#1A1A1D]">
                {topCustomers.map((c, i) => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] text-[#6B6B76] font-mono w-4 tabular-nums">{i + 1}</span>
                      <div>
                        <p className="text-[13px] font-medium text-[#EFEFF1]">{c.name}</p>
                        <p className="text-[11px] text-[#6B6B76]">{c.company || 'Individual'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] text-[#EFEFF1] font-medium tabular-nums">{formatCurrency(c.totalPurchases)}</p>
                      {c.outstandingBalance > 0 && <p className="text-[11px] text-[#FBBF24] tabular-nums">{formatCurrency(c.outstandingBalance)} due</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
