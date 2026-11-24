import { Link } from "@tanstack/react-router";
import { MapPin, Coins, Package, UtensilsCrossed, Palette, Shirt, Sparkles, Lamp, Sprout, Wrench } from "lucide-react";
import { formatBRL, getCategory, getSeller, products, type Product, type Seller, type Mumbuca } from "@/data/demo";
import { cn } from "@/lib/utils";
import { useMockDatabase } from "@/data/mock-db";

export const categoryIcons = { UtensilsCrossed, Palette, Shirt, Sparkles, Lamp, Sprout, Wrench, Package };

export function MumbucaBadge({ value, className }: { value: Mumbuca; className?: string }) {
  if (value !== "sim") return null;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-sun-soft px-2.5 py-1 text-xs font-semibold text-foreground", className)}
      title="Informação declarada pelo vendedor. O site não processa pagamentos.">
      <Coins className="h-3.5 w-3.5 text-sun" aria-hidden /> Aceita Mumbuca
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { sellers } = useMockDatabase();
  const seller = sellers.find((entry) => entry.id === product.sellerId) ?? getSeller(product.sellerId);
  if (!seller) return null;
  return (
    <article className="card-surface group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img src={product.image} alt={product.name} loading="lazy" width={816} height={816} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <MumbucaBadge value={seller.mumbuca} className="absolute left-3 top-3 shadow-sm" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium text-muted-foreground">{getCategory(product.category)?.name}</p>
        <h3 className="font-display text-lg font-semibold leading-snug text-foreground">{product.name}</h3>
        <p className="text-xl font-bold text-primary">{formatBRL(product.price)}</p>
        <div className="mt-auto space-y-0.5 pt-1 text-sm text-muted-foreground">
          <p className="truncate">{seller.name}</p>
          <p className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" aria-hidden />{seller.neighborhood}</p>
        </div>
        <Link to="/anuncio/$id" params={{ id: product.id }} className="btn btn-outline mt-3 h-10 w-full">Ver anúncio</Link>
      </div>
    </article>
  );
}

const toneClass = { primary: "bg-primary-soft text-accent-foreground", secondary: "bg-secondary-soft text-secondary", sun: "bg-sun-soft text-foreground" };

export function SellerAvatar({ seller, size = "md" }: { seller: Seller; size?: "md" | "lg" }) {
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-2xl font-display font-bold", toneClass[seller.tone], size === "lg" ? "h-16 w-16 text-xl" : "h-12 w-12")}>
      {seller.initials}
    </span>
  );
}

export function SellerCard({ seller }: { seller: Seller }) {
  const { products: allProducts } = useMockDatabase();
  const count = allProducts.filter((product) => product.sellerId === seller.id && product.active !== false).length;
  return (
    <article className="card-surface flex flex-col gap-4 p-5">
      <div className="flex items-start gap-3">
        <SellerAvatar seller={seller} />
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold">{seller.name}</h3>
          <p className="text-sm text-muted-foreground">{getCategory(seller.category)?.name} · {seller.neighborhood}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{seller.description}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium">{count} produtos publicados</span>
        <MumbucaBadge value={seller.mumbuca} />
      </div>
      <Link to="/explorar" search={{ vendedor: seller.id }} className="btn btn-outline h-10">Ver produtos</Link>
    </article>
  );
}

export function DemoNote({ children }: { children: React.ReactNode }) {
  return <p className="rounded-lg border border-dashed bg-muted px-3 py-2 text-xs text-muted-foreground">{children}</p>;
}
