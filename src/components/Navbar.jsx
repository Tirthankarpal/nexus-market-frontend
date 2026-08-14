import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, LogIn, UserPlus, LogOut, Store, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <Store className="h-5 w-5 text-zinc-100 transition-colors" />
              <span className="font-display font-semibold text-base tracking-wider text-zinc-100 group-hover:text-zinc-300 transition-colors">
                NEXUS MARKET
              </span>
            </Link>
            
            <div className="hidden md:flex ml-10 items-center space-x-2">
              <NavLink
                to="/catalog"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                    isActive
                      ? 'text-zinc-100 bg-zinc-900 border-zinc-800'
                      : 'text-zinc-400 border-transparent hover:text-zinc-100 hover:bg-zinc-900/40'
                  }`
                }
              >
                Catalog
              </NavLink>
              {user && (
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                      isActive
                        ? 'text-zinc-100 bg-zinc-900 border-zinc-800'
                        : 'text-zinc-400 border-transparent hover:text-zinc-100 hover:bg-zinc-900/40'
                    }`
                  }
                >
                  My Orders
                </NavLink>
              )}
              {user && user.role === 'ADMIN' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                      isActive
                        ? 'text-zinc-100 bg-zinc-900 border-zinc-800'
                        : 'text-zinc-400 border-transparent hover:text-zinc-100 hover:bg-zinc-900/40'
                    }`
                  }
                >
                  Admin
                </NavLink>
              )}
            </div>
          </div>

          {/* User Section & Shopping Cart Badge */}
          <div className="flex items-center space-x-4">
            {/* Real-time Shopping Cart Badge */}
            <Link
              to="/cart"
              className="relative p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 rounded-full transition-all"
            >
              <ShoppingBag className="h-5 w-5" />
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-zinc-100 text-[9px] font-bold text-zinc-950">
                  {getCartCount()}
                </span>
              )}
            </Link>

            <span className="h-4 w-px bg-zinc-800"></span>

            {/* Auth Controls */}
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 text-zinc-400 text-xs">
                  <User className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="font-medium text-zinc-200">{user.username}</span>
                  {/* Clean neutral role badge */}
                  <span className="px-2 py-0.5 text-[9px] font-medium rounded border bg-zinc-900 text-zinc-400 border-zinc-800">
                    {user.role}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 rounded-md transition-all cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-all"
                >
                  <LogIn className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-all active:scale-95"
                >
                  <UserPlus className="h-3.5 w-3.5" />
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
