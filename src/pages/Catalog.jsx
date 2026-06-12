import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import { AlertCircle } from 'lucide-react';

import CatalogToolbar from '../components/catalog/CatalogToolbar';
import Pagination from '../components/catalog/Pagination';

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

  const loadOfflineSimulation = useCallback((reason) => {
    setProducts(OFFLINE_PRODUCTS);
    setTotalPages(1);
    setError(reason);
    setIsOfflineSimulation(true);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsOfflineSimulation(false);
    try {
      const response = await axios.get(`${API_BASE}/api/v1/products`, {
        params: {
          page: page,
          size: size,
          sort: `${sortField},${sortDir}`
        }
      });

      const pageData = response.data;
      if (pageData && pageData.content) {
        setProducts(pageData.content);
        setTotalPages(pageData.totalPages);

        if (pageData.totalElements === 0) {
          loadOfflineSimulation("Your backend database is currently empty. Showing catalog simulation.");
        }
      } else {
        const listData = Array.isArray(pageData) ? pageData : [];
        setProducts(listData);
        setTotalPages(1);
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
  }, [page, size, sortField, sortDir, loadOfflineSimulation]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleSortChange = (e) => {
    const [field, dir] = e.target.value.split(',');
    setSortField(field);
    setSortDir(dir);
    setPage(0);
  };

  const handleSizeChange = (e) => {
    setSize(parseInt(e.target.value));
    setPage(0);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="font-display font-semibold text-2xl tracking-tight text-zinc-100 m-0">
            Discover Products
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Explore our high-performance tech inventory catalog</p>
        </div>

        {/* Toolbar Controls */}
        <CatalogToolbar
          sortField={sortField}
          sortDir={sortDir}
          size={size}
          onSortChange={handleSortChange}
          onSizeChange={handleSizeChange}
          onRefresh={fetchProducts}
        />
      </div>

      {/* Simulation Banner */}
      {isOfflineSimulation && (
        <div className="flex items-start space-x-3 bg-zinc-900 border border-zinc-800 text-zinc-300 p-4 rounded-xl text-xs">
          <AlertCircle className="h-5 w-5 text-zinc-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-zinc-200">Offline Simulation Active</p>
            <p className="mt-0.5 text-zinc-400 leading-relaxed">
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
        <div className="glass-panel rounded-xl py-16 text-center max-w-md mx-auto bg-zinc-900 border border-zinc-800">
          <AlertCircle className="h-8 w-8 text-zinc-650 mx-auto mb-2" />
          <h3 className="font-display font-semibold text-base text-zinc-300">No Products Available</h3>
          <p className="text-xs text-zinc-500 mt-1 px-4">There are no products listed in the system at this time.</p>
        </div>
      )}

      {/* Custom Pagination Footer */}
      {!loading && (
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
};

export default Catalog;
