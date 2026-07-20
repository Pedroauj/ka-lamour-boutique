import { Marquee } from "@/components/brand/Marquee";

export function PromoBar() {
  return (
    <div className="bg-carvao text-marfim">
      <Marquee
        items={[
          "FRETE GRÁTIS ACIMA DE R$ 299",
          "5% OFF NO PIX",
          "PRIMEIRA TROCA GRÁTIS",
          "ATÉ 6X SEM JUROS",
        ]}
      />
    </div>
  );
}
