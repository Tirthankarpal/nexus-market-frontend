import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

const EmptyCart = () => {
  return (
    <div className="max-w-md mx-auto py-16 text-center">
      <div className="inline-flex p-3 rounded-full bg-zinc-900 border border-zinc-800 mb-4 text-zinc-400">
        <ShoppingBag className="h-6 w-6" />
      </div>
      <h2 className="font-display font-semibold text-lg text-zinc-200">Your Cart is Empty</h2>
      <p className="text-xs text-zinc-500 mt-1">Add items from the store catalog to begin checkout</p>
      <Link
        to="/catalog"
        className="inline-flex items-center space-x-2 mt-6 px-4 py-2 rounded-md text-xs font-semibold text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-all cursor-pointer active:scale-95"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Browse Catalog</span>
      </Link>
    </div>
  );
};

export default EmptyCart;
