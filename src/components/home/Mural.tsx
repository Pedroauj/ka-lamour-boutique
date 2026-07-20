import { Reveal } from "@/components/brand/Reveal";
import { ProductImage } from "@/components/brand/ProductImage";

const TILES = [
  { duo: 0, h: "h-64" },
  { duo: 1, h: "h-80" },
  { duo: 4, h: "h-56" },
  { duo: 2, h: "h-72" },
  { duo: 3, h: "h-64" },
  { duo: 5, h: "h-80" },
  { duo: 1, h: "h-56" },
  { duo: 0, h: "h-72" },
];

export function Mural() {
  return (
    <section className="bg-marfim py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="caps text-terracota">nosso mural</p>
            <h2 className="font-display text-4xl md:text-6xl mt-3">
              @kalamour<em>store</em>
            </h2>
          </div>
          <a href="https://instagram.com" className="caps text-carvao hover:text-terracota">Seguir no Instagram →</a>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {TILES.map((t, i) => (
            <div key={i} className={`${t.h}`}>
              <ProductImage duotone={t.duo} label="@kalamourstore" aspect="auto" arch={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
