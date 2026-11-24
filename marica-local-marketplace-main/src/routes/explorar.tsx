import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Search, SearchX, X } from "lucide-react";
import { Page } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/Cards";
import { categories, neighborhoods } from "@/data/demo";
import { useMockDatabase } from "@/data/mock-db";

type S = { q?: string | undefined; categoria?: string | undefined; bairro?: string | undefined; vendedor?: string | undefined; min?: number | undefined; max?: number | undefined; mumbuca?: boolean | undefined; ordem?: "menor" | "maior" | "recentes" | undefined };

export const Route = createFileRoute("/explorar")({
  validateSearch: (r: Record<string, unknown>): S => { const s = r as { [k: string]: unknown } & Record<"q"|"categoria"|"bairro"|"vendedor"|"min"|"max"|"mumbuca"|"ordem", unknown>; return {
    q: typeof s.q === "string" ? s.q : undefined,
    categoria: typeof s.categoria === "string" ? s.categoria : undefined,
    bairro: typeof s.bairro === "string" ? s.bairro : undefined,
    vendedor: typeof s.vendedor === "string" ? s.vendedor : undefined,
    min: s.min !== undefined && !isNaN(Number(s.min)) ? Number(s.min) : undefined,
    max: s.max !== undefined && !isNaN(Number(s.max)) ? Number(s.max) : undefined,
    mumbuca: s.mumbuca === true || s.mumbuca === "true" ? true : undefined,
    ordem: s.ordem === "menor" || s.ordem === "maior" || s.ordem === "recentes" ? s.ordem : undefined,
  }; },
  head: () => ({
    meta: [
      { title: "Explorar produtos — MaricáMais" },
      { name: "description", content: "Pesquise e filtre produtos de pequenos negócios de Maricá por categoria, bairro e preço." },
      { property: "og:title", content: "Explorar produtos — MaricáMais" },
      { property: "og:description", content: "Encontre produtos locais de Maricá com filtros simples." },
    ],
  }),
  component: Explorar,
});

function Explorar() {
  const s = Route.useSearch();
  const database = useMockDatabase();
  const navigate = useNavigate({ from: "/explorar" });
  const set = (patch: Partial<S>) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

  const results = useMemo(() => {
    const q = s.q?.toLowerCase().trim();
    const list = database.products.filter((p) => {
      if (p.active === false) return false;
      const seller = database.sellers.find((entry) => entry.id === p.sellerId);
      if (!seller) return false;
      if (q && !`${p.name} ${p.description} ${seller.name}`.toLowerCase().includes(q)) return false;
      if (s.categoria && p.category !== s.categoria) return false;
      if (s.bairro && seller.neighborhood !== s.bairro) return false;
      if (s.vendedor && p.sellerId !== s.vendedor) return false;
      if (s.min !== undefined && p.price < s.min) return false;
      if (s.max !== undefined && p.price > s.max) return false;
      if (s.mumbuca && seller.mumbuca !== "sim") return false;
      return true;
    });
    if (s.ordem === "menor") list.sort((a, b) => a.price - b.price);
    else if (s.ordem === "maior") list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return list;
  }, [s, database]);

  const hasFilters = Object.values(s).some((v) => v !== undefined && v !== "");
  const vendedor = s.vendedor ? database.sellers.find((seller) => seller.id === s.vendedor) : undefined;

  return (
    <Page>
      <div className="container-page py-10">
        <h1 className="text-3xl font-bold text-secondary md:text-4xl">Explorar produtos</h1>
        <p className="mt-2 text-muted-foreground">Dados de demonstração — anúncios e vendedores fictícios.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="card-surface h-fit space-y-5 p-5 lg:sticky lg:top-24" aria-label="Filtros">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Buscar</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <input className="field pl-9" value={s.q ?? ""} onChange={(e) => set({ q: e.target.value || undefined })} placeholder="Ex.: bolo, cesto…" />
              </div>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Categoria</span>
              <select className="field" value={s.categoria ?? ""} onChange={(e) => set({ categoria: e.target.value || undefined })}>
                <option value="">Todas</option>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Bairro</span>
              <select className="field" value={s.bairro ?? ""} onChange={(e) => set({ bairro: e.target.value || undefined })}>
                <option value="">Todos</option>
                {neighborhoods.map((n) => <option key={n}>{n}</option>)}
              </select>
            </label>
            <fieldset className="space-y-1.5">
              <legend className="text-sm font-medium">Faixa de preço (R$)</legend>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" min={0} inputMode="numeric" aria-label="Preço mínimo" placeholder="Mín." className="field" value={s.min ?? ""} onChange={(e) => set({ min: e.target.value ? Number(e.target.value) : undefined })} />
                <input type="number" min={0} inputMode="numeric" aria-label="Preço máximo" placeholder="Máx." className="field" value={s.max ?? ""} onChange={(e) => set({ max: e.target.value ? Number(e.target.value) : undefined })} />
              </div>
            </fieldset>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-sun-soft p-3">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--color-primary)]" checked={!!s.mumbuca} onChange={(e) => set({ mumbuca: e.target.checked || undefined })} />
              <span className="text-sm">Vendedores que informam aceitar Mumbuca</span>
            </label>
            {hasFilters && (
              <button className="btn btn-outline w-full" onClick={() => navigate({ search: {} })}><X className="h-4 w-4" /> Limpar filtros</button>
            )}
          </aside>

          <section aria-live="polite">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{results.length}</strong> {results.length === 1 ? "anúncio encontrado" : "anúncios encontrados"}
                {vendedor && <> de <strong className="text-foreground">{vendedor.name}</strong></>}
              </p>
              <label className="flex items-center gap-2 text-sm">
                <span>Ordenar por</span>
                <select className="field h-10 w-auto" value={s.ordem ?? "recentes"} onChange={(e) => set({ ordem: e.target.value as S["ordem"] })}>
                  <option value="recentes">Anúncios recentes</option>
                  <option value="menor">Menor preço</option>
                  <option value="maior">Maior preço</option>
                </select>
              </label>
            </div>
            {results.length ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {results.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="card-surface flex flex-col items-center gap-3 px-6 py-16 text-center">
                <SearchX className="h-10 w-10 text-muted-foreground" aria-hidden />
                <h2 className="text-xl font-semibold">Nenhum produto encontrado</h2>
                <p className="max-w-sm text-muted-foreground">Tente outra palavra, mude o bairro ou amplie a faixa de preço.</p>
                <button className="btn btn-primary mt-2" onClick={() => navigate({ search: {} })}>Limpar filtros</button>
                <Link to="/negocios" className="text-sm text-primary underline">Ver negócios locais</Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </Page>
  );
}
