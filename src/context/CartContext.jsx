import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on startup
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const addToCart = (product, quantity = 1) => {
    const existingIndex = cartItems.findIndex((item) => item.id === product.id);
    let newCart = [...cartItems];

    if (existingIndex >= 0) {
      const newQty = newCart[existingIndex].quantity + quantity;
      // Cap at stockQuantity if available
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
        // Enforce maximum stock boundary
        const finalQty = item.stockQuantity !== undefined ? Math.min(newQty, item.stockQuantity) : newQty;
        return { ...item, quantity: finalQty };
      }
      return item;
    });

    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
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
