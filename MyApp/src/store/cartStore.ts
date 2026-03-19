import { create } from 'zustand';
import type { Product } from '../data/products';

export interface CartItem {
  product:  Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];

  // Actions
  addItem:       (product: Product) => void;
  removeItem:    (productId: string) => void;
  updateQty:     (productId: string, qty: number) => void;
  clearCart:     () => void;

  // Selectors
  totalPrice:    () => number;
  totalItems:    () => number;
  isInCart:      (productId: string) => boolean;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product) => {
    const existing = get().items.find(i => i.product.id === product.id);
    if (existing) {
      set(state => ({
        items: state.items.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      }));
    } else {
      set(state => ({ items: [...state.items, { product, quantity: 1 }] }));
    }
  },

  removeItem: (productId) => {
    set(state => ({ items: state.items.filter(i => i.product.id !== productId) }));
  },

  updateQty: (productId, qty) => {
    if (qty <= 0) {
      get().removeItem(productId);
      return;
    }
    set(state => ({
      items: state.items.map(i =>
        i.product.id === productId ? { ...i, quantity: qty } : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  totalPrice: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

  totalItems: () =>
    get().items.reduce((sum, i) => sum + i.quantity, 0),

  isInCart: (productId) =>
    get().items.some(i => i.product.id === productId),
}));
