// Central service layer - the ONLY entry point for data access
import { mockDb } from "./mockDb";
import type { Product, Settings, PaymentMethod } from "@/types";

export const ProdutosService = {
  list: () => mockDb.getProducts(),
  save: (p: Product) => mockDb.saveProduct(p),
  remove: (id: string) => mockDb.deleteProduct(id),
};

export const EstoqueService = {
  decrement: (items: { id: string; qty: number }[]) => mockDb.decrementStock(items),
};

export const PagamentoService = {
  async process(_method: PaymentMethod, _amount: number): Promise<"approved" | "declined"> {
    await new Promise((r) => setTimeout(r, 1800));
    // Simulação: 95% aprovado
    return Math.random() > 0.05 ? "approved" : "declined";
  },
};

export const CarrinhoService = {
  // Carrinho vive em memória (Zustand store), service exposta para futuro persist remoto
};

export const AuthService = {
  async login(password: string): Promise<boolean> {
    const s = await mockDb.getSettings();
    return password === s.adminPassword;
  },
};

export const SettingsService = {
  get: () => mockDb.getSettings(),
  save: (s: Settings) => mockDb.saveSettings(s),
};
