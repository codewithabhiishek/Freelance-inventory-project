import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { PageKey } from '../types';
import {
  LayoutDashboard, Package, Warehouse, ShoppingCart, Truck, Users, Building2,
  FileText, CreditCard, Receipt, BarChart3, UserCog, Settings, Search, Bell,
  Plus, ChevronLeft, LogOut, Menu, Command, ArrowRight
} from 'lucide-react';
import { Button, Badge, formatCurrency } from './ui';

const navGroups = [
  { label: 'Overview', items: [{ key: 'dashboard' as PageKey, label: 'Dashboard', icon: LayoutDashboard }] },
  { label: 'Operations', items: [
    { key: 'products' as PageKey, label: 'Products', icon: Package },
    { key: 'inventory' as PageKey, label: 'Inventory', icon: Warehouse },
    { key: 'sales' as PageKey, label: 'Sales', icon: ShoppingCart },
    { key: 'purchases' as PageKey, label: 'Purchases', icon: Truck },
    { key: 'customers' as PageKey, label: 'Customers', icon: Users },
    { key: 'suppliers' as PageKey, label: 'Suppliers', icon: Building2 },
  ]},
  { label: 'Finance', items: [
    { key: 'invoices' as PageKey, label: 'Invoices', icon: FileText },
    { key: 'payments' as PageKey, label: 'Payments', icon: CreditCard },
    { key: 'expenses' as PageKey, label: 'Expenses', icon: Receipt },
  ]},
  { label: 'Insights', items: [{ key: 'reports' as PageKey, label: 'Reports', icon: BarChart3 }] },
  { label: 'System', items: [
    { key: 'users' as PageKey, label: 'Users', icon: UserCog },
    { key: 'settings' as PageKey, label: 'Settings', icon: Settings },
  ]},
];

const breadcrumbs: Record<PageKey, string> = {
  dashboard: 'Dashboard', products: 'Products', inventory: 'Inventory', sales: 'Sales',
  purchases: 'Purchases', customers: 'Customers', suppliers: 'Suppliers', invoices: 'Invoices',
  payments: 'Payments', expenses: 'Expenses', reports: 'Reports', users: 'Users', settings: 'Settings',
};

