import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { PagamentoService, EstoqueService } from "@/services";
import { TopBar } from "@/components/TopBar";
import { Mascot } from "@/components/Mascot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Banknote, Smartphone, ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { PaymentMethod, PaymentStatus } from "@/types";

const methods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { id: "credit", label: "Crédito", icon: <CreditCard className="h-8 w-8" /> },
  { id: "debit", label: "Débito", icon: <CreditCard className="h-8 w-8" /> },
  { id: "pix", label: "PIX", icon: <Smartphone className="h-8 w-8" /> },
  { id: "cash", label: "Dinheiro", icon: <Banknote className="h-8 w-8" /> },
];

export const Pagamento = () => {
  const { cart, cartTotal, clearCart, setMascot } = useStore();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [selected, setSelected] = useState<PaymentMethod | null>(null);

  const handlePay = async (m: PaymentMethod) => {
    setSelected(m);
    setStatus("processing");
    setMascot("neutral", "Processando seu pagamento...");
    const result = await PagamentoService.process(m, cartTotal());
    if (result === "approved") {
      await EstoqueService.decrement(cart.map((c) => ({ id: c.product.id, qty: c.quantity })));
      setStatus("approved");
      setMascot("excited", "Pagamento aprovado! 🎉");
      setTimeout(() => {
        clearCart();
        navigate("/preparando");
      }, 1200);
    } else {
      setStatus("declined");
      setMascot("sad", "Ops, pagamento recusado.");
    }
  };

  if (cart.length === 0 && status === "idle") {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 pb-12">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar aos produtos
        </Button>

        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-primary">Resumo do Pedido</h2>

        <Card className="p-4 md:p-6 mb-6 shadow-soft">
          <div className="space-y-3">
            {cart.map((c) => (
              <div key={c.product.id} className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">{c.product.name}</span>
                  <span className="text-muted-foreground ml-2">x{c.quantity}</span>
                </div>
                <span className="font-bold">
                  R$ {((c.product.promoPrice ?? c.product.price) * c.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t-2 mt-4 pt-4 flex justify-between items-baseline">
            <span className="text-xl font-semibold">Total</span>
            <span className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent">
              R$ {cartTotal().toFixed(2)}
            </span>
          </div>
        </Card>

        {status === "idle" && (
          <>
            <h3 className="text-2xl font-bold mb-4">Escolha a forma de pagamento</h3>
            <div className="grid grid-cols-2 gap-4">
              {methods.map((m) => (
                <Button
                  key={m.id}
                  onClick={() => handlePay(m.id)}
                  className="h-32 flex flex-col gap-2 gradient-warm text-foreground font-bold text-xl rounded-2xl shadow-soft transition-bounce hover:scale-105 hover:shadow-elegant"
                >
                  {m.icon}
                  {m.label}
                </Button>
              ))}
            </div>
          </>
        )}

        {status === "processing" && (
          <Card className="p-12 text-center animate-bounce-in">
            <Loader2 className="h-20 w-20 mx-auto text-primary animate-spin mb-4" />
            <p className="text-2xl font-bold">Processando...</p>
            <p className="text-muted-foreground mt-2">Aguarde, estamos validando o pagamento</p>
          </Card>
        )}

        {status === "approved" && (
          <Card className="p-12 text-center animate-bounce-in border-success border-2">
            <CheckCircle2 className="h-24 w-24 mx-auto text-success mb-4" />
            <p className="text-3xl font-extrabold text-success">Pagamento Aprovado!</p>
          </Card>
        )}

        {status === "declined" && (
          <Card className="p-12 text-center animate-bounce-in border-destructive border-2">
            <XCircle className="h-24 w-24 mx-auto text-destructive mb-4" />
            <p className="text-3xl font-extrabold text-destructive">Pagamento Recusado</p>
            <p className="text-muted-foreground mt-2 mb-6">Tente outra forma de pagamento</p>
            <Button onClick={() => setStatus("idle")} size="lg" className="gradient-primary text-primary-foreground">
              Tentar novamente
            </Button>
          </Card>
        )}
      </main>
      <Mascot />
    </div>
  );
};

export default Pagamento;
