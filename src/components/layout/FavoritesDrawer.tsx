import * as React from "react";
import { X } from "lucide-react";
import { useStore } from "@/lib/store";
import { products } from "@/data/products";
import { ProductImage } from "@/components/brand/ProductImage";
import { brl } from "@/lib/format";

export function FavoritesDrawer() {
  const s = useStore();
  const favs = products.filter((p) => s.favorites.includes(p.id));

  React.useEffect(() => {
    if (!s.favOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && s.setFavOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [s.favOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-carvao/40 backdrop-blur-sm transition-opacity duration-300 ${
          s.favOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => s.setFavOpen(false)}
      />
      <aside
        aria-label="Favoritos"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-marfim shadow-2xl transition-transform duration-300 ${
          s.favOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-rose-claro">
          <h3 className="font-display text-2xl">Favoritos</h3>
          <button aria-label="Fechar" onClick={() => s.setFavOpen(false)}><X /></button>
        </div>
        {favs.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-display text-xl">Sua lista está esperando.</p>
            <p className="mt-2 text-sm text-muted-foreground">Toque no coração das peças que te encantarem.</p>
          </div>
        ) : (
          <ul className="divide-y divide-rose-claro overflow-y-auto" style={{ maxHeight: "calc(100vh - 80px)" }}>
            {favs.map((p) => (
              <li key={p.id} className="flex gap-4 p-6">
                <div className="w-20"><ProductImage duotone={p.duotone} label="" aspect="3/4" /></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-sm text-terracota">{brl(p.price)}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => { s.addToCart({ productId: p.id, qty: 1 }); s.setFavOpen(false); }}
                      className="caps bg-terracota text-marfim px-3 py-2"
                    >
                      Mover para sacola
                    </button>
                    <button onClick={() => s.toggleFav(p.id)} className="caps border border-rose-claro px-3 py-2">
                      Remover
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </>
  );
}
