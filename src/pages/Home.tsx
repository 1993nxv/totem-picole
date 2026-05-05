import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductsService, Product } from '../services/central'
import { useStore } from '../store/useStore'
import { CartBar } from '../components/CartBar'
import { Sun, Moon, Plus, Info, LayoutGrid, Search } from 'lucide-react'
import { Button, Badge, Card, CardContent, Input } from '@blinkdotnew/ui'

export function Home() {
  const [products, setProducts] = useState<(Product & { stock: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { theme, toggleTheme, addToCart } = useStore()

  useEffect(() => {
    ProductsService.list()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemAnim = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <div className="flex flex-col min-h-screen pb-32">
      <header className="sticky top-0 z-30 w-full px-8 py-6 flex items-center justify-between bg-white/50 dark:bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <LayoutGrid className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-primary">Picolé Kiosk</h1>
            <p className="text-sm opacity-60 font-medium italic">Artesanal & Refrescante</p>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-12">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 opacity-40 group-focus-within:opacity-100 transition-opacity" />
            <Input 
              placeholder="Qual sabor você deseja hoje?..."
              className="h-14 pl-12 bg-background/50 border-2 border-transparent focus:border-primary/20 rounded-2xl transition-all text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-2xl border-2 hover:bg-secondary/10"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <Moon /> : <Sun />}
        </Button>
      </header>

      <main className="flex-1 px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[400px] rounded-3xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={itemAnim}>
                <Card className="group relative overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all rounded-[2rem] h-full shadow-lg hover:shadow-2xl hover:-translate-y-1">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <Badge className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white border-white/30 text-xs font-bold px-3 py-1">
                      {product.stock} em estoque
                    </Badge>

                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-end justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-secondary font-black text-xs uppercase tracking-[0.2em] mb-1">{product.category}</p>
                          <h3 className="text-white text-2xl font-black leading-tight mb-2">{product.name}</h3>
                        </div>
                        <div className="text-right">
                          {product.promotionalPrice ? (
                            <div className="flex flex-col">
                              <span className="text-white/60 line-through text-sm">R$ {product.price.toFixed(2)}</span>
                              <span className="text-secondary text-2xl font-black">R$ {product.promotionalPrice.toFixed(2)}</span>
                            </div>
                          ) : (
                            <span className="text-white text-2xl font-black">R$ {product.price.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <p className="text-sm opacity-70 mb-6 line-clamp-2 min-h-[2.5rem] font-medium leading-relaxed">
                      {product.description}
                    </p>
                    
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 h-14 rounded-xl text-lg font-black bg-primary hover:bg-primary/90 gap-2"
                        onClick={() => addToCart({ ...product, quantity: 1 })}
                        disabled={product.stock <= 0}
                      >
                        <Plus className="h-5 w-5" />
                        ADICIONAR
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-14 w-14 rounded-xl border-2"
                      >
                        <Info className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <CartBar />
    </div>
  )
}
