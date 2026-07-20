import { Reveal } from "@/components/brand/Reveal";

const BENEFITS = [
  { glyph: "⇢", title: "Frete grátis", copy: "Acima de R$ 299 para todo o Brasil." },
  { glyph: "↺", title: "Troca fácil", copy: "Primeira troca por nossa conta em até 30 dias." },
  { glyph: "✦", title: "Pix 5% off", copy: "Desconto automático no fechamento." },
  { glyph: "⌂", title: "Compra segura", copy: "Site protegido, dados criptografados." },
];

export function Beneficios() {
  return (
    <section className="bg-marfim py-20 border-y border-rose-claro">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid gap-10 md:grid-cols-4">
        {BENEFITS.map((b) => (
          <Reveal key={b.title} className="text-center md:text-left">
            <span className="font-display text-4xl text-terracota">{b.glyph}</span>
            <h3 className="caps mt-4 text-carvao">{b.title}</h3>
            <p className="mt-2 text-sm text-grafite/80">{b.copy}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
