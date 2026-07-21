import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { useStore } from "@/lib/store";
import { useCatalog } from "@/lib/catalog-store";
import { ProductCard } from "@/components/product/ProductCard";

export const Route = createFileRoute("/favoritos")({
  head: () => ({ meta: [{ title: "Favoritos — Ka Lamour Store" }] }),
  component: FavPage,
});

function FavPage() {
  return (
    <SiteShell>
      <Inner />
    </SiteShell>
  );
}

function Inner() {
  const { favorites } = useStore();
  const { products } = useCatalog();
  const items = products.filter((p) => favorites.includes(p.id));
  return (
    <div className="pt-32 pb-24 mx-auto max-w-[1400px] px-5 md:px-10">
      <p className="caps text-terracota">sua seleção</p>
      <h1 className="mt-3 font-display text-5xl md:text-7xl">Favoritos</h1>
      {items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-3xl">Sua lista está esperando.</p>
          <p className="mt-3 text-muted-foreground">Toque no coração das peças que te encantarem.</p>
          <Link to="/" className="mt-6 inline-block caps bg-terracota text-marfim px-6 py-3">Voltar para a home</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-x-6 gap-y-14 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
