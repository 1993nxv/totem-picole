// Simulated json-server using localStorage. Single source of truth for the app.
import type { Product, Settings } from "@/types";
import picoleDefault from "@/assets/picole-default.png";

const KEY = "frutos_db_v2";

interface DB {
  products: Product[];
  settings: Settings;
}

const seed: DB = {
  products: [
    { id: "p1", name: "Picolé de Açaí", description: "Cremoso, frutado, refrescante.", price: 8, promoPrice: 6.5, image: picoleDefault, stock: 25, active: true },
    { id: "p2", name: "Picolé de Manga", description: "Manga madura colhida na hora.", price: 7, image: picoleDefault, stock: 18, active: true },
    { id: "p3", name: "Picolé de Coco", description: "Polpa de coco fresca.", price: 7, image: picoleDefault, stock: 30, active: true },
    { id: "p4", name: "Picolé de Morango", description: "Pedaços reais de morango.", price: 8, image: picoleDefault, stock: 12, active: true },
    { id: "p5", name: "Picolé de Chocolate", description: "Chocolate belga premium.", price: 9, promoPrice: 7.9, image: picoleDefault, stock: 22, active: true },
    { id: "p6", name: "Picolé de Limão", description: "Azedinho na medida certa.", price: 6.5, image: picoleDefault, stock: 15, active: true },
    { id: "p7", name: "Picolé de Maracujá", description: "Aroma intenso do cerrado.", price: 7.5, image: picoleDefault, stock: 8, active: true },
    { id: "p8", name: "Picolé de Abacaxi", description: "Doce e suculento.", price: 7, image: picoleDefault, stock: 20, active: true },
  ],
  settings: {
    defaultTheme: "light",
    idleMedia: [],
    adminPassword: "admin123",
  },
};

function load(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return seed;
  }
}

function save(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

export const mockDb = {
  async getProducts(): Promise<Product[]> {
    await delay();
    return load().products;
  },
  async saveProduct(p: Product): Promise<Product> {
    await delay();
    const db = load();
    const idx = db.products.findIndex((x) => x.id === p.id);
    if (idx >= 0) db.products[idx] = p;
    else db.products.push({ ...p, id: p.id || `p${Date.now()}` });
    save(db);
    return p;
  },
  async deleteProduct(id: string): Promise<void> {
    await delay();
    const db = load();
    db.products = db.products.filter((x) => x.id !== id);
    save(db);
  },
  async decrementStock(items: { id: string; qty: number }[]) {
    await delay();
    const db = load();
    items.forEach(({ id, qty }) => {
      const p = db.products.find((x) => x.id === id);
      if (p) p.stock = Math.max(0, p.stock - qty);
    });
    save(db);
  },
  async getSettings(): Promise<Settings> {
    await delay();
    return load().settings;
  },
  async saveSettings(s: Settings): Promise<Settings> {
    await delay();
    const db = load();
    db.settings = s;
    save(db);
    return s;
  },
  reset() {
    localStorage.removeItem(KEY);
  },
};
