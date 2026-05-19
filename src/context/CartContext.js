"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bluebarry_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('bluebarry_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.slug === product.slug && i.size === size);
      if (existing) {
        return prev.map(i =>
          i.slug === product.slug && i.size === size
            ? { ...i, qty: i.qty + qty }
            : i
        );
      }
      return [...prev, {
        slug: product.slug,
        name: product.name,
        price: product.price,
        img: product.images[0],
        size,
        qty
      }];
    });
  };

  const removeFromCart = (slug, size) => {
    setCart(prev => prev.filter(i => !(i.slug === slug && i.size === size)));
  };

  const updateQty = (slug, size, qty) => {
    if (qty < 1) { removeFromCart(slug, size); return; }
    setCart(prev => prev.map(i =>
      i.slug === slug && i.size === size ? { ...i, qty } : i
    ));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
