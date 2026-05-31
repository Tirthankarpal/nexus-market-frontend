import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Reactively load user-specific cart whenever the logged-in session changes
  useEffect(() => {
    if (user) {
      // 1. Logged In: Load specific cart under cart_<username>
      const savedUserCart = localStorage.getItem(`cart_${user.username}`);
      if (savedUserCart) {
        try {
          setCartItems(JSON.parse(savedUserCart));
        } catch (e) {
          setCartItems([]);
        }
      } else {
        // If no user-specific cart exists yet, see if there is a guest cart to adopt
        const guestCart = localStorage.getItem('cart');
        if (guestCart) {
          try {
            const parsed = JSON.parse(guestCart);
            setCartItems(parsed);
            // Persist it as the user's cart and clear the guest cart
            localStorage.setItem(`cart_${user.username}`, guestCart);
            localStorage.removeItem('cart');
          } catch (e) {
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
      }
    } else {
      // 2. Logged Out: Clear active cart items from current view and load guest cart
      const guestCart = localStorage.getItem('cart');
      if (guestCart) {
        try {
          setCartItems(JSON.parse(guestCart));
        } catch (e) {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    }
  }, [user]);

  // Save cart to specific localStorage slots whenever it updates
  const saveCart = (items) => {
    setCartItems(items);
    if (user) {
      localStorage.setItem(`cart_${user.username}`, JSON.stringify(items));
    } else {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  };

  const addToCart = (product, quantity = 1) => {
    const existingIndex = cartItems.findIndex((item) => item.id === product.id);
    let newCart = [...cartItems];

    if (existingIndex >= 0) {
      const newQty = newCart[existingIndex].quantity + quantity;
      if (product.stockQuantity !== undefined && newQty > product.stockQuantity) {
        newCart[existingIndex].quantity = product.stockQuantity;
      } else {
        newCart[existingIndex].quantity = newQty;
      }
    } else {
      newCart.push({
        ...product,
        quantity: Math.min(quantity, product.stockQuantity || 999),
      });
    }

    saveCart(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cartItems.filter((item) => item.id !== productId);
    saveCart(newCart);
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    const newCart = cartItems.map((item) => {
      if (item.id === productId) {
        const finalQty = item.stockQuantity !== undefined ? Math.min(newQty, item.stockQuantity) : newQty;
        return { ...item, quantity: finalQty };
      }
      return item;
    });

    saveCart(newCart);
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) {
      localStorage.removeItem(`cart_${user.username}`);
    } else {
      localStorage.removeItem('cart');
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
