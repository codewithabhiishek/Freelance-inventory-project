import React, { useState } from 'react';
import { useStore } from '../store';
import { Button, Input } from '../components/ui';
import { Lock, Mail } from 'lucide-react';

export function Auth() {
  const { login, users } = useStore();
  const [email, setEmail] = useState('arjun@stockflow.io');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-[#090A0C] p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-[#F2F3F5] tracking-tight">StockFlow</h1>
          <p className="text-sm text-[#6F747C] mt-1">Inventory & Billing Management</p>
        </div>
        
        <div className="bg-[#101214] border border-[#25282C] rounded-lg p-6">
          <h2 className="text-base font-medium text-[#F2F3F5] mb-1">Sign in</h2>
          <p className="text-xs text-[#6F747C] mb-6">Enter your credentials to access the dashboard</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#9A9EA5]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F747C]" size={14} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#090A0C] border border-[#25282C] rounded-md pl-9 pr-3 py-2.5 text-sm text-[#F2F3F5] placeholder:text-[#6F747C] focus:border-[#3A3D42] transition-default"
                  placeholder="you@company.com" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#9A9EA5]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F747C]" size={14} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#090A0C] border border-[#25282C] rounded-md pl-9 pr-3 py-2.5 text-sm text-[#F2F3F5] placeholder:text-[#6F747C] focus:border-[#3A3D42] transition-default"
                  placeholder="••••••••" />
              </div>
            </div>
            {error && <p className="text-xs text-[#F87171]">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#25282C]">
            <p className="text-[10px] text-[#6F747C] text-center mb-3">Demo accounts:</p>
            <div className="space-y-1.5">
              {users.map(u => (
                <button key={u.id} onClick={() => { setEmail(u.email); setPassword('admin123'); }}
                  className="w-full text-left px-3 py-2 rounded-md bg-[#090A0C] border border-[#25282C] hover:border-[#35383C] transition-default">
                  <p className="text-xs text-[#F2F3F5]">{u.name}</p>
                  <p className="text-[10px] text-[#6F747C]">{u.email} • {u.role}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
