import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from '@tanstack/react-router'
import { useStore } from '../store/useStore'
import { PaymentService } from '../services/central'
import { CreditCard, QrCode, ArrowLeft, ShieldCheck, Wallet, ChevronRight } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Separator, toast } from '@blinkdotnew/ui'

export function Payment() {
  const { cart, getCartTotal, clearCart } = useStore()
  const navigate = useNavigate()
  const [method, setMethod] = useState<'pix' | 'card'>('pix')
  const [loading, setLoading] = useState(false)
  const total = getCartTotal()

  if (cart.length === 0) {
    navigate({ to: '/' })
    return null
  }

  const handlePayment = async () => {
    setLoading(true)
    try {
      const result = await PaymentService.processPayment(total, method)
      if (result.success) {
        toast.success('Pagamento processado com sucesso!')
        navigate({ to: '/sucesso' })
      }
    } catch (error) {
      toast.error('Erro ao processar pagamento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8 flex flex-col">
      <header className="mb-12 flex items-center justify-between">
        <Button
          variant="ghost"
          size="lg"
          className="rounded-2xl gap-2 font-bold hover:bg-primary/5"
          onClick={() => navigate({ to: '/' })}
        >
          <ArrowLeft className="h-5 w-5" />
          VOLTAR AOS PRODUTOS
        </Button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold opacity-60">PAGAMENTO SEGURO</span>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto w-full">
        {/* Left Column: Summary */}
        <div className="lg:col-span-7 space-y-8">
          <section>
            <h2 className="text-4xl font-black mb-8 text-primary">Resumo do Pedido</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="border-2 rounded-[1.5rem] overflow-hidden">
                  <CardContent className="p-4 flex items-center gap-6">
                    <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <p className="text-sm opacity-60 font-medium">Quantidade: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black">
                        {((item.promotionalPrice || item.price) * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Card className="bg-primary/5 border-primary/20 rounded-[2rem]">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold opacity-70">Subtotal</span>
                <span className="text-xl font-bold">R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold opacity-70">Descontos</span>
                <span className="text-xl font-bold text-green-600">- R$ 0,00</span>
              </div>
              <Separator className="mb-6" />
              <div className="flex justify-between items-center">
                <span className="text-2xl font-black">TOTAL A PAGAR</span>
                <span className="text-4xl font-black text-primary">
                  {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Payment Methods */}
        <div className="lg:col-span-5 space-y-8">
          <h2 className="text-4xl font-black mb-8 text-primary">Pagamento</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setMethod('pix')}
              className={`p-6 rounded-[2rem] border-4 transition-all flex items-center gap-6 text-left ${
                method === 'pix' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/20'
              }`}
            >
              <div className={`p-4 rounded-2xl ${method === 'pix' ? 'bg-primary text-white' : 'bg-muted'}`}>
                <QrCode className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xl font-black">PIX</h4>
                  <Badge className="bg-green-100 text-green-700 border-none font-bold">RÁPIDO</Badge>
                </div>
                <p className="text-sm opacity-60 font-medium">Aprovação instantânea</p>
              </div>
              {method === 'pix' && <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white"><ChevronRight className="h-4 w-4" /></div>}
            </button>

            <button
              onClick={() => setMethod('card')}
              className={`p-6 rounded-[2rem] border-4 transition-all flex items-center gap-6 text-left ${
                method === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/20'
              }`}
            >
              <div className={`p-4 rounded-2xl ${method === 'card' ? 'bg-primary text-white' : 'bg-muted'}`}>
                <CreditCard className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xl font-black">CARTÃO</h4>
                  <Badge className="bg-blue-100 text-blue-700 border-none font-bold">DÉBITO/CRÉDITO</Badge>
                </div>
                <p className="text-sm opacity-60 font-medium">Aceitamos todas as bandeiras</p>
              </div>
              {method === 'card' && <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white"><ChevronRight className="h-4 w-4" /></div>}
            </button>
          </div>

          <div className="pt-8">
            <Button
              className="w-full h-20 rounded-[1.5rem] text-2xl font-black shadow-xl hover:shadow-primary/20 gap-3"
              size="lg"
              disabled={loading}
              onClick={handlePayment}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Wallet className="h-8 w-8" />
                </motion.div>
              ) : (
                <>
                  PAGAR AGORA
                  <ChevronRight className="h-8 w-8" />
                </>
              )}
            </Button>
            <p className="text-center mt-6 text-sm font-medium opacity-40">
              Ao clicar em pagar, você concorda com nossos termos de uso.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
