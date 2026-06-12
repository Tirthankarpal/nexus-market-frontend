import { useState } from 'react';
import { Edit3, Trash2, Check, X, RefreshCw } from 'lucide-react';

const CatalogTableRow = ({ product, onUpdateProduct, onDeleteProduct, setError }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    price: '',
    stockQuantity: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const startEdit = () => {
    setIsEditing(true);
    setEditForm({
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString()
    });
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    const priceNum = parseFloat(editForm.price);
    const stockNum = parseInt(editForm.stockQuantity);

    if (isNaN(priceNum) || priceNum <= 0 || isNaN(stockNum) || stockNum < 0) {
      setError('Invalid price or stock values provided');
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdateProduct(product, priceNum, stockNum);
      setIsEditing(false);
    } catch {
      // Error handled in parent onUpdateProduct handler
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDeleteProduct(product);
    } catch {
      // Error handled in parent
    }
  };

  return (
    <tr 
      className={`border-b border-zinc-800/40 hover:bg-zinc-900/50 transition-colors ${
        product.stockQuantity === 0 ? 'bg-zinc-950/20' : ''
      }`}
    >
      {/* ID */}
      <td className="py-3 px-2 text-center text-zinc-500 font-mono font-medium">{product.id}</td>

      {/* Name */}
      <td className="py-3 px-3 font-medium text-zinc-200">
        <span className="block leading-snug">{product.name}</span>
        {product.stockQuantity === 0 && (
          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] font-semibold bg-zinc-850 text-zinc-400 border border-zinc-800">
            Out of stock
          </span>
        )}
      </td>

      {/* Price Edit / View */}
      <td className="py-3 px-3">
        {isEditing ? (
          <div className="relative flex items-center max-w-[90px]">
            <span className="absolute left-2 text-zinc-500 text-xs">$</span>
            <input
              type="number"
              step="0.01"
              value={editForm.price}
              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 pl-4 py-0.5 text-xs text-zinc-150 focus:outline-none focus:border-zinc-550"
            />
          </div>
        ) : (
          <span className="font-semibold text-zinc-300 font-mono">
            ${parseFloat(product.price).toFixed(2)}
          </span>
        )}
      </td>

      {/* Stock Edit / View */}
      <td className="py-3 px-3">
        {isEditing ? (
          <input
            type="number"
            value={editForm.stockQuantity}
            onChange={(e) => setEditForm({ ...editForm, stockQuantity: e.target.value })}
            className="w-16 bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-xs text-zinc-150 focus:outline-none focus:border-zinc-550"
          />
        ) : (
          <span className={`font-mono ${
            product.stockQuantity <= 3 ? 'text-amber-400 font-medium' : 'text-zinc-400'
          }`}>
            {product.stockQuantity} units
          </span>
        )}
      </td>

      {/* Action buttons */}
      <td className="py-3 px-2 text-right">
        {isEditing ? (
          <div className="flex items-center justify-end space-x-1.5">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="p-1 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-800 transition-all cursor-pointer"
              title="Save updates"
            >
              {isUpdating ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </button>
            <button
              onClick={cancelEdit}
              disabled={isUpdating}
              className="p-1 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 rounded border border-zinc-800 transition-all cursor-pointer"
              title="Cancel"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end space-x-1">
            <button
              onClick={startEdit}
              className="p-1 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 rounded transition-all cursor-pointer"
              title="Edit product"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 rounded transition-all cursor-pointer"
              title="Delete product"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default CatalogTableRow;
