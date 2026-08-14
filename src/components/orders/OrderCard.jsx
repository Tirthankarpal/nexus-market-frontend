import { useState } from 'react';
import { Package, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import DeliveryTimeline from './DeliveryTimeline';

const STATUS_MAP = {
  CONFIRMED: {
    label: 'Being Processed',
    icon: CheckCircle,
    color: 'text-emerald-450',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-400',
    description: 'Payment confirmed. Your order is being prepared for dispatch.',
  },
  PENDING: {
    label: 'Payment Pending',
    icon: Clock,
    color: 'text-amber-450',
    bg: 'bg-amber-500/10 border-amber-500/20',
    dot: 'bg-amber-400 animate-pulse',
    description: 'Awaiting payment confirmation from the payment gateway.',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-rose-450',
    bg: 'bg-rose-500/10 border-rose-500/20',
    dot: 'bg-rose-400',
    description: 'Payment failed or order was cancelled. Inventory has been restored.',
  },
};

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-all hover:border-zinc-700">
      {/* Card Header */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700/50 shrink-0 mt-0.5">
            <Package className="h-4 w-4 text-zinc-400" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">
              #{order.orderNumber?.slice(0, 16)}...
            </p>
            <p className="text-sm font-semibold text-zinc-100 mt-0.5 font-display">
              ${parseFloat(order.totalAmount).toFixed(2)}
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              {order.orderLineItemsList?.length || 0} item
              {order.orderLineItemsList?.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
            {statusInfo.label}
          </div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div className="border-t border-zinc-800 px-4 pb-4 pt-3 space-y-3">
          {/* Status description */}
          <div className={`flex items-start gap-2 p-2.5 rounded-lg border text-[11px] ${statusInfo.bg} ${statusInfo.color}`}>
            <StatusIcon className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>{statusInfo.description}</span>
          </div>

          {/* Order Items */}
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Items</p>
            <div className="space-y-2">
              {order.orderLineItemsList?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs bg-zinc-950/50 rounded-lg px-3 py-2 border border-zinc-800/50"
                >
                  <span className="text-zinc-300 font-medium">{item.skuCode}</span>
                  <div className="flex items-center gap-4 text-zinc-500">
                    <span>×{item.quantity}</span>
                    <span className="font-mono text-zinc-400">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center text-xs pt-1 border-t border-zinc-800/60">
            <span className="text-zinc-500">Order Total</span>
            <span className="font-display font-bold text-sm text-zinc-100">
              ${parseFloat(order.totalAmount).toFixed(2)}
            </span>
          </div>

          {/* Delivery timeline — only for CONFIRMED */}
          {order.status === 'CONFIRMED' && <DeliveryTimeline />}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
