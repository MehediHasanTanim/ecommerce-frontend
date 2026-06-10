import { create } from 'zustand';
import { Cart } from '@/types/cart';

interface CartState {
  /** Cached cart data from last fetch */
  cart: Cart | null;
  /** Whether the mini cart drawer is open */
  isDrawerOpen: boolean;
  /** Whether cart data is being fetched */
  loading: boolean;

  setCart: (cart: Cart) => void;
  clearCart: () => void;
  updateItemLocally: (itemId: string, quantity: number) => void;
  removeItemLocally: (itemId: string) => void;
  setLoading: (loading: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

/** Parse a decimal string to a float for local calculations */
const parseDecimal = (val: string): number => parseFloat(val) || 0;

export const useCartStore = create<CartState>()((set, get) => ({
  cart: null,
  isDrawerOpen: false,
  loading: false,

  setCart: (cart) => set({ cart }),

  clearCart: () => set({ cart: null }),

  updateItemLocally: (itemId, quantity) => {
    const { cart } = get();
    if (!cart) return;

    const updatedItems = cart.items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            quantity,
            line_total: (parseDecimal(item.unit_price) * quantity).toFixed(2),
          }
        : item
    );

    const subtotal = updatedItems.reduce(
      (sum, item) => sum + parseDecimal(item.line_total),
      0
    );
    const grand_total = Math.max(0, subtotal - cart.discount);
    const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

    set({
      cart: {
        ...cart,
        items: updatedItems,
        subtotal,
        grand_total,
        item_count: itemCount,
      },
    });
  },

  removeItemLocally: (itemId) => {
    const { cart } = get();
    if (!cart) return;

    const updatedItems = cart.items.filter((item) => item.id !== itemId);
    const subtotal = updatedItems.reduce(
      (sum, item) => sum + parseDecimal(item.line_total),
      0
    );
    const grand_total = Math.max(0, subtotal - cart.discount);
    const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

    set({
      cart: {
        ...cart,
        items: updatedItems,
        subtotal,
        grand_total,
        item_count: itemCount,
      },
    });
  },

  setLoading: (loading) => set({ loading }),

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
}));
