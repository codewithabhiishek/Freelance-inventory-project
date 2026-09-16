import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { PageKey } from '../types';
import {
  LayoutDashboard, Package, Warehouse, ShoppingCart, Truck, Users, Building2,
  FileText, CreditCard, Receipt, BarChart3, UserCog, Settings, Search, Bell,
  Plus, LogOut, Menu, Sun, Moon, Keyboard, X, Check, ArrowRight, Package as PackageIcon
} from 'lucide-react';
import { Button, Badge } from './ui';

const navGroups = [
  { label: '', items: [{ key: 'dashboard' as PageKey, label: 'Dashboard', icon: LayoutDashboard }] },
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
  { label: '', items: [
    { key: 'reports' as PageKey, label: 'Reports', icon: BarChart3 },
  ]},
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
  { keys: ['⌘', 'K'], action: 'Search', description: 'Search products, customers, invoices' },
  { keys: ['N'], action: 'New sale', description: 'Create a new sale' },
  { keys: ['G'], action: 'Dashboard', description: 'Navigate to dashboard' },
  { keys: ['P'], action: 'Products', description: 'Navigate to products' },
  { keys: ['I'], action: 'Inventory', description: 'Navigate to inventory' },
  { keys: ['T'], action: 'Theme', description: 'Toggle light/dark mode' },
  { keys: ['?'], action: 'Shortcuts', description: 'Show keyboard shortcuts' },
  { keys: ['Esc'], action: 'Close', description: 'Close any open panel' },
];

