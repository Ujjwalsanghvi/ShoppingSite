import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartTotal,
  selectCartCount,
} from '../store/slices/cartSlice';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const count = useAppSelector(selectCartCount);
  const [loading, setLoading] = useState(false);

  const handleUpdateQuantity = useCallback((productId: number, quantity: number) => {
    setLoading(true);
    dispatch(updateQuantity({ productId, quantity }));
    setTimeout(() => setLoading(false), 300);
  }, [dispatch]);

  const handleRemoveFromCart = useCallback((productId: number) => {
    setLoading(true);
    dispatch(removeFromCart(productId));
    setTimeout(() => setLoading(false), 300);
  }, [dispatch]);

  const handleClearCart = useCallback(() => {
    setLoading(true);
    dispatch(clearCart());
    setTimeout(() => setLoading(false), 300);
  }, [dispatch]);

  // Helper function to get item total with proper formatting
  const getItemTotal = useCallback((productId: number) => {
    const item = cart.find(i => i.product.id === productId);
    if (!item) return 0;
    const itemTotal = item.product.price * item.quantity;
    return Math.round(itemTotal * 100) / 100;
  }, [cart]);

  return {
    cart,
    total,
    count,
    loading,
    handleUpdateQuantity,
    handleRemoveFromCart,
    handleClearCart,
    getItemTotal,
  };
};