import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, MapPin, Clock, Tag, MessageCircle, Info, X } from "lucide-react";
import { Page, SectionTitle } from "@/components/site/Layout";
import { MumbucaBadge, ProductCard, SellerAvatar } from "@/components/site/Cards";
import { formatBRL, getCategory } from "@/data/demo";
import { saveContactMessage, useMockDatabase } from "@/data/mock-db";

export const Route = createFileRoute("/anuncio/$id")({
  head: () => ({
    meta: [
      { title: "Anúncio — MaricáMais" },
      { name: "description", content: "Conheça os detalhes deste produto local de Maricá." },
      { property: "og:title", content: "Anúncio — MaricáMais" },
      { property: "og:description", content: "Conheça os detalhes deste produto local de Maricá." },
    ],
  }),
  component: Anuncio,
});

function Anuncio() {
  const { id } = Route.useParams();
  const database = useMockDatabase();
  const product = database.products.find((entry) => entry.id === id);
  const seller = product ? database.sellers.find((entry) => entry.id === product.sellerId) : undefined;
  const others = seller ? database.products.filter((entry) => entry.sellerId === seller.id && entry.id !== id && entry.active !== false) : [];
  const [img, setImg] = useState(0);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(`Olá! Tenho interesse em "${product.name}". Ainda está disponível?`);
  const [err, setErr] = useState("");
  const views = ["object-center", "object-left", "object-right"];

  if (!product || !seller) {
    return (
      <Page>
        <div className="container-page py-24 text-center">
          <h1 className="text-2xl font-bold">Anúncio não encontrado</h1>
          <Link to="/explorar" className="btn btn-primary mt-6">Explorar produtos</Link>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="container-page py-8">
        <Link to="/explorar" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Voltar para produtos</Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="space-y-3">
            <img src={product.image} alt={product.name} width={816} height={816} className={`aspect-square w-full rounded-3xl object-cover ${views[img]}`} />
            <div className="grid grid-cols-3 gap-3">
              {views.map((v, i) => (
                <button key={v} onClick={() => setImg(i)} aria-label={`Ver imagem ${i + 1}`} className={`overflow-hidden rounded-xl border-2 ${img === i ? "border-primary" : "border-transparent"}`}>
                  <img src={product.image} alt="" loading="lazy" className={`aspect-square w-full scale-150 object-cover ${v}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-accent-foreground"><Tag className="h-3.5 w-3.5" />{getCategory(product.category)?.name}</span>
              <MumbucaBadge value={seller.mumbuca} />
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">Anúncio demonstrativo</span>
            </div>
            <h1 className="text-3xl font-bold text-secondary md:text-4xl">{product.name}</h1>
            <p className="text-3xl font-bold text-primary">{formatBRL(product.price)}</p>
            <p className="text-muted-foreground">{product.description}</p>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="card-surface flex gap-3 p-4"><MapPin className="h-5 w-5 text-primary" /><div><dt className="text-xs text-muted-foreground">Localização aproximada</dt><dd className="font-medium">{seller.neighborhood}, Maricá</dd></div></div>
              <div className="card-surface flex gap-3 p-4"><Clock className="h-5 w-5 text-primary" /><div><dt className="text-xs text-muted-foreground">Disponibilidade informada</dt><dd className="font-medium">{product.availability}</dd></div></div>
            </dl>

            <div className="card-surface flex items-center gap-4 p-5">
              <SellerAvatar seller={seller} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Vendido por</p>
                <p className="font-display text-lg font-semibold">{seller.name}</p>
                <p className="text-sm text-muted-foreground">{seller.description}</p>
              </div>
            </div>

            <button className="btn btn-primary h-12 w-full text-base" onClick={() => setOpen(true)}><MessageCircle className="h-5 w-5" /> Entrar em contato com o vendedor</button>
            <p className="flex items-start gap-2 text-xs text-muted-foreground"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />O MaricáMais não processa pagamentos nem entregas. A negociação é combinada diretamente com o vendedor.{seller.mumbuca === "sim" && " A aceitação de Mumbuca é uma informação declarada pelo vendedor."}</p>
          </div>
        </div>

        {others.length > 0 && (
          <section className="mt-20">
            <SectionTitle title={`Mais de ${seller.name}`} />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{others.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </section>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" role="dialog" aria-modal="true" aria-labelledby="contato-titulo" onClick={() => setOpen(false)}>
          <form className="card-surface w-full max-w-md space-y-4 p-6" onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              if (msg.trim().length < 10) { setErr("Escreva uma mensagem com pelo menos 10 caracteres."); return; }
              try {
                saveContactMessage({ productId: product.id, sellerId: seller.id, message: msg.trim() });
                setOpen(false); setErr("");
                toast.success("Interesse registrado nesta demonstração", { description: "A mensagem ficou salva somente neste navegador." });
              } catch (error) {
                console.error("Falha ao salvar mensagem na base simulada.", error);
                setErr("Não foi possível registrar a mensagem. Verifique o armazenamento local do navegador.");
              }
            }}>
            <div className="flex items-start justify-between gap-4">
              <h2 id="contato-titulo" className="text-xl font-semibold">Contato com {seller.name}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar" className="btn btn-ghost h-9 px-2"><X className="h-4 w-4" /></button>
            </div>
            <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">Contato demonstrativo. A mensagem fica salva localmente e não é enviada ao vendedor.</p>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Sua mensagem</span>
              <textarea className="field h-28 py-2" value={msg} onChange={(e) => setMsg(e.target.value)} aria-invalid={!!err} />
              {err && <span className="text-sm text-destructive">{err}</span>}
            </label>
            <button className="btn btn-primary w-full">Enviar mensagem (simulação)</button>
          </form>
        </div>
      )}
    </Page>
  );
}
