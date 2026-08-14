import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const StatusIcon = ({ status }) => {
  if (status === 'CONFIRMED') {
    return (
      <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 text-emerald-450">
        <CheckCircle className="h-6 w-6" />
      </div>
    );
  }
  if (status === 'CANCELLED') {
    return (
      <div className="inline-flex p-3 rounded-full bg-rose-500/10 border border-rose-500/20 mb-4 text-rose-450">
        <XCircle className="h-6 w-6" />
      </div>
    );
  }
  // PENDING — pulsing spinner
  return (
    <div className="inline-flex p-3 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4 text-amber-450 animate-pulse">
      <RefreshCw className="h-6 w-6 animate-spin" />
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    CONFIRMED: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450',
    CANCELLED: 'bg-rose-500/10 border-rose-500/20 text-rose-450',
    PENDING:   'bg-amber-500/10 border-amber-500/20 text-amber-450 animate-pulse',
  };
  return (
    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold tracking-wider ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
};

const OrderSuccess = ({ placedOrder, cartTotal, onRetry }) => {
  const status = placedOrder?.status || 'PENDING';

  const headings = {
    CONFIRMED: 'Order Confirmed!',
    CANCELLED: 'Payment Failed',
    PENDING:   'Processing Payment...',
  };

  const subtexts = {
    CONFIRMED: 'Your payment was approved and your order is on its way.',
    CANCELLED: 'Your payment could not be completed. Your cart items have been automatically restored by the system.',
    PENDING:   'Awaiting payment confirmation from the payment gateway. This usually takes 2-3 seconds.',
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="glass-panel rounded-xl p-8 text-center relative overflow-hidden bg-zinc-900 border border-zinc-800">

        <StatusIcon status={status} />

        <h2 className="font-display font-semibold text-xl text-zinc-100">
          {headings[status] || headings.PENDING}
        </h2>
        <p className="text-xs text-zinc-450 mt-1 px-2 leading-relaxed">
          {subtexts[status] || subtexts.PENDING}
        </p>

        <div className="mt-6 border-t border-b border-zinc-800/40 py-4 text-left space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Order Number:</span>
            <span className="font-mono text-zinc-300 font-medium text-[11px]">
              {placedOrder?.orderNumber?.slice(0, 18)}...
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Recipient:</span>
            <span className="text-zinc-300 font-medium">{placedOrder?.userEmail}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Total:</span>
            <span className="font-display text-zinc-100 font-bold">
              ${parseFloat(placedOrder?.totalAmount || cartTotal).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Payment Status:</span>
            <StatusBadge status={status} />
          </div>
        </div>

        {/* CANCELLED: show retry button */}
        {status === 'CANCELLED' && onRetry && (
          <button
            onClick={onRetry}
            className="w-full mt-4 py-2 rounded-lg text-xs font-semibold text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Checkout</span>
          </button>
        )}

        {/* CONFIRMED or PENDING: show back to store */}
        {status !== 'CANCELLED' && (
          <Link
            to="/catalog"
            className="w-full mt-6 py-2 rounded-lg text-xs font-semibold text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Storefront</span>
          </Link>
        )}

        {/* PENDING: subtle hint text */}
        {status === 'PENDING' && (
          <p className="text-[10px] text-zinc-600 mt-3">
            Page updates automatically - do not refresh.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderSuccess;
