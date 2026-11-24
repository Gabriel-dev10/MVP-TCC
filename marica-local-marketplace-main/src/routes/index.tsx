import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ArrowRight, Store, SearchCheck, MessagesSquare, Coins, Info, Megaphone, Compass, Handshake, HeartHandshake, Gavel } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { Page, SectionTitle } from "@/components/site/Layout";
import { ProductCard, SellerCard, categoryIcons } from "@/components/site/Cards";
import { categories, neighborhoods } from "@/data/demo";
import { useMockDatabase } from "@/data/mock-db";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MaricáMais — Valorize o comércio local de Maricá" },
      { name: "description", content: "Descubra produtos, conheça empreendedores e fortaleça a economia local de Maricá." },
      { property: "og:title", content: "MaricáMais — Valorize o comércio local de Maricá" },
      { property: "og:description", content: "Vitrine digital para aproximar moradores e pequenos negócios de Maricá." },
    ],
  }),
  component: Home,
});

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [categoria, setCategoria] = useState("");
  const [bairro, setBairro] = useState("");
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); navigate({ to: "/explorar", search: { q: q || undefined, categoria: categoria || undefined, bairro: bairro || undefined } }); }}
      className={`card-surface grid gap-2 p-2 ${compact ? "" : "md:grid-cols-[1.6fr_1fr_1fr_auto]"}`}
      role="search"
    >
      <label className="relative">
        <span className="sr-only">O que você está procurando?</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="O que você está procurando em Maricá?" className="field border-transparent pl-9" />
      </label>
      <label>
        <span className="sr-only">Categoria</span>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="field">
          <option value="">Todas as categorias</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </label>
      <label>
        <span className="sr-only">Bairro</span>
        <select value={bairro} onChange={(e) => setBairro(e.target.value)} className="field">
          <option value="">Todos os bairros</option>
          {neighborhoods.map((n) => <option key={n}>{n}</option>)}
        </select>
      </label>
      <button type="submit" className="btn btn-primary h-[2.875rem] rounded-lg">Encontrar produtos</button>
    </form>
  );
}

