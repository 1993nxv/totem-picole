import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { AuthService, ProdutosService, SettingsService } from "@/services";
import type { Product, Settings, IdleMedia } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, LogOut, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const empty: Product = { id: "", name: "", description: "", price: 0, image: "🍦", stock: 0, active: true };

const SESSION_TIMEOUT = 15 * 60 * 1000;

export const Gerir = () => {
  const { adminAuthed, setAdminAuthed, theme, toggleTheme } = useStore();
  const [pwd, setPwd] = useState("");

  // Session timeout
  useEffect(() => {
    if (!adminAuthed) return;
    const t = setTimeout(() => {
      setAdminAuthed(false);
      toast.info("Sessão administrativa expirada");
    }, SESSION_TIMEOUT);
    return () => clearTimeout(t);
  }, [adminAuthed, setAdminAuthed]);

  if (!adminAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="p-8 max-w-md w-full shadow-elegant">
          <img src={logo} alt="" className="h-20 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-center mb-6">Painel Administrativo</h1>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const ok = await AuthService.login(pwd);
              if (ok) {
                setAdminAuthed(true);
                toast.success("Bem-vindo!");
              } else toast.error("Senha incorreta");
            }}
            className="space-y-4"
          >
            <div>
              <Label>Senha</Label>
              <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} autoFocus />
              <p className="text-xs text-muted-foreground mt-1">Padrão: admin123</p>
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground">Entrar</Button>
          </form>
        </Card>
      </div>
    );
  }

  return <AdminPanel onLogout={() => setAdminAuthed(false)} theme={theme} toggleTheme={toggleTheme} />;
};

