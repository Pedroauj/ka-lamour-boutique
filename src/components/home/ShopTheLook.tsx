import * as React from "react";
import { toast } from "sonner";
import { getProduct } from "@/data/products";
import { ProductImage } from "@/components/brand/ProductImage";
import { brl } from "@/lib/format";
import { Reveal } from "@/components/brand/Reveal";
import { useStore } from "@/lib/store";

const LOOK_IDS = ["kls-0001", "kls-0101", "kls-0201"];
const HOTSPOTS = [
  { top: "22%", left: "58%" },
  { top: "52%", left: "36%" },
  { top: "78%", left: "62%" },
];

export function ShopTheLook() {
  const s = useStore();
  const [active, setActive] = React.useState(0);
  const items = LOOK_IDS.map((id) => getProduct(id)!).filter(Boolean);
  const total = items.reduce((sum, p) => sum + p.price, 0);

  return (
    <section className="bg-porcelana py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid gap-12 lg:grid-cols-[1.15fr_1fr] items-center">
        <Reveal className="relative">
          <div className="w-full h-[70vh] max-h-[720px]">
            <ProductImage duotone={0} label="shop the look · entardecer" outline aspect="4/5" />
          </div>
          {HOTSPOTS.map((h, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`absolute z-10 h-9 w-9 rounded-full border border-marfim/80 text-marfim font-display flex items-center justify-center transition-all ${
                active === i ? "bg-terracota scale-110" : "bg-carvao/70"
              }`}
              style={{ top: h.top, left: h.left }}
              aria-label={`Item ${i+1}`}
            >
              <span className="animate-ping absolute inset-0 rounded-full bg-terracota/40" aria-hidden />
              <span className="relative">{i+1}</span>
            </button>
          ))}
        </Reveal>

        <Reveal>
          <p className="caps text-terracota">shop the look</p>
          <h2 className="font-display text-4xl md:text-5xl mt-3">Um look, três <em>gestos</em>.</h2>
          <ul className="mt-8 space-y-4">
            {items.map((p, i) => (
              <li
                key={p.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${
                  active === i ? "border-terracota bg-marfim" : "border-rose-claro"
                }`}
              >
                <span className="font-display italic text-2xl text-terracota w-6">{i+1}</span>
                <div className="w-16"><ProductImage duotone={p.duotone} label="" aspect="1/1" arch={false} /></div>
                <div className="flex-1">
                  <p className="caps text-muted-foreground">{p.category}</p>
                  <p className="font-display text-lg">{p.name}</p>
                </div>
                <span className="text-terracota">{brl(p.price)}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              items.forEach((p) => s.addToCart({ productId: p.id, qty: 1, size: p.sizes?.[0], volume: p.volumes?.[0] }));
              toast("Look completo adicionado ✦");
            }}
            className="mt-6 caps bg-carvao text-marfim px-6 py-4 hover:bg-terracota transition-colors"
          >
            Adicionar look completo — {brl(total)}
          </button>
        </Reveal>
      </div>
    </section>
  );
}
