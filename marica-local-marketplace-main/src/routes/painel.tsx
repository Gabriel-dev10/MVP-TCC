import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Eye, Pencil, Power, PackageOpen, ShoppingBag, CheckCircle2, Truck } from "lucide-react";
import { Page } from "@/components/site/Layout";
import { categories, formatBRL } from "@/data/demo";
import { createProduct, setActiveSeller, toggleProduct, updateProduct, useMockDatabase } from "@/data/mock-db";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Área do empreendedor — MaricáMais" },
      { name: "description", content: "Gerencie anúncios na área demonstrativa do empreendedor." },
      { property: "og:title", content: "Área do empreendedor — MaricáMais" },
      { property: "og:description", content: "Painel demonstrativo do empreendedor." },
    ],
  }),
  component: Painel,
});

type OrderStatus = "pendente" | "confirmado" | "entregue";

interface Order {
  id: string;
  product: string;
  buyer: string;
  value: number;
  status: OrderStatus;
}

const initialOrders: Order[] = [
  { id: "ped-001", product: "Brigadeiro gourmet (cx 12 un)", buyer: "Ana Lima", value: 36.0, status: "pendente" },
  { id: "ped-002", product: "Bolo de cenoura com chocolate", buyer: "Carlos Souza", value: 55.0, status: "confirmado" },
  { id: "ped-003", product: "Trufa de maracujá (cx 6 un)", buyer: "Maria Fernanda", value: 28.5, status: "entregue" },
];

const statusLabel: Record<OrderStatus, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  entregue: "Entregue",
};

