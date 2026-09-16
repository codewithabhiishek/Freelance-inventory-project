import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Button, Input } from '../components/ui';
import { Lock, Mail, ArrowRight, Shield, Zap, BarChart3, Sun, Moon } from 'lucide-react';

export function Auth() {
  const { login, users, theme, toggleTheme } = useStore();
  const [email, setEmail] = useState('arjun@stockflow.io');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  // Apply theme
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
    }, 600);
  };

  return (
    <div className="min-h-screen flex bg-[#090A0C] overflow-hidden relative">
      {/* Theme toggle */}
      <button onClick={toggleTheme}
        className="absolute top-5 right-5 z-50 p-2.5 rounded-xl bg-[#101214] border border-[#25282C] hover:border-[#35383C] text-[#6F747C] hover:text-[#F2F3F5] transition-all duration-300 btn-press group/theme shadow-lg shadow-black/20">
        {theme === 'dark' ? (
          <Sun size={16} className="transition-transform duration-300 group-hover/theme:rotate-45" />
        ) : (
          <Moon size={16} className="transition-transform duration-300 group-hover/theme:-rotate-12" />
        )}
      </button>
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#34D399]/[0.02] rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#60A5FA]/[0.02] rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#F2F3F5]/[0.01] to-transparent rounded-full" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#F2F3F5 1px, transparent 1px), linear-gradient(90deg, #F2F3F5 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Left side - branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative">
        <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F2F3F5] to-[#9A9EA5] flex items-center justify-center shadow-lg shadow-white/5">
              <span className="text-sm font-black text-[#090A0C]">SF</span>
            </div>
            <span className="text-xl font-bold text-[#F2F3F5] tracking-tight">StockFlow</span>
          </div>
          <h2 className="text-4xl font-bold text-[#F2F3F5] leading-tight tracking-tight mb-4">
            Inventory & Billing<br />
            <span className="gradient-text">made simple.</span>
          </h2>
          <p className="text-[#6F747C] text-base max-w-md leading-relaxed">
            Track products, manage sales, generate invoices, and gain insights into your business — all in one place.
          </p>
        </div>

        <div className={`space-y-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {[
            { icon: <Zap size={16} />, title: 'Real-time Inventory', desc: 'Track stock levels automatically' },
            { icon: <BarChart3 size={16} />, title: 'Business Insights', desc: 'Revenue, profit, and trend reports' },
            { icon: <Shield size={16} />, title: 'Role-based Access', desc: 'Secure permissions for your team' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#101214]/50 border border-[#1E2024] hover:border-[#25282C] transition-all duration-300 group/feature">
              <div className="p-2 rounded-lg bg-[#151719] border border-[#25282C] text-[#9A9EA5] group-hover/feature:text-[#F2F3F5] group-hover/feature:border-[#35383C] transition-all duration-300">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-[#F2F3F5]">{item.title}</p>
                <p className="text-xs text-[#6F747C] mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={`text-xs text-[#6F747C] transition-all duration-700 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          © 2026 StockFlow. Built for modern businesses.
        </div>
      </div>

      {/* Right side - login form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className={`w-full max-w-sm transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F2F3F5] to-[#9A9EA5] flex items-center justify-center">
                <span className="text-xs font-black text-[#090A0C]">SF</span>
              </div>
              <span className="text-lg font-bold text-[#F2F3F5] tracking-tight">StockFlow</span>
            </div>
          </div>

          <div className="bg-[#101214] border border-[#25282C] rounded-2xl p-7 shadow-2xl shadow-black/20 inner-glow">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#F2F3F5] tracking-tight">Sign in</h2>
              <p className="text-sm text-[#6F747C] mt-1">Enter your credentials to continue</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#9A9EA5]">Email</label>
                <div className="relative group/input">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F747C] group-focus-within/input:text-[#9A9EA5] transition-colors" size={15} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#090A0C] border border-[#25282C] rounded-xl pl-10 pr-4 py-3 text-sm text-[#F2F3F5] placeholder:text-[#6F747C] focus:border-[#3A3D42] transition-all duration-200"
                    placeholder="you@company.com" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#9A9EA5]">Password</label>
                <div className="relative group/input">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F747C] group-focus-within/input:text-[#9A9EA5] transition-colors" size={15} />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full bg-[#090A0C] border border-[#25282C] rounded-xl pl-10 pr-4 py-3 text-sm text-[#F2F3F5] placeholder:text-[#6F747C] focus:border-[#3A3D42] transition-all duration-200"
                    placeholder="••••••••" />
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F87171]/10 border border-[#F87171]/20 animate-fade-in">
                  <span className="text-xs text-[#F87171]">{error}</span>
                </div>
              )}
              <Button type="submit" className="w-full py-3 rounded-xl" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#090A0C]/30 border-t-[#090A0C] rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">Sign in <ArrowRight size={14} /></span>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#25282C]">
              <p className="text-[11px] text-[#6F747C] text-center mb-3 uppercase tracking-wider font-medium">Quick access</p>
              <div className="space-y-1.5">
                {users.map((u, i) => (
                  <button key={u.id} onClick={() => { setEmail(u.email); setPassword('admin123'); }}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl bg-[#090A0C] border border-[#25282C] hover:border-[#35383C] hover:bg-[#0C0D0F] transition-all duration-200 group/user btn-press"
                    style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-[#F2F3F5] group-hover/user:text-white transition-colors">{u.name}</p>
                        <p className="text-[10px] text-[#6F747C]">{u.email}</p>
                      </div>
                      <span className="text-[9px] font-medium text-[#6F747C] bg-[#151719] border border-[#25282C] px-2 py-0.5 rounded-full uppercase group-hover/user:border-[#35383C] transition-colors">{u.role}</span>
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
