import * as React from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { type ProductType } from "@/data/products";
import { useCatalog } from "@/lib/catalog-store";
import { Reveal } from "@/components/brand/Reveal";

const TABS: { key: ProductType; label: string }[] = [
  { key: "roupa", label: "Roupas" },
  { key: "perfume", label: "Perfumes" },
  { key: "cosmetico", label: "Cosméticos" },
];

export function Categorias() {
  const { byType } = useCatalog();
  const [tab, setTab] = React.useState<ProductType>("roupa");
  const items = byType(tab).slice(0, 6);
  return (
    <section className="bg-marfim py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="caps text-terracota">categorias em destaque</p>
            <h2 className="font-display text-4xl md:text-6xl mt-3">
              Um trilho de <em>vitrine</em>.
            </h2>
          </div>
          <div className="flex gap-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`caps px-4 py-2 border ${tab === t.key ? "bg-carvao text-marfim border-carvao" : "border-rose-claro text-grafite hover:border-terracota"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 flex gap-6 overflow-x-auto snap-x-mand no-scrollbar pb-4 -mx-5 px-5 md:mx-0 md:px-0">
          {items.map((p, i) => (
            <div
              key={p.id}
              className="snap-start w-[75%] sm:w-[45%] md:w-[30%] flex-shrink-0"
              style={{ transform: i % 2 === 1 ? "translateY(26px)" : undefined }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
