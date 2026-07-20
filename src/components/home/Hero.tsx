import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/brand/Reveal";
import { ProductImage } from "@/components/brand/ProductImage";
import { Sparkle } from "@/components/brand/Logo";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-marfim pt-32 md:pt-40 pb-24">
      {/* vertical marquee */}
      <div className="hidden md:flex absolute top-32 right-6 h-[70vh] w-8 overflow-hidden flex-col items-center">
        <div className="marquee-vertical flex flex-col gap-8 caps text-grafite/50">
          {["desejo","perfume","seda","âmbar","rouge","memória","desejo","perfume","seda","âmbar","rouge","memória"].map((w,i)=>(
            <span key={i} style={{ writingMode: "vertical-rl" }}>{w}</span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid gap-12 lg:grid-cols-[1.05fr_1fr] items-center">
        <Reveal>
          <p className="caps text-terracota flex items-center gap-2"><Sparkle />coleção entardecer · 2024</p>
          <h1 className="mt-6 font-display text-5xl md:text-7xl xl:text-8xl leading-[0.95] text-carvao">
            Vista o que<br />
            você <em className="text-terracota">sente</em>.<br />
            Perfume o <em className="text-rosewood">resto</em>.
          </h1>
          <p className="mt-6 max-w-lg text-grafite/80">
            Boutique digital de moda feminina, perfumaria e cosméticos.
            Peças e aromas para as mulheres que preferem deixar rastro a deixar recado.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/roupas" className="caps bg-terracota text-marfim px-7 py-4 hover:bg-rosewood transition-colors">
              Explorar moda
            </Link>
            <Link to="/perfumes" className="caps border border-carvao text-carvao px-7 py-4 hover:bg-carvao hover:text-marfim transition-colors">
              Descobrir perfumaria
            </Link>
          </div>
        </Reveal>

        <Reveal className="relative h-[520px] md:h-[640px]">
          {/* Rotating seal */}
          <div className="absolute -top-4 -left-4 z-20 h-28 w-28 rounded-full bg-carvao text-marfim flex items-center justify-center spin-slow">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <defs>
                <path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text fontSize="9" letterSpacing="4" fill="currentColor" fontFamily="Archivo">
                <textPath href="#circ">KA LAMOUR STORE ✦ DESDE 2024 ✦ </textPath>
              </text>
            </svg>
          </div>

          <div className="absolute top-0 left-8 w-[58%] h-[62%]">
            <ProductImage duotone={0} label="editorial rubra · rosa turca" outline />
          </div>
          <div className="absolute bottom-0 right-0 w-[62%] h-[58%]">
            <ProductImage duotone={3} label="vestido entardecer" outline />
          </div>
          <div className="absolute bottom-16 left-0 w-[32%] h-[26%] z-10 float-slow">
            <ProductImage duotone={5} label="detalhe" outline={false} />
          </div>
        </Reveal>
      </div>

      <div className="hidden md:flex absolute left-6 md:left-10 bottom-8 items-center gap-3 caps text-grafite/60">
        <span>role a página</span>
        <i className="block w-px h-11 bg-gradient-to-b from-grafite/60 to-transparent animate-descend" />
      </div>
    </section>
  );
}
