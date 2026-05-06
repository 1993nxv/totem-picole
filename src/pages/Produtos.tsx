import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProdutosService } from "@/services";
import { useStore } from "@/store/useStore";
import type { Product } from "@/types";
import { TopBar } from "@/components/TopBar";
import { Mascot } from "@/components/Mascot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";

const ProductRow = ({ product, alt }: { product: Product; alt: boolean }) => {
  const { cart, addToCart, removeOne, removeAll } = useStore();
  const inCart = cart.find((c) => c.product.id === product.id);
  const qty = inCart?.quantity ?? 0;
  const outOfStock = product.stock <= 0;
  const price = product.promoPrice ?? product.price;

  return (
    <Card
      className={`flex items-center gap-5 p-4 md:p-6 transition-bounce hover:shadow-elegant ${
        outOfStock ? "opacity-50 grayscale pointer-events-none" : ""
      } ${alt ? "border-l-4 border-l-secondary" : "border-l-4 border-l-primary"}`}
    >
      {/* Imagem à esquerda - GRANDE e em destaque */}
      <div className="flex-shrink-0 w-90 h-40 md:w-106 md:h-56 rounded-3xl  from-secondary/20 to-accent/20 flex items-center justify-center shadow-elegant overflow-hidden animate-float">
        {product.image.startsWith("http") || product.image.startsWith("/") || product.image.startsWith("data:") ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-contain drop-shadow-2xl scale-110" />
        ) : (
          <span className="text-7xl md:text-8xl">{product.image}</span>
        )}
      </div>

      {/* Info + botões à direita */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        <div>
          <h3 className="text-xl md:text-3xl font-extrabold text-foreground">{product.name}</h3>
          <p className="text-sm md:text-base text-muted-foreground line-clamp-2">{product.description}</p>
          <div className="flex items-baseline gap-2 mt-2 flex-wrap">
            {product.promoPrice ? (
              <>
                <span className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">R$ {product.promoPrice.toFixed(2)}</span>
                <span className="text-sm line-through text-muted-foreground">R$ {product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">R$ {price.toFixed(2)}</span>
            )}
            < span className="text-xs text-muted-foreground ml-auto"> {/*product.stock*/}</span>
          </div>
        </div>

        {qty === 0 ? (
          <Button
            onClick={() => addToCart(product)}
            size="lg"
            className="w-full md:w-auto self-stretch bg-gradient-to-r from-secondary to-accent text-accent-foreground font-extrabold rounded-full px-6 shadow-gold transition-bounce hover:scale-105 hover:shadow-glow"
          >
            <Plus className="mr-1 h-5 w-5" /> Adicionar
          </Button>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-gradient-to-r from-secondary to-accent rounded-full p-1 shadow-gold">
              <Button onClick={() => removeOne(product.id)} size="icon" variant="ghost" className="rounded-full h-10 w-10 text-accent-foreground hover:bg-white/20">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-extrabold text-xl w-8 text-center text-accent-foreground">{qty}</span>
              <Button
                onClick={() => addToCart(product)}
                size="icon"
                variant="ghost"
                className="rounded-full h-10 w-10 text-accent-foreground hover:bg-white/20"
                disabled={qty >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={() => removeAll(product.id)}
              size="sm"
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 rounded-full"
            >
              <Trash2 className="h-3 w-3 mr-1" /> Remover
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export const Produtos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { cartCount, cartTotal, setMascot } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    ProdutosService.list().then((p) => {
      setProducts(p);
      setLoading(false);
    });
    setMascot("neutral", "Escolha seus picolés favoritos! 🍦");
  }, [setMascot]);

  // Order: active products by stock desc, alternated 1,2,3 / 3,2,1
  const sorted = [...products].filter((p) => p.active).sort((a, b) => b.stock - a.stock);
  const arranged: Product[] = [];
  for (let i = 0; i < sorted.length; i += 3) {
    const chunk = sorted.slice(i, i + 3);
    arranged.push(...((i / 3) % 2 === 0 ? chunk : [...chunk].reverse()));
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-6 py-6 pb-32">
        <div className="text-center mb-12 animate-slide-up">
              <img src="\src\assets\BANNER-001.png"></img>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Carregando...</div>
        ) : (
          <div className="flex flex-col gap-4">
            {arranged.map((p, i) => (
              <ProductRow key={p.id} product={p} alt={i % 2 === 1} />
            ))}
          </div>
        )}
      </main>

      {/* Botão Prosseguir */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-card/95 backdrop-blur-md border-t-2 border-primary/20">
        <div className="max-w-3xl mx-auto">
          <Button
            disabled={cartCount() === 0}
            onClick={() => navigate("/pagamento")}
            size="lg"
            className="w-full h-16 md:h-20 text-lg md:text-2xl font-extrabold bg-gradient-to-r from-secondary via-accent to-accent text-white rounded-2xl shadow-gold transition-bounce hover:scale-[1.02] hover:shadow-glow disabled:opacity-50 disabled:scale-100"
          >
            <ShoppingCart className="mr-3 h-6 w-6" />
            PROSSEGUIR COM O PEDIDO
            {cartCount() > 0 && (
              <span className="ml-3 bg-white/25 text-white px-4 py-1 rounded-full text-base backdrop-blur-sm">
                {cartCount()} • R$ {cartTotal().toFixed(2)}
              </span>
            )}
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </div>

      <Mascot />
    </div>
  );
};

export default Produtos;
