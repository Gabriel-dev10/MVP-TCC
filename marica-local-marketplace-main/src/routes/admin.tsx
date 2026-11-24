import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Shield,
  AlertTriangle,
  Users,
  Package,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
} from "lucide-react";
import { Page } from "@/components/site/Layout";
import { sellers, products, formatBRL } from "@/data/demo";

type DenunciaStatus = "pendente" | "analisada" | "resolvida";

interface Denuncia {
  id: string;
  anuncio: string;
  denunciante: string;
  motivo: string;
  status: DenunciaStatus;
  createdAt: string;
}

const denunciasDemo: Denuncia[] = [
  {
    id: "d1",
    anuncio: "Bolo de chocolate artesanal",
    denunciante: "usuario_anonimo",
    motivo: "Preço incorreto",
    status: "pendente",
    createdAt: "2026-11-15",
  },
  {
    id: "d2",
    anuncio: "Capinha de silicone colorida",
    denunciante: "usuario_anonimo",
    motivo: "Produto não disponível",
    status: "pendente",
    createdAt: "2026-11-16",
  },
  {
    id: "d3",
    anuncio: "Kit de mudas e suculentas",
    denunciante: "usuario_anonimo",
    motivo: "Informação enganosa",
    status: "analisada",
    createdAt: "2026-11-10",
  },
];

type Tab = "denuncias" | "usuarios" | "anuncios";

const statusBadge: Record<DenunciaStatus, { label: string; className: string }> = {
  pendente: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
  analisada: { label: "Analisada", className: "bg-blue-100 text-blue-800" },
  resolvida: { label: "Resolvida", className: "bg-green-100 text-green-800" },
};

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel Admin (Demo) — MaricáMais" },
      {
        name: "description",
        content: "Painel administrativo demonstrativo do MaricáMais. Sem autenticação real.",
      },
    ],
  }),
  component: Admin,
});

