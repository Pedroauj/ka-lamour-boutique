import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { ProductImage } from "@/components/brand/ProductImage";
import { brl, pix, parcelas } from "@/lib/format";
import { useStore } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const s = useStore();
  const fav = s.favorites.includes(product.id);
  const [size, setSize] = React.useState(product.sizes?.[0]);
  const [quickOpen, setQuickOpen] = React.useState(false);
  const [pulse, setPulse] = React.useState(false);
  const off = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setQuickOpen(true)}
      onMouseLeave={() => setQuickOpen(false)}
    >
      <Link to="/produto/$id" params={{ id: product.slug }} className="block">
        <div className="relative">
          <ProductImage duotone={product.duotone} label={product.imageLabel} aspect="3/4" outline className="group-hover:-translate-y-1.5" />
          {/* badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && <span className="caps bg-terracota text-marfim px-2 py-1">Novo</span>}
            {off > 0 && <span className="caps bg-carvao text-marfim px-2 py-1">-{off}%</span>}
            {product.soldOut && <span className="caps bg-grafite text-marfim px-2 py-1">Esgotado</span>}
          </div>
          <button
            aria-label={fav ? "Remover dos favoritos" : "Favoritar"}
            onClick={(e) => {
              e.preventDefault();
              s.toggleFav(product.id);
              toast(fav ? "Removido dos favoritos" : "Adicionado aos favoritos ✦");
              if (!fav) { setPulse(true); setTimeout(() => setPulse(false), 500); }
            }}
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-marfim/90 backdrop-blur flex items-center justify-center hover:bg-marfim"
          >
            <Heart className={`h-4 w-4 ${fav ? "fill-terracota text-terracota" : "text-grafite"} ${pulse ? "animate-heart-pulse" : ""}`} />
          </button>
          {/* Quick shop */}
          {quickOpen && !product.soldOut && product.sizes && product.sizes.length > 1 && (
            <div className="absolute bottom-3 left-3 right-3 bg-marfim/95 backdrop-blur p-2 flex items-center gap-1 flex-wrap opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={(e) => { e.preventDefault(); setSize(sz); s.addToCart({ productId: product.id, qty: 1, size: sz }); toast(`Adicionado à sacola ✦ ${product.name}`); }}
                  className={`caps px-2 py-1 border ${size === sz ? "border-terracota text-terracota" : "border-rose-claro"} hover:border-terracota`}
                >
                  {sz}
                </button>
              ))}
            </div>
          )}
        </div>
      </Link>
      <div className="mt-4 space-y-1">
        <Link to="/produto/$id" params={{ id: product.slug }} className="block">
          <p className="caps text-muted-foreground">{product.category}</p>
          <h3 className="font-display text-lg leading-snug text-carvao">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 text-xs text-rosewood">
          <Star className="h-3 w-3 fill-current" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="pt-1">
          {product.compareAt && (
            <p className="text-xs text-muted-foreground line-through">{brl(product.compareAt)}</p>
          )}
          <p className="text-lg text-carvao font-medium">{brl(product.price)}</p>
          <p className="text-xs text-muted-foreground">{parcelas(product.price)}</p>
          <p className="text-xs text-terracota">Pix {brl(pix(product.price))}</p>
        </div>
        {product.stock <= 3 && !product.soldOut && (
          <p className="caps text-terracota">Últimas unidades</p>
        )}
      </div>
    </div>
  );
}
