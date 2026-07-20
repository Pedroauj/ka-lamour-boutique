import { Reveal } from "@/components/brand/Reveal";
import { ProductImage } from "@/components/brand/ProductImage";

const TILES = [
  { duo: 0, h: "h-64", legend: "look do dia" },
  { duo: 1, h: "h-80", legend: "ritual da noite" },
  { duo: 4, h: "h-56", legend: "detalhe entardecer" },
  { duo: 2, h: "h-72", legend: "editorial rubra" },
  { duo: 3, h: "h-64", legend: "vestido leveza" },
  { duo: 5, h: "h-80", legend: "aroma do momento" },
  { duo: 1, h: "h-56", legend: "pele em cuidado" },
  { duo: 0, h: "h-72", legend: "cliente ka lamour" },
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
            <div key={i} className={`group relative overflow-hidden rounded-lg ${t.h}`}>
              <ProductImage duotone={t.duo} label="@kalamourstore" aspect="auto" arch={false} className="group-hover:scale-110 duration-[800ms]" />
              <div className="absolute inset-0 bg-carvao/70 flex items-center justify-center text-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="font-display italic text-marfim text-lg">{t.legend}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
