import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/site/Layout";
import { SellerCard } from "@/components/site/Cards";
import { useMockDatabase } from "@/data/mock-db";

export const Route = createFileRoute("/negocios")({
  head: () => ({
    meta: [
      { title: "Negócios locais — MaricáMais" },
      { name: "description", content: "Conheça perfis de empreendedores, artesãos e produtores de Maricá." },
      { property: "og:title", content: "Negócios locais — MaricáMais" },
      { property: "og:description", content: "Perfis de pequenos negócios de Maricá." },
    ],
  }),
  component: Negocios,
});

function Negocios() {
  const { sellers: allSellers } = useMockDatabase();
  return (
    <Page>
      <div className="container-page py-10">
        <h1 className="text-3xl font-bold text-secondary md:text-4xl">Negócios locais</h1>
        <p className="mt-2 text-muted-foreground">Perfis fictícios, criados apenas para demonstração.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allSellers.map((s) => <SellerCard key={s.id} seller={s} />)}
        </div>
      </div>
    </Page>
  );
}