// Global Search Modal
function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const store = useStore();
  
  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  if (!open) return null;

  const results: { type: string; label: string; sublabel: string; page: PageKey }[] = [];
  if (query.length > 1) {
    const q = query.toLowerCase();
    store.products.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)).slice(0, 5)
      .forEach(p => results.push({ type: 'Product', label: p.name, sublabel: p.sku, page: 'products' }));
    store.customers.filter(c => c.name.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q)).slice(0, 5)
      .forEach(c => results.push({ type: 'Customer', label: c.name, sublabel: c.company || c.email, page: 'customers' }));
    store.suppliers.filter(s => s.name.toLowerCase().includes(q) || s.company.toLowerCase().includes(q)).slice(0, 5)
      .forEach(s => results.push({ type: 'Supplier', label: s.company, sublabel: s.name, page: 'suppliers' }));
    store.invoices.filter(i => i.invoiceNumber.toLowerCase().includes(q) || i.customerName.toLowerCase().includes(q)).slice(0, 5)
      .forEach(i => results.push({ type: 'Invoice', label: i.invoiceNumber, sublabel: i.customerName, page: 'invoices' }));
    store.sales.filter(s => s.invoiceNumber.toLowerCase().includes(q) || s.customerName.toLowerCase().includes(q)).slice(0, 5)
      .forEach(s => results.push({ type: 'Sale', label: s.invoiceNumber, sublabel: s.customerName, page: 'sales' }));
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/70 modal-backdrop animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-[#101214] border border-[#25282C] rounded-xl shadow-2xl shadow-black/40 animate-fade-in-scale inner-glow overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#25282C] bg-[#0C0D0F]/50">
          <Search size={16} className="text-[#6F747C]" />
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search products, customers, invoices..."
            className="flex-1 bg-transparent text-sm text-[#F2F3F5] placeholder:text-[#6F747C] outline-none" />
          <kbd className="px-1.5 py-0.5 text-[10px] text-[#6F747C] bg-[#151719] border border-[#25282C] rounded font-mono">ESC</kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto py-2">
          {results.length === 0 && query.length > 1 && (
            <div className="px-4 py-8 text-center text-sm text-[#6F747C]">No results found</div>
          )}
          {results.map((r, i) => (
            <button key={i} onClick={() => { store.setCurrentPage(r.page); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#1A1C1F] transition-all duration-200 text-left group/result border-l-2 border-transparent hover:border-[#F2F3F5]"
              style={{ animationDelay: `${i * 30}ms` }}>
              <span className="text-[10px] font-medium text-[#6F747C] bg-[#151719] border border-[#25282C] rounded px-1.5 py-0.5 uppercase group-hover/result:border-[#35383C] transition-colors">{r.type}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[#F2F3F5] truncate group-hover/result:text-white transition-colors">{r.label}</div>
                <div className="text-xs text-[#6F747C] truncate">{r.sublabel}</div>
              </div>
              <ArrowRight size={12} className="text-[#6F747C] opacity-0 group-hover/result:opacity-100 transition-opacity" />
            </button>
          ))}
          {query.length <= 1 && (
            <div className="px-4 py-6 text-center">
              <p className="text-xs text-[#6F747C]">Start typing to search across all data</p>
              <div className="flex items-center justify-center gap-4 mt-3">
                <span className="text-[10px] text-[#6F747C]">⌘K to open</span>
                <span className="text-[10px] text-[#6F747C]">ESC to close</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentPage, setCurrentPage, sidebarCollapsed, toggleSidebar, currentUser, logout, notifications, settings } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(o => !o); }
      if (e.key === 'Escape') { setSearchOpen(false); setNotifOpen(false); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#090A0C]">
      {/* Mobile overlay */}
      {mobileMenuOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}
      
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 flex flex-col bg-[#0C0D0F] border-r border-[#1E2024] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${sidebarCollapsed ? 'w-[60px]' : 'w-[220px]'} ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center h-14 px-4 border-b border-[#1E2024]">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 animate-fade-in-left">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#F2F3F5] to-[#9A9EA5] flex items-center justify-center">
                <span className="text-[9px] font-black text-[#090A0C]">SF</span>
              </div>
              <span className="text-sm font-semibold text-[#F2F3F5] tracking-tight">StockFlow</span>
            </div>
          )}
          {sidebarCollapsed && <span className="text-sm font-bold text-[#F2F3F5] w-full text-center">SF</span>}
        </div>
        
        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {navGroups.map(group => (
            <div key={group.label} className="mb-4">
              {!sidebarCollapsed && <p className="px-2 mb-1.5 text-[10px] font-semibold text-[#6F747C] uppercase tracking-wider">{group.label}</p>}
              {sidebarCollapsed && <div className="h-px bg-[#1E2024] mx-1 mb-2" />}
              {group.items.map(item => {
                const active = currentPage === item.key;
                return (
                  <button key={item.key} onClick={() => { setCurrentPage(item.key); setMobileMenuOpen(false); }}
                    className={`nav-item w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-all duration-200 mb-0.5 btn-press ${active ? 'active bg-[#1A1C1F] text-[#F2F3F5]' : 'text-[#6F747C] hover:text-[#9A9EA5] hover:bg-[#151719] hover:pl-3'}`}
                    title={sidebarCollapsed ? item.label : undefined}>
                    <item.icon size={16} className={`transition-all duration-200 ${active ? 'text-[#F2F3F5]' : 'group-hover:scale-110'}`} />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        
        {/* Bottom */}
        <div className="border-t border-[#1E2024] p-2">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2.5 px-2 py-2">
              <div className="w-7 h-7 rounded-full bg-[#1A1C1F] border border-[#25282C] flex items-center justify-center text-xs font-medium text-[#9A9EA5]">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#F2F3F5] truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-[#6F747C] capitalize">{currentUser?.role}</p>
              </div>
              <button onClick={logout} className="p-1 rounded hover:bg-[#1A1C1F] text-[#6F747C] hover:text-[#F87171] transition-default"><LogOut size={14} /></button>
            </div>
          ) : (
            <button onClick={logout} className="w-full flex items-center justify-center p-2 rounded-md hover:bg-[#1A1C1F] text-[#6F747C] hover:text-[#F87171] transition-default">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex items-center h-14 px-4 lg:px-6 border-b border-[#1E2024] bg-[#090A0C]/80 backdrop-blur-md gap-3 sticky top-0 z-20">
          <button onClick={() => { if (window.innerWidth < 1024) setMobileMenuOpen(true); else toggleSidebar(); }}
            className="p-1.5 rounded-md hover:bg-[#1A1C1F] text-[#6F747C] hover:text-[#F2F3F5] transition-all duration-200 btn-press">
            <Menu size={16} />
          </button>
          
          <nav className="hidden md:flex items-center text-sm animate-fade-in-left">
            <span className="text-[#6F747C]">StockFlow</span>
            <span className="mx-2 text-[#25282C]">/</span>
            <span className="text-[#F2F3F5] font-medium">{breadcrumbs[currentPage]}</span>
          </nav>

          <div className="flex-1" />

          {/* Search */}
          <button onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#101214] border border-[#25282C] text-[#6F747C] hover:border-[#35383C] transition-default">
            <Search size={13} />
            <span className="text-xs">Search...</span>
            <kbd className="px-1 py-0.5 text-[9px] bg-[#151719] border border-[#25282C] rounded">⌘K</kbd>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg hover:bg-[#1A1C1F] text-[#6F747C] hover:text-[#F2F3F5] transition-all duration-200 btn-press">
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F87171] rounded-full notif-dot">
                  <span className="absolute inset-0 rounded-full bg-[#F87171]" />
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#101214] border border-[#25282C] rounded-xl shadow-2xl shadow-black/30 z-50 animate-slide-down inner-glow overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#25282C] bg-[#0C0D0F]/50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#F2F3F5]">Notifications</span>
                    {unreadCount > 0 && <span className="text-[10px] font-bold text-[#F87171] bg-[#F87171]/10 px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                  </div>
                  <button onClick={() => useStore.getState().markAllNotificationsRead()} className="text-[11px] text-[#6F747C] hover:text-[#F2F3F5] transition-colors font-medium">Mark all read</button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  {notifications.slice(0, 10).map((n, i) => (
                    <div key={n.id} onClick={() => { useStore.getState().markNotificationRead(n.id); setNotifOpen(false); }}
                      className={`px-4 py-3 border-b border-[#1E2024] cursor-pointer hover:bg-[#151719] transition-all duration-200 border-l-2 ${!n.read ? 'bg-[#0D0E10] border-l-[#60A5FA]' : 'border-l-transparent'}`}
                      style={{ animationDelay: `${i * 30}ms` }}>
                      <div className="flex items-start gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          n.type === 'low_stock' ? 'bg-[#FBBF24]/10 text-[#FBBF24]' :
                          n.type === 'out_of_stock' ? 'bg-[#F87171]/10 text-[#F87171]' :
                          n.type === 'overdue_invoice' ? 'bg-[#F87171]/10 text-[#F87171]' :
                          n.type === 'payment_received' ? 'bg-[#34D399]/10 text-[#34D399]' :
                          'bg-[#60A5FA]/10 text-[#60A5FA]'
                        }`}>
                          <Bell size={12} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#F2F3F5]">{n.title}</p>
                          <p className="text-[11px] text-[#6F747C] mt-0.5 line-clamp-2">{n.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick action */}
          <Button size="sm" variant="secondary" onClick={() => setCurrentPage('sales')} className="hidden sm:inline-flex">
            <Plus size={13} /> New Sale
          </Button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