// Global Search
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
    store.invoices.filter(i => i.invoiceNumber.toLowerCase().includes(q) || i.customerName.toLowerCase().includes(q)).slice(0, 5)
      .forEach(i => results.push({ type: 'Invoice', label: i.invoiceNumber, sublabel: i.customerName, page: 'invoices' }));
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[18vh]">
      <div className="absolute inset-0 bg-black/60 modal-backdrop animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#111113] border border-[#242428] rounded-lg shadow-2xl animate-fade-in-scale overflow-hidden">
        <div className="flex items-center gap-2.5 px-3.5 h-11 border-b border-[#242428]">
          <Search size={14} className="text-[#6B6B76]" />
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent text-[13px] text-[#EFEFF1] placeholder:text-[#45454D] outline-none" />
          <kbd className="text-[10px] text-[#6B6B76] bg-[#161618] border border-[#242428] rounded px-1.5 py-0.5 font-mono">ESC</kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto py-1">
          {results.length === 0 && query.length > 1 && (
            <div className="px-4 py-8 text-center text-[12px] text-[#6B6B76]">No results</div>
          )}
          {results.map((r, i) => (
            <button key={i} onClick={() => { store.setCurrentPage(r.page); onClose(); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#161618] transition-colors text-left">
              <span className="text-[10px] text-[#6B6B76] bg-[#161618] border border-[#242428] rounded px-1 py-0.5 font-mono">{r.type}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-[#EFEFF1] truncate">{r.label}</div>
                <div className="text-[11px] text-[#6B6B76] truncate">{r.sublabel}</div>
              </div>
            </button>
          ))}
          {query.length <= 1 && (
            <div className="px-4 py-6 text-center">
              <p className="text-[12px] text-[#6B6B76]">Type to search across all data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Shortcuts Modal
function ShortcutsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 modal-backdrop animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#111113] border border-[#242428] rounded-lg animate-fade-in-scale">
        <div className="flex items-center justify-between px-4 h-11 border-b border-[#242428]">
          <h2 className="text-[13px] font-semibold text-[#EFEFF1]">Keyboard shortcuts</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#1C1C1F] text-[#6B6B76]"><X size={13} /></button>
        </div>
        <div className="p-2">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#161618]">
              <span className="text-[12px] text-[#A1A1AA]">{s.action}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((key, ki) => (
                  <kbd key={ki} className="px-1.5 py-0.5 text-[10px] font-mono text-[#A1A1AA] bg-[#161618] border border-[#242428] rounded min-w-[20px] text-center">{key}</kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentPage, setCurrentPage, sidebarCollapsed, toggleSidebar, currentUser, logout, notifications, theme, toggleTheme, shortcutsOpen, setShortcutsOpen } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(o => !o); }
      if (e.key === 'Escape') { setSearchOpen(false); setNotifOpen(false); setShortcutsOpen(false); }
      if (!isInput && !searchOpen && !notifOpen && !shortcutsOpen) {
        if (e.key === '?') { e.preventDefault(); setShortcutsOpen(true); }
        if (e.key === 'n' || e.key === 'N') setCurrentPage('sales');
        if (e.key === 'g' || e.key === 'G') setCurrentPage('dashboard');
        if (e.key === 'p' || e.key === 'P') setCurrentPage('products');
        if (e.key === 'i' || e.key === 'I') setCurrentPage('inventory');
        if (e.key === 't' || e.key === 'T') toggleTheme();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [searchOpen, notifOpen, shortcutsOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.body.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0B0C]">
      {mobileMenuOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}
      
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 flex flex-col bg-[#111113] border-r border-[#1A1A1D] transition-all duration-200 ${sidebarCollapsed ? 'w-[52px]' : 'w-[200px]'} ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Logo */}
        <div className="flex items-center h-12 px-3 border-b border-[#1A1A1D]">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#EFEFF1] flex items-center justify-center">
                <span className="text-[8px] font-black text-[#0B0B0C]">SF</span>
              </div>
              <span className="text-[13px] font-semibold text-[#EFEFF1] tracking-tight">StockFlow</span>
            </div>
          ) : (
            <div className="w-5 h-5 rounded bg-[#EFEFF1] flex items-center justify-center mx-auto">
              <span className="text-[8px] font-black text-[#0B0B0C]">SF</span>
            </div>
          )}
        </div>
        
        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-1.5">
          {navGroups.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-4' : ''}>
              {!sidebarCollapsed && group.label && (
                <p className="px-2 mb-1 text-[10px] font-medium text-[#45454D] uppercase tracking-wider">{group.label}</p>
              )}
              {sidebarCollapsed && group.label && <div className="h-px bg-[#1A1A1D] mx-1 my-2" />}
              {group.items.map(item => {
                const active = currentPage === item.key;
                return (
                  <button key={item.key} onClick={() => { setCurrentPage(item.key); setMobileMenuOpen(false); }}
                    className={`nav-active w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors mb-0.5 ${active ? 'bg-[#1C1C1F] text-[#EFEFF1]' : 'text-[#6B6B76] hover:text-[#A1A1AA] hover:bg-[#161618]'}`}
                    title={sidebarCollapsed ? item.label : undefined}>
                    <item.icon size={15} strokeWidth={active ? 2 : 1.5} />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        
        {/* User */}
        <div className="border-t border-[#1A1A1D] p-1.5">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#161618] transition-colors">
              <div className="w-6 h-6 rounded-full bg-[#1C1C1F] border border-[#242428] flex items-center justify-center text-[10px] font-medium text-[#A1A1AA]">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-[#EFEFF1] truncate leading-tight">{currentUser?.name}</p>
                <p className="text-[10px] text-[#6B6B76] capitalize leading-tight">{currentUser?.role}</p>
              </div>
              <button onClick={logout} className="p-1 rounded hover:bg-[#1C1C1F] text-[#6B6B76] hover:text-[#F87171] transition-colors"><LogOut size={12} /></button>
            </div>
          ) : (
            <button onClick={logout} className="w-full flex items-center justify-center p-1.5 rounded-md hover:bg-[#161618] text-[#6B6B76] hover:text-[#F87171] transition-colors">
              <LogOut size={14} />
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center h-12 px-4 lg:px-6 border-b border-[#1A1A1D] bg-[#0B0B0C] gap-2 flex-shrink-0">
          <button onClick={() => { if (window.innerWidth < 1024) setMobileMenuOpen(true); else toggleSidebar(); }}
            className="p-1.5 rounded hover:bg-[#161618] text-[#6B6B76] hover:text-[#EFEFF1] transition-colors">
            <Menu size={15} />
          </button>
          
          <nav className="hidden md:flex items-center text-[13px]">
            <span className="text-[#6B6B76]">{breadcrumbs[currentPage]}</span>
          </nav>

          <div className="flex-1" />

          <button onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 h-7 px-2.5 rounded-md bg-[#111113] border border-[#242428] text-[#6B6B76] hover:border-[#2E2E33] transition-colors">
            <Search size={12} />
            <span className="text-[12px]">Search...</span>
            <kbd className="text-[9px] bg-[#161618] border border-[#242428] rounded px-1 py-0.5 font-mono">⌘K</kbd>
          </button>

          <button onClick={toggleTheme} className="p-1.5 rounded hover:bg-[#161618] text-[#6B6B76] hover:text-[#EFEFF1] transition-colors" title="Toggle theme (T)">
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <div ref={notifRef} className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-1.5 rounded hover:bg-[#161618] text-[#6B6B76] hover:text-[#EFEFF1] transition-colors">
              <Bell size={14} className={notifOpen ? 'animate-bell-ring' : ''} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] flex items-center justify-center px-0.5 bg-[#F87171] text-white text-[9px] font-bold rounded-full border border-[#0B0B0C] animate-count-pop">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-[45] bg-black/20" onClick={() => setNotifOpen(false)} />
                <div className="fixed top-[3.5rem] right-4 lg:right-6 w-80 bg-[#111113] border border-[#242428] rounded-lg shadow-2xl z-[50] animate-slide-down overflow-hidden">
                  <div className="flex items-center justify-between px-3.5 h-10 border-b border-[#242428]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-semibold text-[#EFEFF1]">Notifications</span>
                      {unreadCount > 0 && <span className="text-[10px] font-bold text-white bg-[#F87171] px-1 py-0.5 rounded-full min-w-[14px] text-center">{unreadCount}</span>}
                    </div>
                    <button onClick={() => useStore.getState().markAllNotificationsRead()} className="text-[11px] text-[#6B6B76] hover:text-[#EFEFF1] transition-colors flex items-center gap-1">
                      <Check size={10} /> Read all
                    </button>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-10 text-center">
                        <p className="text-[12px] text-[#6B6B76]">No notifications</p>
                      </div>
                    ) : (
                      notifications.slice(0, 15).map((n) => (
                        <div key={n.id} onClick={() => { useStore.getState().markNotificationRead(n.id); setNotifOpen(false); }}
                          className={`px-3.5 py-2.5 border-b border-[#1A1A1D] last:border-0 cursor-pointer hover:bg-[#161618] transition-colors ${!n.read ? 'bg-[#0F0F11]' : ''}`}>
                          <div className="flex items-start gap-2.5">
                            <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                              n.type === 'low_stock' || n.type === 'out_of_stock' ? 'bg-[#FBBF24]/10 text-[#FBBF24]' :
                              n.type === 'overdue_invoice' ? 'bg-[#F87171]/10 text-[#F87171]' :
                              n.type === 'payment_received' ? 'bg-[#4ADE80]/10 text-[#4ADE80]' :
                              'bg-[#60A5FA]/10 text-[#60A5FA]'
                            }`}>
                              {n.type.includes('stock') ? <PackageIcon size={11} /> :
                               n.type === 'overdue_invoice' ? <FileText size={11} /> :
                               n.type === 'payment_received' ? <CreditCard size={11} /> :
                               <Bell size={11} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-[12px] font-medium text-[#EFEFF1] leading-tight">{n.title}</p>
                                {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] flex-shrink-0 mt-1" />}
                              </div>
                              <p className="text-[11px] text-[#6B6B76] mt-0.5 leading-snug line-clamp-2">{n.message}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <button onClick={() => setShortcutsOpen(true)} className="hidden lg:flex p-1.5 rounded hover:bg-[#161618] text-[#6B6B76] hover:text-[#EFEFF1] transition-colors" title="Shortcuts (?)">
            <Keyboard size={14} />
          </button>

          <Button size="sm" variant="secondary" onClick={() => setCurrentPage('sales')} className="hidden sm:inline-flex">
            <Plus size={12} /> New sale
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}
