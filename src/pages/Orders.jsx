import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, AlertCircle } from 'lucide-react';

import OrderCard from '../components/orders/OrderCard';
import EmptyOrders from '../components/orders/EmptyOrders';

const API_BASE =
  import.meta.env.VITE_API_BASE !== undefined
    ? import.meta.env.VITE_API_BASE
    : 'http://localhost:8000';

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/api/v1/orders`, {
        params: { page, size: 5, sort: 'id,desc' },
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = res.data;
      setOrders(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [user, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (authLoading || !user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl tracking-tight text-zinc-100 m-0">
            My Orders
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Your purchase history and delivery status</p>
        </div>
        <button
          onClick={fetchOrders}
          className="self-start px-3 py-1.5 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 rounded-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-450 p-4 rounded-xl text-xs">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Could not load orders</p>
            <p className="mt-0.5 text-zinc-400">{error}</p>
          </div>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && orders.length === 0 && <EmptyOrders />}

      {/* Order cards */}
      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Previous
          </button>
          <span className="text-xs text-zinc-500">Page {page + 1} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