const AdminPanel = ({ onLogout, theme, toggleTheme }: { onLogout: () => void; theme: string; toggleTheme: () => void }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  const reload = async () => {
    setProducts(await ProdutosService.list());
    setSettings(await SettingsService.get());
  };
  useEffect(() => { reload(); }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-4 border-b bg-card sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" className="h-10" />
          <div>
            <h1 className="font-bold text-lg">Painel Administrativo</h1>
            <p className="text-xs text-muted-foreground">Frutos de Goiás</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button variant="outline" onClick={onLogout}><LogOut className="h-4 w-4 mr-2" />Sair</Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Produtos & Estoque</TabsTrigger>
            <TabsTrigger value="media">Mídias / Modo Repouso</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsAdmin products={products} reload={reload} />
          </TabsContent>
          <TabsContent value="media">
            {settings && <MediaAdmin settings={settings} reload={reload} />}
          </TabsContent>
          <TabsContent value="settings">
            {settings && <SettingsAdmin settings={settings} reload={reload} />}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const ProductsAdmin = ({ products, reload }: { products: Product[]; reload: () => void }) => {
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const onEdit = (p: Product) => { setEditing(p); setOpen(true); };
  const onNew = () => { setEditing({ ...empty }); setOpen(true); };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Produtos ({products.length})</h2>
        <Button onClick={onNew} className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Novo Produto</Button>
      </div>

      <div className="grid gap-3">
        {products.map((p) => (
          <Card key={p.id} className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl gradient-warm flex items-center justify-center text-3xl">
              {p.image.startsWith("http") || p.image.startsWith("data:") ? (
                <img src={p.image} alt="" className="w-full h-full object-cover rounded-xl" />
              ) : <img src={p.image} alt="" className="w-full h-full object-cover rounded-xl" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold">{p.name}</h3>
                {!p.active && <span className="text-xs bg-muted px-2 py-0.5 rounded">Inativo</span>}
                {p.stock <= 0 && <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded">Sem estoque</span>}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{p.description}</p>
              <p className="text-sm">
                <span className="font-semibold text-primary">R$ {(p.promoPrice ?? p.price).toFixed(2)}</span>
                {p.promoPrice && <span className="line-through text-muted-foreground ml-2">R$ {p.price.toFixed(2)}</span>}
                <span className="ml-3 text-muted-foreground">Estoque: {p.stock}</span>
              </p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => onEdit(p)}><Pencil className="h-4 w-4" /></Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-destructive"
              onClick={async () => {
                if (confirm(`Remover ${p.name}?`)) {
                  await ProdutosService.remove(p.id);
                  toast.success("Produto removido");
                  reload();
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>

      <ProductDialog open={open} setOpen={setOpen} product={editing} reload={reload} />
    </div>
  );
};

const ProductDialog = ({
  open, setOpen, product, reload,
}: { open: boolean; setOpen: (b: boolean) => void; product: Product | null; reload: () => void }) => {
  const [form, setForm] = useState<Product>(product ?? empty);
  useEffect(() => { if (product) setForm(product); }, [product]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, image: reader.result as string });
    reader.readAsDataURL(f);
  };

  const save = async () => {
    if (!form.name.trim()) { toast.error("Nome obrigatório"); return; }
    await ProdutosService.save({ ...form, id: form.id || `p${Date.now()}` });
    toast.success("Produto salvo");
    setOpen(false);
    reload();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{form.id ? "Editar" : "Novo"} Produto</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Nome</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Preço normal (R$)</Label>
              <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
            </div>
            <div>
              <Label>Preço promocional (R$)</Label>
              <Input type="number" step="0.01" value={form.promoPrice ?? ""} onChange={(e) => setForm({ ...form, promoPrice: e.target.value ? parseFloat(e.target.value) : undefined })} />
            </div>
          </div>
          <div>
            <Label>Quantidade em estoque</Label>
            <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} />
          </div>
          <div>
            <Label>Imagem (upload ou emoji)</Label>
            <Input type="file" accept="image/*" onChange={onFile} />
            <Input className="mt-2" placeholder="ou cole um emoji 🍦" value={form.image.startsWith("data:") ? "" : form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            {form.image && (
              <div className="mt-2 w-20 h-20 rounded-xl gradient-warm flex items-center justify-center text-4xl overflow-hidden">
                {form.image.startsWith("data:") || form.image.startsWith("http") ? (
                  <img src={form.image} alt="" className="w-full h-full object-cover" />
                ) : <img src={form.image} alt="" className="w-full h-full object-cover" />}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between pt-2">
            <Label>Produto ativo</Label>
            <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={save} className="gradient-primary text-primary-foreground">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const MediaAdmin = ({ settings, reload }: { settings: Settings; reload: () => void }) => {
  const [media, setMedia] = useState<IdleMedia[]>(settings.idleMedia);
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"image" | "video">("image");

  const add = () => {
    if (!url.trim()) return;
    setMedia([...media, { id: `m${Date.now()}`, type, url }]);
    setUrl("");
  };
  const remove = (id: string) => setMedia(media.filter((m) => m.id !== id));
  const save = async () => {
    await SettingsService.save({ ...settings, idleMedia: media });
    toast.success("Mídias salvas");
    reload();
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Mídias do Modo Repouso</h2>
      <p className="text-sm text-muted-foreground mb-4">Imagens ou vídeos exibidos quando o totem fica ocioso por 1 minuto.</p>
      <div className="flex gap-2 mb-4">
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="border rounded-md px-3 bg-background">
          <option value="image">Imagem</option>
          <option value="video">Vídeo</option>
        </select>
        <Input placeholder="URL da mídia" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Button onClick={add}><Plus className="h-4 w-4" /></Button>
      </div>
      <div className="space-y-2 mb-4">
        {media.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma mídia cadastrada (será exibida tela padrão da marca).</p>}
        {media.map((m) => (
          <div key={m.id} className="flex justify-between items-center border rounded-lg p-2">
            <span className="text-xs uppercase font-bold text-primary">{m.type}</span>
            <span className="flex-1 mx-3 truncate text-sm">{m.url}</span>
            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(m.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button onClick={save} className="gradient-primary text-primary-foreground">Salvar</Button>
    </Card>
  );
};

const SettingsAdmin = ({ settings, reload }: { settings: Settings; reload: () => void }) => {
  const [s, setS] = useState(settings);

  const save = async () => {
    await SettingsService.save(s);
    toast.success("Configurações salvas");
    reload();
  };

  return (
    <Card className="p-6 space-y-4 max-w-md">
      <h2 className="text-xl font-bold">Configurações Gerais</h2>
      <div>
        <Label>Tema padrão</Label>
        <select
          value={s.defaultTheme}
          onChange={(e) => setS({ ...s, defaultTheme: e.target.value as any })}
          className="w-full border rounded-md px-3 py-2 bg-background mt-1"
        >
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
        </select>
      </div>
      <div>
        <Label>Senha do administrador</Label>
        <Input type="password" value={s.adminPassword} onChange={(e) => setS({ ...s, adminPassword: e.target.value })} />
      </div>
      <Button onClick={save} className="gradient-primary text-primary-foreground">Salvar</Button>
    </Card>
  );
};

export default Gerir;
