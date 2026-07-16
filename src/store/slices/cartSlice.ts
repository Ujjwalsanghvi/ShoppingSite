import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '../../types/Mainview';
import { RootState } from '../index';

const loadCartFromStorage = (): CartItem[] => {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : [];
};


const saveCartToStorage = (items: CartItem[]) => {
  localStorage.setItem('cart', JSON.stringify(items));
};


const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
  },
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
      saveCartToStorage(state.items);
    },
    
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
      saveCartToStorage(state.items);
    },
    
    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter(item => item.product.id !== productId);
      } else {
        const item = state.items.find(item => item.product.id === productId);
        if (item) {
          item.quantity = quantity;
        }
      }
      saveCartToStorage(state.items);
    },
    
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});


export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;


export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) => {
    const total = items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    return Math.round(total * 100) / 100; 
  }
);

export const selectCartCount = createSelector(
  [selectCartItems],
  (items) => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }
);