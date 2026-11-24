import { Link } from "@tanstack/react-router";
import { Menu, X, Leaf } from "lucide-react";
import { useState, type ReactNode } from "react";

const nav = [
  { to: "/", label: "Início" },
  { to: "/explorar", label: "Explorar produtos" },
  { to: "/categorias", label: "Categorias" },
  { to: "/negocios", label: "Negócios locais" },
  { to: "/leiloes", label: "Leilões" },
  { to: "/mapa", label: "Mapa" },
  { to: "/sobre", label: "Sobre o projeto" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="MaricáMais, página inicial">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
        <Leaf className="h-5 w-5" aria-hidden />
      </span>
      <span className="font-display text-xl font-bold tracking-tight text-secondary">
        Maricá<span className="text-primary">Mais</span>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              activeProps={{ className: "text-primary bg-primary-soft" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/admin" className="btn btn-ghost text-xs opacity-70">Admin</Link>
          <Link to="/painel" className="btn btn-ghost">Entrar</Link>
          <Link to="/cadastro" className="btn btn-primary">Divulgue seu negócio</Link>
        </div>
        <button className="btn btn-ghost px-3 lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Fechar menu" : "Abrir menu"}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t bg-card lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Menu móvel">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-medium hover:bg-muted">
                {n.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link to="/painel" onClick={() => setOpen(false)} className="btn btn-outline">Entrar</Link>
              <Link to="/cadastro" onClick={() => setOpen(false)} className="btn btn-primary">Divulgar</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const links = [
    { to: "/sobre", label: "Sobre o MaricáMais" },
    { to: "/cadastro", label: "Como divulgar um negócio" },
    { to: "/sobre", hash: "orientacoes", label: "Orientações de uso" },
    { to: "/sobre", hash: "privacidade", label: "Privacidade" },
    { to: "/sobre", hash: "contato", label: "Contato" },
    { to: "/sobre", hash: "academico", label: "Projeto acadêmico" },
  ] as const;
  return (
    <footer className="mt-24 bg-secondary text-secondary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.3fr_2fr]">
        <div className="space-y-4">
          <div className="font-display text-2xl font-bold">Maricá<span className="text-sun">Mais</span></div>
          <p className="max-w-sm text-sm opacity-80">
            Vitrine digital demonstrativa para aproximar moradores e empreendedores e fortalecer o comércio local de Maricá.
          </p>
          <p className="max-w-sm text-xs opacity-60">
            Projeto acadêmico independente. Não é uma plataforma oficial da Prefeitura de Maricá e não possui vínculo institucional.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          {links.map((l) => (
            <li key={l.label}>
              <Link to={l.to} hash={"hash" in l ? l.hash : undefined} className="opacity-80 hover:opacity-100 hover:underline">{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-secondary-foreground/15">
        <div className="container-page py-5 text-xs opacity-60">© 2026 MaricáMais · Protótipo de Projeto Final de Curso · Dados de demonstração</div>
      </div>
    </footer>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function SectionTitle({ eyebrow, title, desc, action }: { eyebrow?: string; title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>}
        <h2 className="text-3xl font-bold text-secondary md:text-4xl">{title}</h2>
        {desc && <p className="mt-3 text-muted-foreground">{desc}</p>}
      </div>
      {action}
    </div>
  );
}
