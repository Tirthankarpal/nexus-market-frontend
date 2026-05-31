import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Lock, AlertCircle, RefreshCw, CheckCircle, Shield } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(false);
    
    if (!username.trim() || !password.trim()) {
      setLocalError('Username and password are required.');
      return;
    }

    setLoading(true);
    try {
      await register(username, password, role);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setLocalError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75svh] items-center justify-center">
      <div className="glass-panel rounded-2xl w-full max-w-md p-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)]">
        {/* Glow accent */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-violet-neon/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-indigo-glowing/10 blur-3xl"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex p-3 rounded-full bg-slate-800/40 border border-slate-700/30 mb-3 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <UserPlus className="h-6 w-6 text-violet-neon" />
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-100">Create Account</h2>
          <p className="text-xs text-slate-400 mt-1">Join the secured microservice commerce store</p>
        </div>

        {/* Global Success Banner */}
        {success && (
          <div className="mb-6 flex items-start space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg text-xs animate-fade-in">
            <CheckCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-bold">Account created securely!</span>
              <span className="mt-0.5 text-slate-300">Redirecting to login dashboard...</span>
            </div>
          </div>
        )}

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
                disabled={loading || success}
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
                placeholder="Create a strong password"
                className="w-full bg-obsidian-900/60 border border-slate-800 hover:border-slate-700 focus:border-violet-neon text-sm text-slate-100 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-neon transition-all"
                disabled={loading || success}
              />
            </div>
          </div>

          {/* Role selector (Crucial for microservice permission testing!) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Account Role</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Shield className="h-4 w-4" />
              </span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-obsidian-900/60 border border-slate-800 hover:border-slate-700 focus:border-violet-neon text-sm text-slate-300 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-neon transition-all appearance-none cursor-pointer"
                disabled={loading || success}
              >
                <option value="USER" className="bg-obsidian-950">Standard User (Place Orders)</option>
                <option value="ADMIN" className="bg-obsidian-950">System Admin (Full Catalog Control)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full mt-6 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-violet-neon to-indigo-glowing hover:opacity-95 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Register securely</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400 relative z-10">
          <span>Already have an account? </span>
          <Link to="/login" className="text-cyan-glowing hover:underline font-semibold">
            Log In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
