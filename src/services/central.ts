import { blink } from '../blink/client'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  promotionalPrice?: number
  imageUrl: string
  active: number
  category: string
  createdAt: string
  userId: string
}

export interface Inventory {
  productId: string
  quantity: number
  updatedAt: string
  userId: string
}

export interface CartItem extends Product {
  quantity: number
}

export const ProductsService = {
  async list() {
    const products = await blink.db.table<Product>('products').list({
      where: { active: 1 }
    })
    const inventory = await blink.db.table<Inventory>('inventory').list()

    // Create a map for quick inventory lookup
    const inventoryMap = new Map(inventory.map(item => [item.productId, Number(item.quantity)]))

    // Merge and sort
    const merged = products.map(product => ({
      ...product,
      stock: inventoryMap.get(product.id) || 0
    }))

    // Sort by stock (highest first)
    return merged.sort((a, b) => b.stock - a.stock)
  },

  async get(id: string) {
    return await blink.db.table<Product>('products').get(id)
  },

  async initializeMockData() {
    const products = await blink.db.table<Product>('products').list()
    if (products.length === 0) {
      const mockProducts = [
        {
          id: 'p1',
          name: 'Classic Chocolate Picolé',
          description: 'Rich dark chocolate coating with creamy vanilla inside.',
          price: 3.50,
          category: 'Classic',
          imageUrl: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?q=80&w=400&auto=format&fit=crop',
          active: 1
        },
        {
          id: 'p2',
          name: 'Strawberry Dream',
          description: 'Fresh strawberry puree with real fruit chunks.',
          price: 3.00,
          category: 'Fruit',
          imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=400&auto=format&fit=crop',
          active: 1
        },
        {
          id: 'p3',
          name: 'Tropical Mango',
          description: 'Sun-ripened Alphonso mangoes for a refreshing taste.',
          price: 3.25,
          category: 'Fruit',
          imageUrl: 'https://images.unsplash.com/photo-1549395156-9747d2739199?q=80&w=400&auto=format&fit=crop',
          active: 1
        },
        {
          id: 'p4',
          name: 'Pistachio Delight',
          description: 'Roasted pistachios blended into a smooth, nutty cream.',
          price: 4.00,
          category: 'Premium',
          imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=400&auto=format&fit=crop',
          active: 1
        }
      ]

      for (const p of mockProducts) {
        await blink.db.table<Product>('products').create(p)
        await blink.db.table<Inventory>('inventory').create({
          productId: p.id,
          quantity: Math.floor(Math.random() * 50) + 10
        })
      }
    }
  }
}

export const InventoryService = {
  async getStock(productId: string) {
    const item = await blink.db.table<Inventory>('inventory').get(productId)
    return item ? Number(item.quantity) : 0
  },

  async updateStock(productId: string, quantity: number) {
    return await blink.db.table<Inventory>('inventory').update(productId, { quantity })
  }
}

export const CartService = {
  // Cart logic is mostly client-side in Global State, 
  // but could have persist/restore logic here if needed.
}

export const PaymentService = {
  async processPayment(amount: number, method: string) {
    console.log(`Processing ${method} payment of $${amount}`)
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    return { success: true, transactionId: `txn_${Math.random().toString(36).substr(2, 9)}` }
  }
}

export const AuthService = {
  async login() {
    return await blink.auth.login()
  },
  async logout() {
    return await blink.auth.signOut()
  },
  async getCurrentUser() {
    return await blink.auth.me()
  },
  onAuthStateChanged(callback: (user: any) => void) {
    return blink.auth.onAuthStateChanged((state) => callback(state.user))
  }
}

export interface IdleMedia {
  id: string
  url: string
  type: 'video' | 'image'
  active: number
}

export const IdleMediaService = {
  async list() {
    return await blink.db.table<IdleMedia>('idle_media').list({
      where: { active: 1 }
    })
  },
  async create(data: Omit<IdleMedia, 'id'>) {
    return await blink.db.table<IdleMedia>('idle_media').create(data)
  },
  async delete(id: string) {
    return await blink.db.table<IdleMedia>('idle_media').delete(id)
  }
}
