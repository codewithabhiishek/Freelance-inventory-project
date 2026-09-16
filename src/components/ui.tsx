import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { X, Check, AlertTriangle, Search } from 'lucide-react';

// ============================================
// BUTTON
// Restrained. Primary actions use filled style.
// ============================================
export function Button({ children, variant = 'primary', size = 'md', className = '', disabled, onClick, type = 'button' }: {
  children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'; size?: 'sm' | 'md'; className?: string; disabled?: boolean; onClick?: () => void; type?: 'button' | 'submit';
}) {
  const variants = {
    primary: 'bg-[#EFEFF1] text-[#0B0B0C] hover:bg-white',
    secondary: 'bg-[#1C1C1F] text-[#EFEFF1] hover:bg-[#222225]',
    ghost: 'text-[#A1A1AA] hover:text-[#EFEFF1] hover:bg-[#1C1C1F]',
    danger: 'bg-[#DC2626] text-white hover:bg-[#EF4444]',
    outline: 'border border-[#242428] text-[#A1A1AA] hover:text-[#EFEFF1] hover:border-[#2E2E33]',
  };
  const sizes = { sm: 'h-7 px-2.5 text-[12px] gap-1.5', md: 'h-8 px-3 text-[13px] gap-2' };
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`inline-flex items-center justify-center font-medium rounded-md btn-press disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
}

// ============================================
// INPUT
// ============================================
export function Input({ label, error, className = '', ...props }: {
  label?: string; error?: string; className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      {label && <label className="text-[12px] font-medium text-[#A1A1AA]">{label}</label>}
      <input className={`h-8 w-full bg-[#111113] border border-[#242428] rounded-md px-2.5 text-[13px] text-[#EFEFF1] placeholder:text-[#45454D] focus:border-[#2E2E33] transition-colors ${error ? 'border-[#DC2626]' : ''} ${className}`} {...props} />
      {error && <p className="text-[11px] text-[#F87171]">{error}</p>}
    </div>
  );
}

