import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, LogIn, UserPlus, LogOut, Store, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount, clearCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800/40 bg-obsidian-900/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Glowing Premium Brand Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <Store className="h-6 w-6 text-violet-neon group-hover:text-cyan-glowing transition-colors duration-300" />
              <span className="font-display font-bold text-lg tracking-wider bg-gradient-to-r from-violet-neon to-cyan-glowing bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                NEXUS MARKET
              </span>
            </Link>
            
            <div className="hidden md:block ml-10">
              <NavLink
                to="/catalog"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-cyan-glowing bg-slate-800/40 border border-slate-700/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/20'
                  }`
                }
              >
                Catalog
              </NavLink>
            </div>
          </div>

          {/* User Section & Shopping Cart Badge */}
          <div className="flex items-center space-x-4">
            {/* Real-time Shopping Cart Badge with glow */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/30 rounded-full transition-all duration-300 group"
            >
              <ShoppingBag className="h-5.5 w-5.5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet-neon text-[10px] font-bold text-white shadow-[0_0_10px_rgba(139,92,246,0.6)] animate-pulse">
                  {getCartCount()}
                </span>
              )}
            </Link>

            <span className="h-5 w-px bg-slate-800"></span>

            {/* Auth Controls */}
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 text-slate-300 text-sm">
                  <User className="h-4 w-4 text-violet-neon" />
                  <span className="font-medium text-slate-200">{user.username}</span>
                  {/* Glowing neon role badge */}
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                    user.role === 'ADMIN' 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.2)]'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                  }`}>
                    {user.role}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 bg-obsidian-950/40 hover:bg-slate-800/30 rounded-md transition-all duration-200"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800/30 rounded-md transition-all"
                >
                  <LogIn className="h-4 w-4 text-cyan-glowing" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 px-3.5 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-neon to-indigo-glowing hover:opacity-90 rounded-md shadow-[0_0_12px_rgba(139,92,246,0.4)] transition-all transform active:scale-95"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
