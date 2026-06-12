import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-xl overflow-hidden flex flex-col h-full relative group bg-zinc-900 border border-zinc-800">
      <div className="p-5 flex flex-col flex-grow relative z-10">
        {/* Product Category Tag */}
        <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 mb-1">
          Nexus Premium Store
        </span>

        {/* Product Name */}
        <h3 className="font-display font-medium text-base text-zinc-100 mb-2 leading-snug group-hover:text-zinc-350 transition-colors">
          {product.name}
        </h3>

        {/* Stock Indicator */}
        <div className="mb-4 flex items-center space-x-1.5 text-[11px]">
          {isOutOfStock ? (
            <span className="flex items-center text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-medium">
              <AlertCircle className="h-3 w-3 mr-1" />
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="flex items-center text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-medium">
              <AlertCircle className="h-3 w-3 mr-1" />
              Low Stock: {product.stockQuantity} left
            </span>
          ) : (
            <span className="flex items-center text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
              <CheckCircle className="h-3 w-3 mr-1" />
              In Stock: {product.stockQuantity} units
            </span>
          )}
        </div>

        {/* Product Price & Cart Action */}
        <div className="mt-auto pt-4 border-t border-zinc-800/40 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Price</span>
            <span className="font-display font-bold text-lg text-zinc-100">
              ${parseFloat(product.price).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              isOutOfStock
                ? 'bg-zinc-800/40 text-zinc-500 border border-zinc-800/20 cursor-not-allowed'
                : 'bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700 hover:text-white cursor-pointer active:scale-95'
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Elegant Skeleton Loading Card
export const ProductCardSkeleton = () => {
  return (
    <div className="glass-panel rounded-xl p-5 flex flex-col h-full relative animate-pulse bg-zinc-900 border border-zinc-800">
      <div className="h-3 w-20 bg-zinc-800 rounded mb-2"></div>
      <div className="h-5 w-3/4 bg-zinc-800 rounded mb-3"></div>
      <div className="h-4 w-24 bg-zinc-800 rounded mb-8"></div>
      
      <div className="mt-auto pt-4 border-t border-zinc-800/40 flex items-center justify-between">
        <div className="flex flex-col space-y-1">
          <div className="h-2 w-8 bg-zinc-800 rounded"></div>
          <div className="h-4 w-16 bg-zinc-800 rounded"></div>
        </div>
        <div className="h-7 w-24 bg-zinc-800 rounded-md"></div>
      </div>
    </div>
  );
};

export default ProductCard;
