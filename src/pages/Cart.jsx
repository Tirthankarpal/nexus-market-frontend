import { useState } from 'react';
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

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);
    setPlacedOrder(null);

    const orderRequest = {
      orderLineItemsList: cartItems.map((item) => ({
        skuCode: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axios.post(`${API_BASE}/api/v1/orders`, orderRequest, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setPlacedOrder(response.data);
      clearCart();
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.response?.data || err.message || 'Checkout failed';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (placedOrder) {
    return <OrderSuccess placedOrder={placedOrder} cartTotal={getCartTotal()} />;
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
