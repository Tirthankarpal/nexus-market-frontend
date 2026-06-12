import { useState } from 'react';
import { PlusCircle, RefreshCw } from 'lucide-react';

const AddProductForm = ({ onAddProduct, setError }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stockQuantity: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stockQuantity) {
      setError('Please fill in all product fields');
      return;
    }

    const priceNum = parseFloat(newProduct.price);
    const stockNum = parseInt(newProduct.stockQuantity);

    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Price must be a positive number');
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      setError('Stock level cannot be negative');
      return;
    }

    setFormSubmitting(true);
    try {
      await onAddProduct({
        name: newProduct.name,
        price: newProduct.price,
        stockQuantity: newProduct.stockQuantity
      });
      setNewProduct({ name: '', price: '', stockQuantity: '' });
    } catch {
      // Error is handled in the parent via setError
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6 space-y-6 bg-zinc-900 border border-zinc-800">
      <div>
        <h3 className="font-display font-semibold text-base text-zinc-150 flex items-center space-x-2">
          <PlusCircle className="h-4.5 w-4.5 text-zinc-300" />
          <span>Add New Product</span>
        </h3>
        <p className="text-[11px] text-zinc-400 mt-1">Insert a new item in the product catalog and initialize inventory reserves</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input 1 */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">Product Title</label>
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            placeholder="e.g. Nexus Master Keyboard"
            className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 transition-all placeholder-zinc-650"
            required
          />
        </div>

        {/* Input 2 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">Price (USD)</label>
            <input
              type="number"
              step="0.01"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              placeholder="249.99"
              className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 transition-all placeholder-zinc-655"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">Initial Stock</label>
            <input
              type="number"
              value={newProduct.stockQuantity}
              onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
              placeholder="10"
              className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 transition-all placeholder-zinc-655"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={formSubmitting}
          className="w-full mt-2 py-2 rounded-lg text-xs font-semibold text-zinc-950 bg-zinc-100 hover:bg-zinc-200 shadow-none transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {formSubmitting ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              <span>Publish Product</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
