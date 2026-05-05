import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from '@tanstack/react-router'
import { useStore } from '../store/useStore'
import { ShoppingCart, ArrowRight, Trash2 } from 'lucide-react'
import { Button } from '@blinkdotnew/ui'

export function CartBar() {
  const { cart, getCartTotal, removeFromCart, updateCartQuantity } = useStore()
  const navigate = useNavigate()
  const total = getCartTotal()

  if (cart.length === 0) return null

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 h-24 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-border z-40 px-6 flex items-center justify-between shadow-2xl"
    >
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2">
        <div className="flex items-center gap-2 text-primary font-bold">
          <ShoppingCart className="h-6 w-6" />
          <span className="text-xl">{cart.length}</span>
        </div>
        
        <div className="h-10 w-px bg-border mx-2" />

        <div className="flex items-center gap-4">
          {cart.map((item) => (
            <motion.div
              layout
              key={item.id}
              className="flex items-center gap-3 bg-secondary/20 dark:bg-secondary/10 px-3 py-2 rounded-full border border-secondary/30 group"
            >
              <img src={item.imageUrl} alt={item.name} className="h-8 w-8 rounded-full object-cover" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold truncate max-w-[100px]">{item.name}</span>
                <span className="text-xs opacity-70">x{item.quantity}</span>
              </div>
              <button 
                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-8 pl-6 border-l border-border h-full">
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider opacity-60 font-bold">Total do Pedido</p>
          <p className="text-3xl font-black text-primary">
            {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>

        <Button
          size="lg"
          className="h-16 px-10 text-xl font-black rounded-2xl gap-3 shadow-lg hover:shadow-primary/20 transition-all bg-primary hover:bg-primary/90"
          onClick={() => navigate({ to: '/pagamento' })}
        >
          PROSSEGUIR
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
    </motion.div>
  )
}
