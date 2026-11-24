import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/site/Layout";
import { categoryIcons } from "@/components/site/Cards";
import { categories } from "@/data/demo";
import { useMockDatabase } from "@/data/mock-db";

export const Route = createFileRoute("/categorias")({
  head: () => ({
    meta: [
      { title: "Categorias — MaricáMais" },
      { name: "description", content: "Navegue pelas categorias de produtos e serviços locais de Maricá." },
      { property: "og:title", content: "Categorias — MaricáMais" },
      { property: "og:description", content: "Categorias de produtos e serviços locais de Maricá." },
    ],
  }),
  component: Categorias,
});

function Categorias() {
  const { products } = useMockDatabase();
  return (
    <Page>
      <div className="container-page py-10">
        <h1 className="text-3xl font-bold text-secondary md:text-4xl">Categorias</h1>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c) => {
            const Icon = categoryIcons[c.icon];
            const n = products.filter((p) => p.category === c.slug && p.active !== false).length;
            return (
              <Link key={c.slug} to="/explorar" search={{ categoria: c.slug }} className="card-surface flex flex-col gap-3 p-5 hover:border-primary">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary"><Icon className="h-6 w-6" /></span>
                <span className="font-semibold">{c.name}</span>
                <span className="text-sm text-muted-foreground">{n} anúncios</span>
              </Link>
            );
          })}
        </div>
      </div>
    </Page>
  );
}
