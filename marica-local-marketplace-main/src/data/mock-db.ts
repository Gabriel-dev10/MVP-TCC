import { useEffect, useState } from "react";
import {
  products as demoProducts,
  sellers as demoSellers,
  type CategorySlug,
  type Product,
  type Seller,
} from "@/data/demo";

const storageKey = "maricamais:database:v1";
const changeEvent = "maricamais:database-change";

export interface Auction {
  id: string;
  productId: string;
  lanceMinimo: number;
  lanceAtual: number;
  totalLances: number;
  endsAt: string;
  ultimoLicitante: string | null;
}

export interface ContactMessage {
  id: string;
  productId: string;
  sellerId: string;
  message: string;
  createdAt: string;
}

export interface MockDatabase {
  sellers: Seller[];
  products: Product[];
  auctions: Auction[];
  messages: ContactMessage[];
  activeSellerId: string;
}

export interface NewSeller {
  owner: string;
  name: string;
  description: string;
  category: CategorySlug;
  neighborhood: string;
  contact: string;
  mumbuca: Seller["mumbuca"];
}

export interface NewProduct {
  name: string;
  description: string;
  price: number;
  category: CategorySlug;
  availability: string;
}

function createSeedDatabase(): MockDatabase {
  const now = Date.now();
  return {
    sellers: demoSellers.map((seller) => ({ ...seller })),
    products: demoProducts.map((product) => ({ ...product })),
    activeSellerId: demoSellers[0]?.id ?? "",
    messages: [],
    auctions: [
      { id: "l1", productId: "cesto-fibra", lanceMinimo: 80, lanceAtual: 150, totalLances: 4, endsAt: new Date(now + 23 * 60 * 60 * 1000).toISOString(), ultimoLicitante: "M.S." },
      { id: "l2", productId: "vaso-ceramica", lanceMinimo: 50, lanceAtual: 92, totalLances: 2, endsAt: new Date(now + 5 * 60 * 60 * 1000).toISOString(), ultimoLicitante: "R.F." },
      { id: "l3", productId: "macrame", lanceMinimo: 60, lanceAtual: 60, totalLances: 0, endsAt: new Date(now + 48 * 60 * 60 * 1000).toISOString(), ultimoLicitante: null },
    ],
  };
}

const initialDatabase = createSeedDatabase();

function readStoredDatabase(): MockDatabase | undefined {
  if (typeof window === "undefined") return undefined;
  const stored = window.localStorage.getItem(storageKey);
  if (!stored) return undefined;

  const value: unknown = JSON.parse(stored);
  if (
    typeof value !== "object" ||
    value === null ||
    !("sellers" in value) ||
    !Array.isArray(value.sellers) ||
    !("products" in value) ||
    !Array.isArray(value.products) ||
    !("auctions" in value) ||
    !Array.isArray(value.auctions) ||
    !("messages" in value) ||
    !Array.isArray(value.messages) ||
    !("activeSellerId" in value) ||
    typeof value.activeSellerId !== "string"
  ) {
    throw new Error("Os dados locais do MaricáMais estão inválidos. Limpe os dados do site para reiniciar a demonstração.");
  }
  return value as MockDatabase;
}

function persist(database: MockDatabase): void {
  if (typeof window === "undefined") {
    throw new Error("A base simulada só pode ser alterada no navegador.");
  }
  window.localStorage.setItem(storageKey, JSON.stringify(database));
  window.dispatchEvent(new Event(changeEvent));
}

function updateDatabase(update: (database: MockDatabase) => MockDatabase): void {
  persist(update(readStoredDatabase() ?? initialDatabase));
}

export function useMockDatabase(): MockDatabase {
  const [database, setDatabase] = useState(initialDatabase);

  useEffect(() => {
    const refresh = () => setDatabase(readStoredDatabase() ?? initialDatabase);
    refresh();
    window.addEventListener(changeEvent, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(changeEvent, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return database;
}

export function createSeller(input: NewSeller): Seller {
  const id = `${input.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;
  const seller: Seller = {
    ...input,
    id,
    initials: input.name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join(""),
    tone: "primary",
  };
  updateDatabase((database) => ({
    ...database,
    sellers: [...database.sellers, seller],
    activeSellerId: seller.id,
  }));
  return seller;
}

export function setActiveSeller(activeSellerId: string): void {
  updateDatabase((database) => ({ ...database, activeSellerId }));
}

export function createProduct(sellerId: string, input: NewProduct): Product {
  const seller = (readStoredDatabase() ?? initialDatabase).sellers.find((entry) => entry.id === sellerId);
  if (!seller) throw new Error("Não foi possível encontrar o negócio selecionado.");
  const fallbackImage = demoProducts.find((product) => product.category === input.category)?.image ?? demoProducts[0]!.image;
  const product: Product = {
    ...input,
    id: `produto-${Date.now().toString(36)}`,
    sellerId,
    image: fallbackImage,
    createdAt: new Date().toISOString().slice(0, 10),
    active: true,
  };
  updateDatabase((database) => ({ ...database, products: [...database.products, product] }));
  return product;
}

export function updateProduct(productId: string, changes: Pick<Product, "name" | "price">): void {
  updateDatabase((database) => ({
    ...database,
    products: database.products.map((product) => product.id === productId ? { ...product, ...changes } : product),
  }));
}

export function toggleProduct(productId: string): void {
  updateDatabase((database) => ({
    ...database,
    products: database.products.map((product) => product.id === productId ? { ...product, active: product.active === false } : product),
  }));
}

export function saveContactMessage(input: Omit<ContactMessage, "id" | "createdAt">): void {
  const message: ContactMessage = {
    ...input,
    id: `mensagem-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };
  updateDatabase((database) => ({ ...database, messages: [...database.messages, message] }));
}

export function placeBid(auctionId: string, amount: number): void {
  updateDatabase((database) => {
    const auction = database.auctions.find((entry) => entry.id === auctionId);
    if (!auction) throw new Error("Leilão não encontrado.");
    if (new Date(auction.endsAt).getTime() <= Date.now()) throw new Error("Este leilão já foi encerrado.");
    if (!Number.isFinite(amount) || amount < auction.lanceAtual + auction.lanceMinimo) {
      throw new Error(`O lance mínimo é de R$ ${(auction.lanceAtual + auction.lanceMinimo).toFixed(2)}.`);
    }
    return {
      ...database,
      auctions: database.auctions.map((entry) => entry.id === auctionId
        ? { ...entry, lanceAtual: amount, totalLances: entry.totalLances + 1, ultimoLicitante: "Você" }
        : entry),
    };
  });
}
