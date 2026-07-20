import * as React from "react";
import { Link } from "@tanstack/react-router";
import { X, Minus, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { brl, pix, parcelas } from "@/lib/format";
import { ProductImage } from "@/components/brand/ProductImage";
import { products } from "@/data/products";
import { Sparkle } from "@/components/brand/Logo";

const FRETE_MIN = 299;

export function CartDrawer() {
  const s = useStore();
  const suggestion = React.useMemo(
    () => products.find((p) => !s.cart.some((i) => i.productId === p.id) && p.isBestseller),
    [s.cart]
  );

  React.useEffect(() => {
    if (!s.cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && s.setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [s.cartOpen]);

  const faltam = Math.max(0, FRETE_MIN - s.cartTotal);
  const progress = Math.min(100, (s.cartTotal / FRETE_MIN) * 100);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-carvao/40 backdrop-blur-sm transition-opacity duration-300 ${
          s.cartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => s.setCartOpen(false)}
      />
      <aside
        aria-label="Sacola"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-marfim shadow-2xl transition-transform duration-300 ${
          s.cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-rose-claro">
          <h3 className="font-display text-2xl">Sua sacola</h3>
          <button aria-label="Fechar" onClick={() => s.setCartOpen(false)}><X /></button>
        </div>

        <div className="px-6 py-4 bg-porcelana">
          <p className="text-xs text-grafite">
            {faltam > 0 ? (
              <>Faltam <strong className="text-terracota">{brl(faltam)}</strong> para o frete grátis <Sparkle className="text-terracota" /></>
            ) : (
              <>Você garantiu <strong className="text-terracota">frete grátis</strong> <Sparkle className="text-terracota" /></>
            )}
          </p>
          <div className="mt-2 h-1 bg-rose-claro rounded-full overflow-hidden">
            <div className="h-full bg-terracota transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 340px)" }}>
          {s.cartProducts.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-display text-xl text-grafite">Sua sacola está vazia.</p>
              <p className="mt-2 text-sm text-muted-foreground">Comece pelas nossas favoritas.</p>
              <Link
                to="/roupas"
                onClick={() => s.setCartOpen(false)}
                className="mt-6 inline-block bg-terracota text-marfim px-6 py-3 caps"
              >
                Explorar moda
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-rose-claro">
              {s.cartProducts.map(({ item, product }, idx) => (
                <li key={idx} className="flex gap-4 p-6">
                  <div className="w-20 flex-shrink-0">
                    <ProductImage duotone={product.duotone} label="" aspect="3/4" outline={false} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-3">
                      <p className="font-medium text-sm text-carvao truncate">{product.name}</p>
                      <button aria-label="Remover" onClick={() => s.removeFromCart(idx)} className="text-muted-foreground hover:text-terracota"><X className="h-4 w-4" /></button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {[item.size, item.color, item.volume].filter(Boolean).join(" · ")}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-rose-claro">
                        <button onClick={() => s.updateQty(idx, item.qty - 1)} className="p-2" aria-label="Diminuir"><Minus className="h-3 w-3" /></button>
                        <span className="px-3 text-sm">{item.qty}</span>
                        <button onClick={() => s.updateQty(idx, item.qty + 1)} className="p-2" aria-label="Aumentar"><Plus className="h-3 w-3" /></button>
                      </div>
                      <span className="font-medium">{brl(product.price * item.qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {s.cartProducts.length > 0 && suggestion && (
            <div className="mx-6 my-4 p-4 border border-rose-claro bg-porcelana/50">
              <p className="caps text-terracota">Complete seu ritual</p>
              <div className="flex gap-3 mt-3 items-center">
                <div className="w-16"><ProductImage duotone={suggestion.duotone} label="" aspect="3/4" outline={false} /></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{suggestion.name}</p>
                  <p className="text-sm text-terracota">{brl(suggestion.price)}</p>
                </div>
                <button
                  onClick={() => s.addToCart({ productId: suggestion.id, qty: 1 })}
                  className="caps border border-terracota text-terracota px-3 py-2 hover:bg-terracota hover:text-marfim"
                >
                  Adicionar
                </button>
              </div>
            </div>
          )}
        </div>

        {s.cartProducts.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-marfim border-t border-rose-claro p-6 space-y-3">
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>{brl(s.cartTotal)}</span></div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>ou {parcelas(s.cartTotal)}</span>
              <span className="text-terracota">Pix {brl(pix(s.cartTotal))}</span>
            </div>
            <button className="w-full bg-terracota text-marfim py-4 caps hover:bg-rosewood transition-colors">
              Finalizar compra
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