const statusClass: Record<OrderStatus, string> = {
  pendente: "bg-yellow-100 text-yellow-800",
  confirmado: "bg-blue-100 text-blue-800",
  entregue: "bg-green-100 text-green-800",
};

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const confirm = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "confirmado" } : o)));
    toast.success("Pedido confirmado!");
  };

  const ship = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "entregue" } : o)));
    toast.success("Pedido marcado como entregue!");
  };

  return (
    <ul className="mt-6 space-y-3">
      {orders.map((o) => (
        <li key={o.id} className="card-surface flex flex-wrap items-center gap-4 p-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
            <ShoppingBag className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{o.product}</p>
            <p className="text-sm text-muted-foreground">
              {o.buyer} · {formatBRL(o.value)}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[o.status]}`}>
            {statusLabel[o.status]}
          </span>
          <div className="flex gap-2">
            {o.status === "pendente" && (
              <button
                className="btn btn-primary h-9 gap-1.5 px-3 text-sm"
                onClick={() => confirm(o.id)}
                aria-label="Confirmar pedido"
              >
                <CheckCircle2 className="h-4 w-4" /> Confirmar
              </button>
            )}
            {o.status === "confirmado" && (
              <button
                className="btn btn-outline h-9 gap-1.5 px-3 text-sm"
                onClick={() => ship(o.id)}
                aria-label="Marcar como enviado"
              >
                <Truck className="h-4 w-4" /> Marcar enviado
              </button>
            )}
            {o.status === "entregue" && (
              <span className="flex items-center gap-1 text-sm text-green-700">
                <CheckCircle2 className="h-4 w-4" /> Concluído
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function Painel() {
  const [tab, setTab] = useState<"anuncios" | "pedidos">("anuncios");
  const database = useMockDatabase();
  const [selectedSellerId, setSelectedSellerId] = useState(database.activeSellerId);
  const [editingId, setEditingId] = useState<string>();
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [err, setErr] = useState("");
  const seller = database.sellers.find((entry) => entry.id === selectedSellerId) ?? database.sellers[0];
  const items = database.products.filter((product) => product.sellerId === seller?.id);
  const active = items.filter((product) => product.active !== false).length;

  useEffect(() => {
    setSelectedSellerId(database.activeSellerId);
  }, [database.activeSellerId]);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seller) { setErr("Cadastre ou selecione um negócio primeiro."); return; }
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const price = Number(form.get("price"));
    const description = String(form.get("description") ?? "").trim();
    const availability = String(form.get("availability") ?? "").trim();
    const category = categories.find((entry) => entry.slug === form.get("category"));
    if (!name || !description || !availability || !category || !Number.isFinite(price) || price <= 0) {
      setErr("Preencha todos os campos e informe um preço válido.");
      return;
    }
    try {
      createProduct(seller.id, { name, price, description, availability, category: category.slug });
      e.currentTarget.reset();
      setErr("");
      toast.success("Produto publicado e salvo nesta demonstração.");
    } catch (error) {
      console.error("Falha ao publicar produto na base simulada.", error);
      setErr("Não foi possível salvar o produto. Verifique o armazenamento local do navegador.");
    }
  };

  return (
    <Page>
      <div className="container-page py-10">
        <p className="text-sm text-muted-foreground">Área demonstrativa · dados salvos localmente neste navegador</p>
        <h1 className="text-3xl font-bold text-secondary md:text-4xl">Área do empreendedor</h1>
        {database.sellers.length > 0 && (
          <label className="mt-5 block max-w-md space-y-1.5">
            <span className="text-sm font-medium">Negócio selecionado</span>
            <select className="field" value={seller?.id ?? ""} onChange={(event) => {
              setSelectedSellerId(event.target.value);
              setActiveSeller(event.target.value);
            }}>
              {database.sellers.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
            </select>
          </label>
        )}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[["Anúncios", items.length], ["Ativos", active], ["Desativados", items.length - active]].map(([l, v]) => (
            <div key={l} className="card-surface p-5"><p className="text-sm text-muted-foreground">{l}</p><p className="font-display text-3xl font-bold">{v}</p></div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 rounded-xl bg-muted p-1 w-fit">
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${tab === "anuncios" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setTab("anuncios")}
          >
            Meus anúncios
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${tab === "pedidos" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setTab("pedidos")}
          >
            Pedidos recebidos
          </button>
        </div>

        {tab === "anuncios" && (
          <>
            <form onSubmit={add} className="card-surface mt-6 grid gap-3 p-5 sm:grid-cols-[2fr_1fr_auto]">
              <input name="name" className="field" placeholder="Nome do produto" aria-label="Nome do produto" required />
              <input name="price" className="field" type="number" min="0.01" step="0.01" placeholder="Preço (R$)" aria-label="Preço" required />
              <select name="category" className="field" defaultValue="" required>
                <option value="" disabled>Categoria</option>
                {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
              </select>
              <textarea name="description" className="field h-20 py-2 sm:col-span-2" placeholder="Descrição" aria-label="Descrição" required />
              <input name="availability" className="field" placeholder="Disponibilidade" aria-label="Disponibilidade" required />
              <button className="btn btn-primary sm:col-span-3"><Plus className="h-4 w-4" /> Cadastrar produto</button>
              {err && <p className="text-sm text-destructive sm:col-span-3" role="alert">{err}</p>}
            </form>

            {items.length === 0 ? (
              <div className="card-surface mt-6 flex flex-col items-center gap-3 py-16 text-center">
                <PackageOpen className="h-10 w-10 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Você ainda não publicou produtos</h2>
                <p className="text-muted-foreground">Use o formulário acima para publicar o primeiro.</p>
              </div>
            ) : (
              <ul className="mt-6 space-y-3">
                {items.map((p) => (
                  <li key={p.id} className={`card-surface flex flex-wrap items-center gap-4 p-4 ${p.active === false ? "opacity-60" : ""}`}>
                    <img src={p.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{formatBRL(p.price)} · {p.active === false ? "Desativado" : "Ativo"}</p>
                    </div>
                    {editingId === p.id && (
                      <form className="flex w-full flex-wrap gap-2" onSubmit={(event) => {
                        event.preventDefault();
                        const nextPrice = Number(editPrice);
                        if (!editName.trim() || !Number.isFinite(nextPrice) || nextPrice <= 0) {
                          setErr("Informe um nome e um preço válido.");
                          return;
                        }
                        updateProduct(p.id, { name: editName.trim(), price: nextPrice });
                        setEditingId(undefined);
                        setErr("");
                        toast.success("Anúncio atualizado.");
                      }}>
                        <input className="field min-w-40 flex-1" aria-label="Nome do produto" value={editName} onChange={(event) => setEditName(event.target.value)} />
                        <input className="field w-32" aria-label="Preço do produto" type="number" min="0.01" step="0.01" value={editPrice} onChange={(event) => setEditPrice(event.target.value)} />
                        <button className="btn btn-primary h-10" type="submit">Salvar</button>
                        <button className="btn btn-outline h-10" type="button" onClick={() => setEditingId(undefined)}>Cancelar</button>
                      </form>
                    )}
                    <div className="flex gap-2">
                      {p.active !== false && <Link to="/anuncio/$id" params={{ id: p.id }} className="btn btn-outline h-9 px-3" aria-label="Visualizar"><Eye className="h-4 w-4" /></Link>}
                      <button className="btn btn-outline h-9 px-3" aria-label="Editar" onClick={() => {
                        setEditingId(p.id);
                        setEditName(p.name);
                        setEditPrice(String(p.price));
                        setErr("");
                      }}><Pencil className="h-4 w-4" /></button>
                      <button className="btn btn-outline h-9 px-3" aria-label={p.active === false ? "Reativar" : "Desativar"} onClick={() => toggleProduct(p.id)}><Power className="h-4 w-4" /></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {tab === "pedidos" && <OrdersTab />}
      </div>
    </Page>
  );
}
