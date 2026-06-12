import { Link } from 'react-router-dom';
import { AlertCircle, LogIn, CreditCard, RefreshCw } from 'lucide-react';

const OrderSummary = ({ cartTotal, user, loading, onCheckout }) => {
  return (
    <div className="glass-panel rounded-xl p-6 space-y-6 bg-zinc-900 border border-zinc-800">
      <h3 className="font-display font-semibold text-base text-zinc-150">Order Summary</h3>

      <div className="space-y-3 text-xs border-b border-zinc-800/40 pb-4">
        <div className="flex justify-between text-zinc-400">
          <span>Items Total:</span>
          <span className="font-mono">${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Secure Shipping:</span>
          <span className="text-emerald-450 font-semibold font-mono">FREE</span>
        </div>
      </div>

      <div className="flex justify-between items-baseline">
        <span className="text-xs text-zinc-450">Estimated Total:</span>
        <span className="font-display font-bold text-xl text-zinc-100">
          ${cartTotal.toFixed(2)}
        </span>
      </div>

      {/* Secure Checkout Actions */}
      {!user ? (
        <div className="space-y-3">
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-450 p-3 rounded-lg text-[11px] leading-relaxed flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>You must authenticate in order to route and process checkout transactions.</span>
          </div>
          <Link
            to="/login"
            className="w-full py-2 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-950 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-none"
          >
            <LogIn className="h-3.5 w-3.5 text-zinc-450" />
            <span>Log In to Checkout</span>
          </Link>
        </div>
      ) : (
        <button
          onClick={onCheckout}
          disabled={loading}
          className="w-full py-2 rounded-lg text-xs font-semibold text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
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

      <div className="text-[10px] text-center text-zinc-500 leading-normal">
        Orders are securely validated with downstream inventory reserves upon checkout.
      </div>
    </div>
  );
};

export default OrderSummary;
