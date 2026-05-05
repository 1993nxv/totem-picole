import { useState, useEffect } from 'react'
import { 
  AppShell, AppShellSidebar, AppShellMain, 
  SidebarItem, SidebarHeader, SidebarContent, SidebarFooter,
  Page, PageHeader, PageTitle, PageActions, PageBody,
  Button, DataTable, Tabs, TabsList, TabsTrigger, TabsContent,
  Card, CardContent, Badge, StatGroup, Stat,
  Dialog, DialogContent, DialogHeader, DialogTitle,
  AutoForm, toast, Persona
} from '@blinkdotnew/ui'
import { 
  IceCream, Package, Monitor, LogOut, Plus, 
  TrendingUp, Activity, AlertCircle, Trash2, Home
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { ProductsService, InventoryService, IdleMediaService, Product, Inventory, IdleMedia } from '../services/central'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  description: z.string().min(5, 'Descrição é obrigatória'),
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
  promotionalPrice: z.number().optional(),
  imageUrl: z.string().url('URL da imagem inválida'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  active: z.number().default(1)
})

export function AdminDashboard() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState<(Product & { stock: number })[]>([])
  const [idleMedia, setIdleMedia] = useState<IdleMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('products')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check for the kiosk demo
    if (password === '1234') {
      setIsAuthenticated(true)
      toast.success('Bem-vindo ao Painel')
    } else {
      toast.error('Senha incorreta')
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [p, m] = await Promise.all([
        ProductsService.list(),
        IdleMediaService.list()
      ])
      setProducts(p)
      setIdleMedia(m)
    } catch (error) {
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="p-8">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IceCream className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-black text-primary">GESTÃO PICOLÉ</h1>
              <p className="text-sm text-muted-foreground">Insira a senha para acessar o painel</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha Administrativa"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-center text-2xl tracking-[1em] outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full py-6 text-lg font-bold">
                ACESSAR PAINEL
              </Button>
              <Button 
                variant="ghost" 
                className="w-full" 
                onClick={() => navigate({ to: '/' })}
              >
                Voltar ao Totem
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleDeleteMedia = async (id: string) => {
    try {
      await IdleMediaService.delete(id)
      toast.success('Mídia removida')
      fetchData()
    } catch (error) {
      toast.error('Erro ao remover mídia')
    }
  }

  const handleUpdateStock = async (productId: string, quantity: number) => {
    try {
      await InventoryService.updateStock(productId, quantity)
      toast.success('Estoque atualizado')
      fetchData()
    } catch (error) {
      toast.error('Erro ao atualizar estoque')
    }
  }

  const productColumns = [
    { 
      accessorKey: 'name', 
      header: 'Produto',
      cell: ({ row }: any) => (
        <Persona 
          name={row.original.name} 
          subtitle={row.original.category} 
          src={row.original.imageUrl} 
        />
      )
    },
    { 
      accessorKey: 'price', 
      header: 'Preço',
      cell: ({ row }: any) => `R$ ${row.original.price.toFixed(2)}`
    },
    { 
      accessorKey: 'stock', 
      header: 'Estoque',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Badge variant={row.original.stock < 10 ? 'destructive' : 'default'}>
            {row.original.stock} un
          </Badge>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={() => handleUpdateStock(row.original.id, row.original.stock + 10)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )
    },
    { 
      accessorKey: 'active', 
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge variant={row.original.active ? 'default' : 'outline'}>
          {row.original.active ? 'Ativo' : 'Inativo'}
        </Badge>
      )
    }
  ]

  const mediaColumns = [
    {
      accessorKey: 'url',
      header: 'Mídia',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          {row.original.type === 'video' ? (
            <div className="w-12 h-12 rounded bg-muted flex items-center justify-center"><Monitor className="h-6 w-6" /></div>
          ) : (
            <img src={row.original.url} className="w-12 h-12 rounded object-cover" />
          )}
          <span className="truncate max-w-[200px] text-xs font-mono">{row.original.url}</span>
        </div>
      )
    },
    {
      accessorKey: 'type',
      header: 'Tipo',
      cell: ({ row }: any) => <Badge variant="outline" className="capitalize">{row.original.type}</Badge>
    },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <Button variant="ghost" size="sm" onClick={() => handleDeleteMedia(row.original.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      )
    }
  ]

  return (
    <AppShell>
      <AppShellSidebar>
        <div className="flex flex-col h-full w-[240px] bg-card border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2 font-black text-primary">
              <IceCream className="h-6 w-6" />
              <span>PAINEL ADMIN</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="flex-1 p-2 space-y-1">
            <SidebarItem 
              icon={<IceCream className="h-4 w-4" />} 
              label="Produtos" 
              active={activeTab === 'products'} 
              onClick={() => setActiveTab('products')} 
            />
            <SidebarItem 
              icon={<Package className="h-4 w-4" />} 
              label="Estoque" 
              active={activeTab === 'inventory'} 
              onClick={() => setActiveTab('inventory')} 
            />
            <SidebarItem 
              icon={<Monitor className="h-4 w-4" />} 
              label="Mídia Idle" 
              active={activeTab === 'idle'} 
              onClick={() => setActiveTab('idle')} 
            />
          </SidebarContent>
          <SidebarFooter className="border-t p-4 space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate({ to: '/' })}>
              <Home className="h-4 w-4" /> Ir para Totem
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-destructive">
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </SidebarFooter>
        </div>
      </AppShellSidebar>

      <AppShellMain>
        <Page>
          <PageHeader>
            <PageTitle>Gerenciamento</PageTitle>
            <PageActions>
              <Button onClick={() => setIsAddProductOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Novo Produto
              </Button>
            </PageActions>
          </PageHeader>

          <PageBody className="space-y-8">
            <StatGroup>
              <Stat label="Vendas Hoje" value="R$ 1.240,00" trend={12.5} icon={<TrendingUp />} />
              <Stat label="Produtos Ativos" value={products.length.toString()} icon={<IceCream />} />
              <Stat label="Estoque Baixo" value={products.filter(p => p.stock < 10).length.toString()} icon={<AlertCircle />} />
              <Stat label="Status Sistema" value="ONLINE" icon={<Activity />} className="text-green-600" />
            </StatGroup>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="products">Produtos</TabsTrigger>
                <TabsTrigger value="inventory">Estoque Detalhado</TabsTrigger>
                <TabsTrigger value="idle">Loop de Mídia</TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="pt-6">
                <DataTable columns={productColumns} data={products} loading={loading} />
              </TabsContent>

              <TabsContent value="inventory" className="pt-6">
                <Card>
                  <CardContent className="p-0">
                    <DataTable columns={productColumns} data={products} loading={loading} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="idle" className="pt-6 space-y-6">
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => {
                    const url = prompt('URL da mídia:')
                    if (url) {
                      IdleMediaService.create({ url, type: url.includes('.mp4') ? 'video' : 'image', active: 1 })
                        .then(fetchData)
                    }
                  }}>
                    Adicionar Mídia
                  </Button>
                </div>
                <DataTable columns={mediaColumns} data={idleMedia} loading={loading} />
              </TabsContent>
            </Tabs>
          </PageBody>
        </Page>
      </AppShellMain>

      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Picolé</DialogTitle>
          </DialogHeader>
          <AutoForm 
            schema={productSchema} 
            onSubmit={async (data) => {
              try {
                // Mock product creation
                toast.success('Produto cadastrado (Simulado)')
                setIsAddProductOpen(false)
                fetchData()
              } catch (e) {
                toast.error('Erro ao cadastrar')
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
