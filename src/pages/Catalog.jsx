import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import { ArrowUpDown, AlertCircle, ShoppingCart, SlidersHorizontal, RefreshCcw } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE !== undefined ? import.meta.env.VITE_API_BASE : 'http://localhost:8000';

// Offline fallback mock data for seamless premium simulations when backend is offline/empty
const OFFLINE_PRODUCTS = [
  { id: 101, name: "Nexus Quantum Laptop", price: "1299.99", stockQuantity: 5 },
  { id: 102, name: "Omni Pro Curved Monitor", price: "449.99", stockQuantity: 12 },
  { id: 103, name: "Holographic Mech Keyboard", price: "189.50", stockQuantity: 3 },
  { id: 104, name: "Chrono Cyber Watch", price: "299.00", stockQuantity: 0 },
  { id: 105, name: "Apex Wireless Mouse", price: "89.99", stockQuantity: 45 },
  { id: 106, name: "Void-ANC Sound Earbuds", price: "159.99", stockQuantity: 8 },
  { id: 107, name: "Lumen RGB Smart Light Strips", price: "34.50", stockQuantity: 15 },
  { id: 108, name: "Nexus Core SSD 2TB", price: "179.99", stockQuantity: 2 }
];

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOfflineSimulation, setIsOfflineSimulation] = useState(false);

  // Pagination & Sorting State
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(8);
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    setIsOfflineSimulation(false);
    try {
      // Query parameters format matching Pageable: /api/v1/products?page=0&size=8&sort=name,asc
      const response = await axios.get(`${API_BASE}/api/v1/products`, {
        params: {
          page: page,
          size: size,
          sort: `${sortField},${sortDir}`
        }
      });

      // Handle raw page payload from Spring Data Page<Product>
      const pageData = response.data;
      if (pageData && pageData.content) {
        setProducts(pageData.content);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);

        // Fallback to offline simulation if backend returned successfully but catalog is empty
        if (pageData.totalElements === 0) {
          loadOfflineSimulation("Your backend database is currently empty. Showing catalog simulation.");
        }
      } else {
        // Fallback for list responses
        const listData = Array.isArray(pageData) ? pageData : [];
        setProducts(listData);
        setTotalPages(1);
        setTotalElements(listData.length);
        if (listData.length === 0) {
          loadOfflineSimulation("Empty product list.");
        }
      }
    } catch (err) {
      console.warn("Backend connection failed, starting simulator...", err);
      loadOfflineSimulation("Connecting to backend microservices failed. Running in simulation mode.");
    } finally {
      setLoading(false);
    }
  };

  const loadOfflineSimulation = (reason) => {
    setProducts(OFFLINE_PRODUCTS);
    setTotalPages(1);
    setTotalElements(OFFLINE_PRODUCTS.length);
    setError(reason);
    setIsOfflineSimulation(true);
  };

  useEffect(() => {
    fetchProducts();
  }, [page, size, sortField, sortDir]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleSortChange = (e) => {
    const [field, dir] = e.target.value.split(',');
    setSortField(field);
    setSortDir(dir);
    setPage(0); // Reset to first page
  };

  return (
    <div className="space-y-6">
      {/* Header and Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight text-slate-100 m-0">
            Discover Products
          </h1>
          <p className="text-xs text-slate-400 mt-1">Explore our high-performance tech inventory catalog</p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sorting Selector */}
          <div className="flex items-center space-x-1.5 bg-obsidian-900/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="h-3.5 w-3.5 text-violet-neon" />
            <select
              onChange={handleSortChange}
              value={`${sortField},${sortDir}`}
              className="bg-transparent focus:outline-none cursor-pointer font-medium"
            >
              <option value="name,asc" className="bg-obsidian-950 text-slate-300">Name (A - Z)</option>
              <option value="name,desc" className="bg-obsidian-950 text-slate-300">Name (Z - A)</option>
              <option value="price,asc" className="bg-obsidian-950 text-slate-300">Price (Low - High)</option>
              <option value="price,desc" className="bg-obsidian-950 text-slate-300">Price (High - Low)</option>
            </select>
          </div>

          {/* Size Selector */}
          <div className="flex items-center space-x-1.5 bg-obsidian-900/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
            <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-glowing" />
            <select
              value={size}
              onChange={(e) => { setSize(parseInt(e.target.value)); setPage(0); }}
              className="bg-transparent focus:outline-none cursor-pointer font-medium"
            >
              <option value="8" className="bg-obsidian-950 text-slate-300">Show 8</option>
              <option value="12" className="bg-obsidian-950 text-slate-300">Show 12</option>
              <option value="24" className="bg-obsidian-950 text-slate-300">Show 24</option>
            </select>
          </div>

          {/* Manual Refresh */}
          <button
            onClick={fetchProducts}
            className="p-2 bg-obsidian-900/60 border border-slate-800 hover:border-slate-700 hover:text-slate-100 rounded-lg transition-all text-slate-400 cursor-pointer active:scale-95"
            title="Reload Catalog"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Connection Mode indicator */}
      {isOfflineSimulation && (
        <div className="flex items-start space-x-3 bg-violet-neon/10 border border-violet-neon/30 text-slate-300 p-4 rounded-xl text-xs">
          <AlertCircle className="h-5 w-5 text-violet-neon shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-violet-400">Offline Simulation Active</p>
            <p className="mt-0.5 text-slate-400 leading-relaxed">
              {error}. We loaded premium dummy products so you can fully test the catalog layouts, sorting filters, cart limits, and responsive grid panels.
            </p>
          </div>
        </div>
      )}

      {/* Main Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: size }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl py-16 text-center max-w-md mx-auto">
          <AlertCircle className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-lg text-slate-300">No Products Available</h3>
          <p className="text-xs text-slate-500 mt-1 px-4">There are no products listed in the system at this time.</p>
        </div>
      )}

      {/* Custom Pagination Footer */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md border ${
              page === 0
                ? 'border-slate-800/40 text-slate-600 bg-transparent cursor-not-allowed'
                : 'border-slate-800 text-slate-400 bg-obsidian-900/40 hover:bg-slate-800/30 hover:text-slate-200 cursor-pointer active:scale-95'
            } transition-all`}
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => handlePageChange(idx)}
              className={`h-8 w-8 text-xs font-bold rounded-md border transition-all ${
                page === idx
                  ? 'border-violet-neon bg-violet-neon text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]'
                  : 'border-slate-800 text-slate-400 bg-obsidian-900/40 hover:bg-slate-800/30 hover:text-slate-200 cursor-pointer'
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages - 1}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md border ${
              page === totalPages - 1
                ? 'border-slate-800/40 text-slate-600 bg-transparent cursor-not-allowed'
                : 'border-slate-800 text-slate-400 bg-obsidian-900/40 hover:bg-slate-800/30 hover:text-slate-200 cursor-pointer active:scale-95'
            } transition-all`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalog;
