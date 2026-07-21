import type { Product } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";

export function CatalogView({
  title, subtitle, items, loading = false,
}: { title: string; subtitle: string; items: Product[]; loading?: boolean }) {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <p className="caps text-terracota">catálogo</p>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">{title}</h1>
        <p className="mt-4 max-w-xl text-grafite/80">{subtitle}</p>

        <div className="mt-8 py-4 border-y border-rose-claro flex items-center justify-between text-sm">
          <span>{loading ? "carregando…" : `${items.length} produtos`}</span>
          <div className="flex gap-4">
            <button className="caps hover:text-terracota">Filtros</button>
            <button className="caps hover:text-terracota">Ordenar ↓</button>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-x-6 gap-y-14 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] rounded-lg bg-porcelana" />
                <div className="mt-4 h-3 w-2/3 bg-porcelana rounded" />
                <div className="mt-2 h-3 w-1/3 bg-porcelana rounded" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-3xl">Nada por aqui — ainda.</p>
            <p className="mt-3 text-muted-foreground">Volte em breve para novidades.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-x-6 gap-y-14 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
