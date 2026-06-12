import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  return (
    <div className="glass-panel rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800">
      {/* Product Info */}
      <div className="flex-1">
        <span className="text-[9px] uppercase font-bold text-zinc-550 tracking-wider">Premium Tech</span>
        <h3 className="font-display font-medium text-base text-zinc-100 leading-tight">{item.name}</h3>
        <span className="text-xs text-zinc-400 mt-1 inline-block font-mono">
          ${parseFloat(item.price).toFixed(2)} each
        </span>
      </div>

      {/* Quantity Controls & Total */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        <div className="flex items-center space-x-2 bg-zinc-950 border border-zinc-850 rounded-lg p-1">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-1 hover:bg-zinc-850 hover:text-zinc-100 rounded text-zinc-500 transition-all cursor-pointer"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-bold text-zinc-200">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-1 hover:bg-zinc-850 hover:text-zinc-100 rounded text-zinc-500 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="w-20 text-right">
          <span className="font-display font-semibold text-sm text-zinc-250">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>

        <button
          onClick={() => removeFromCart(item.id)}
          className="p-2 hover:bg-rose-500/10 hover:text-rose-450 text-zinc-500 rounded-lg transition-all cursor-pointer"
          title="Remove Item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
