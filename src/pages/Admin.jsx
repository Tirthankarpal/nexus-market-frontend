import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Package, 
  DollarSign, 
  Layers, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  RefreshCw, 
  AlertCircle,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE !== undefined ? import.meta.env.VITE_API_BASE : 'http://localhost:8000';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admins or guests immediately
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      navigate('/catalog');
    }
  }, [user, authLoading, navigate]);

  // Page States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stockQuantity: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Editing Row States
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    price: '',
    stockQuantity: ''
  });
  const [rowUpdatingId, setRowUpdatingId] = useState(null);

  // Fetch all products (admin-scoped search)
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Query parameters for unpaginated products list (size 999 to show all)
      const response = await axios.get(`${API_BASE}/api/v1/products`, {
        params: { page: 0, size: 999, sort: 'id,asc' },
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      
      const pageData = response.data;
      if (pageData && pageData.content) {
        setProducts(pageData.content);
      } else if (Array.isArray(pageData)) {
        setProducts(pageData);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch catalog products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchProducts();
    }
  }, [user]);

  // Handle Add Product Submit
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stockQuantity) {
      setError('Please fill in all product fields');
      return;
    }

    setFormSubmitting(true);
    setError(null);
    setSuccess(null);

    const priceNum = parseFloat(newProduct.price);
    const stockNum = parseInt(newProduct.stockQuantity);

    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Price must be a positive number');
      setFormSubmitting(false);
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      setError('Stock level cannot be negative');
      setFormSubmitting(false);
      return;
    }

    try {
      // 1. Create product in product-service
      const productPayload = {
        name: newProduct.name,
        price: priceNum,
        stockQuantity: stockNum
      };

      const prodRes = await axios.post(`${API_BASE}/api/v1/products`, productPayload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      const savedProduct = prodRes.data;

      // 2. Initialize stock reserves in inventory-service
      // Note: We use our new /set endpoint to guarantee exact synchronization
      await axios.put(`${API_BASE}/api/v1/inventory/set`, null, {
        params: {
          skuCode: savedProduct.name,
          quantity: savedProduct.stockQuantity
        },
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setSuccess(`Product "${savedProduct.name}" created and inventory initialized successfully!`);
      setNewProduct({ name: '', price: '', stockQuantity: '' });
      fetchProducts(); // Refresh active list
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Creation failed');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Start Editing Inline
  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString()
    });
  };

  // Cancel Inline Edit
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Save Inline Edit
  const handleUpdateProduct = async (product) => {
    const priceNum = parseFloat(editForm.price);
    const stockNum = parseInt(editForm.stockQuantity);

    if (isNaN(priceNum) || priceNum <= 0 || isNaN(stockNum) || stockNum < 0) {
      setError('Invalid price or stock values provided');
      return;
    }

    setRowUpdatingId(product.id);
    setError(null);
    setSuccess(null);

    try {
      // 1. Update product detail in product-service
      const updatePayload = {
        name: product.name,
        price: priceNum,
        stockQuantity: stockNum
      };

      await axios.put(`${API_BASE}/api/v1/products/${product.id}`, updatePayload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      // 2. Synchronize stock reserves in inventory-service
      await axios.put(`${API_BASE}/api/v1/inventory/set`, null, {
        params: {
          skuCode: product.name,
          quantity: stockNum
        },
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setSuccess(`Product "${product.name}" updated successfully!`);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Update failed');
    } finally {
      setRowUpdatingId(null);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to remove "${product.name}" from the active catalog?`)) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      // 1. Delete product in product-service
      await axios.delete(`${API_BASE}/api/v1/products/${product.id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      // Note: inventory-service retains SKU historical entries or they can stay idle.
      setSuccess(`Product "${product.name}" deleted from catalog.`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Deletion failed');
    }
  };

  // Metrics Calculations
  const metrics = {
    totalProducts: products.length,
    catalogValuation: products.reduce((sum, p) => sum + (parseFloat(p.price) * p.stockQuantity), 0),
    outOfStockCount: products.filter(p => p.stockQuantity === 0).length
  };

  // Guard view during redirection
  if (authLoading || !user || user.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-10 w-10 text-violet-neon animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight text-slate-100 m-0">
            Admin Console
          </h1>
          <p className="text-xs text-rose-400 mt-1 font-semibold flex items-center space-x-1.5">
            <ShieldAlert className="h-3.5 w-3.5 inline" />
            <span>Secure Administrative Access Active</span>
          </p>
        </div>

        <button
          onClick={fetchProducts}
          className="px-4 py-2 border border-slate-800 hover:border-slate-700 bg-obsidian-900/60 hover:bg-slate-800/30 text-xs font-semibold text-slate-300 rounded-lg transition-all flex items-center space-x-2 cursor-pointer active:scale-95 shadow-md"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload Catalog</span>
        </button>
      </div>

      {/* Global Alerts */}
      {error && (
        <div className="flex items-start space-x-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-xs animate-shake">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Administrative Error</p>
            <p className="mt-0.5 text-slate-300">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-start space-x-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs">
          <Check className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Action Completed</p>
            <p className="mt-0.5 text-slate-300">{success}</p>
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="glass-panel rounded-xl p-5 flex items-center space-x-4 border-l-4 border-l-violet-neon shadow-lg relative overflow-hidden">
          <div className="p-3 bg-violet-neon/10 border border-violet-neon/20 rounded-lg text-violet-neon shrink-0">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Catalog Items</span>
            <span className="font-display font-extrabold text-2xl text-slate-100">{metrics.totalProducts}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel rounded-xl p-5 flex items-center space-x-4 border-l-4 border-l-cyan-glowing shadow-lg relative overflow-hidden">
          <div className="p-3 bg-cyan-glowing/10 border border-cyan-glowing/20 rounded-lg text-cyan-glowing shrink-0">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Asset Valuation</span>
            <span className="font-display font-extrabold text-2xl text-cyan-glowing">
              ${metrics.catalogValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel rounded-xl p-5 flex items-center space-x-4 border-l-4 border-l-rose-500 shadow-lg relative overflow-hidden">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 shrink-0">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Out of Stock Items</span>
            <span className="font-display font-extrabold text-2xl text-rose-400">{metrics.outOfStockCount}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Product Creation Column */}
        <div className="glass-panel rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="font-display font-extrabold text-lg text-slate-100 flex items-center space-x-2">
              <PlusCircle className="h-5 w-5 text-violet-neon" />
              <span>Add New Product</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Insert a new item in the product catalog and initialize inventory reserves</p>
          </div>

          <form onSubmit={handleAddProduct} className="space-y-4">
            {/* Input 1 */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Product Title</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="e.g. Nexus Master Keyboard"
                className="w-full bg-obsidian-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-neon focus:ring-1 focus:ring-violet-neon transition-all"
                required
              />
            </div>

            {/* Input 2 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="249.99"
                  className="w-full bg-obsidian-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-neon focus:ring-1 focus:ring-violet-neon transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Initial Stock</label>
                <input
                  type="number"
                  value={newProduct.stockQuantity}
                  onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                  placeholder="10"
                  className="w-full bg-obsidian-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-neon focus:ring-1 focus:ring-violet-neon transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={formSubmitting}
              className="w-full mt-2 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-violet-neon to-indigo-glowing hover:opacity-95 shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
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

        {/* Catalog Table Column */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 space-y-4 overflow-hidden shadow-2xl">
          <div>
            <h3 className="font-display font-extrabold text-lg text-slate-100">Catalog Inventory</h3>
            <p className="text-[11px] text-slate-400 mt-1">Manage pricing details, override stock reserves, or delete legacy products</p>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-2 text-center w-12">ID</th>
                  <th className="py-3 px-3">Product details</th>
                  <th className="py-3 px-3 w-32">Price</th>
                  <th className="py-3 px-3 w-28">Stock Level</th>
                  <th className="py-3 px-2 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-16">
                      <RefreshCw className="h-8 w-8 text-violet-neon animate-spin mx-auto" />
                      <span className="text-slate-500 text-xs mt-2 block">Loading live database records...</span>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-16 text-slate-500">
                      <AlertCircle className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                      <span>No items registered in active database.</span>
                    </td>
                  </tr>
                ) : (
                  products.map((prod) => (
                    <tr 
                      key={prod.id} 
                      className={`border-b border-slate-800/40 hover:bg-slate-800/10 transition-colors ${
                        prod.stockQuantity === 0 ? 'bg-rose-500/[0.01]' : ''
                      }`}
                    >
                      {/* ID */}
                      <td className="py-4 px-2 text-center text-slate-500 font-mono font-medium">{prod.id}</td>

                      {/* Name */}
                      <td className="py-4 px-3 font-semibold text-slate-200">
                        <span className="block leading-snug">{prod.name}</span>
                        {prod.stockQuantity === 0 && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Out of stock
                          </span>
                        )}
                      </td>

                      {/* Price Edit / View */}
                      <td className="py-4 px-3">
                        {editingId === prod.id ? (
                          <div className="relative flex items-center max-w-[100px]">
                            <span className="absolute left-2.5 text-slate-500 text-xs">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={editForm.price}
                              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                              className="w-full bg-obsidian-950 border border-slate-700 rounded-lg pl-5 pr-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-violet-neon"
                            />
                          </div>
                        ) : (
                          <span className="font-semibold text-slate-300 font-mono">
                            ${parseFloat(prod.price).toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Stock Edit / View */}
                      <td className="py-4 px-3">
                        {editingId === prod.id ? (
                          <input
                            type="number"
                            value={editForm.stockQuantity}
                            onChange={(e) => setEditForm({ ...editForm, stockQuantity: e.target.value })}
                            className="w-20 bg-obsidian-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-violet-neon"
                          />
                        ) : (
                          <span className={`font-mono font-semibold ${
                            prod.stockQuantity <= 3 ? 'text-amber-400 font-bold' : 'text-slate-300'
                          }`}>
                            {prod.stockQuantity} units
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-2 text-right">
                        {editingId === prod.id ? (
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleUpdateProduct(prod)}
                              disabled={rowUpdatingId !== null}
                              className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30 transition-all cursor-pointer active:scale-90"
                              title="Save updates"
                            >
                              {rowUpdatingId === prod.id ? (
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Check className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={rowUpdatingId !== null}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded border border-slate-700/50 transition-all cursor-pointer"
                              title="Cancel"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => startEdit(prod)}
                              className="p-1.5 hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 rounded transition-all cursor-pointer"
                              title="Edit product"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod)}
                              className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded transition-all cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
