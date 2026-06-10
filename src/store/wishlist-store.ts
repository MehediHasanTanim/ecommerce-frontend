import { create } from 'zustand';
import { WishlistItem } from '@/types/wishlist';

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;

  setWishlist: (items: WishlistItem[]) => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  items: [],
  loading: false,

  setWishlist: (items) => set({ items }),

  addItem: (item) => {
    const { items } = get();
    if (!items.find((i) => i.product_id === item.product_id)) {
      set({ items: [...items, item] });
    }
  },

  removeItem: (productId) => {
    const { items } = get();
    set({ items: items.filter((i) => i.product_id !== productId) });
  },

  setLoading: (loading) => set({ loading }),
}));
