import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/brand/Reveal";
import { ProductImage } from "@/components/brand/ProductImage";
import { Sparkle } from "@/components/brand/Logo";

export function Campanha() {
  return (
    <section className="bg-carvao text-marfim py-24 md:py-32 relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid gap-10 lg:grid-cols-[1fr_1.1fr] items-center">
        <Reveal>
          <p className="caps text-rose flex items-center gap-2"><Sparkle />campanha entardecer</p>
          <h2 className="mt-6 font-display text-5xl md:text-7xl leading-[0.95]">
            A hora em que o dia <em className="text-rose">respira</em> antes da noite.
          </h2>
          <p className="mt-6 text-marfim/70 max-w-lg">
            Vestidos que capturam a luz de fim de tarde, perfumes que aparecem quando o vento passa,
            rituais que continuam quando você já saiu.
          </p>
          <Link to="/novidades" className="mt-8 inline-block caps bg-rose text-carvao px-8 py-4 hover:bg-marfim transition-colors">
            Ver a coleção
          </Link>
        </Reveal>
        <Reveal className="relative h-[520px]">
          <div className="absolute top-0 right-0 w-[70%] h-[70%]">
            <ProductImage duotone={5} label="campanha entardecer" outline />
          </div>
          <div className="absolute bottom-0 left-0 w-[55%] h-[55%]">
            <ProductImage duotone={3} label="detalhe · rouge" outline />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
