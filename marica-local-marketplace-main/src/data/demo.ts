import bolo from "@/assets/p-bolo.jpg";
import artesanato from "@/assets/p-artesanato.jpg";
import plantas from "@/assets/p-plantas.jpg";
import moda from "@/assets/p-moda.jpg";
import celular from "@/assets/p-celular.jpg";
import decor from "@/assets/p-decor.jpg";

export type Mumbuca = "sim" | "nao" | "nao-informado";

export const categories = [
  { slug: "alimentacao", name: "Alimentação", icon: "UtensilsCrossed" },
  { slug: "artesanato", name: "Artesanato", icon: "Palette" },
  { slug: "moda", name: "Moda e acessórios", icon: "Shirt" },
  { slug: "beleza", name: "Beleza e cuidados pessoais", icon: "Sparkles" },
  { slug: "casa", name: "Casa e decoração", icon: "Lamp" },
  { slug: "agricultura", name: "Agricultura e produtos rurais", icon: "Sprout" },
  { slug: "servicos", name: "Serviços locais", icon: "Wrench" },
  { slug: "outros", name: "Outros produtos", icon: "Package" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export const neighborhoods = [
  "Centro", "Itaipuaçu", "Inoã", "Ponta Negra", "São José do Imbassaí", "Barra de Maricá", "Flamengo", "Araçatiba",
];

export interface Seller {
  id: string;
  name: string;
  owner: string;
  contact?: string;
  category: CategorySlug;
  neighborhood: string;
  description: string;
  mumbuca: Mumbuca;
  initials: string;
  tone: "primary" | "secondary" | "sun";
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategorySlug;
  sellerId: string;
  image: string;
  availability: string;
  createdAt: string;
  active?: boolean;
}

export const sellers: Seller[] = [
  { id: "doces-da-vila", name: "Doces da Vila (demo)", owner: "Responsável fictícia", category: "alimentacao", neighborhood: "Centro", description: "Bolos caseiros, brigadeiros e doces para festas feitos sob encomenda.", mumbuca: "sim", initials: "DV", tone: "sun" },
  { id: "tramas-do-litoral", name: "Tramas do Litoral (demo)", owner: "Responsável fictício", category: "artesanato", neighborhood: "Itaipuaçu", description: "Cestaria em fibra natural e macramê produzidos à mão.", mumbuca: "sim", initials: "TL", tone: "primary" },
  { id: "sitio-verde", name: "Sítio Verde (demo)", owner: "Responsável fictício", category: "agricultura", neighborhood: "São José do Imbassaí", description: "Mudas, ervas e hortaliças de pequena produção rural.", mumbuca: "nao-informado", initials: "SV", tone: "primary" },
  { id: "mare-moda", name: "Maré Moda (demo)", owner: "Responsável fictícia", category: "moda", neighborhood: "Ponta Negra", description: "Peças leves de verão e bijuterias artesanais.", mumbuca: "nao", initials: "MM", tone: "secondary" },
  { id: "conecta-cel", name: "Conecta Cel (demo)", owner: "Responsável fictício", category: "outros", neighborhood: "Inoã", description: "Capinhas, cabos e acessórios para celular.", mumbuca: "sim", initials: "CC", tone: "secondary" },
  { id: "casa-argila", name: "Casa Argila (demo)", owner: "Responsável fictícia", category: "casa", neighborhood: "Barra de Maricá", description: "Vasos em cerâmica e velas aromáticas feitas em pequenos lotes.", mumbuca: "nao-informado", initials: "CA", tone: "sun" },
];

export const products: Product[] = [
  { id: "bolo-chocolate", name: "Bolo de chocolate artesanal", description: "Bolo de chocolate com cobertura de ganache, aproximadamente 1,5 kg. Feito sob encomenda.", price: 85, category: "alimentacao", sellerId: "doces-da-vila", image: bolo, availability: "Sob encomenda, 2 dias de antecedência", createdAt: "2026-10-10" },
  { id: "brigadeiros", name: "Caixa com 25 brigadeiros", description: "Brigadeiros tradicionais enrolados à mão, ideais para festas.", price: 45, category: "alimentacao", sellerId: "doces-da-vila", image: bolo, availability: "Pronta entrega aos sábados", createdAt: "2026-10-12" },
  { id: "cesto-fibra", name: "Cesto em fibra natural", description: "Cesto trançado à mão com alças, 30 cm de diâmetro.", price: 120, category: "artesanato", sellerId: "tramas-do-litoral", image: artesanato, availability: "3 unidades disponíveis", createdAt: "2026-10-08" },
  { id: "macrame", name: "Painel de macramê", description: "Peça decorativa em algodão cru com aro de madeira.", price: 95, category: "artesanato", sellerId: "tramas-do-litoral", image: artesanato, availability: "Pronta entrega", createdAt: "2026-10-14" },
  { id: "kit-mudas", name: "Kit de mudas e suculentas", description: "Kit com 4 vasos de suculentas e mudas de ervas aromáticas.", price: 38, category: "agricultura", sellerId: "sitio-verde", image: plantas, availability: "Disponível às sextas", createdAt: "2026-10-11" },
  { id: "cesta-hortalicas", name: "Cesta de hortaliças da semana", description: "Seleção de hortaliças da estação, variando conforme a colheita.", price: 55, category: "agricultura", sellerId: "sitio-verde", image: plantas, availability: "Semanal, sob reserva", createdAt: "2026-10-13" },
  { id: "vestido-praia", name: "Vestido leve estampado", description: "Vestido em viscose com amarração na cintura. Tamanhos P ao G.", price: 139, category: "moda", sellerId: "mare-moda", image: moda, availability: "Tamanhos P, M e G", createdAt: "2026-10-09" },
  { id: "pulseiras", name: "Trio de pulseiras de miçangas", description: "Pulseiras artesanais com pingentes, cores variadas.", price: 32, category: "moda", sellerId: "mare-moda", image: moda, availability: "Pronta entrega", createdAt: "2026-10-15" },
  { id: "capinhas", name: "Capinha de silicone colorida", description: "Capinhas para diversos modelos. Consulte disponibilidade.", price: 29.9, category: "outros", sellerId: "conecta-cel", image: celular, availability: "Consulte modelos", createdAt: "2026-10-07" },
  { id: "cabo-usbc", name: "Cabo USB-C trançado", description: "Cabo reforçado de 1,2 m, várias cores.", price: 24.9, category: "outros", sellerId: "conecta-cel", image: celular, availability: "Pronta entrega", createdAt: "2026-10-12" },
  { id: "vaso-ceramica", name: "Vaso de cerâmica texturizado", description: "Vaso em cerâmica artesanal, acabamento fosco, 22 cm.", price: 78, category: "casa", sellerId: "casa-argila", image: decor, availability: "2 unidades", createdAt: "2026-10-06" },
  { id: "vela-aromatica", name: "Vela aromática de soja", description: "Vela em pote de vidro, cera de soja, aroma de lavanda.", price: 42, category: "casa", sellerId: "casa-argila", image: decor, availability: "Pronta entrega", createdAt: "2026-10-14" },
];

export const getSeller = (id: string) => sellers.find((s) => s.id === id);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const formatBRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
