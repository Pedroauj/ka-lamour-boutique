import * as React from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Heart, Share2, Star, Minus, Plus } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { type Product } from "@/data/products";
import { getPublicProductBySlug } from "@/lib/supabase-catalog";
import { rowToProduct, useCatalog } from "@/lib/catalog-store";
import { ProductImage } from "@/components/brand/ProductImage";
import { ProductCard } from "@/components/product/ProductCard";
import { brl, pix, parcelas } from "@/lib/format";
import { useStore } from "@/lib/store";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";

export const Route = createFileRoute("/produto/$id")({
  loader: async ({ params }) => {
    const row = await getPublicProductBySlug(params.id);
    if (!row) throw notFound();
    return { product: rowToProduct(row) };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Ka Lamour Store` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — Ka Lamour Store` },
          { property: "og:description", content: loaderData.product.description },
        ]
      : [{ title: "Produto não encontrado" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  return (
    <SiteShell>
      <Inner product={product} />
      <WhatsAppFab productName={product.name} />
    </SiteShell>
  );
}

function Inner({ product }: { product: Product }) {
  const s = useStore();
  const { products } = useCatalog();
  const [size, setSize] = React.useState<string | undefined>(product.sizes?.[0]);
  const [color, setColor] = React.useState<string | undefined>(product.colors?.[0]?.name);
  const [volume, setVolume] = React.useState<string | undefined>(product.volumes?.[0]);
  const [qty, setQty] = React.useState(1);
  const [activeImg, setActiveImg] = React.useState(0);
  const [cep, setCep] = React.useState("");
  const [frete, setFrete] = React.useState<null | { padrao: number; expressa: number }>(null);
  const fav = s.favorites.includes(product.id);
  const off = product.compareAt ? product.compareAt - product.price : 0;

  const related = products.filter((p) => p.type === product.type && p.id !== product.id).slice(0, 4);

  const addToCart = () => {
    if (product.soldOut) return;
    s.addToCart({ productId: product.id, qty, size, color, volume });
    toast(`Adicionado à sacola ✦ ${product.name}`);
  };

  const share = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `Olha o que achei na Ka Lamour: ${product.name} — ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <nav className="caps text-muted-foreground">
          <Link to="/" className="hover:text-terracota">Home</Link> / <Link to="/roupas" className="hover:text-terracota">{product.category}</Link> / <span className="text-carvao">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          {/* Galeria */}
          <div className="lg:sticky lg:top-28 self-start grid gap-4 grid-cols-[80px_1fr]">
            <div className="flex flex-col gap-3">
              {(product.images.length > 0 ? product.images : [0, 1, 2, 3]).map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className={`w-20 border ${activeImg === i ? "border-terracota" : "border-rose-claro"}`}
                >
                  <ProductImage
                    duotone={(product.duotone + i) % 6}
                    src={product.images[i]}
                    label="" aspect="3/4" arch={false}
                  />
                </button>
              ))}
            </div>
            <ProductImage
              duotone={product.duotone}
              src={product.images[activeImg] ?? product.images[0]}
              label={product.imageLabel} aspect="3/4" outline
            />
          </div>

          {/* Info */}
          <div>
            <p className="caps text-terracota">{product.category} · ref. {product.ref}</p>
            <h1 className="mt-3 font-display text-4xl md:text-6xl leading-[1]">{product.name}</h1>
            {product.reviews > 0 && (
              <div className="flex items-center gap-2 mt-4 text-rosewood">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({product.reviews} avaliações)</span>
              </div>
            )}

            <div className="mt-6">
              {product.compareAt && <p className="text-sm text-muted-foreground line-through">{brl(product.compareAt)}</p>}
              <p className="font-display text-4xl text-carvao">{brl(product.price)}</p>
              {off > 0 && <p className="caps text-terracota">Economize {brl(off)}</p>}
              <p className="mt-2 text-sm text-muted-foreground">{parcelas(product.price)}</p>
              <p className="text-sm text-terracota">ou {brl(pix(product.price))} no Pix (5% off)</p>
            </div>

            <p className="mt-6 text-grafite/85 leading-relaxed">{product.description}</p>

            {/* Variações */}
            {product.sizes && (
              <div className="mt-8">
                <p className="caps mb-3">Tamanho</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz, i) => {
                    const unavailable = product.soldOut || (i === 0 && product.stock < 2);
                    return (
                      <button
                        key={sz}
                        disabled={unavailable}
                        onClick={() => setSize(sz)}
                        className={`min-w-11 h-11 px-3 border caps ${
                          size === sz ? "border-terracota text-terracota" : "border-rose-claro"
                        } ${unavailable ? "line-through opacity-50 cursor-not-allowed" : "hover:border-terracota"}`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {product.colors && (
              <div className="mt-6">
                <p className="caps mb-3">Cor: <span className="text-terracota">{color}</span></p>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      aria-label={c.name}
                      onClick={() => setColor(c.name)}
                      className={`h-8 w-8 rounded-full border-2 ${color === c.name ? "border-terracota" : "border-rose-claro"}`}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.volumes && (
              <div className="mt-6">
                <p className="caps mb-3">Volume</p>
                <div className="flex gap-2">
                  {product.volumes.map((v) => (
                    <button
                      key={v}
                      onClick={() => setVolume(v)}
                      className={`h-11 px-4 border caps ${volume === v ? "border-terracota text-terracota" : "border-rose-claro hover:border-terracota"}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ação */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center border border-carvao">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3" aria-label="Diminuir"><Minus className="h-4 w-4" /></button>
                <span className="px-4">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="p-3" aria-label="Aumentar"><Plus className="h-4 w-4" /></button>
              </div>
              <button
                onClick={addToCart}
                disabled={product.soldOut}
                className="caps bg-terracota text-marfim px-8 py-4 hover:bg-rosewood transition-colors disabled:bg-grafite disabled:cursor-not-allowed"
              >
                {product.soldOut ? "Esgotado" : "Adicionar à sacola"}
              </button>
              <button onClick={() => { s.toggleFav(product.id); toast(fav ? "Removido dos favoritos" : "Adicionado aos favoritos ✦"); }}
                aria-label="Favoritar" className="h-14 w-14 border border-carvao flex items-center justify-center hover:bg-porcelana">
                <Heart className={`h-5 w-5 ${fav ? "fill-terracota text-terracota" : ""}`} />
              </button>
              <button onClick={share} aria-label="Compartilhar" className="h-14 w-14 border border-carvao flex items-center justify-center hover:bg-porcelana">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {product.stock <= 3 && !product.soldOut && (
              <p className="mt-4 caps text-terracota">✦ Últimas {product.stock} unidades</p>
            )}

            {/* Frete */}
            <div className="mt-8 border border-rose-claro p-5">
              <p className="caps mb-3">Calcular frete e prazo</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (cep.replace(/\D/g, "").length !== 8) { toast("CEP inválido"); return; }
                  setFrete({ padrao: 24.90, expressa: 39.90 });
                }}
                className="flex gap-2"
              >
                <input
                  value={cep}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 8);
                    setCep(v.length > 5 ? `${v.slice(0,5)}-${v.slice(5)}` : v);
                  }}
                  placeholder="00000-000"
                  className="flex-1 bg-transparent border-b border-carvao outline-none py-2 focus:border-terracota"
                />
                <button className="caps border border-carvao px-4">Calcular</button>
              </form>
              {frete && (
                <ul className="mt-4 text-sm space-y-2">
                  <li className="flex justify-between"><span>Padrão · 5 a 8 dias úteis</span><span>{brl(frete.padrao)}</span></li>
                  <li className="flex justify-between"><span>Expressa · 2 a 3 dias úteis</span><span>{brl(frete.expressa)}</span></li>
                </ul>
              )}
            </div>

            {/* Acordeões condicionais */}
            <div className="mt-10 divide-y divide-rose-claro border-y border-rose-claro">
              {product.pyramid && (
                <Accordion title="Pirâmide olfativa">
                  <div className="grid gap-4">
                    {[
                      { l: "Notas de topo", n: product.pyramid.topo, bg: "bg-porcelana" },
                      { l: "Notas de coração", n: product.pyramid.coracao, bg: "bg-rose-claro/60" },
                      { l: "Notas de fundo", n: product.pyramid.fundo, bg: "bg-rose/50" },
                    ].map((layer) => (
                      <div key={layer.l} className={`${layer.bg} p-4`}>
                        <p className="caps text-terracota">{layer.l}</p>
                        <p className="mt-1 font-display text-lg">{layer.n.join(" · ")}</p>
                      </div>
                    ))}
                  </div>
                  <dl className="mt-6 grid grid-cols-3 gap-4 text-sm">
                    <div><dt className="caps text-muted-foreground">Fixação</dt><dd>{product.pyramid.fixacao}</dd></div>
                    <div><dt className="caps text-muted-foreground">Projeção</dt><dd>{product.pyramid.projecao}</dd></div>
                    <div><dt className="caps text-muted-foreground">Ocasião</dt><dd>{product.pyramid.ocasiao}</dd></div>
                  </dl>
                </Accordion>
              )}
              {product.actives && (
                <Accordion title="Modo de uso e ativos">
                  <p className="text-sm">Aplique sobre a pele limpa, massageando suavemente. Uso diário, manhã e noite.</p>
                  <p className="caps mt-4 text-terracota">Ativos principais</p>
                  <ul className="mt-2 text-sm list-disc pl-5">{product.actives.map((a) => <li key={a}>{a}</li>)}</ul>
                </Accordion>
              )}
              {product.fabric && (
                <Accordion title="Composição e cuidados">
                  <p className="text-sm">{product.fabric}</p>
                  {product.care && (
                    <ul className="mt-3 text-sm list-disc pl-5">{product.care.map((c) => <li key={c}>{c}</li>)}</ul>
                  )}
                  <p className="caps mt-4 text-terracota">Tabela de medidas</p>
                  <table className="mt-2 w-full text-sm">
                    <thead className="text-left text-muted-foreground">
                      <tr><th className="py-1">Tamanho</th><th>Busto</th><th>Cintura</th><th>Quadril</th></tr>
                    </thead>
                    <tbody>
                      {["PP 82 · 62 · 88","P 86 · 66 · 92","M 90 · 70 · 96","G 94 · 74 · 100","GG 98 · 78 · 104"].map(r => (
                        <tr key={r} className="border-t border-rose-claro"><td colSpan={4} className="py-2">{r}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </Accordion>
              )}
              <Accordion title="Entrega e trocas">
                <p className="text-sm">Enviamos para todo o Brasil. Frete grátis acima de R$ 299. Primeira troca por nossa conta em até 30 dias.</p>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Complete seu ritual/look */}
        <div className="mt-24">
          <p className="caps text-terracota">
            {product.type === "roupa" ? "Complete seu look" : "Complete seu ritual"}
          </p>
          <h2 className="font-display text-4xl md:text-5xl mt-2">Vai bem com <em>este</em>.</h2>
          <div className="mt-8 grid gap-x-6 gap-y-12 grid-cols-2 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>

      {/* Sticky buy bar mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-marfim border-t border-rose-claro p-4 flex items-center justify-between gap-3 md:hidden">
        <div>
          <p className="text-sm font-medium">{brl(product.price)}</p>
          <p className="text-xs text-muted-foreground">{parcelas(product.price)}</p>
        </div>
        <button onClick={addToCart} disabled={product.soldOut}
          className="caps bg-terracota text-marfim px-6 py-3 disabled:bg-grafite">
          {product.soldOut ? "Esgotado" : "Adicionar"}
        </button>
      </div>
    </div>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between py-5 text-left">
        <span className="caps text-carvao">{title}</span>
        <span className="text-terracota text-xl">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="pb-6">{children}</div>}
    </div>
  );
}
