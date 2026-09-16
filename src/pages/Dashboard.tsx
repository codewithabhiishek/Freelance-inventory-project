import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { StatCard, Badge, formatCurrency, formatDate, AnimatedCounter } from '../components/ui';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Package, CreditCard, DollarSign, AlertTriangle, ArrowUpRight, ArrowDownRight, Activity, Zap, Shield } from 'lucide-react';

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

  // Revenue chart data
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F3F5] tracking-tight">Dashboard</h1>
          <p className="text-sm text-[#6F747C] mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#101214] border border-[#25282C]">
            <div className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
            <span className="text-xs text-[#9A9EA5]">System Online</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} change="12.5% vs last month" changeType="up" icon={<DollarSign size={14} />} />
        <StatCard label="Total Sales" value={totalSales.toString()} change="8 new this week" changeType="up" icon={<TrendingUp size={14} />} />
        <StatCard label="Inventory Value" value={formatCurrency(inventoryValue)} change={`${products.length} products tracked`} changeType="neutral" icon={<Package size={14} />} />
        <StatCard label="Outstanding" value={formatCurrency(outstandingPayments)} change={`${invoices.filter(i => i.status === 'overdue').length} overdue`} changeType={outstandingPayments > 50000 ? 'down' : 'neutral'} icon={<CreditCard size={14} />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[#101214] border border-[#25282C] rounded-xl p-5 card-hover inner-glow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#34D399]/[0.03] to-transparent rounded-full -translate-y-12 translate-x-12 group-hover:scale-125 transition-transform duration-700" />
          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-[#F2F3F5]">Revenue & Sales</h3>
                <p className="text-xs text-[#6F747C] mt-0.5">Performance over the last 7 days</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#151719] border border-[#1E2024]">
                <Activity size={11} className="text-[#34D399]" />
                <span className="text-[10px] font-medium text-[#9A9EA5]">Live</span>
              </div>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34D399" stopOpacity={0.2} />
                      <stop offset="50%" stopColor="#34D399" stopOpacity={0.08} />
                      <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6F747C', fontSize: 11 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6F747C', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} dx={-4} />
                  <Tooltip 
                    contentStyle={{ background: '#151719', border: '1px solid #25282C', borderRadius: 10, fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
                    labelStyle={{ color: '#F2F3F5', fontWeight: 600, marginBottom: 4 }}
                    itemStyle={{ color: '#9A9EA5' }}
                    formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    cursor={{ stroke: '#25282C', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#34D399" strokeWidth={2} fill="url(#revGrad)" animationDuration={1500} animationEasing="ease-out" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Inventory Movement */}
        <div className="bg-[#101214] border border-[#25282C] rounded-xl p-5 card-hover inner-glow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#FBBF24]/[0.03] to-transparent rounded-full -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform duration-700" />
          <div className="relative">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-[#F2F3F5]">Inventory Movement</h3>
              <p className="text-xs text-[#6F747C] mt-0.5">Stock in vs stock out</p>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryData} barGap={3}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6F747C', fontSize: 11 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6F747C', fontSize: 11 }} dx={-4} />
                  <Tooltip 
                    contentStyle={{ background: '#151719', border: '1px solid #25282C', borderRadius: 10, fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
                    labelStyle={{ color: '#F2F3F5', fontWeight: 600 }}
                    cursor={{ fill: '#151719', opacity: 0.5 }}
                  />
                  <Bar dataKey="in" fill="#34D399" radius={[4, 4, 0, 0]} barSize={14} name="Stock In" animationDuration={1200} />
                  <Bar dataKey="out" fill="#F87171" radius={[4, 4, 0, 0]} barSize={14} name="Stock Out" animationDuration={1200} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 stagger-children">
        {/* Low Stock */}
        <div className="bg-[#101214] border border-[#25282C] rounded-xl p-5 card-hover inner-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-[#FBBF24]/10 border border-[#FBBF24]/20">
                <AlertTriangle size={13} className="text-[#FBBF24]" />
              </div>
              <h3 className="text-sm font-semibold text-[#F2F3F5]">Low Stock Alert</h3>
            </div>
            <span className="text-[10px] font-medium text-[#6F747C] bg-[#151719] px-2 py-0.5 rounded-full border border-[#1E2024]">{lowStockItems.length} items</span>
          </div>
          <div className="space-y-2.5">
            {lowStockItems.map((item, i) => (
              <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg bg-[#0C0D0F] border border-[#1E2024] hover:border-[#25282C] transition-all duration-200 group/item" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#F2F3F5] truncate group-hover/item:text-white transition-colors">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-[#1A1C1F] rounded-full overflow-hidden">
                      <div className="h-full rounded-full progress-bar" style={{ width: `${Math.min((item.stock / item.minStock) * 100, 100)}%`, backgroundColor: item.stock === 0 ? '#F87171' : '#FBBF24' }} />
                    </div>
                    <span className="text-[10px] text-[#6F747C] font-mono">{item.stock}/{item.minStock}</span>
                  </div>
                </div>
                <Badge variant={item.stock === 0 ? 'error' : 'warning'} className="ml-2">
                  {item.stock === 0 ? 'Out' : 'Low'}
                </Badge>
              </div>
            ))}
            {lowStockItems.length === 0 && (
              <div className="text-center py-8">
                <div className="w-10 h-10 rounded-full bg-[#34D399]/10 border border-[#34D399]/20 flex items-center justify-center mx-auto mb-2">
                  <Shield size={16} className="text-[#34D399]" />
                </div>
                <p className="text-xs text-[#6F747C]">All items well stocked</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#101214] border border-[#25282C] rounded-xl p-5 card-hover inner-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-[#34D399]/10 border border-[#34D399]/20">
                <TrendingUp size={13} className="text-[#34D399]" />
              </div>
              <h3 className="text-sm font-semibold text-[#F2F3F5]">Recent Sales</h3>
            </div>
          </div>
          <div className="space-y-2">
            {recentSales.map((sale, i) => (
              <div key={sale.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#0C0D0F] border border-transparent hover:border-[#1E2024] transition-all duration-200 group/sale" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1A1C1F] to-[#151719] border border-[#25282C] flex items-center justify-center text-[10px] font-bold text-[#9A9EA5] group-hover/sale:border-[#35383C] transition-colors">
                    {sale.customerName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#F2F3F5] truncate">{sale.customerName}</p>
                    <p className="text-[10px] text-[#6F747C]">{formatDate(sale.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-[#F2F3F5]">{formatCurrency(sale.total)}</p>
                  <div className="flex items-center justify-end gap-0.5 mt-0.5">
                    <ArrowUpRight size={9} className="text-[#34D399]" />
                    <span className="text-[9px] text-[#34D399] font-medium">Completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-[#101214] border border-[#25282C] rounded-xl p-5 card-hover inner-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-[#60A5FA]/10 border border-[#60A5FA]/20">
                <Zap size={13} className="text-[#60A5FA]" />
              </div>
              <h3 className="text-sm font-semibold text-[#F2F3F5]">Top Products</h3>
            </div>
          </div>
          <div className="space-y-2">
            {topProducts.map((product, i) => {
              const maxRevenue = topProducts[0]?.revenue || 1;
              return (
                <div key={i} className="p-2.5 rounded-lg hover:bg-[#0C0D0F] border border-transparent hover:border-[#1E2024] transition-all duration-200" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-[#6F747C] w-4">#{i + 1}</span>
                      <p className="text-xs font-medium text-[#F2F3F5] truncate">{product.name}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#F2F3F5] ml-2">{formatCurrency(product.revenue)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-[#1A1C1F] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#60A5FA] to-[#34D399] progress-bar" style={{ width: `${(product.revenue / maxRevenue) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-[#6F747C] font-mono">{product.units} sold</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Profit Summary */}
      <div className="bg-[#101214] border border-[#25282C] rounded-xl p-5 card-hover inner-glow relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#34D399]/[0.03] to-transparent rounded-full -translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-[#34D399]/10 border border-[#34D399]/20">
                <DollarSign size={13} className="text-[#34D399]" />
              </div>
              <h3 className="text-sm font-semibold text-[#F2F3F5]">Profit Summary</h3>
            </div>
            <span className="text-[10px] text-[#6F747C] bg-[#151719] px-2 py-0.5 rounded-full border border-[#1E2024]">This Period</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-[#0C0D0F] border border-[#1E2024] hover:border-[#25282C] transition-colors">
              <p className="text-[10px] text-[#6F747C] uppercase tracking-wider font-medium">Revenue</p>
              <p className="text-lg font-bold text-[#F2F3F5] mt-1.5">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#0C0D0F] border border-[#1E2024] hover:border-[#25282C] transition-colors">
              <p className="text-[10px] text-[#6F747C] uppercase tracking-wider font-medium">Expenses</p>
              <p className="text-lg font-bold text-[#F87171] mt-1.5">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#0C0D0F] border border-[#1E2024] hover:border-[#25282C] transition-colors">
              <p className="text-[10px] text-[#6F747C] uppercase tracking-wider font-medium">COGS</p>
              <p className="text-lg font-bold text-[#F2F3F5] mt-1.5">{formatCurrency(totalRevenue - (totalRevenue - totalExpenses - (totalRevenue * 0.15)))}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-[#34D399]/5 to-transparent border border-[#34D399]/20 hover:border-[#34D399]/30 transition-colors">
              <p className="text-[10px] text-[#6F747C] uppercase tracking-wider font-medium">Net Profit</p>
              <p className={`text-lg font-bold mt-1.5 ${(totalRevenue - totalExpenses) >= 0 ? 'text-[#34D399]' : 'text-[#F87171]'}`}>{formatCurrency(totalRevenue - totalExpenses)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
