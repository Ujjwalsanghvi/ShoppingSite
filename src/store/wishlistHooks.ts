import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import {
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
  clearWishlist as clearWishlistAction,
  selectWishlistItems,
  selectWishlistCount,
  selectIsInWishlist,
} from './slices/wishlistSlice';
import { Product } from '../types/Mainview';

export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector(selectWishlistItems);
  const count = useAppSelector(selectWishlistCount);

  const addToWishlist = useCallback((product: Product) => {
    dispatch(addToWishlistAction(product));
  }, [dispatch]);

  const removeFromWishlist = useCallback((productId: number) => {
    dispatch(removeFromWishlistAction(productId));
  }, [dispatch]);

  const clearWishlist = useCallback(() => {
    dispatch(clearWishlistAction());
  }, [dispatch]);

  const isInWishlist = useCallback((productId: number) => {
    const selector = selectIsInWishlist(productId);
    return useAppSelector(selector);
  }, []);

  const getWishlistCount = useCallback(() => {
    return count;
  }, [count]);

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
    clearWishlist,
  };
};