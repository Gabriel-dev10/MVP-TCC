import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/site/Layout";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o projeto — MaricáMais" },
      { name: "description", content: "Conheça a proposta acadêmica do MaricáMais para o comércio local de Maricá." },
      { property: "og:title", content: "Sobre o projeto — MaricáMais" },
      { property: "og:description", content: "Proposta acadêmica de vitrine digital para Maricá." },
    ],
  }),
  component: Sobre,
});

const blocks = [
  { id: "sobre", t: "Sobre o MaricáMais", d: "Vitrine digital que busca ampliar a visibilidade de microempreendedores, artesãos, produtores rurais e pequenos comerciantes de Maricá, aproximando-os dos moradores." },
  { id: "orientacoes", t: "Orientações de uso", d: "Pesquise produtos, filtre por categoria e bairro e entre em contato diretamente com o vendedor. O site não processa pagamentos nem organiza entregas." },
  { id: "privacidade", t: "Privacidade", d: "Neste protótipo, todos os dados são fictícios e ficam apenas no seu navegador. Nenhuma informação pessoal é coletada ou armazenada." },
  { id: "contato", t: "Contato", d: "Canal de contato a ser definido pela equipe do projeto acadêmico." },
  { id: "academico", t: "Projeto acadêmico", d: "Projeto Final de Curso de Engenharia de Software, independente. Não é uma plataforma oficial da Prefeitura de Maricá e não possui parcerias públicas. A informação sobre Mumbuca é apenas declarativa." },
];

function Sobre() {
  return (
    <Page>
      <div className="container-page max-w-3xl py-10">
        <h1 className="text-3xl font-bold text-secondary md:text-4xl">Sobre o projeto</h1>
        <div className="mt-8 space-y-4">
          {blocks.map((b) => (
            <section key={b.id} id={b.id} className="card-surface scroll-mt-24 p-6">
              <h2 className="text-xl font-semibold">{b.t}</h2>
              <p className="mt-2 text-muted-foreground">{b.d}</p>
            </section>
          ))}
        </div>
      </div>
    </Page>
  );
}
