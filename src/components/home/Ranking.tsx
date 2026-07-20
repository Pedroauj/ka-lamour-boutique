import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { products } from "@/data/products";
import { ProductImage } from "@/components/brand/ProductImage";
import { brl } from "@/lib/format";
import { Reveal } from "@/components/brand/Reveal";
import { useStore } from "@/lib/store";

export function Ranking() {
  const s = useStore();
  const top = products.filter((p) => p.testimonial).slice(0, 5);
  // ensure 5
  while (top.length < 5) top.push(products[top.length]);
  return (
    <section className="bg-marfim py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <Reveal>
          <p className="caps text-terracota">mais vendidos</p>
          <h2 className="font-display text-4xl md:text-6xl mt-3">
            O <em>ranking</em> das nossas favoritas.
          </h2>
        </Reveal>

        <ul className="mt-14 divide-y divide-rose-claro border-y border-rose-claro">
          {top.slice(0,5).map((p, i) => (
            <li key={p.id} className="grid grid-cols-[64px_88px_1fr_auto] md:grid-cols-[120px_120px_1fr_auto] items-center gap-4 md:gap-8 py-6">
              <span className="font-display italic text-5xl md:text-7xl text-terracota leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Link to="/produto/$id" params={{ id: p.slug }}>
                <ProductImage duotone={p.duotone} label="" aspect="3/4" arch />
              </Link>
              <div className="min-w-0">
                <p className="caps text-muted-foreground">{p.category}</p>
                <Link to="/produto/$id" params={{ id: p.slug }} className="font-display text-xl md:text-2xl text-carvao hover:text-terracota">
                  {p.name}
                </Link>
                {p.testimonial && (
                  <p className="mt-2 italic text-sm text-grafite/70 hidden md:block">
                    "{p.testimonial.quote}" — {p.testimonial.name}, {p.testimonial.city}
                  </p>
                )}
                <p className="mt-2 text-terracota md:hidden">{brl(p.price)}</p>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <span className="hidden md:block text-carvao">{brl(p.price)}</span>
                <button
                  onClick={() => { s.addToCart({ productId: p.id, qty: 1, size: p.sizes?.[0], volume: p.volumes?.[0] }); toast(`Adicionado ✦ ${p.name}`); }}
                  className="caps border border-terracota text-terracota px-4 py-2 hover:bg-terracota hover:text-marfim"
                >
                  Adicionar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
