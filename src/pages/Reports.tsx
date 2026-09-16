import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Button, Select, formatCurrency, Tabs, StatCard } from '../components/ui';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Download, BarChart3 } from 'lucide-react';

export function Reports() {
  const { products, sales, invoices, payments, purchases, expenses, customers, suppliers } = useStore();
  const [activeTab, setActiveTab] = useState('sales');
  const [period, setPeriod] = useState('month');

  const totalRevenue = sales.reduce((s, sale) => s + sale.total, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalPurchases = purchases.filter(p => p.status === 'received').reduce((s, p) => s + p.total, 0);
  const inventoryValue = products.reduce((s, p) => s + (p.stock * p.costPrice), 0);
  const totalProfit = totalRevenue - totalPurchases - totalExpenses;

  // Monthly data
  const monthlyData = [
    { month: 'Aug', revenue: 42000, expenses: 38000, profit: 4000 },
    { month: 'Sep', revenue: 58000, expenses: 42000, profit: 16000 },
    { month: 'Oct', revenue: 71000, expenses: 45000, profit: 26000 },
    { month: 'Nov', revenue: 85000, expenses: 52000, profit: 33000 },
    { month: 'Dec', revenue: 92000, expenses: 48000, profit: 44000 },
    { month: 'Jan', revenue: totalRevenue, expenses: totalExpenses, profit: totalProfit },
  ];

  // Expense breakdown
  const expenseByCategory: Record<string, number> = {};
  expenses.forEach(e => { expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount; });
  const expenseBreakdown = Object.entries(expenseByCategory).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  const COLORS = ['#34D399', '#FBBF24', '#F87171', '#60A5FA', '#A78BFA', '#FB923C', '#38BDF8', '#E879F9'];

  // Top customers
  const topCustomers = [...customers].sort((a, b) => b.totalPurchases - a.totalPurchases).slice(0, 5);

  // Product performance
  const productPerformance: Record<string, { name: string; units: number; revenue: number; profit: number }> = {};
  sales.forEach(s => s.items.forEach(item => {
    if (!productPerformance[item.productId]) {
      const product = products.find(p => p.id === item.productId);
      productPerformance[item.productId] = { name: item.productName, units: 0, revenue: 0, profit: 0 };
    }
    productPerformance[item.productId].units += item.quantity;
    productPerformance[item.productId].revenue += item.total;
    const product = products.find(p => p.id === item.productId);
    if (product) productPerformance[item.productId].profit += item.quantity * (item.unitPrice - product.costPrice);
  }));
  const topProducts = Object.values(productPerformance).sort((a, b) => b.revenue - a.revenue).slice(0, 8);

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
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#F2F3F5]">Reports</h1>
          <p className="text-sm text-[#6F747C]">Business analytics and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onChange={e => setPeriod(e.target.value)}
            options={[{ value: 'week', label: 'This Week' }, { value: 'month', label: 'This Month' }, { value: 'year', label: 'This Year' }]} className="w-32" />
          <Button variant="outline" size="sm" onClick={exportCSV}><Download size={13} /> Export CSV</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Revenue" value={formatCurrency(totalRevenue)} changeType="up" change="12.5% vs last period" />
        <StatCard label="Expenses" value={formatCurrency(totalExpenses)} changeType="down" change="8.2% vs last period" />
        <StatCard label="Net Profit" value={formatCurrency(totalProfit)} changeType={totalProfit >= 0 ? 'up' : 'down'} />
        <StatCard label="Inventory Value" value={formatCurrency(inventoryValue)} />
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {/* Sales Report */}
      {activeTab === 'sales' && (
        <div className="space-y-4">
          <div className="bg-[#101214] border border-[#25282C] rounded-lg p-4">
            <h3 className="text-sm font-medium text-[#F2F3F5] mb-4">Revenue Trend</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34D399" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6F747C', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6F747C', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: '#151719', border: '1px solid #25282C', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [formatCurrency(v), '']} />
                  <Area type="monotone" dataKey="revenue" stroke="#34D399" strokeWidth={1.5} fill="url(#revGrad2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-[#101214] border border-[#25282C] rounded-lg p-4">
            <h3 className="text-sm font-medium text-[#F2F3F5] mb-3">Top Selling Products</h3>
            <div className="space-y-2">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#1E2024] last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#F2F3F5] truncate">{p.name}</p>
                    <p className="text-[10px] text-[#6F747C]">{p.units} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-[#F2F3F5]">{formatCurrency(p.revenue)}</p>
                    <p className="text-[10px] text-[#34D399]">Profit: {formatCurrency(p.profit)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Revenue Report */}
      {activeTab === 'revenue' && (
        <div className="bg-[#101214] border border-[#25282C] rounded-lg p-4">
          <h3 className="text-sm font-medium text-[#F2F3F5] mb-4">Revenue vs Expenses vs Profit</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barGap={4}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6F747C', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6F747C', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#151719', border: '1px solid #25282C', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [formatCurrency(v), '']} />
                <Bar dataKey="revenue" fill="#34D399" radius={[2, 2, 0, 0]} barSize={20} name="Revenue" />
                <Bar dataKey="expenses" fill="#F87171" radius={[2, 2, 0, 0]} barSize={20} name="Expenses" />
                <Bar dataKey="profit" fill="#FBBF24" radius={[2, 2, 0, 0]} barSize={20} name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Inventory Report */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Total Products" value={products.length.toString()} />
            <StatCard label="Total Stock" value={products.reduce((s, p) => s + p.stock, 0).toString()} />
            <StatCard label="Inventory Value" value={formatCurrency(inventoryValue)} />
            <StatCard label="Low Stock Items" value={products.filter(p => p.stock <= p.minStock).length.toString()} changeType="down" />
          </div>
          <div className="bg-[#101214] border border-[#25282C] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#25282C]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase">Product</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase">Stock</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase">Value</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase">% of Total</th>
              </tr></thead>
              <tbody>
                {[...products].sort((a, b) => (b.stock * b.costPrice) - (a.stock * a.costPrice)).slice(0, 10).map(p => (
                  <tr key={p.id} className="border-b border-[#1E2024]">
                    <td className="px-4 py-2.5 text-[#F2F3F5] text-xs">{p.name}</td>
                    <td className="px-4 py-2.5 text-right text-[#9A9EA5] text-xs">{p.stock}</td>
                    <td className="px-4 py-2.5 text-right text-[#F2F3F5] text-xs">{formatCurrency(p.stock * p.costPrice)}</td>
                    <td className="px-4 py-2.5 text-right text-[#6F747C] text-xs">{inventoryValue > 0 ? ((p.stock * p.costPrice / inventoryValue) * 100).toFixed(1) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expenses Report */}
      {activeTab === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#101214] border border-[#25282C] rounded-lg p-4">
            <h3 className="text-sm font-medium text-[#F2F3F5] mb-4">Expense Breakdown</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={2}>
                    {expenseBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#151719', border: '1px solid #25282C', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [formatCurrency(v), '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {expenseBreakdown.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] text-[#6F747C]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#101214] border border-[#25282C] rounded-lg p-4">
            <h3 className="text-sm font-medium text-[#F2F3F5] mb-3">By Category</h3>
            <div className="space-y-3">
              {expenseBreakdown.sort((a, b) => b.value - a.value).map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#9A9EA5]">{item.name}</span>
                    <span className="text-[#F2F3F5]">{formatCurrency(item.value)}</span>
                  </div>
                  <div className="h-1.5 bg-[#1A1C1F] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(item.value / totalExpenses) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Customers Report */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Total Customers" value={customers.length.toString()} />
            <StatCard label="Active" value={customers.filter(c => c.status === 'active').length.toString()} />
            <StatCard label="Total Purchases" value={formatCurrency(customers.reduce((s, c) => s + c.totalPurchases, 0))} />
            <StatCard label="Outstanding" value={formatCurrency(customers.reduce((s, c) => s + c.outstandingBalance, 0))} />
          </div>
          <div className="bg-[#101214] border border-[#25282C] rounded-lg p-4">
            <h3 className="text-sm font-medium text-[#F2F3F5] mb-3">Top Customers by Revenue</h3>
            <div className="space-y-2">
              {topCustomers.map((c, i) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-[#1E2024] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#6F747C] w-4">{i + 1}</span>
                    <div>
                      <p className="text-xs font-medium text-[#F2F3F5]">{c.name}</p>
                      <p className="text-[10px] text-[#6F747C]">{c.company || 'Individual'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-[#F2F3F5]">{formatCurrency(c.totalPurchases)}</p>
                    {c.outstandingBalance > 0 && <p className="text-[10px] text-[#FBBF24]">{formatCurrency(c.outstandingBalance)} due</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
