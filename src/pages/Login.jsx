import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, Lock, AlertCircle, RefreshCw } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!username.trim() || !password.trim()) {
      setLocalError('Username and password are required.');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      navigate('/catalog');
    } catch (err) {
      setLocalError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75svh] items-center justify-center">
      <div className="glass-panel rounded-2xl w-full max-w-md p-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)]">
        {/* Glow accent */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-violet-neon/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-cyan-glowing/10 blur-3xl"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex p-3 rounded-full bg-slate-800/40 border border-slate-700/30 mb-3 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <LogIn className="h-6 w-6 text-violet-neon" />
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-100">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Authenticate to access protected store checkouts</p>
        </div>

        {/* Global Error Banner */}
        {localError && (
          <div className="mb-6 flex items-start space-x-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-lg text-xs animate-shake">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{localError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-obsidian-900/60 border border-slate-800 hover:border-slate-700 focus:border-violet-neon text-sm text-slate-100 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-neon transition-all"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-obsidian-900/60 border border-slate-800 hover:border-slate-700 focus:border-violet-neon text-sm text-slate-100 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-neon transition-all"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-violet-neon to-indigo-glowing hover:opacity-95 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Log In Securely</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400 relative z-10">
          <span>New to Nexus Market? </span>
          <Link to="/register" className="text-cyan-glowing hover:underline font-semibold">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
