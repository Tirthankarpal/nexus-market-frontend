import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const EmptyOrders = () => (
  <div className="py-20 text-center">
    <div className="inline-flex p-3 rounded-full bg-zinc-900 border border-zinc-800 mb-4 text-zinc-500">
      <ShoppingBag className="h-6 w-6" />
    </div>
    <h3 className="font-display font-semibold text-base text-zinc-300">No orders yet</h3>
    <p className="text-xs text-zinc-500 mt-1">
      Your purchase history will appear here after your first order.
    </p>
    <Link
      to="/catalog"
      className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-md text-xs font-semibold text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-all cursor-pointer"
    >
      Browse Catalog
    </Link>
  </div>
);

export default EmptyOrders;
