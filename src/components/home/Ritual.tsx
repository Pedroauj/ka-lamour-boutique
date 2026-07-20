import { Link } from "@tanstack/react-router";
import { ProductImage } from "@/components/brand/ProductImage";
import { getProduct } from "@/data/products";
import { Reveal } from "@/components/brand/Reveal";

const STEPS = [
  { n: "01", label: "Preparar", copy: "Uma bruma fria acorda a pele para o que vem.", id: "kls-0205", duo: 2 },
  { n: "02", label: "Hidratar", copy: "Manteiga de karité, camadas de conforto.", id: "kls-0201", duo: 1 },
  { n: "03", label: "Perfumar", copy: "Rubra: pimenta rosa, jasmim, âmbar.", id: "kls-0101", duo: 0 },
  { n: "04", label: "Finalizar", copy: "Máscara labial que trabalha enquanto você dorme.", id: "kls-0204", duo: 4 },
];

export function Ritual() {
  return (
    <section className="bg-marfim py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="max-w-2xl">
          <p className="caps text-terracota">ritual de beleza</p>
          <h2 className="font-display text-4xl md:text-6xl mt-3">Quatro passos, uma <em>hora sagrada</em>.</h2>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-4">
          {STEPS.map((step) => {
            const product = getProduct(step.id);
            return (
              <Reveal key={step.n}>
                <div className="relative">
                  <span className="absolute -top-4 -left-2 font-display italic text-6xl text-terracota z-10">{step.n}</span>
                  <ProductImage duotone={step.duo} label={step.label.toLowerCase()} aspect="4/5" outline />
                </div>
                <h3 className="mt-6 font-display text-2xl">{step.label}</h3>
                <p className="mt-2 text-sm text-grafite/80">{step.copy}</p>
                {product && (
                  <Link
                    to="/produto/$id" params={{ id: product.slug }}
                    className="caps text-terracota mt-3 inline-block hover:underline"
                  >
                    {product.name} →
                  </Link>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
