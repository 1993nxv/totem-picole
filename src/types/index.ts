export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
  image: string;
  stock: number;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type MascotMood = "neutral" | "happy" | "excited" | "sad";

export type PaymentStatus = "idle" | "processing" | "approved" | "declined";

export type PaymentMethod = "credit" | "debit" | "pix" | "cash";

export interface IdleMedia {
  id: string;
  type: "image" | "video";
  url: string;
}

export interface Settings {
  defaultTheme: "light" | "dark";
  idleMedia: IdleMedia[];
  adminPassword: string;
}
