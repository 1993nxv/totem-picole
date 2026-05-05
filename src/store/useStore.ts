import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '../services/central'

export type MascotMood = 'neutral' | 'happy' | 'excited' | 'sad'
export type Theme = 'light' | 'dark'

interface AppState {
  // Theme
  theme: Theme
  toggleTheme: () => void

  // Cart
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number

  // Mascot
  mascotMood: MascotMood
  setMascotMood: (mood: MascotMood) => void

  // Idle Mode
  isIdle: boolean
  setIdle: (isIdle: boolean) => void

  // Session
  sessionActive: boolean
  startSession: () => void
  endSession: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      // Cart
      cart: [],
      addToCart: (item) => {
        const existing = get().cart.find((i) => i.id === item.id)
        if (existing) {
          set((state) => ({
            cart: state.cart.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            mascotMood: 'excited'
          }))
        } else {
          set((state) => ({
            cart: [...state.cart, { ...item, quantity: 1 }],
            mascotMood: 'happy'
          }))
        }
      },
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.id !== productId)
        })),
      updateCartQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((i) =>
            i.id === productId ? { ...i, quantity: Math.max(0, quantity) } : i
          ).filter(i => i.quantity > 0)
        })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce((total, item) => {
          const price = item.promotionalPrice || item.price
          return total + price * item.quantity
        }, 0)
      },

      // Mascot
      mascotMood: 'neutral',
      setMascotMood: (mood) => set({ mascotMood: mood }),

      // Idle Mode
      isIdle: true,
      setIdle: (isIdle) => set({ isIdle, mascotMood: isIdle ? 'neutral' : 'happy' }),

      // Session
      sessionActive: false,
      startSession: () => set({ sessionActive: true, isIdle: false, mascotMood: 'happy' }),
      endSession: () => set({ sessionActive: false, isIdle: true, cart: [], mascotMood: 'neutral' }),
    }),
    {
      name: 'picole-kiosk-storage',
      partialize: (state) => ({ theme: state.theme, cart: state.cart }),
    }
  )
)
