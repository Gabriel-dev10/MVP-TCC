import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Clock, Gavel, ArrowRight, Coins, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Page, SectionTitle } from "@/components/site/Layout";
import { formatBRL } from "@/data/demo";
import { MumbucaBadge } from "@/components/site/Cards";
import { placeBid, useMockDatabase, type Auction } from "@/data/mock-db";

function formatCountdown(endsAt: string): string {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return "Encerrado";
  const h = Math.floor(diff / 1000 / 60 / 60);
  const m = Math.floor((diff / 1000 / 60) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

function LeilaoCard({
  leilao,
  onLance,
}: {
  leilao: Auction;
  onLance: (id: string, valor: number) => void;
}) {
  const { products, sellers } = useMockDatabase();
  const product = products.find((p) => p.id === leilao.productId);
  const seller = product ? sellers.find((entry) => entry.id === product.sellerId) : undefined;
  const [countdown, setCountdown] = useState(() => formatCountdown(leilao.endsAt));
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValor, setInputValor] = useState("");
  const [erroLance, setErroLance] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
    setCountdown(formatCountdown(leilao.endsAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [leilao.endsAt]);

  if (!product || !seller) return null;

  const encerrado = new Date(leilao.endsAt).getTime() <= Date.now();
  const minAceito = leilao.lanceAtual + leilao.lanceMinimo;

  function handleConfirmar() {
    const valor = parseFloat(inputValor.replace(",", "."));
    if (isNaN(valor) || valor < minAceito) {
      setErroLance(`O lance deve ser de pelo menos ${formatBRL(minAceito)}.`);
      return;
    }
    onLance(leilao.id, valor);
    setModalOpen(false);
    setInputValor("");
    setErroLance("");
  }

  return (
    <article className="card-surface overflow-hidden flex flex-col">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {seller.mumbuca === "sim" && (
          <MumbucaBadge value={seller.mumbuca} className="absolute left-3 top-3 shadow-sm" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-lg font-semibold leading-snug">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {seller.name} · {seller.neighborhood}
          </p>
        </div>

        <div className="rounded-lg bg-primary-soft px-4 py-3 text-center">
          <p className="text-xs font-medium text-muted-foreground mb-0.5">Lance atual</p>
          <p className="text-2xl font-bold text-primary">{formatBRL(leilao.lanceAtual)}</p>
          {leilao.ultimoLicitante && (
            <p className="text-xs text-muted-foreground mt-0.5">por {leilao.ultimoLicitante}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg bg-muted px-3 py-2">
            <p className="text-xs text-muted-foreground">Lance mínimo</p>
            <p className="font-semibold">{formatBRL(leilao.lanceMinimo)}</p>
          </div>
          <div className="rounded-lg bg-muted px-3 py-2">
            <p className="text-xs text-muted-foreground">Lances</p>
            <p className="font-semibold flex items-center gap-1">
              <Gavel className="h-3.5 w-3.5" aria-hidden />
              {leilao.totalLances}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
            encerrado ? "bg-muted text-muted-foreground" : "bg-sun-soft text-foreground"
          }`}
        >
          <Clock className="h-4 w-4 shrink-0" aria-hidden />
          <span>{countdown}</span>
        </div>

        <button
          className="btn btn-primary mt-auto"
          disabled={encerrado}
          onClick={() => setModalOpen(true)}
        >
          <Gavel className="h-4 w-4" aria-hidden />
          {encerrado ? "Leilão encerrado" : "Fazer lance (demo)"}
        </button>
      </div>

      {/* Modal de lance */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`modal-title-${leilao.id}`}
        >
          <div className="card-surface w-full max-w-sm space-y-4 p-6">
            <h2 id={`modal-title-${leilao.id}`} className="font-display text-xl font-bold">
              Fazer lance (demo)
            </h2>
            <p className="text-sm text-muted-foreground">
              <strong>{product.name}</strong> — lance mínimo:{" "}
              <strong>{formatBRL(minAceito)}</strong>
            </p>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Seu lance (R$)</span>
              <input
                type="number"
                min={minAceito}
                step="0.01"
                className="field"
                placeholder={`Ex.: ${minAceito}`}
                value={inputValor}
                onChange={(e) => {
                  setInputValor(e.target.value);
                  setErroLance("");
                }}
                autoFocus
              />
            </label>
            {erroLance && (
              <p className="text-sm text-red-600 font-medium">{erroLance}</p>
            )}
            <div className="flex gap-3">
              <button
                className="btn btn-outline flex-1"
                onClick={() => {
                  setModalOpen(false);
                  setInputValor("");
                  setErroLance("");
                }}
              >
                Cancelar
              </button>
              <button className="btn btn-primary flex-1" onClick={handleConfirmar}>
                Confirmar (demo)
              </button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Nenhum lance real é processado — apenas demonstração.
            </p>
          </div>
        </div>
      )}
    </article>
  );
}

export const Route = createFileRoute("/leiloes")({
  head: () => ({
    meta: [
      { title: "Leilões em andamento — MaricáMais" },
      {
        name: "description",
        content:
          "Leilões demonstrativos de produtos locais de Maricá. Protótipo acadêmico.",
      },
      { property: "og:title", content: "Leilões em andamento — MaricáMais" },
    ],
  }),
  component: Leiloes,
});

function Leiloes() {
  const { auctions } = useMockDatabase();

  function handleLance(id: string, valor: number) {
    try {
      placeBid(id, valor);
      toast.success(`Lance de ${formatBRL(valor)} registrado! (demonstração)`);
    } catch (error) {
      console.error("Falha ao registrar lance na base simulada.", error);
      toast.error(error instanceof Error ? error.message : "Não foi possível registrar o lance.");
    }
  }

  return (
    <Page>
      <div className="container-page py-10">
        <SectionTitle
          eyebrow="Demonstração"
          title="Leilões em andamento"
          desc="Leilões demonstrativos de produtos de pequenos negócios locais de Maricá. Os dados são fictícios e nenhum lance real é processado."
        />

        {/* Aviso */}
        <div className="mb-8 rounded-xl bg-sun-soft p-4 flex gap-3 items-start">
          <AlertCircle className="h-5 w-5 text-sun mt-0.5 shrink-0" aria-hidden />
          <p className="text-sm font-medium">
            <strong>Leilões demonstrativos</strong> — Nenhum lance real é processado. Esta
            funcionalidade é parte do protótipo acadêmico.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {auctions.map((l) => (
            <LeilaoCard key={l.id} leilao={l} onLance={handleLance} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/explorar" className="btn btn-outline inline-flex items-center gap-2">
            Ver todos os produtos
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </Page>
  );
}
