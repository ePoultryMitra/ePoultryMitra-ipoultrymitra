
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthScreenProps {
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ type: 'error', text: 'कृपया सभी फ़ील्ड भरें (Please fill all fields)' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({ type: 'success', text: 'रजिस्ट्रेशन सफल! कृपया ईमेल चेक करें। (Registration successful! Check email)' });
        const { data: { session } } = await supabase.auth.getSession();
        if (session) onSuccess();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'कु़छ गलत हुआ (Something went wrong)' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'गूगल लॉगिन विफल (Google Login Failed)' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="flex bg-slate-100">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition-colors ${isLogin ? 'bg-white text-orange-500 border-b-2 border-orange-500' : 'text-slate-500'}`}
          >
            Login / लॉगिन
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition-colors ${!isLogin ? 'bg-white text-orange-500 border-b-2 border-orange-500' : 'text-slate-500'}`}
          >
            Signup / साइनअप
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-slate-500">
              {isLogin ? 'मुर्गी पालन मित्र में आपका स्वागत है' : 'आज ही अपना डिजिटल फार्म शुरू करें'}
            </p>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Email / ईमेल</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-slate-900"
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Password / पासवर्ड</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-slate-900"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-orange-500 text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 transition-all transform active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : (isLogin ? 'Login / लॉगिन' : 'Signup / साइनअप')}
            </button>
          </form>

          <div className="relative py-2 flex items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase">OR / या</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3 transform active:scale-[0.98]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors pt-2"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
