import React, { useState } from 'react';
import { useStore } from '../store';
import { Button, Input, Select } from '../components/ui';
import { Sun, Moon } from 'lucide-react';

export function Auth() {
  const { login, users, theme, toggleTheme } = useStore();
  const [email, setEmail] = useState('arjun@stockflow.io');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError('Invalid credentials. Try: arjun@stockflow.io / admin123');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090A0C] p-4">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-lg bg-[#101214] border border-[#25282C] hover:border-[#35383C] transition-all duration-200 btn-press"
        title="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={16} className="text-[#9A9EA5]" /> : <Moon size={16} className="text-[#9A9EA5]" />}
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F2F3F5] to-[#9A9EA5] mb-4 animate-float">
            <span className="text-2xl font-black text-[#090A0C]">SF</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F2F3F5] tracking-tight">StockFlow</h1>
          <p className="text-sm text-[#6F747C] mt-1">Inventory & Billing Management</p>
        </div>

        <div className="bg-[#101214] border border-[#25282C] rounded-xl p-6 animate-fade-in-up inner-glow">
          <h2 className="text-lg font-semibold text-[#F2F3F5] mb-1">Sign in</h2>
          <p className="text-sm text-[#6F747C] mb-6">Enter your credentials to access the dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="p-3 rounded-lg bg-[#F87171]/10 border border-[#F87171]/20 animate-fade-in">
                <p className="text-xs text-[#F87171]">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#25282C]">
            <p className="text-xs text-[#6F747C] text-center mb-3">Demo accounts:</p>
            <div className="space-y-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setEmail(user.email);
                    setPassword('admin123');
                  }}
                  className="w-full text-left p-3 rounded-lg bg-[#090A0C] border border-[#25282C] hover:border-[#35383C] transition-all duration-200 btn-press group"
                >
                  <p className="text-xs font-medium text-[#F2F3F5] group-hover:text-white transition-colors">{user.name}</p>
                  <p className="text-[10px] text-[#6F747C] mt-0.5">{user.email} • {user.role}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-[#6F747C] mt-6 space-y-1">
          <p>© 2026 StockFlow. Enterprise Inventory & Billing.</p>
          <p>
            <a
              href="https://abhiishek.is-a.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9A9EA5] hover:text-[#F2F3F5] transition-colors underline underline-offset-4 decoration-[#25282C] hover:decoration-[#60A5FA]"
            >
              Built by Abhishek ↗
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
