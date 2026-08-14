import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';

import EmptyCart from '../components/cart/EmptyCart';
import OrderSuccess from '../components/cart/OrderSuccess';
import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';

const API_BASE = import.meta.env.VITE_API_BASE !== undefined ? import.meta.env.VITE_API_BASE : 'http://localhost:8000';

// Poll every 2.5s, max 4 attempts (10s total), then give up gracefully
const POLL_INTERVAL_MS = 2500;
const POLL_MAX_ATTEMPTS = 4;

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [cartSnapshot, setCartSnapshot] = useState(null); // preserve for retry

  const pollTimerRef = useRef(null);
  const pollAttemptsRef = useRef(0);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  /**
   * Polls GET /api/v1/orders to find the updated status of a specific order.
   * Stops when status is CONFIRMED or CANCELLED, or after max attempts.
   */
  const startPolling = (orderNumber) => {
    pollAttemptsRef.current = 0;

    pollTimerRef.current = setInterval(async () => {
      pollAttemptsRef.current += 1;

      try {
        const response = await axios.get(`${API_BASE}/api/v1/orders`, {
          params: { page: 0, size: 50, sort: 'id,desc' },
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const orders = response.data?.content || [];
        const updated = orders.find((o) => o.orderNumber === orderNumber);

        if (updated && updated.status !== 'PENDING') {
          // Final status reached — stop polling and update UI
          clearInterval(pollTimerRef.current);
          setPlacedOrder(updated);
          return;
        }
      } catch (err) {
        console.warn('Polling failed:', err.message);
      }

      // Give up after max attempts — leave as PENDING with neutral message
      if (pollAttemptsRef.current >= POLL_MAX_ATTEMPTS) {
        clearInterval(pollTimerRef.current);
        console.warn('Payment status polling timed out — leaving as PENDING');
      }
    }, POLL_INTERVAL_MS);
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);
    setPlacedOrder(null);

    // Snapshot the cart before clearing — needed for retry on CANCELLED
    const snapshot = [...cartItems];

    const orderRequest = {
      orderLineItemsList: cartItems.map((item) => ({
        skuCode: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axios.post(`${API_BASE}/api/v1/orders`, orderRequest, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const order = response.data; // status: "PENDING" at this point
      setCartSnapshot(snapshot);
      setPlacedOrder(order);
      clearCart();

      // Begin polling for CONFIRMED / CANCELLED
      startPolling(order.orderNumber);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.response?.data || err.message || 'Checkout failed';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Retry handler — shown when payment is CANCELLED.
   * Re-adds the snapshotted cart items back so user can try again.
   */
  const handleRetry = () => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    setPlacedOrder(null);
    setError(null);
    // Cart was already cleared on checkout; snapshot items are re-injected
    // by restoring from cartSnapshot via re-adding (CartContext handles dedup)
    if (cartSnapshot) {
      cartSnapshot.forEach((item) => {
        // Directly restore into localStorage so CartContext picks it up on re-render
        const key = user ? `cart_${user.username}` : 'cart';
        localStorage.setItem(key, JSON.stringify(cartSnapshot));
      });
      // Force a page reload to re-hydrate the cart context from localStorage
      window.location.reload();
    }
  };

  if (placedOrder) {
    return (
      <OrderSuccess
        placedOrder={placedOrder}
        cartTotal={getCartTotal()}
        onRetry={placedOrder.status === 'CANCELLED' ? handleRetry : undefined}
      />
    );
  }

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-2xl tracking-tight text-zinc-100 m-0">
          Shopping Cart
        </h1>
        <p className="text-xs text-zinc-400 mt-1">Review your selections and process transaction checkout</p>
      </div>

      {error && (
        <div className="flex items-start space-x-3 bg-rose-500/10 border border-rose-500/20 text-rose-450 p-4 rounded-xl text-xs animate-shake">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <div className="flex-grow">
            <p className="font-bold">Checkout Blocked by Gateway</p>
            <p className="mt-0.5 text-zinc-350">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          ))}
        </div>

        {/* Checkout summary panel */}
        <OrderSummary
          cartTotal={getCartTotal()}
          user={user}
          loading={loading}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
};

export default Cart;
