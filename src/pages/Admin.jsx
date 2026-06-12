import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Check, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';

import AdminMetrics from '../components/admin/AdminMetrics';
import AddProductForm from '../components/admin/AddProductForm';
import CatalogTable from '../components/admin/CatalogTable';

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

  const fetchProducts = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProducts();
    }
  }, [user, fetchProducts]);

  // Handle Add Product Submit
  const handleAddProduct = async (productData) => {
    setError(null);
    setSuccess(null);

    const priceNum = parseFloat(productData.price);
    const stockNum = parseInt(productData.stockQuantity);

    try {
      const productPayload = {
        name: productData.name,
        price: priceNum,
        stockQuantity: stockNum
      };

      const prodRes = await axios.post(`${API_BASE}/api/v1/products`, productPayload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      const savedProduct = prodRes.data;

      await axios.put(`${API_BASE}/api/v1/inventory/set`, null, {
        params: {
          skuCode: savedProduct.name,
          quantity: savedProduct.stockQuantity
        },
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setSuccess(`Product "${savedProduct.name}" created and inventory initialized successfully!`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Creation failed';
      setError(msg);
      throw err;
    }
  };

  // Save Inline Edit
  const handleUpdateProduct = async (product, updatedPrice, updatedStock) => {
    setError(null);
    setSuccess(null);

    try {
      const updatePayload = {
        name: product.name,
        price: updatedPrice,
        stockQuantity: updatedStock
      };

      await axios.put(`${API_BASE}/api/v1/products/${product.id}`, updatePayload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      await axios.put(`${API_BASE}/api/v1/inventory/set`, null, {
        params: {
          skuCode: product.name,
          quantity: updatedStock
        },
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setSuccess(`Product "${product.name}" updated successfully!`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Update failed';
      setError(msg);
      throw err;
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
      await axios.delete(`${API_BASE}/api/v1/products/${product.id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setSuccess(`Product "${product.name}" deleted from catalog.`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Deletion failed';
      setError(msg);
      throw err;
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
        <RefreshCw className="h-8 w-8 text-zinc-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="font-display font-semibold text-2xl tracking-tight text-zinc-100 m-0">
            Admin Console
          </h1>
          <p className="text-xs text-zinc-400 mt-1 flex items-center space-x-1.5">
            <ShieldAlert className="h-3.5 w-3.5 inline text-zinc-550" />
            <span>Secure Administrative Access Active</span>
          </p>
        </div>

        <button
          onClick={fetchProducts}
          className="px-3 py-1.5 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 rounded-md transition-all flex items-center space-x-2 cursor-pointer"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload Catalog</span>
        </button>
      </div>

      {/* Global Alerts */}
      {error && (
        <div className="flex items-start space-x-3 bg-rose-500/10 border border-rose-500/20 text-rose-450 p-4 rounded-xl text-xs">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Administrative Error</p>
            <p className="mt-0.5 text-zinc-350">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-start space-x-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 p-4 rounded-xl text-xs">
          <Check className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Action Completed</p>
            <p className="mt-0.5 text-zinc-350">{success}</p>
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      <AdminMetrics metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Product Creation Column */}
        <AddProductForm onAddProduct={handleAddProduct} setError={setError} />

        {/* Catalog Table Column */}
        <CatalogTable 
          products={products} 
          loading={loading} 
          onUpdateProduct={handleUpdateProduct} 
          onDeleteProduct={handleDeleteProduct} 
          setError={setError}
        />
      </div>
    </div>
  );
};

export default Admin;
