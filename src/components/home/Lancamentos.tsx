import { ProductCard } from "@/components/product/ProductCard";
import { novidades, products } from "@/data/products";
import { Reveal } from "@/components/brand/Reveal";

export function Lancamentos() {
  const items = [...novidades(), ...products.slice(0, 5)].slice(0, 8);
  return (
    <section className="bg-porcelana py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <p className="caps text-terracota">lançamentos</p>
            <h2 className="font-display text-4xl md:text-6xl mt-3">
              Recém-<em>chegadas</em>.
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 flex gap-6 overflow-x-auto snap-x-mand no-scrollbar pb-4 -mx-5 px-5 md:mx-0 md:px-0">
          {items.map((p) => (
            <div key={p.id} className="snap-start w-[75%] sm:w-[45%] md:w-[26%] flex-shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
