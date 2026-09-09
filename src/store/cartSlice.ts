import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product, CartItem } from '../types/products';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const prod = action.payload;
      const existing = state.items.find((i) => i.id === prod.id);
      if (existing) {
        existing.count += 1;
      } else {
        state.items.push({ ...prod, count: 1 });
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
    },
    removeOneFromCart(state, action: PayloadAction<number>) {
      const id = action.payload;
      const existing = state.items.find((i) => i.id === id);
      if (existing) {
        if (existing.count > 1) {
          existing.count -= 1;
        } else {
          state.items = state.items.filter((i) => i.id !== id);
        }
      }
    },
    updateCount(state, action: PayloadAction<{ id: number; count: number }>) {
      const { id, count } = action.payload;
      const existing = state.items.find((i) => i.id === id);
      if (existing) existing.count = Math.max(1, count);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, removeOneFromCart, updateCount, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
