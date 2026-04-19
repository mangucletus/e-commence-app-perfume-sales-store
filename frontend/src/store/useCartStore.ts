import { create } from 'zustand';
import { getCart } from '../api/cart';

interface CartStore {
  count: number;
  fetchCount: () => Promise<void>;
  setCount: (n: number) => void;
  reset: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  count: 0,
  fetchCount: async () => {
    try {
      const cart = await getCart();
      set({ count: cart.items.reduce((s, i) => s + i.quantity, 0) });
    } catch {
      set({ count: 0 });
    }
  },
  setCount: (count) => set({ count }),
  reset: () => set({ count: 0 }),
}));
