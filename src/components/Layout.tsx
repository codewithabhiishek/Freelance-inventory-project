import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { PageKey } from '../types';
import {
  LayoutDashboard, Package, Warehouse, ShoppingCart, Truck, Users, Building2,
  FileText, CreditCard, Receipt, BarChart3, UserCog, Settings, Search, Bell,
  Plus, LogOut, Menu, Command, ArrowRight, Sun, Moon, Keyboard, X, Check
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

const shortcuts = [
  { keys: ['⌘', 'K'], action: 'Open search', description: 'Search products, customers, invoices' },
  { keys: ['N'], action: 'New sale', description: 'Create a new sale' },
  { keys: ['G'], action: 'Go to dashboard', description: 'Navigate to dashboard' },
  { keys: ['P'], action: 'Go to products', description: 'Navigate to products page' },
  { keys: ['I'], action: 'Go to inventory', description: 'Navigate to inventory page' },
  { keys: ['?'], action: 'Keyboard shortcuts', description: 'Show this help dialog' },
  { keys: ['T'], action: 'Toggle theme', description: 'Switch between light and dark mode' },
  { keys: ['Esc'], action: 'Close', description: 'Close any open modal or panel' },
];

// Global Search Modal
function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const store = useStore();
  
  useEffect(() => { if (open) setQuery(''); }, [open]);
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

// Keyboard Shortcuts Modal
function ShortcutsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 modal-backdrop animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#101214] border border-[#25282C] rounded-xl shadow-2xl shadow-black/40 animate-fade-in-scale inner-glow overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#25282C]">
          <div className="flex items-center gap-2">
            <Keyboard size={16} className="text-[#9A9EA5]" />
            <h2 className="text-base font-semibold text-[#F2F3F5]">Keyboard Shortcuts</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-[#1A1C1F] text-[#6F747C] hover:text-[#F2F3F5] transition-all duration-200 hover:rotate-90"><X size={15} /></button>
        </div>
        <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-1">
            {shortcuts.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[#151719] transition-all duration-200 group" style={{ animationDelay: `${i * 30}ms` }}>
                <div>
                  <p className="text-sm font-medium text-[#F2F3F5]">{s.action}</p>
                  <p className="text-[11px] text-[#6F747C] mt-0.5">{s.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  {s.keys.map((key, ki) => (
                    <React.Fragment key={ki}>
                      <kbd className="px-2 py-1 text-[11px] font-mono font-medium text-[#9A9EA5] bg-[#151719] border border-[#25282C] rounded-md group-hover:border-[#35383C] transition-colors min-w-[24px] text-center">{key}</kbd>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentPage, setCurrentPage, sidebarCollapsed, toggleSidebar, currentUser, logout, notifications, settings, theme, toggleTheme, shortcutsOpen, setShortcutsOpen } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close notification panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(o => !o); }
      if (e.key === 'Escape') { setSearchOpen(false); setNotifOpen(false); setShortcutsOpen(false); }
      
      if (!isInput && !searchOpen && !notifOpen && !shortcutsOpen) {
        if (e.key === '?') { e.preventDefault(); setShortcutsOpen(true); }
        if (e.key === 'n' || e.key === 'N') { setCurrentPage('sales'); }
        if (e.key === 'g' || e.key === 'G') { setCurrentPage('dashboard'); }
        if (e.key === 'p' || e.key === 'P') { setCurrentPage('products'); }
        if (e.key === 'i' || e.key === 'I') { setCurrentPage('inventory'); }
        if (e.key === 't' || e.key === 'T') { toggleTheme(); }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [searchOpen, notifOpen, shortcutsOpen]);

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.body.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#090A0C]">
      {/* Mobile overlay */}
      {mobileMenuOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden animate-fade-in" onClick={() => setMobileMenuOpen(false)} />}
      
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
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#101214] border border-[#25282C] text-[#6F747C] hover:border-[#35383C] transition-all duration-200 btn-press">
            <Search size={13} />
            <span className="text-xs">Search...</span>
            <kbd className="px-1 py-0.5 text-[9px] bg-[#151719] border border-[#25282C] rounded">⌘K</kbd>
          </button>

          {/* Theme Toggle */}
          <button onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[#1A1C1F] text-[#6F747C] hover:text-[#F2F3F5] transition-all duration-200 btn-press group"
            title="Toggle theme (T)">
            {theme === 'dark' ? (
              <Sun size={16} className="transition-transform duration-300 group-hover:rotate-45" />
            ) : (
              <Moon size={16} className="transition-transform duration-300 group-hover:-rotate-12" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => setNotifOpen(!notifOpen)} 
              className="relative p-2 rounded-lg hover:bg-[#1A1C1F] text-[#6F747C] hover:text-[#F2F3F5] transition-all duration-200 btn-press group/bell"
              title="Notifications">
              <Bell size={16} className={`transition-transform duration-200 ${notifOpen ? 'animate-bell-ring' : 'group-hover/bell:scale-110'}`} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 bg-[#F87171] text-white text-[10px] font-bold rounded-full border-2 border-[#090A0C] animate-count-pop shadow-lg shadow-red-500/20">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)}>
                <div className="absolute right-4 lg:right-6 top-14 w-[calc(100vw-2rem)] max-w-sm bg-[#101214] border border-[#25282C] rounded-xl shadow-2xl shadow-black/30 z-50 animate-slide-down inner-glow overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#25282C] bg-[#0C0D0F]/50">
                    <div className="flex items-center gap-2">
                      <Bell size={14} className="text-[#9A9EA5]" />
                      <span className="text-sm font-semibold text-[#F2F3F5]">Notifications</span>
                      {unreadCount > 0 && <span className="text-[10px] font-bold text-white bg-[#F87171] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{unreadCount}</span>}
                    </div>
                    <button onClick={() => useStore.getState().markAllNotificationsRead()} className="text-[11px] text-[#6F747C] hover:text-[#F2F3F5] transition-colors font-medium flex items-center gap-1 btn-press">
                      <Check size={11} /> Mark all read
                    </button>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-[#151719] border border-[#25282C] flex items-center justify-center mx-auto mb-3">
                          <Bell size={18} className="text-[#6F747C]" />
                        </div>
                        <p className="text-sm text-[#6F747C]">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.slice(0, 15).map((n, i) => (
                        <div key={n.id} onClick={() => { useStore.getState().markNotificationRead(n.id); setNotifOpen(false); }}
                          className={`px-4 py-3 border-b border-[#1E2024] last:border-0 cursor-pointer hover:bg-[#151719] transition-all duration-200 border-l-2 animate-fade-in ${!n.read ? 'bg-[#0D0E10] border-l-[#60A5FA]' : 'border-l-transparent'}`}
                          style={{ animationDelay: `${i * 30}ms` }}>
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 hover:scale-110 ${
                              n.type === 'low_stock' ? 'bg-[#FBBF24]/10 text-[#FBBF24]' :
                              n.type === 'out_of_stock' ? 'bg-[#F87171]/10 text-[#F87171]' :
                              n.type === 'overdue_invoice' ? 'bg-[#F87171]/10 text-[#F87171]' :
                              n.type === 'payment_received' ? 'bg-[#34D399]/10 text-[#34D399]' :
                              'bg-[#60A5FA]/10 text-[#60A5FA]'
                            }`}>
                              {n.type === 'low_stock' ? <Package size={14} /> :
                               n.type === 'out_of_stock' ? <Package size={14} /> :
                               n.type === 'overdue_invoice' ? <FileText size={14} /> :
                               n.type === 'payment_received' ? <CreditCard size={14} /> :
                               <Bell size={14} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-semibold text-[#F2F3F5]">{n.title}</p>
                                {!n.read && <span className="w-2 h-2 rounded-full bg-[#60A5FA] flex-shrink-0 mt-1" />}
                              </div>
                              <p className="text-[11px] text-[#6F747C] mt-0.5 leading-relaxed">{n.message}</p>
                              <p className="text-[10px] text-[#495057] mt-1">{n.date}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-[#25282C] bg-[#0C0D0F]/30">
                      <button onClick={() => { setNotifOpen(false); }} className="w-full text-center text-[11px] text-[#6F747C] hover:text-[#F2F3F5] transition-colors font-medium btn-press py-1">
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Shortcuts hint */}
          <button onClick={() => setShortcutsOpen(true)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-[#1A1C1F] text-[#6F747C] hover:text-[#F2F3F5] transition-all duration-200 btn-press group"
            title="Keyboard shortcuts (?)">
            <Keyboard size={16} className="transition-transform duration-200 group-hover:scale-110" />
          </button>

          {/* Quick action */}
          <Button size="sm" variant="secondary" onClick={() => setCurrentPage('sales')} className="hidden sm:inline-flex">
            <Plus size={13} /> New Sale
          </Button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Floating shortcut hint */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300 group/hint">
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#101214] border border-[#25282C] shadow-lg shadow-black/20 opacity-0 group-hover/hint:opacity-100 transition-all duration-300 translate-y-2 group-hover/hint:translate-y-0">
            <Keyboard size={11} className="text-[#6F747C]" />
            <span className="text-[10px] text-[#6F747C]">Press</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[#9A9EA5] bg-[#151719] border border-[#25282C] rounded">?</kbd>
            <span className="text-[10px] text-[#6F747C]">for shortcuts</span>
          </div>
        </div>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}
