import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/Mainview';
import { RootState } from '../index';

interface WishlistState {
  items: Product[];
}

// Get user from localStorage
const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

const user = getUser();

// Load wishlist from localStorage
const loadWishlistFromStorage = (): Product[] => {
  if (user?.id) {
    const savedWishlist = localStorage.getItem(`wishlist_${user?.id}`);
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  }
  return [];
};

const initialState: WishlistState = {
  items: loadWishlistFromStorage(),
};

// Save wishlist to localStorage
const saveWishlistToStorage = (items: Product[]) => {
  const currentUser = getUser();
  if (currentUser?.id) {
    localStorage.setItem(`wishlist_${currentUser.id}`, JSON.stringify(items));
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const exists = state.items.some(item => item.id === product.id);
      if (!exists) {
        state.items.push(product);
        saveWishlistToStorage(state.items);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveWishlistToStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
    },
    loadWishlist: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      saveWishlistToStorage(state.items);
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist, loadWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

// Selectors
export const selectWishlistItems = (state: RootState) => state.wishlist?.items || [];

export const selectWishlistCount = createSelector(
  [selectWishlistItems],
  (items) => items.length
);

export const selectIsInWishlist = (productId: number) => 
  createSelector(
    [selectWishlistItems],
    (items) => items.some(item => item.id === productId)
  );