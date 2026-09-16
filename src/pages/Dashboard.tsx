import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { StatCard, Badge, formatCurrency, formatDate } from '../components/ui';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Package, CreditCard, DollarSign, AlertTriangle } from 'lucide-react';

export function Dashboard() {
  const { products, sales, invoices, payments, expenses, settings } = useStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setLoaded(true); }, []);

  // Calculate KPIs
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalSales = sales.length;
  const inventoryValue = products.reduce((sum, p) => sum + (p.stock * p.costPrice), 0);
  const outstandingPayments = invoices.reduce((sum, i) => sum + (i.total - i.paidAmount), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const cogs = products.reduce((sum, p) => {
    const soldItems = sales.flatMap(s => s.items.filter(i => i.productId === p.id));
    return sum + soldItems.reduce((s, i) => s + (i.quantity * p.costPrice), 0);
  }, 0);
  const profit = totalRevenue - cogs - totalExpenses;

  // Revenue chart data (last 7 days simulated)
  const revenueData = [
    { day: 'Mon', revenue: 28500, sales: 12400 },
    { day: 'Tue', revenue: 34200, sales: 18900 },
    { day: 'Wed', revenue: 21800, sales: 9200 },
    { day: 'Thu', revenue: 42100, sales: 24600 },
    { day: 'Fri', revenue: 38700, sales: 21300 },
    { day: 'Sat', revenue: 15400, sales: 8100 },
    { day: 'Sun', revenue: 12200, sales: 6800 },
  ];

  // Low stock items
  const lowStockItems = products.filter(p => p.stock <= p.minStock).sort((a, b) => a.stock - b.stock).slice(0, 5);

  // Recent transactions
  const recentSales = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  // Top products by revenue
  const productRevenue: Record<string, { name: string; units: number; revenue: number }> = {};
  sales.forEach(s => s.items.forEach(item => {
    if (!productRevenue[item.productId]) productRevenue[item.productId] = { name: item.productName, units: 0, revenue: 0 };
    productRevenue[item.productId].units += item.quantity;
    productRevenue[item.productId].revenue += item.total;
  }));
  const topProducts = Object.values(productRevenue).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Inventory movement data
  const inventoryData = [
    { day: 'Mon', in: 50, out: 12 },
    { day: 'Tue', in: 0, out: 25 },
    { day: 'Wed', in: 30, out: 8 },
    { day: 'Thu', in: 0, out: 18 },
    { day: 'Fri', in: 45, out: 32 },
    { day: 'Sat', in: 0, out: 5 },
    { day: 'Sun', in: 0, out: 3 },
  ];

  return (
    <div className={`p-4 lg:p-6 space-y-6 ${loaded ? 'animate-fade-in' : 'opacity-0'}`}>
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-[#F2F3F5]">Dashboard</h1>
        <p className="text-sm text-[#6F747C] mt-0.5">Welcome back. Here's your business overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} change="12.5% vs last month" changeType="up" icon={<DollarSign size={14} />} />
        <StatCard label="Total Sales" value={totalSales.toString()} change="8 new this week" changeType="up" icon={<TrendingUp size={14} />} />
        <StatCard label="Inventory Value" value={formatCurrency(inventoryValue)} change={`${products.length} products`} changeType="neutral" icon={<Package size={14} />} />
        <StatCard label="Outstanding" value={formatCurrency(outstandingPayments)} change={`${invoices.filter(i => i.status === 'overdue').length} overdue`} changeType={outstandingPayments > 50000 ? 'down' : 'neutral'} icon={<CreditCard size={14} />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[#101214] border border-[#25282C] rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-[#F2F3F5]">Revenue & Sales</h3>
              <p className="text-xs text-[#6F747C] mt-0.5">Last 7 days</p>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34D399" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6F747C', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6F747C', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#151719', border: '1px solid #25282C', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#F2F3F5' }} itemStyle={{ color: '#9A9EA5' }}
                  formatter={(value: number) => [formatCurrency(value), '']} />
                <Area type="monotone" dataKey="revenue" stroke="#34D399" strokeWidth={1.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Movement */}
        <div className="bg-[#101214] border border-[#25282C] rounded-lg p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-[#F2F3F5]">Inventory Movement</h3>
            <p className="text-xs text-[#6F747C] mt-0.5">Stock in vs out</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData} barGap={2}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6F747C', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6F747C', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#151719', border: '1px solid #25282C', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#F2F3F5' }} />
                <Bar dataKey="in" fill="#34D399" radius={[2, 2, 0, 0]} barSize={12} name="Stock In" />
                <Bar dataKey="out" fill="#F87171" radius={[2, 2, 0, 0]} barSize={12} name="Stock Out" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Low Stock */}
        <div className="bg-[#101214] border border-[#25282C] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-[#F2F3F5]">Low Stock</h3>
            <AlertTriangle size={14} className="text-[#FBBF24]" />
          </div>
          <div className="space-y-2.5">
            {lowStockItems.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#F2F3F5] truncate">{item.name}</p>
                  <p className="text-[10px] text-[#6F747C]">{item.stock} / {item.minStock} min</p>
                </div>
                <Badge variant={item.stock === 0 ? 'error' : 'warning'}>
                  {item.stock === 0 ? 'Out' : 'Low'}
                </Badge>
              </div>
            ))}
            {lowStockItems.length === 0 && <p className="text-xs text-[#6F747C] text-center py-4">All items well stocked</p>}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#101214] border border-[#25282C] rounded-lg p-4">
          <h3 className="text-sm font-medium text-[#F2F3F5] mb-3">Recent Sales</h3>
          <div className="space-y-2.5">
            {recentSales.map(sale => (
              <div key={sale.id} className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#F2F3F5] truncate">{sale.customerName}</p>
                  <p className="text-[10px] text-[#6F747C]">{formatDate(sale.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#F2F3F5]">{formatCurrency(sale.total)}</p>
                  <Badge variant="success" className="mt-0.5">Completed</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-[#101214] border border-[#25282C] rounded-lg p-4">
          <h3 className="text-sm font-medium text-[#F2F3F5] mb-3">Top Products</h3>
          <div className="space-y-2.5">
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#F2F3F5] truncate">{product.name}</p>
                  <p className="text-[10px] text-[#6F747C]">{product.units} units sold</p>
                </div>
                <span className="text-xs font-medium text-[#9A9EA5]">{formatCurrency(product.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profit Summary */}
      <div className="bg-[#101214] border border-[#25282C] rounded-lg p-4">
        <h3 className="text-sm font-medium text-[#F2F3F5] mb-3">Profit Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] text-[#6F747C] uppercase tracking-wide">Revenue</p>
            <p className="text-sm font-semibold text-[#F2F3F5] mt-1">{formatCurrency(totalRevenue)}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#6F747C] uppercase tracking-wide">Expenses</p>
            <p className="text-sm font-semibold text-[#F87171] mt-1">{formatCurrency(totalExpenses)}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#6F747C] uppercase tracking-wide">COGS</p>
            <p className="text-sm font-semibold text-[#F2F3F5] mt-1">{formatCurrency(cogs)}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#6F747C] uppercase tracking-wide">Net Profit</p>
            <p className={`text-sm font-semibold mt-1 ${profit >= 0 ? 'text-[#34D399]' : 'text-[#F87171]'}`}>{formatCurrency(profit)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
