import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, AlertTriangle, Search } from 'lucide-react';

// Button
export function Button({ children, variant = 'primary', size = 'md', className = '', disabled, onClick, type = 'button', ...props }: {
  children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'; size?: 'sm' | 'md' | 'lg'; className?: string; disabled?: boolean; onClick?: () => void; type?: 'button' | 'submit';
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded-md btn-press disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-200';
  const variants = {
    primary: 'bg-[#F2F3F5] text-[#090A0C] hover:bg-white hover:shadow-lg hover:shadow-white/5 active:bg-[#E0E1E3]',
    secondary: 'bg-[#1A1C1F] text-[#F2F3F5] border border-[#25282C] hover:bg-[#202225] hover:border-[#35383C] hover:shadow-lg hover:shadow-black/20',
    ghost: 'text-[#9A9EA5] hover:text-[#F2F3F5] hover:bg-[#1A1C1F]',
    danger: 'bg-[#DC2626] text-white hover:bg-[#EF4444] hover:shadow-lg hover:shadow-red-500/20',
    outline: 'border border-[#25282C] text-[#9A9EA5] hover:text-[#F2F3F5] hover:bg-[#1A1C1F] hover:border-[#35383C]',
  };
  const sizes = { sm: 'px-2.5 py-1.5 text-xs gap-1.5', md: 'px-3.5 py-2 text-sm gap-2', lg: 'px-4 py-2.5 text-sm gap-2' };
  return <button type={type} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled} onClick={onClick} {...props}>{children}</button>;
}

// Input
export function Input({ label, error, helperText, className = '', id, ...props }: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string; error?: string; helperText?: string;
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="space-y-1.5">
      {label && <label htmlFor={inputId} className="block text-xs font-medium text-[#9A9EA5]">{label}</label>}
      <input id={inputId} className={`w-full px-3 py-2 text-sm bg-[#151719] border border-[#25282C] rounded-lg text-[#F2F3F5] placeholder-[#495057] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all duration-200 ${error ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]' : ''} ${className}`} {...props} />
      {error && <p className="text-[11px] text-[#F87171]">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-[#495057]">{helperText}</p>}
    </div>
  );
}

// Select
export function Select({ label, error, options, className = '', id, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string; error?: string; options: { value: string; label: string }[];
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="space-y-1.5">
      {label && <label htmlFor={selectId} className="block text-xs font-medium text-[#9A9EA5]">{label}</label>}
      <select id={selectId} className={`w-full px-3 py-2 text-sm bg-[#151719] border border-[#25282C] rounded-lg text-[#F2F3F5] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all duration-200 ${error ? 'border-[#DC2626]' : ''} ${className}`} {...props}>
        {options.map(opt => <option key={opt.value} value={opt.value} className="bg-[#151719] text-[#F2F3F5]">{opt.label}</option>)}
      </select>
      {error && <p className="text-[11px] text-[#F87171]">{error}</p>}
    </div>
  );
}

// Textarea
export function Textarea({ label, error, className = '', id, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string; error?: string;
}) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="space-y-1.5">
      {label && <label htmlFor={textareaId} className="block text-xs font-medium text-[#9A9EA5]">{label}</label>}
      <textarea id={textareaId} className={`w-full px-3 py-2 text-sm bg-[#151719] border border-[#25282C] rounded-lg text-[#F2F3F5] placeholder-[#495057] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all duration-200 ${error ? 'border-[#DC2626]' : ''} ${className}`} {...props} />
      {error && <p className="text-[11px] text-[#F87171]">{error}</p>}
    </div>
  );
}

// Badge
export function Badge({ children, variant = 'neutral', className = '' }: {
  children: ReactNode; variant?: 'success' | 'warning' | 'danger' | 'error' | 'info' | 'neutral' | 'default'; className?: string;
}) {
  const variants = {
    success: 'bg-[#34D399]/10 text-[#34D399] border-[#34D399]/20',
    warning: 'bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/20',
    danger: 'bg-[#F87171]/10 text-[#F87171] border-[#F87171]/20',
    error: 'bg-[#F87171]/10 text-[#F87171] border-[#F87171]/20',
    info: 'bg-[#60A5FA]/10 text-[#60A5FA] border-[#60A5FA]/20',
    neutral: 'bg-[#151719] text-[#6F747C] border-[#25282C]',
    default: 'bg-[#151719] text-[#6F747C] border-[#25282C]',
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${variants[variant]} ${className}`}>{children}</span>;
}

// Modal (Portal-rendered for perfect screen centering)
export function Modal({ open, onClose, title, children, size = 'md', footer }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'; footer?: ReactNode;
}) {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      {/* Modal Dialog */}
      <div className={`relative bg-[#101214] border border-[#25282C] rounded-2xl shadow-2xl shadow-black/80 w-full ${sizes[size]} max-h-[88vh] flex flex-col animate-fade-in-scale inner-glow overflow-hidden z-10 my-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#25282C] bg-[#0C0D0F]/80 backdrop-blur-sm flex-shrink-0">
          <h2 className="text-base font-semibold text-[#F2F3F5] tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#1A1C1F] text-[#6F747C] hover:text-[#F2F3F5] transition-all duration-200 hover:rotate-90">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="px-6 py-3.5 border-t border-[#25282C] flex items-center justify-end gap-2.5 bg-[#0C0D0F]/60 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

// Confirm Dialog
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmText = 'Confirm', danger = false }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; confirmText?: string; danger?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Button>
      </>
    }>
      <div className="flex items-start gap-3">
        {danger && <AlertTriangle className="text-[#F87171] mt-0.5 flex-shrink-0" size={18} />}
        <p className="text-sm text-[#9A9EA5]">{message}</p>
      </div>
    </Modal>
  );
}

