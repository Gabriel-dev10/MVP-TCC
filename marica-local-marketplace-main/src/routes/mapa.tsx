import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Page } from "@/components/site/Layout";
import { neighborhoods } from "@/data/demo";
import { useMockDatabase } from "@/data/mock-db";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa de negócios locais — MaricáMais" },
      { name: "description", content: "Encontre negócios locais por bairro em Maricá." },
    ],
  }),
  component: Mapa,
});

function Mapa() {
  const { sellers } = useMockDatabase();

  return (
    <Page>
      <div className="container-page py-10">
        <h1 className="text-3xl font-bold text-secondary md:text-4xl">Negócios por bairro</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Explore os vendedores cadastrados por região. Esta visualização é uma lista demonstrativa, sem localização GPS.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {neighborhoods.map((neighborhood) => {
            const count = sellers.filter((seller) => seller.neighborhood === neighborhood).length;
            return (
              <Link
                key={neighborhood}
                to="/explorar"
                search={{ bairro: neighborhood }}
                className="card-surface flex items-center gap-4 p-5 transition hover:border-primary"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <MapPin className="h-6 w-6" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{neighborhood}</span>
                  <span className="text-sm text-muted-foreground">{count} negócio{count === 1 ? "" : "s"}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </Page>
  );
}
