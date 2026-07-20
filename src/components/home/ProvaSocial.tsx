import { Star } from "lucide-react";
import { Reveal } from "@/components/brand/Reveal";
import { products } from "@/data/products";

const REVIEWS = products.filter((p) => p.testimonial).slice(0, 4).map((p) => ({
  ...p.testimonial!,
  product: p.name,
}));

export function ProvaSocial() {
  return (
    <section className="bg-porcelana py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid gap-16 lg:grid-cols-[1fr_2fr] items-start">
        <Reveal>
          <p className="caps text-terracota">quem sente conta</p>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-8xl md:text-9xl text-carvao">4,9</span>
            <span className="text-3xl text-terracota">/5</span>
          </div>
          <div className="flex gap-1 mt-3 text-rosewood">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
          </div>
          <p className="mt-4 text-grafite/80">
            Média de mais de 2.100 avaliações de clientes verificadas.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {REVIEWS.map((r, i) => (
            <Reveal key={i} className="bg-marfim p-8 border border-rose-claro">
              <div className="flex gap-1 text-rosewood">
                {[...Array(r.rating)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 font-display text-xl italic text-carvao leading-snug">"{r.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-terracota text-marfim flex items-center justify-center font-display">
                  {r.name.charAt(0)}
                </div>
                <div className="text-sm">
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.city}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-rose-claro flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Comprou: {r.product}</span>
                <span className="caps text-terracota">✓ compra verificada</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
