import { create } from 'zustand';
import type { Product } from '../data/products';

// ─── Product Store ────────────────────────────
interface ProductState {
  favorites:      string[];   // product ids
  recentlyViewed: string[];

  toggleFavorite: (productId: string) => void;
  addRecentlyViewed: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const useProductStore = create<ProductState>((set, get) => ({
  favorites:      [],
  recentlyViewed: [],

  toggleFavorite: (productId) => {
    const isFav = get().favorites.includes(productId);
    set(state => ({
      favorites: isFav
        ? state.favorites.filter(id => id !== productId)
        : [...state.favorites, productId],
    }));
  },

  addRecentlyViewed: (productId) => {
    set(state => ({
      recentlyViewed: [
        productId,
        ...state.recentlyViewed.filter(id => id !== productId),
      ].slice(0, 10),
    }));
  },

  isFavorite: (productId) => get().favorites.includes(productId),
}));

// ─── UI Store ─────────────────────────────────
interface UIState {
  toastMessage:   string | null;
  toastType:      'success' | 'error' | 'info';
  isSearchOpen:   boolean;

  showToast:  (message: string, type?: UIState['toastType']) => void;
  hideToast:  () => void;
  setSearchOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  toastMessage:  null,
  toastType:     'success',
  isSearchOpen:  false,

  showToast: (message, type = 'success') => {
    set({ toastMessage: message, toastType: type });
    setTimeout(() => set({ toastMessage: null }), 2500);
  },

  hideToast: () => set({ toastMessage: null }),

  setSearchOpen: (open) => set({ isSearchOpen: open }),
}));
