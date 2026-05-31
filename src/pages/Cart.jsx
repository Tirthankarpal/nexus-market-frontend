import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ShoppingBag, Trash2, Plus, Minus, CreditCard, LogIn, AlertCircle, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);
    setPlacedOrder(null);

    // Map cartItems to OrderRequest line items list
    const orderRequest = {
      orderLineItemsList: cartItems.map((item) => ({
        skuCode: item.name, // Mapped name directly to Downstream Inventory SKU!
        price: item.price,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axios.post(`${API_BASE}/api/v1/orders`, orderRequest, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Backend returns the placed Order details (containing UUID orderNumber)
      setPlacedOrder(response.data);
      clearCart(); // Success, empty client cart!
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.response?.data || err.message || 'Checkout failed';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // 1. Success Screen
  if (placedOrder) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="glass-panel rounded-2xl p-8 text-center relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]">
          <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-slate-100">Order Confirmed!</h2>
          <p className="text-xs text-slate-400 mt-1">Your checkout completed successfully through the order gateway</p>

          <div className="mt-6 border-t border-b border-slate-800/40 py-4 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Order Number:</span>
              <span className="font-mono text-cyan-glowing font-medium">{placedOrder.orderNumber?.slice(0, 18)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Recipient Session:</span>
              <span className="text-slate-300 font-semibold">{placedOrder.userEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Charged:</span>
              <span className="font-display text-emerald-400 font-extrabold">${parseFloat(placedOrder.totalAmount || getCartTotal()).toFixed(2)}</span>
            </div>
          </div>

          <Link
            to="/catalog"
            className="w-full mt-6 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-violet-neon to-indigo-glowing hover:opacity-95 shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Storefront</span>
          </Link>
        </div>
      </div>
    );
  }

  // 2. Empty State
  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <div className="inline-flex p-3 rounded-full bg-slate-800/40 border border-slate-700/30 mb-4 text-slate-500">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="font-display font-bold text-xl text-slate-200">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 mt-1">Add items from the store catalog to begin checkout</p>
        <Link
          to="/catalog"
          className="inline-flex items-center space-x-2 mt-6 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-violet-neon hover:bg-violet-600 shadow-[0_0_10px_rgba(139,92,246,0.3)] transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Browse Catalog</span>
        </Link>
      </div>
    );
  }

  // 3. Main Cart Checkout UI
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-3xl tracking-tight text-slate-100 m-0">
          Shopping Cart
        </h1>
        <p className="text-xs text-slate-400 mt-1">Review your selections and process transaction checkout</p>
      </div>

      {error && (
        <div className="flex items-start space-x-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-xs animate-shake">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-grow">
            <p className="font-bold">Checkout Blocked by Gateway</p>
            <p className="mt-0.5 text-slate-300">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Product Info */}
              <div className="flex-1">
                <span className="text-[9px] uppercase font-semibold text-slate-500 tracking-wider">Premium Tech</span>
                <h3 className="font-display font-bold text-base text-slate-100 leading-tight">{item.name}</h3>
                <span className="text-xs text-cyan-glowing mt-1 inline-block font-mono">
                  ${parseFloat(item.price).toFixed(2)} each
                </span>
              </div>

              {/* Quantity Controls & Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                <div className="flex items-center space-x-2 bg-obsidian-950/60 border border-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-slate-800/40 hover:text-slate-100 rounded text-slate-500 transition-all cursor-pointer active:scale-75"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-200">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-slate-800/40 hover:text-slate-100 rounded text-slate-500 transition-all cursor-pointer active:scale-75"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="w-20 text-right">
                  <span className="font-display font-extrabold text-sm text-slate-200">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 rounded-lg transition-all cursor-pointer"
                  title="Remove Item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout summary panel */}
        <div className="glass-panel rounded-2xl p-6 space-y-6">
          <h3 className="font-display font-bold text-lg text-slate-100">Order Summary</h3>

          <div className="space-y-3 text-xs border-b border-slate-800/40 pb-4">
            <div className="flex justify-between text-slate-400">
              <span>Items Total:</span>
              <span className="font-mono">${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Secure Shipping:</span>
              <span className="text-emerald-400 font-semibold font-mono">FREE</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-xs text-slate-400">Estimated Total:</span>
            <span className="font-display font-extrabold text-2xl text-cyan-glowing">
              ${getCartTotal().toFixed(2)}
            </span>
          </div>

          {/* Secure Checkout Actions */}
          {!user ? (
            <div className="space-y-3">
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-3 rounded-lg text-[11px] leading-relaxed flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>You must authenticate in order to route and process checkout transactions.</span>
              </div>
              <Link
                to="/login"
                className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 hover:text-slate-100 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
              >
                <LogIn className="h-4 w-4 text-cyan-glowing" />
                <span>Log In to Checkout</span>
              </Link>
            </div>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-violet-neon to-indigo-glowing hover:opacity-95 shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  <span>Place Secured Order</span>
                </>
              )}
            </button>
          )}

          <div className="text-[10px] text-center text-slate-500 leading-normal">
            Orders are securely validated with downstream inventory reserves upon checkout.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