function Home() {
  const database = useMockDatabase();
  const visibleProducts = database.products.filter((product) => product.active !== false);
  return (
    <Page>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-page grid items-center gap-10 py-10 md:py-16 lg:grid-cols-[1.05fr_1fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-medium text-accent-foreground">
              <HeartHandshake className="h-4 w-4" aria-hidden /> Comércio local de Maricá
            </span>
            <h1 className="text-4xl font-extrabold leading-[1.05] text-secondary sm:text-5xl lg:text-6xl">
              Maricá cresce quando seus negócios são <span className="text-primary">valorizados.</span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Descubra produtos, conheça empreendedores e fortaleça a economia local de Maricá.
            </p>
            <p className="flex max-w-xl items-start gap-2 border-l-2 border-primary pl-3 text-sm text-muted-foreground">
              Uma proposta digital para aproximar moradores e empreendedores e fortalecer o comércio local.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rotate-2 rounded-[2rem] bg-primary-soft" aria-hidden />
            <img src={hero} alt="Artesã organizando produtos locais em uma banca à beira-mar" width={1280} height={1024} className="aspect-[5/4] w-full rounded-3xl object-cover shadow-[var(--shadow-lift)]" />
            <div className="card-surface absolute -bottom-5 left-5 flex items-center gap-3 px-4 py-3">
              <Coins className="h-6 w-6 text-sun" aria-hidden />
              <div className="text-sm"><p className="font-semibold">Aceita Mumbuca?</p><p className="text-muted-foreground">Veja no perfil do vendedor</p></div>
            </div>
          </div>
        </div>
        <div className="container-page pb-6"><SearchBar /></div>
      </section>

      {/* Categorias */}
      <section className="container-page mt-16">
        <SectionTitle eyebrow="Categorias" title="Encontre o que Maricá produz" action={<Link to="/categorias" className="btn btn-ghost text-primary">Ver todas <ArrowRight className="h-4 w-4" /></Link>} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((c) => {
            const Icon = categoryIcons[c.icon];
            return (
              <Link key={c.slug} to="/explorar" search={{ categoria: c.slug }} className="card-surface group flex flex-col gap-3 p-4 transition hover:border-primary">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="h-5 w-5" aria-hidden /></span>
                <span className="font-medium leading-snug">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Destaques */}
      <section className="container-page mt-20">
        <SectionTitle eyebrow="Em destaque" title="Produtos de quem faz Maricá" desc="Anúncios e vendedores fictícios, criados apenas para demonstração do protótipo." action={<Link to="/explorar" className="btn btn-ghost text-primary">Explorar tudo <ArrowRight className="h-4 w-4" /></Link>} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {visibleProducts.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Leilões */}
      <section className="container-page mt-20">
        <SectionTitle eyebrow="Leilões" title="Dispute produtos em leilão" desc="Lance em tempo real em produtos dos empreendedores locais de Maricá." action={<Link to="/leiloes" className="btn btn-ghost text-primary">Ver leilões <ArrowRight className="h-4 w-4" /></Link>} />
        <div className="rounded-2xl bg-secondary-soft p-8 text-center">
          <Gavel className="mx-auto h-12 w-12 text-primary opacity-70" aria-hidden />
          <p className="mt-4 text-muted-foreground">Leilões demonstrativos disponíveis com lances simulados.</p>
          <Link to="/leiloes" className="btn btn-primary mt-4">Ver leilões ativos</Link>
        </div>
      </section>

      {/* Negócios */}
      <section className="container-page mt-20">
        <SectionTitle eyebrow="Negócios locais" title="Descubra os negócios de Maricá" desc="Perfis demonstrativos de empreendedores, artesãos e produtores." action={<Link to="/negocios" className="btn btn-ghost text-primary">Ver negócios <ArrowRight className="h-4 w-4" /></Link>} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {database.sellers.slice(0, 3).map((s) => <SellerCard key={s.id} seller={s} />)}
        </div>
      </section>

      {/* Mumbuca */}
      <section className="container-page mt-20">
        <div className="grid gap-8 overflow-hidden rounded-3xl bg-sun-soft p-8 md:grid-cols-[auto_1fr] md:p-12">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-sun text-foreground"><Coins className="h-8 w-8" aria-hidden /></span>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-secondary">Economia local e Mumbuca</h2>
            <p className="max-w-3xl text-muted-foreground">
              A Mumbuca é a moeda social utilizada em Maricá. O MaricáMais busca facilitar a descoberta de negócios locais e tornar visível, de forma informativa, quais vendedores declaram aceitar essa forma de pagamento.
            </p>
            <div className="flex items-start gap-2 rounded-xl bg-card p-4 text-sm">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
              <p>O selo <strong>“Aceita Mumbuca”</strong> indica apenas uma informação declarada pelo vendedor. O site não processa pagamentos, não possui integração financeira e não realiza transações.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="container-page mt-20">
        <SectionTitle eyebrow="Como funciona" title="Uma vitrine simples, em três passos" />
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Store, t: "O empreendedor divulga", d: "Cadastra o negócio e publica seus produtos na plataforma." },
            { icon: SearchCheck, t: "O morador descobre", d: "Pesquisa, compara opções e conhece negócios do seu bairro." },
            { icon: MessagesSquare, t: "Contato direto", d: "Comprador e vendedor conversam diretamente para combinar a negociação." },
          ].map((s, i) => (
            <li key={s.t} className="card-surface relative p-6">
              <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-primary-soft">{i + 1}</span>
              <s.icon className="h-8 w-8 text-primary" aria-hidden />
              <h3 className="mt-4 text-xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-muted-foreground">O MaricáMais funciona como vitrine digital: não processa pagamentos nem organiza entregas.</p>
      </section>

      {/* Impacto */}
      <section className="mt-20 bg-secondary py-16 text-secondary-foreground">
        <div className="container-page">
          <h2 className="max-w-2xl text-3xl font-bold md:text-4xl">Mais visibilidade para quem movimenta Maricá</h2>
          <p className="mt-3 max-w-2xl opacity-80">Objetivos pretendidos pelo projeto:</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Megaphone, t: "Ampliar a presença digital dos pequenos negócios" },
              { icon: Compass, t: "Facilitar a descoberta de produtos e serviços locais" },
              { icon: Handshake, t: "Aproximar moradores e empreendedores" },
              { icon: HeartHandshake, t: "Incentivar a valorização da economia do município" },
            ].map((o) => (
              <div key={o.t} className="rounded-2xl border border-secondary-foreground/15 bg-secondary-foreground/5 p-6">
                <o.icon className="h-7 w-7 text-sun" aria-hidden />
                <p className="mt-4 font-medium leading-snug">{o.t}</p>
              </div>
            ))}
          </div>
          <Link to="/cadastro" className="btn btn-primary mt-10">Divulgue seu negócio <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </Page>
  );
}
