import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { X, ChevronDown, Check, AlertTriangle, Search } from 'lucide-react';

// Button
export function Button({ children, variant = 'primary', size = 'md', className = '', disabled, onClick, type = 'button', ...props }: {
  children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'; size?: 'sm' | 'md' | 'lg'; className?: string; disabled?: boolean; onClick?: () => void; type?: 'button' | 'submit';
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded-md transition-default disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer';
  const variants = {
    primary: 'bg-[#F2F3F5] text-[#090A0C] hover:bg-[#E0E1E3] active:bg-[#D0D1D3]',
    secondary: 'bg-[#1A1C1F] text-[#F2F3F5] border border-[#25282C] hover:bg-[#202225] hover:border-[#35383C]',
    ghost: 'text-[#9A9EA5] hover:text-[#F2F3F5] hover:bg-[#1A1C1F]',
    danger: 'bg-[#DC2626] text-white hover:bg-[#B91C1C]',
    outline: 'border border-[#25282C] text-[#9A9EA5] hover:text-[#F2F3F5] hover:bg-[#1A1C1F] hover:border-[#35383C]',
  };
  const sizes = { sm: 'px-2.5 py-1.5 text-xs gap-1.5', md: 'px-3.5 py-2 text-sm gap-2', lg: 'px-4 py-2.5 text-sm gap-2' };
  return <button type={type} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled} onClick={onClick} {...props}>{children}</button>;
}

// Input
export function Input({ label, error, className = '', ...props }: {
  label?: string; error?: string; className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-medium text-[#9A9EA5]">{label}</label>}
      <input className={`w-full bg-[#101214] border border-[#25282C] rounded-md px-3 py-2 text-sm text-[#F2F3F5] placeholder:text-[#6F747C] focus:border-[#3A3D42] transition-default ${error ? 'border-[#DC2626]' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-[#F87171]">{error}</p>}
    </div>
  );
}

// Select
export function Select({ label, error, options, className = '', ...props }: {
  label?: string; error?: string; options: { value: string; label: string }[]; className?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-medium text-[#9A9EA5]">{label}</label>}
      <select className={`w-full bg-[#101214] border border-[#25282C] rounded-md px-3 py-2 text-sm text-[#F2F3F5] focus:border-[#3A3D42] transition-default appearance-none ${className}`} {...props}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-xs text-[#F87171]">{error}</p>}
    </div>
  );
}

// Textarea
export function Textarea({ label, error, className = '', ...props }: {
  label?: string; error?: string; className?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-medium text-[#9A9EA5]">{label}</label>}
      <textarea className={`w-full bg-[#101214] border border-[#25282C] rounded-md px-3 py-2 text-sm text-[#F2F3F5] placeholder:text-[#6F747C] focus:border-[#3A3D42] transition-default resize-none ${className}`} rows={3} {...props} />
      {error && <p className="text-xs text-[#F87171]">{error}</p>}
    </div>
  );
}

// Badge
export function Badge({ children, variant = 'default', className = '' }: {
  children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral'; className?: string;
}) {
  const variants = {
    default: 'bg-[#1A1C1F] text-[#9A9EA5] border-[#25282C]',
    success: 'bg-[#052E16] text-[#34D399] border-[#064E2B]',
    warning: 'bg-[#422006] text-[#FBBF24] border-[#713F12]',
    error: 'bg-[#450A0A] text-[#F87171] border-[#7F1D1D]',
    info: 'bg-[#0C1A2E] text-[#60A5FA] border-[#1E3A5F]',
    neutral: 'bg-[#151719] text-[#6F747C] border-[#25282C]',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${variants[variant]} ${className}`}>{children}</span>;
}

// Modal
export function Modal({ open, onClose, title, children, size = 'md', footer }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'; footer?: ReactNode;
}) {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-[#101214] border border-[#25282C] rounded-lg shadow-xl w-full ${sizes[size]} max-h-[90vh] flex flex-col animate-fade-in`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#25282C]">
          <h2 className="text-base font-semibold text-[#F2F3F5]">{title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#1A1C1F] text-[#6F747C] hover:text-[#F2F3F5] transition-default"><X size={16} /></button>
        </div>
        <div className="px-5 py-4 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-[#25282C] flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
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
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: 'border-[#064E2B] bg-[#052E16]', error: 'border-[#7F1D1D] bg-[#450A0A]', warning: 'border-[#713F12] bg-[#422006]' };
  const textColors = { success: 'text-[#34D399]', error: 'text-[#F87171]', warning: 'text-[#FBBF24]' };
  return (
    <div className={`fixed bottom-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg border ${colors[type]} animate-fade-in`}>
      <span className={`text-sm font-medium ${textColors[type]}`}>{message}</span>
      <button onClick={onClose} className="text-[#6F747C] hover:text-[#F2F3F5]"><X size={14} /></button>
    </div>
  );
}

// Empty State
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-12 h-12 rounded-lg bg-[#151719] border border-[#25282C] flex items-center justify-center mb-4">
        <Search className="text-[#6F747C]" size={20} />
      </div>
      <h3 className="text-sm font-medium text-[#F2F3F5] mb-1">{title}</h3>
      <p className="text-xs text-[#6F747C] text-center max-w-xs mb-4">{description}</p>
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
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-1 min-w-[160px] bg-[#101214] border border-[#25282C] rounded-lg shadow-xl py-1 z-50 animate-fade-in`}>
          {items.map((item, i) => (
            <button key={i} onClick={() => { item.onClick(); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-default ${item.danger ? 'text-[#F87171] hover:bg-[#1A1C1F]' : 'text-[#9A9EA5] hover:text-[#F2F3F5] hover:bg-[#1A1C1F]'}`}>
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
    <div className="flex items-center gap-0.5 border-b border-[#25282C]">
      {tabs.map(tab => (
        <button key={tab.key} onClick={() => onChange(tab.key)}
          className={`px-3 py-2.5 text-sm font-medium border-b-2 transition-default ${active === tab.key ? 'border-[#F2F3F5] text-[#F2F3F5]' : 'border-transparent text-[#6F747C] hover:text-[#9A9EA5]'}`}>
          {tab.label}{tab.count !== undefined && <span className="ml-1.5 text-xs text-[#6F747C]">({tab.count})</span>}
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
    <div className="bg-[#101214] border border-[#25282C] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[#6F747C] uppercase tracking-wide">{label}</span>
        {icon && <span className="text-[#6F747C]">{icon}</span>}
      </div>
      <div className="text-xl font-semibold text-[#F2F3F5] tracking-tight">{value}</div>
      {change && (
        <div className={`mt-1.5 text-xs font-medium ${changeType === 'up' ? 'text-[#34D399]' : changeType === 'down' ? 'text-[#F87171]' : 'text-[#6F747C]'}`}>
          {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : '→'} {change}
        </div>
      )}
    </div>
  );
}

// Skeleton
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-[#151719] rounded animate-pulse ${className}`} />;
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
