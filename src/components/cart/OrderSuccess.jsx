import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const OrderSuccess = ({ placedOrder, cartTotal }) => {
  return (
    <div className="max-w-md mx-auto py-12">
      <div className="glass-panel rounded-xl p-8 text-center relative overflow-hidden bg-zinc-900 border border-zinc-800">
        <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 text-emerald-450">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h2 className="font-display font-semibold text-xl text-zinc-100">Order Confirmed!</h2>
        <p className="text-xs text-zinc-450 mt-1">Your checkout completed successfully through the order gateway</p>

        <div className="mt-6 border-t border-b border-zinc-800/40 py-4 text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">Order Number:</span>
            <span className="font-mono text-zinc-300 font-medium">
              {placedOrder.orderNumber?.slice(0, 18)}...
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Recipient Session:</span>
            <span className="text-zinc-300 font-medium">{placedOrder.userEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Total Charged:</span>
            <span className="font-display text-emerald-450 font-bold">
              ${parseFloat(placedOrder.totalAmount || cartTotal).toFixed(2)}
            </span>
          </div>
        </div>

        <Link
          to="/catalog"
          className="w-full mt-6 py-2 rounded-lg text-xs font-semibold text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Storefront</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
