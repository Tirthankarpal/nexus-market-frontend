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
    <div className="glass-panel glass-panel-hover rounded-xl overflow-hidden flex flex-col h-full relative group">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-obsidian-950/20 pointer-events-none z-0"></div>

      <div className="p-5 flex flex-col flex-grow relative z-10">
        {/* Product Category Tag / Decorative text */}
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">
          Nexus Premium Store
        </span>

        {/* Product Name */}
        <h3 className="font-display font-semibold text-lg text-slate-100 mb-2 leading-snug group-hover:text-cyan-glowing transition-colors duration-300">
          {product.name}
        </h3>

        {/* Dynamic Stock Indicator */}
        <div className="mb-4 flex items-center space-x-1.5 text-xs">
          {isOutOfStock ? (
            <span className="flex items-center text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-medium">
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="flex items-center text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-medium">
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
              Low Stock: {product.stockQuantity} left
            </span>
          ) : (
            <span className="flex items-center text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              In Stock: {product.stockQuantity} units
            </span>
          )}
        </div>

        {/* Product Price & Cart Action */}
        <div className="mt-auto pt-4 border-t border-slate-800/40 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Price</span>
            <span className="font-display font-extrabold text-xl text-cyan-glowing">
              ${parseFloat(product.price).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all duration-300 transform active:scale-95 ${
              isOutOfStock
                ? 'bg-slate-800/40 text-slate-500 border border-slate-700/20 cursor-not-allowed'
                : 'bg-violet-neon text-white shadow-[0_0_10px_rgba(139,92,246,0.3)] hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:bg-violet-600 cursor-pointer'
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

// Elegant Skeleton Loading Card for pagination/fetch states
export const ProductCardSkeleton = () => {
  return (
    <div className="glass-panel rounded-xl p-5 flex flex-col h-full relative animate-pulse">
      <div className="h-3 w-20 bg-slate-800 rounded mb-2"></div>
      <div className="h-6 w-3/4 bg-slate-800 rounded mb-3"></div>
      <div className="h-5 w-24 bg-slate-800 rounded mb-8"></div>
      
      <div className="mt-auto pt-4 border-t border-slate-800/40 flex items-center justify-between">
        <div className="flex flex-col space-y-1">
          <div className="h-2.5 w-8 bg-slate-800 rounded"></div>
          <div className="h-5 w-16 bg-slate-800 rounded"></div>
        </div>
        <div className="h-8 w-24 bg-slate-800 rounded-lg"></div>
      </div>
    </div>
  );
};

export default ProductCard;
