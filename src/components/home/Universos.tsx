import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/brand/Reveal";
import { ProductImage } from "@/components/brand/ProductImage";

export function Universos() {
  return (
    <section className="bg-porcelana py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid gap-6 md:grid-cols-2">
        {[
          { to: "/roupas", tag: "universo 01", title: "Moda", desc: "Silhuetas fluidas, alfaiataria feminina e vestidos que se movem com você.", duo: 4 },
          { to: "/perfumes", tag: "universo 02", title: "Beleza", desc: "Perfumaria, cuidado e rituais que ficam na pele — e na memória.", duo: 2 },
        ].map((u) => (
          <Reveal key={u.to}>
            <Link
              to={u.to}
              className="group block relative pl-6 md:pl-10 py-8"
            >
              <i className="fio-lateral absolute left-0 top-8 bottom-8 w-[3px] bg-terracota" />
              <div className="overflow-hidden">
                <ProductImage duotone={u.duo} label={u.title.toLowerCase() + " · ka lamour"} outline aspect="4/5" className="group-hover:scale-105 duration-[1200ms]" />
              </div>
              <div className="mt-6">
                <p className="caps text-terracota">{u.tag}</p>
                <h2 className="font-display text-5xl md:text-6xl text-carvao mt-3 group-hover:italic transition-all">{u.title}</h2>
                <p className="mt-4 max-w-md text-grafite/80">{u.desc}</p>
                <span className="caps text-terracota mt-6 inline-block group-hover:underline">Descobrir →</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