function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>("denuncias");
  const [denuncias, setDenuncias] = useState<Denuncia[]>(denunciasDemo);
  const [visibleProducts, setVisibleProducts] = useState(products.map((p) => p.id));

  const pendentes = denuncias.filter((d) => d.status === "pendente").length;

  function marcarAnalisada(id: string) {
    setDenuncias((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "analisada" as DenunciaStatus } : d))
    );
    toast.info("Denúncia marcada como analisada. (demo)");
  }

  function resolver(id: string) {
    setDenuncias((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "resolvida" as DenunciaStatus } : d))
    );
    toast.success("Denúncia resolvida! (demo)");
  }

  function suspenderUsuario(nome: string) {
    toast.warning(`Vendedor "${nome}" suspenso (demonstração — nenhuma ação real).`);
  }

  function ocultarProduto(id: string, nome: string) {
    setVisibleProducts((prev) => prev.filter((pid) => pid !== id));
    toast.success(`Anúncio "${nome}" ocultado (demonstração).`);
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: "denuncias",
      label: `Denúncias${pendentes > 0 ? ` (${pendentes})` : ""}`,
      icon: <AlertTriangle className="h-4 w-4" aria-hidden />,
    },
    {
      key: "usuarios",
      label: "Usuários",
      icon: <Users className="h-4 w-4" aria-hidden />,
    },
    {
      key: "anuncios",
      label: "Anúncios",
      icon: <Package className="h-4 w-4" aria-hidden />,
    },
  ];

  return (
    <Page>
      <div className="container-page py-10">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Shield className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold text-secondary md:text-3xl">
                Painel Administrativo
              </h1>
              <p className="text-sm text-muted-foreground">
                (Demonstrativo — sem autenticação real)
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
            Acesso demo
          </span>
        </div>

        {/* Aviso */}
        <div className="mb-8 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          <strong>Atenção:</strong> Este painel é puramente demonstrativo. Nenhuma ação aqui
          produz efeitos reais. Os dados são fictícios e fazem parte do protótipo acadêmico.
        </div>

        {/* Abas */}
        <div className="mb-8 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`btn inline-flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "btn-outline"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Aba Denúncias */}
        {activeTab === "denuncias" && (
          <section>
            <h2 className="mb-4 text-xl font-bold">
              Denúncias{" "}
              {pendentes > 0 && (
                <span className="ml-2 rounded-full bg-yellow-100 px-2.5 py-0.5 text-sm font-semibold text-yellow-800">
                  {pendentes} pendente{pendentes > 1 ? "s" : ""}
                </span>
              )}
            </h2>
            <div className="space-y-4">
              {denuncias.map((d) => {
                const badge = statusBadge[d.status];
                return (
                  <div key={d.id} className="card-surface flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 space-y-1">
                      <p className="font-semibold">{d.anuncio}</p>
                      <p className="text-sm text-muted-foreground">
                        Motivo: {d.motivo} · Data: {d.createdAt}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Denunciante: {d.denunciante}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      {d.status === "pendente" && (
                        <button
                          className="btn btn-outline text-xs"
                          onClick={() => marcarAnalisada(d.id)}
                        >
                          <Eye className="h-3.5 w-3.5" aria-hidden />
                          Marcar analisada
                        </button>
                      )}
                      {d.status !== "resolvida" && (
                        <button
                          className="btn btn-primary text-xs"
                          onClick={() => resolver(d.id)}
                        >
                          <CheckCircle className="h-3.5 w-3.5" aria-hidden />
                          Resolver
                        </button>
                      )}
                      {d.status === "resolvida" && (
                        <span className="flex items-center gap-1 text-xs text-green-700 font-medium">
                          <CheckCircle className="h-4 w-4" aria-hidden />
                          Resolvida
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Aba Usuários */}
        {activeTab === "usuarios" && (
          <section>
            <h2 className="mb-4 text-xl font-bold">
              Usuários / Vendedores
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({sellers.length} cadastrados)
              </span>
            </h2>
            <div className="space-y-4">
              {sellers.map((s) => (
                <div
                  key={s.id}
                  className="card-surface flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft font-bold text-primary text-sm">
                      {s.initials}
                    </span>
                    <div className="space-y-0.5">
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {s.neighborhood}
                        {s.mumbuca === "sim" && (
                          <span className="ml-2 rounded-full bg-sun-soft px-2 py-0.5 text-xs font-semibold">
                            Aceita Mumbuca
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    className="btn btn-outline text-xs text-orange-700 border-orange-200 hover:bg-orange-50"
                    onClick={() => suspenderUsuario(s.name)}
                  >
                    <Ban className="h-3.5 w-3.5" aria-hidden />
                    Suspender (demo)
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Aba Anúncios */}
        {activeTab === "anuncios" && (
          <section>
            <h2 className="mb-4 text-xl font-bold">
              Anúncios
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({visibleProducts.length} visíveis)
              </span>
            </h2>
            <div className="space-y-4">
              {products
                .filter((p) => visibleProducts.includes(p.id))
                .map((p) => {
                  const seller = sellers.find((s) => s.id === p.sellerId);
                  return (
                    <div
                      key={p.id}
                      className="card-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-12 w-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{p.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatBRL(p.price)} · {seller?.name ?? p.sellerId}
                          </p>
                        </div>
                      </div>
                      <button
                        className="btn btn-outline text-xs text-red-700 border-red-200 hover:bg-red-50 shrink-0"
                        onClick={() => ocultarProduto(p.id, p.name)}
                      >
                        <XCircle className="h-3.5 w-3.5" aria-hidden />
                        Ocultar (demo)
                      </button>
                    </div>
                  );
                })}
              {visibleProducts.length === 0 && (
                <div className="card-surface py-16 text-center text-muted-foreground">
                  <Package className="mx-auto h-10 w-10 mb-3 opacity-30" aria-hidden />
                  <p>Todos os anúncios foram ocultados (demonstração).</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </Page>
  );
}