// ============================================
// SELECT
// ============================================
export function Select({ label, error, options, className = '', ...props }: {
  label?: string; error?: string; options: { value: string; label: string }[]; className?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="space-y-1">
      {label && <label className="text-[12px] font-medium text-[#A1A1AA]">{label}</label>}
      <select className={`h-8 w-full bg-[#111113] border border-[#242428] rounded-md px-2.5 text-[13px] text-[#EFEFF1] focus:border-[#2E2E33] transition-colors appearance-none ${className}`} {...props}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-[11px] text-[#F87171]">{error}</p>}
    </div>
  );
}

// ============================================
// TEXTAREA
// ============================================
export function Textarea({ label, error, className = '', ...props }: {
  label?: string; error?: string; className?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-1">
      {label && <label className="text-[12px] font-medium text-[#A1A1AA]">{label}</label>}
      <textarea className={`w-full bg-[#111113] border border-[#242428] rounded-md px-2.5 py-2 text-[13px] text-[#EFEFF1] placeholder:text-[#45454D] focus:border-[#2E2E33] transition-colors resize-none ${className}`} rows={3} {...props} />
      {error && <p className="text-[11px] text-[#F87171]">{error}</p>}
    </div>
  );
}

// ============================================
// BADGE
// Semantic only. No decorative use.
// ============================================
export function Badge({ children, variant = 'default', className = '' }: {
  children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral'; className?: string;
}) {
  const variants = {
    default: 'bg-[#1C1C1F] text-[#A1A1AA]',
    success: 'bg-[#4ADE80]/10 text-[#4ADE80]',
    warning: 'bg-[#FBBF24]/10 text-[#FBBF24]',
    error: 'bg-[#F87171]/10 text-[#F87171]',
    info: 'bg-[#60A5FA]/10 text-[#60A5FA]',
    neutral: 'bg-[#161618] text-[#6B6B76]',
  };
  return <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium ${variants[variant]} ${className}`}>{children}</span>;
}

// ============================================
// MODAL
// ============================================
export function Modal({ open, onClose, title, children, size = 'md', footer }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'; footer?: ReactNode;
}) {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 modal-backdrop animate-fade-in" onClick={onClose} />
      <div className={`relative bg-[#111113] border border-[#242428] rounded-lg w-full ${sizes[size]} max-h-[85vh] flex flex-col animate-fade-in-scale`}>
        <div className="flex items-center justify-between px-5 h-12 border-b border-[#242428]">
          <h2 className="text-[14px] font-semibold text-[#EFEFF1]">{title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#1C1C1F] text-[#6B6B76] hover:text-[#EFEFF1] transition-colors"><X size={14} /></button>
        </div>
        <div className="px-5 py-4 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="px-5 h-12 border-t border-[#242428] flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

// ============================================
// CONFIRM DIALOG
// ============================================
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
      <div className="flex items-start gap-3 py-2">
        {danger && <AlertTriangle className="text-[#F87171] mt-0.5 flex-shrink-0" size={16} />}
        <p className="text-[13px] text-[#A1A1AA] leading-relaxed">{message}</p>
      </div>
    </Modal>
  );
}

// ============================================
// DROPDOWN
// ============================================
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
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-1 min-w-[150px] bg-[#161618] border border-[#242428] rounded-md shadow-lg py-1 z-50 animate-slide-down`}>
          {items.map((item, i) => (
            <button key={i} onClick={() => { item.onClick(); setOpen(false); }}
              className={`w-full text-left px-2.5 py-1.5 text-[12px] flex items-center gap-2 transition-colors ${item.danger ? 'text-[#F87171] hover:bg-[#1C1C1F]' : 'text-[#A1A1AA] hover:text-[#EFEFF1] hover:bg-[#1C1C1F]'}`}>
              {item.icon}{item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// TABS
// ============================================
export function Tabs({ tabs, active, onChange }: { tabs: { key: string; label: string; count?: number }[]; active: string; onChange: (key: string) => void }) {
  return (
    <div className="flex items-center gap-5 border-b border-[#1A1A1D]">
      {tabs.map(tab => (
        <button key={tab.key} onClick={() => onChange(tab.key)}
          className={`relative pb-2.5 text-[13px] font-medium transition-colors ${active === tab.key ? 'text-[#EFEFF1]' : 'text-[#6B6B76] hover:text-[#A1A1AA]'}`}>
          {tab.label}
          {tab.count !== undefined && <span className="ml-1.5 text-[11px] text-[#6B6B76]">{tab.count}</span>}
          {active === tab.key && <span className="absolute bottom-0 left-0 right-0 h-px bg-[#EFEFF1]" />}
        </button>
      ))}
    </div>
  );
}

// ============================================
// SEARCH INPUT
// ============================================
export function SearchInput({ value, onChange, placeholder = 'Search...', className = '' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B6B76]" size={13} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="h-8 w-full bg-[#111113] border border-[#242428] rounded-md pl-8 pr-2.5 text-[13px] text-[#EFEFF1] placeholder:text-[#45454D] focus:border-[#2E2E33] transition-colors" />
    </div>
  );
}

// ============================================
// PAGINATION
// ============================================
export function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 h-10 border-t border-[#1A1A1D]">
      <span className="text-[11px] text-[#6B6B76]">Page {page} of {totalPages}</span>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Prev</Button>
        <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</Button>
      </div>
    </div>
  );
}

// ============================================
// METRIC
// Part of a cohesive summary, not isolated cards.
// ============================================
export function Metric({ label, value, hint, trend }: {
  label: string; value: string; hint?: string; trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="min-w-0">
      <p className="text-[12px] text-[#6B6B76] mb-1">{label}</p>
      <p className="text-[22px] font-semibold text-[#EFEFF1] tracking-tight leading-none">{value}</p>
      {(hint || trend) && (
        <p className={`mt-1.5 text-[11px] ${trend === 'up' ? 'text-[#4ADE80]' : trend === 'down' ? 'text-[#F87171]' : 'text-[#6B6B76]'}`}>
          {trend === 'up' ? '↑ ' : trend === 'down' ? '↓ ' : ''}{hint}
        </p>
      )}
    </div>
  );
}

// StatCard - alias for backwards compatibility
export function StatCard({ label, value, change, changeType, icon: _icon }: {
  label: string; value: string; change?: string; changeType?: 'up' | 'down' | 'neutral'; icon?: ReactNode;
}) {
  return <Metric label={label} value={value} hint={change} trend={changeType} />;
}

// ============================================
// EMPTY STATE
// ============================================
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <p className="text-[13px] font-medium text-[#A1A1AA] mb-1">{title}</p>
      <p className="text-[12px] text-[#6B6B76] text-center max-w-xs mb-4">{description}</p>
      {action}
    </div>
  );
}

// ============================================
// CHECKBOX
// ============================================
export function Checkbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center cursor-pointer transition-colors ${checked ? 'bg-[#EFEFF1] border-[#EFEFF1]' : 'border-[#2E2E33] bg-transparent hover:border-[#45454D]'}`}
      onClick={() => onChange(!checked)}>
      {checked && <Check size={10} strokeWidth={3} className="text-[#0B0B0C]" />}
    </div>
  );
}

// ============================================
// FORMAT HELPERS
// ============================================
export function formatCurrency(amount: number, symbol = '₹'): string {
  return `${symbol}${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatShortDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
