import { create } from "zustand";
import type { CartItem, Product, MascotMood } from "@/types";

interface State {
  cart: CartItem[];
  theme: "light" | "dark";
  mascotMood: MascotMood;
  mascotMessage: string;
  isIdle: boolean;
  adminAuthed: boolean;

  addToCart: (p: Product) => void;
  removeOne: (id: string) => void;
  removeAll: (id: string) => void;
  clearCart: () => void;
  cartCount: () => number;
  cartTotal: () => number;

  toggleTheme: () => void;
  setTheme: (t: "light" | "dark") => void;

  setMascot: (mood: MascotMood, message?: string) => void;

  setIdle: (b: boolean) => void;
  setAdminAuthed: (b: boolean) => void;
}

export const useStore = create<State>((set, get) => ({
  cart: [],
  theme: (localStorage.getItem("theme") as "light" | "dark") || "light",
  mascotMood: "neutral",
  mascotMessage: "Olá! Bem-vindo à Frutos de Goiás 🦜",
  isIdle: false,
  adminAuthed: false,

  addToCart: (p) =>
    set((s) => {
      const existing = s.cart.find((c) => c.product.id === p.id);
      if (existing) {
        if (existing.quantity >= p.stock) return s;
        return {
          cart: s.cart.map((c) =>
            c.product.id === p.id ? { ...c, quantity: c.quantity + 1 } : c
          ),
          mascotMood: "happy",
          mascotMessage: `+1 ${p.name}! 😋`,
        };
      }
      return {
        cart: [...s.cart, { product: p, quantity: 1 }],
        mascotMood: "happy",
        mascotMessage: `${p.name} adicionado!`,
      };
    }),
  removeOne: (id) =>
    set((s) => {
      const item = s.cart.find((c) => c.product.id === id);
      if (!item) return s;
      const cart =
        item.quantity > 1
          ? s.cart.map((c) => (c.product.id === id ? { ...c, quantity: c.quantity - 1 } : c))
          : s.cart.filter((c) => c.product.id !== id);
      return { cart, mascotMood: "neutral", mascotMessage: "Removido." };
    }),
  removeAll: (id) =>
    set((s) => ({
      cart: s.cart.filter((c) => c.product.id !== id),
      mascotMood: "neutral",
      mascotMessage: "Item removido.",
    })),
  clearCart: () => set({ cart: [] }),
  cartCount: () => get().cart.reduce((a, c) => a + c.quantity, 0),
  cartTotal: () =>
    get().cart.reduce((a, c) => a + (c.product.promoPrice ?? c.product.price) * c.quantity, 0),

  toggleTheme: () =>
    set((s) => {
      const t = s.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", t);
      document.documentElement.classList.toggle("dark", t === "dark");
      return { theme: t };
    }),
  setTheme: (t) => {
    localStorage.setItem("theme", t);
    document.documentElement.classList.toggle("dark", t === "dark");
    set({ theme: t });
  },

  setMascot: (mood, message) =>
    set({ mascotMood: mood, mascotMessage: message ?? get().mascotMessage }),

  setIdle: (b) => set({ isIdle: b }),
  setAdminAuthed: (b) => set({ adminAuthed: b }),
}));

// Init theme on load
if (typeof document !== "undefined") {
  const t = (localStorage.getItem("theme") as "light" | "dark") || "light";
  document.documentElement.classList.toggle("dark", t === "dark");
}
