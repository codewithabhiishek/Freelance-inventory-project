import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Badge, formatCurrency, formatShortDate } from '../components/ui';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function Dashboard() {
  const { products, sales, invoices, expenses } = useStore();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  // KPIs
  const totalRevenue = sales.reduce((s, sale) => s + sale.total, 0);
  const inventoryValue = products.reduce((s, p) => s + (p.stock * p.costPrice), 0);
  const outstanding = invoices.reduce((s, i) => s + (i.total - i.paidAmount), 0);
  const overdueCount = invoices.filter(i => i.status === 'overdue').length;

  // Chart data
  const revenueData = [
    { day: 'Mon', revenue: 28500 },
    { day: 'Tue', revenue: 34200 },
    { day: 'Wed', revenue: 21800 },
    { day: 'Thu', revenue: 42100 },
    { day: 'Fri', revenue: 38700 },
    { day: 'Sat', revenue: 15400 },
    { day: 'Sun', revenue: 12200 },
  ];

  const inventoryData = [
    { day: 'Mon', in: 50, out: 12 },
    { day: 'Tue', in: 0, out: 25 },
    { day: 'Wed', in: 30, out: 8 },
    { day: 'Thu', in: 0, out: 18 },
    { day: 'Fri', in: 45, out: 32 },
    { day: 'Sat', in: 0, out: 5 },
    { day: 'Sun', in: 0, out: 3 },
  ];

  // Low stock
  const lowStock = products.filter(p => p.stock <= p.minStock).sort((a, b) => a.stock - b.stock).slice(0, 5);

  // Recent sales
  const recentSales = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  // Top products
  const productRevenue: Record<string, { name: string; units: number; revenue: number }> = {};
  sales.forEach(s => s.items.forEach(item => {
    if (!productRevenue[item.productId]) productRevenue[item.productId] = { name: item.productName, units: 0, revenue: 0 };
    productRevenue[item.productId].units += item.quantity;
    productRevenue[item.productId].revenue += item.total;
  }));
  const topProducts = Object.values(productRevenue).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <div className={`p-6 lg:p-8 space-y-8 ${loaded ? 'animate-fade-in' : 'opacity-0'}`}>
      
      {/* Page header */}
      <div>
        <h1 className="text-[20px] font-semibold text-[#EFEFF1] tracking-tight">Overview</h1>
        <p className="text-[13px] text-[#6B6B76] mt-0.5">Here's what's happening with your business today.</p>
      </div>

      {/* KPI Summary - cohesive, not 4 identical cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 pb-6 border-b border-[#1A1A1D]">
        <div>
          <p className="text-[12px] text-[#6B6B76] mb-1.5">Revenue</p>
          <p className="text-[26px] font-semibold text-[#EFEFF1] tracking-tight leading-none">{formatCurrency(totalRevenue)}</p>
          <p className="mt-2 text-[11px] text-[#4ADE80]">↑ 12.5% vs last month</p>
        </div>
        <div>
          <p className="text-[12px] text-[#6B6B76] mb-1.5">Sales</p>
          <p className="text-[26px] font-semibold text-[#EFEFF1] tracking-tight leading-none">{sales.length}</p>
          <p className="mt-2 text-[11px] text-[#6B6B76]">8 this week</p>
        </div>
        <div>
          <p className="text-[12px] text-[#6B6B76] mb-1.5">Inventory value</p>
          <p className="text-[26px] font-semibold text-[#EFEFF1] tracking-tight leading-none">{formatCurrency(inventoryValue)}</p>
          <p className="mt-2 text-[11px] text-[#6B6B76]">{products.length} products tracked</p>
        </div>
        <div>
          <p className="text-[12px] text-[#6B6B76] mb-1.5">Outstanding</p>
          <p className="text-[26px] font-semibold text-[#EFEFF1] tracking-tight leading-none">{formatCurrency(outstanding)}</p>
          {overdueCount > 0 ? (
            <p className="mt-2 text-[11px] text-[#F87171]">{overdueCount} overdue invoice{overdueCount > 1 ? 's' : ''}</p>
          ) : (
            <p className="mt-2 text-[11px] text-[#6B6B76]">All paid on time</p>
          )}
        </div>
      </div>

      {/* Charts - clean, native-looking */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Revenue chart - takes more space */}
        <div className="lg:col-span-3">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-[14px] font-semibold text-[#EFEFF1]">Revenue</h2>
            <span className="text-[11px] text-[#6B6B76]">Last 7 days</span>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EFEFF1" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#EFEFF1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B6B76', fontSize: 11 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B6B76', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ background: '#161618', border: '1px solid #242428', borderRadius: 6, fontSize: 12, padding: '6px 10px' }}
                  labelStyle={{ color: '#A1A1AA', fontSize: 11, marginBottom: 2 }}
                  itemStyle={{ color: '#EFEFF1', fontWeight: 500 }}
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  cursor={{ stroke: '#242428', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#EFEFF1" strokeWidth={1.5} fill="url(#revFill)" dot={false} activeDot={{ r: 3, fill: '#EFEFF1', stroke: '#0B0B0C', strokeWidth: 2 }} animationDuration={800} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory movement */}
        <div className="lg:col-span-2">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-[14px] font-semibold text-[#EFEFF1]">Inventory movement</h2>
            <span className="text-[11px] text-[#6B6B76]">This week</span>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }} barGap={2}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B6B76', fontSize: 11 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B6B76', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ background: '#161618', border: '1px solid #242428', borderRadius: 6, fontSize: 12, padding: '6px 10px' }}
                  labelStyle={{ color: '#A1A1AA', fontSize: 11, marginBottom: 2 }}
                  cursor={{ fill: '#161618' }}
                />
                <Bar dataKey="in" fill="#4ADE80" radius={[2, 2, 0, 0]} barSize={10} name="Stock in" animationDuration={600} />
                <Bar dataKey="out" fill="#F87171" radius={[2, 2, 0, 0]} barSize={10} name="Stock out" animationDuration={600} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm bg-[#4ADE80]" />
              <span className="text-[11px] text-[#6B6B76]">In</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm bg-[#F87171]" />
              <span className="text-[11px] text-[#6B6B76]">Out</span>
            </div>
          </div>
        </div>
      </div>

      {/* Business data sections - not cards, just grouped content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
        
        {/* Low stock - operational alert */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-semibold text-[#EFEFF1]">Low stock</h2>
            {lowStock.length > 0 && (
              <Badge variant="warning">{lowStock.length} items</Badge>
            )}
          </div>
          {lowStock.length === 0 ? (
            <p className="text-[12px] text-[#6B6B76] py-4">All items are well stocked.</p>
          ) : (
            <div className="divide-y divide-[#1A1A1D]">
              {lowStock.map(item => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-[#EFEFF1] truncate">{item.name}</p>
                    <p className="text-[11px] text-[#6B6B76] mt-0.5 font-mono">{item.stock} / {item.minStock} min</p>
                  </div>
                  <Badge variant={item.stock === 0 ? 'error' : 'warning'}>
                    {item.stock === 0 ? 'Out' : 'Low'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent sales */}
        <div>
          <h2 className="text-[14px] font-semibold text-[#EFEFF1] mb-3">Recent sales</h2>
          <div className="divide-y divide-[#1A1A1D]">
            {recentSales.map(sale => (
              <div key={sale.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-[#EFEFF1] truncate">{sale.customerName}</p>
                  <p className="text-[11px] text-[#6B6B76] mt-0.5">{formatShortDate(sale.date)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[13px] text-[#EFEFF1] font-medium tabular-nums">{formatCurrency(sale.total)}</p>
                  <Badge variant="success" className="mt-0.5">Paid</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div>
          <h2 className="text-[14px] font-semibold text-[#EFEFF1] mb-3">Top products</h2>
          <div className="divide-y divide-[#1A1A1D]">
            {topProducts.map((product, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="text-[11px] text-[#6B6B76] font-mono w-4 tabular-nums">{i + 1}</span>
                  <p className="text-[13px] text-[#EFEFF1] truncate">{product.name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[13px] text-[#EFEFF1] font-medium tabular-nums">{formatCurrency(product.revenue)}</p>
                  <p className="text-[11px] text-[#6B6B76] mt-0.5 tabular-nums">{product.units} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
