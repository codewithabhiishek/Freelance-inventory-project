import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Button, Input } from '../components/ui';
import { Lock, Mail, ArrowRight, Sun, Moon } from 'lucide-react';

export function Auth() {
  const { login, users, theme, toggleTheme } = useStore();
  const [email, setEmail] = useState('arjun@stockflow.io');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.body.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.body.classList.remove('light');
    }
  }, [theme]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const success = login(email, password);
      if (!success) setError('Invalid credentials or inactive account');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex bg-[#0B0B0C] overflow-hidden relative">
      {/* Theme toggle */}
      <button onClick={toggleTheme}
        className="absolute top-5 right-5 z-50 p-2 rounded-md bg-[#111113] border border-[#242428] hover:border-[#2E2E33] text-[#6B6B76] hover:text-[#EFEFF1] transition-colors">
        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      </button>

      {/* Left side - branding */}
      <div className={`hidden lg:flex flex-col justify-between w-1/2 p-12 relative transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-7 h-7 rounded bg-[#EFEFF1] flex items-center justify-center">
              <span className="text-[10px] font-black text-[#0B0B0C]">SF</span>
            </div>
            <span className="text-[15px] font-semibold text-[#EFEFF1] tracking-tight">StockFlow</span>
          </div>
          <h2 className="text-[32px] font-bold text-[#EFEFF1] leading-tight tracking-tight mb-3">
            Inventory & billing,<br />
            <span className="text-[#6B6B76]">simplified.</span>
          </h2>
          <p className="text-[14px] text-[#6B6B76] max-w-sm leading-relaxed">
            Track products, manage sales, generate invoices, and gain insights into your business. Built for teams that run operations daily.
          </p>
        </div>

        <div className="space-y-3">
          {[
            { title: 'Real-time inventory', desc: 'Automatic stock tracking' },
            { title: 'Business insights', desc: 'Revenue, profit, and trends' },
            { title: 'Role-based access', desc: 'Secure team permissions' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-[#111113] border border-[#1A1A1D]">
              <div className="w-1 h-1 rounded-full bg-[#4ADE80] mt-2 flex-shrink-0" />
              <div>
                <p className="text-[13px] font-medium text-[#EFEFF1]">{item.title}</p>
                <p className="text-[12px] text-[#6B6B76] mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-[12px] text-[#45454D]">
          © 2026 StockFlow
        </div>
      </div>

      {/* Right side - login */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className={`w-full max-w-xs transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-[#EFEFF1] flex items-center justify-center">
                <span className="text-[9px] font-black text-[#0B0B0C]">SF</span>
              </div>
              <span className="text-[14px] font-semibold text-[#EFEFF1] tracking-tight">StockFlow</span>
            </div>
          </div>

          <div className="bg-[#111113] border border-[#242428] rounded-lg p-6">
            <div className="mb-5">
              <h2 className="text-[16px] font-semibold text-[#EFEFF1] tracking-tight">Sign in</h2>
              <p className="text-[12px] text-[#6B6B76] mt-1">Enter your credentials to continue</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[#A1A1AA]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B6B76]" size={13} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="h-8 w-full bg-[#0B0B0C] border border-[#242428] rounded-md pl-8 pr-2.5 text-[13px] text-[#EFEFF1] placeholder:text-[#45454D] focus:border-[#2E2E33] transition-colors"
                    placeholder="you@company.com" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[#A1A1AA]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B6B76]" size={13} />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    className="h-8 w-full bg-[#0B0B0C] border border-[#242428] rounded-md pl-8 pr-2.5 text-[13px] text-[#EFEFF1] placeholder:text-[#45454D] focus:border-[#2E2E33] transition-colors"
                    placeholder="••••••••" />
                </div>
              </div>
              {error && (
                <div className="p-2 rounded-md bg-[#F87171]/10 border border-[#F87171]/20">
                  <p className="text-[11px] text-[#F87171]">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-[#0B0B0C]/30 border-t-[#0B0B0C] rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">Sign in <ArrowRight size={12} /></span>
                )}
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-[#1A1A1D]">
              <p className="text-[10px] text-[#45454D] text-center mb-2 uppercase tracking-wider">Quick access</p>
              <div className="space-y-1">
                {users.map(u => (
                  <button key={u.id} onClick={() => { setEmail(u.email); setPassword('admin123'); }}
                    className="w-full text-left px-2.5 py-1.5 rounded-md bg-[#0B0B0C] border border-[#1A1A1D] hover:border-[#242428] transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[12px] font-medium text-[#EFEFF1]">{u.name}</p>
                        <p className="text-[10px] text-[#6B6B76]">{u.email}</p>
                      </div>
                      <span className="text-[9px] text-[#6B6B76] bg-[#161618] border border-[#242428] px-1.5 py-0.5 rounded uppercase">{u.role}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