// Toast
export function Toast({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error' | 'warning'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: 'border-[#064E2B] bg-[#052E16]/95', error: 'border-[#7F1D1D] bg-[#450A0A]/95', warning: 'border-[#713F12] bg-[#422006]/95' };
  const textColors = { success: 'text-[#34D399]', error: 'text-[#F87171]', warning: 'text-[#FBBF24]' };
  const icons = { success: '✓', error: '✕', warning: '⚠' };
  return createPortal(
    <div className={`fixed bottom-5 right-5 z-[120] flex items-center gap-3 px-4 py-3.5 rounded-xl border backdrop-blur-md shadow-2xl shadow-black/30 ${colors[type]} animate-toast`}>
      <span className={`text-sm font-bold ${textColors[type]} w-5 h-5 flex items-center justify-center rounded-full bg-black/20`}>{icons[type]}</span>
      <span className={`text-sm font-medium ${textColors[type]}`}>{message}</span>
      <button onClick={onClose} className="text-[#6F747C] hover:text-[#F2F3F5] transition-colors ml-2"><X size={14} /></button>
    </div>,
    document.body
  );
}

// Animated Counter
export function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1200 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.floor(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);
  return <span>{prefix}{display.toLocaleString('en-IN')}{suffix}</span>;
}

// Empty State
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-2xl bg-[#151719] border border-[#25282C] flex items-center justify-center">
          <Search className="text-[#6F747C]" size={22} />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1A1C1F] border border-[#25282C] flex items-center justify-center">
          <span className="text-[8px] text-[#6F747C]">?</span>
        </div>
      </div>
      <h3 className="text-sm font-semibold text-[#F2F3F5] mb-1.5">{title}</h3>
      <p className="text-xs text-[#6F747C] text-center max-w-xs mb-5 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}

// Dropdown
export function Dropdown({ trigger, items, align = 'right' }: {
  trigger: ReactNode; items: { label: string; onClick: () => void; danger?: boolean; icon?: ReactNode }[]; align?: 'left' | 'right';
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className={`!absolute top-full ${align === 'right' ? 'right-0' : 'left-0'} mt-1.5 min-w-[160px] bg-[#101214] border border-[#25282C] rounded-xl shadow-2xl shadow-black/30 py-1.5 z-50 animate-slide-down inner-glow overflow-hidden`}>
          {items.map((item, i) => (
            <button key={i} onClick={() => { item.onClick(); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2.5 transition-all duration-150 border-l-2 border-transparent hover:border-l-[#F2F3F5] ${item.danger ? 'text-[#F87171] hover:bg-[#1A1C1F]' : 'text-[#9A9EA5] hover:text-[#F2F3F5] hover:bg-[#1A1C1F]'}`}>
              {item.icon}{item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Tabs
export function Tabs({ tabs, active, onChange }: { tabs: { key: string; label: string; count?: number }[]; active: string; onChange: (key: string) => void }) {
  return (
    <div className="flex items-center gap-1 border-b border-[#25282C]">
      {tabs.map(tab => (
        <button key={tab.key} onClick={() => onChange(tab.key)}
          className={`relative px-4 py-3 text-sm font-medium transition-all duration-200 btn-press ${active === tab.key ? 'text-[#F2F3F5]' : 'text-[#6F747C] hover:text-[#9A9EA5]'}`}>
          {tab.label}{tab.count !== undefined && <span className="ml-1.5 text-xs text-[#6F747C]">({tab.count})</span>}
          {active === tab.key && (
            <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#F2F3F5] rounded-full animate-scale-in" />
          )}
        </button>
      ))}
    </div>
  );
}

// Search Input
export function SearchInput({ value, onChange, placeholder = 'Search...', className = '' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F747C]" size={14} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-[#101214] border border-[#25282C] rounded-md pl-9 pr-3 py-2 text-sm text-[#F2F3F5] placeholder:text-[#6F747C] focus:border-[#3A3D42] transition-default" />
    </div>
  );
}

// Pagination
export function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[#25282C]">
      <span className="text-xs text-[#6F747C]">Page {page} of {totalPages}</span>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</Button>
        <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</Button>
      </div>
    </div>
  );
}

// Stat Card
export function StatCard({ label, value, change, changeType, icon }: {
  label: string; value: string; change?: string; changeType?: 'up' | 'down' | 'neutral'; icon?: ReactNode;
}) {
  return (
    <div className="bg-[#101214] border border-[#25282C] rounded-xl p-4 card-hover inner-glow kpi-card relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/[0.02] to-transparent rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-medium text-[#6F747C] uppercase tracking-wider">{label}</span>
          {icon && <span className="text-[#6F747C] p-1.5 rounded-md bg-[#151719] border border-[#1E2024] group-hover:border-[#25282C] transition-colors">{icon}</span>}
        </div>
        <div className="text-2xl font-bold text-[#F2F3F5] tracking-tight animate-fade-in">{value}</div>
        {change && (
          <div className={`mt-2 text-xs font-medium inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${changeType === 'up' ? 'text-[#34D399] bg-[#34D399]/10' : changeType === 'down' ? 'text-[#F87171] bg-[#F87171]/10' : 'text-[#6F747C] bg-[#6F747C]/10'}`}>
            {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : '→'} {change}
          </div>
        )}
      </div>
    </div>
  );
}

// Metric (alias for StatCard without icon)
export function Metric({ label, value, hint, trend }: {
  label: string; value: string; hint?: string; trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="bg-[#101214] border border-[#25282C] rounded-xl p-4 card-hover inner-glow">
      <div className="text-[11px] font-medium text-[#6F747C] uppercase tracking-wider mb-2">{label}</div>
      <div className="text-2xl font-bold text-[#F2F3F5] tracking-tight">{value}</div>
      {hint && (
        <div className={`mt-2 text-xs font-medium inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${trend === 'up' ? 'text-[#34D399] bg-[#34D399]/10' : trend === 'down' ? 'text-[#F87171] bg-[#F87171]/10' : 'text-[#6F747C] bg-[#6F747C]/10'}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {hint}
        </div>
      )}
    </div>
  );
}

// Shimmer Skeleton
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton-shimmer rounded-md border border-[#25282C]/30 ${className}`} />;
}

// Prebuilt Stat Card Skeleton
export function CardSkeleton() {
  return (
    <div className="bg-[#101214] border border-[#25282C] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-7 rounded-md" />
      </div>
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-4 w-20 rounded-full" />
    </div>
  );
}

// Prebuilt Table Skeleton
export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-[#101214] border border-[#25282C] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1E2024] flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-44 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
      <div className="p-4 space-y-3.5">
        <div className="grid grid-cols-5 gap-4 pb-2 border-b border-[#1E2024]/60">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-full max-w-[90px]" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="grid grid-cols-5 gap-4 items-center py-1">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Prebuilt Dashboard Skeleton
export function DashboardSkeleton() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-3.5 w-64" />
      </div>
      {/* 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-[#101214] border border-[#25282C] rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-[240px] w-full rounded-lg" />
        </div>
        <div className="bg-[#101214] border border-[#25282C] rounded-xl p-4 space-y-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-[240px] w-full rounded-lg" />
        </div>
      </div>
      {/* Bottom Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="bg-[#101214] border border-[#25282C] rounded-xl p-4 space-y-3">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="bg-[#101214] border border-[#25282C] rounded-xl p-4 space-y-3">
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="bg-[#101214] border border-[#25282C] rounded-xl p-4 space-y-3">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Prebuilt Generic Page Skeleton for Tables & Lists
export function PageSkeleton({ title = 'Loading...' }: { title?: string }) {
  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-3.5 w-60" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#101214] border border-[#25282C] rounded-xl p-3.5 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-28" />
        </div>
        <div className="bg-[#101214] border border-[#25282C] rounded-xl p-3.5 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-28" />
        </div>
        <div className="bg-[#101214] border border-[#25282C] rounded-xl p-3.5 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-28" />
        </div>
      </div>
      <TableSkeleton rows={7} cols={5} />
    </div>
  );
}

// Format currency
export function formatCurrency(amount: number, symbol = '₹'): string {
  return `${symbol}${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Format date
export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatShortDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// Checkbox
export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-default ${checked ? 'bg-[#F2F3F5] border-[#F2F3F5]' : 'border-[#25282C] bg-[#101214]'}`}
        onClick={() => onChange(!checked)}>
        {checked && <Check size={10} className="text-[#090A0C]" />}
      </div>
      {label && <span className="text-sm text-[#9A9EA5]">{label}</span>}
    </label>
  );
}
