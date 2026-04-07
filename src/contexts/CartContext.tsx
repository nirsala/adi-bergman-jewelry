'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  productId: string;
  name: string;
  nameHe: string;
  image: string;
  category: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

interface CartData {
  id?: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  status?: string;
}

interface CartContextType {
  cart: CartData;
  loading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  submitCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
}

const emptyCart: CartData = { items: [], total: 0, itemCount: 0 };
const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartData>(emptyCart);
  const [loading, setLoading] = useState(false);

  const isEligible = user && user.role === 'customer' && user.status === 'approved';

  const refreshCart = useCallback(async () => {
    if (!isEligible) { setCart(emptyCart); return; }
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart || emptyCart);
      }
    } catch { setCart(emptyCart); }
  }, [isEligible]);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  const saveItems = async (items: { productId: string; quantity: number }[]) => {
    setLoading(true);
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      await refreshCart();
    } finally { setLoading(false); }
  };

  const addToCart = async (productId: string, quantity: number) => {
    const existing = cart.items.find(i => i.productId === productId);
    const newItems = existing
      ? cart.items.map(i => i.productId === productId ? { productId, quantity: i.quantity + quantity } : { productId: i.productId, quantity: i.quantity })
      : [...cart.items.map(i => ({ productId: i.productId, quantity: i.quantity })), { productId, quantity }];
    await saveItems(newItems);
  };

  const removeFromCart = async (productId: string) => {
    const newItems = cart.items.filter(i => i.productId !== productId).map(i => ({ productId: i.productId, quantity: i.quantity }));
    await saveItems(newItems);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(productId);
    const newItems = cart.items.map(i => i.productId === productId ? { productId, quantity } : { productId: i.productId, quantity: i.quantity });
    await saveItems(newItems);
  };

  const clearCartFn = async () => {
    setLoading(true);
    try {
      await fetch('/api/cart', { method: 'DELETE' });
      setCart(emptyCart);
    } finally { setLoading(false); }
  };

  const submitCartFn = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cart/submit', { method: 'POST' });
      if (res.ok) { setCart(emptyCart); return true; }
      return false;
    } finally { setLoading(false); }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, clearCart: clearCartFn, submitCart: submitCartFn, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
