import * as React from "react";
import { Link } from "@tanstack/react-router";
import { X, Search as SearchIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import { products } from "@/data/products";
import { stripAccents, brl } from "@/lib/format";
import { ProductImage } from "@/components/brand/ProductImage";

const POPULAR = ["Vestido midi", "Rubra perfume", "Sérum vitamina C", "Blazer", "Manteiga karité"];

export function SearchOverlay() {
  const s = useStore();
  const [q, setQ] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (s.searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && s.setSearchOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [s.searchOpen]);

  const results = React.useMemo(() => {
    if (!q.trim()) return [];
    const t = stripAccents(q);
    return products
      .filter((p) => stripAccents(p.name + " " + p.category + " " + p.description).includes(t))
      .slice(0, 6);
  }, [q]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-marfim overflow-y-auto transition-opacity duration-300 ${
        s.searchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!s.searchOpen}
    >
      <div
        className="mx-auto max-w-[1000px] px-6 py-10 transition-transform duration-500"
        style={{
          transform: s.searchOpen ? "none" : "translateY(-20px)",
          transitionTimingFunction: "cubic-bezier(.22,.9,.24,1)",
        }}
      >
        <div className="flex justify-end">
          <button aria-label="Fechar busca" onClick={() => s.setSearchOpen(false)}><X /></button>
        </div>
        <div className="mt-8 flex items-center gap-4 border-b border-carvao pb-4">
          <SearchIcon className="h-6 w-6 text-carvao" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && q.trim()) s.addRecent(q); }}
            placeholder="O que sua tarde pede hoje?"
            className="flex-1 bg-transparent outline-none text-2xl md:text-4xl font-display placeholder:text-grafite/40"
          />
        </div>

        {results.length > 0 ? (
          <div className="mt-10 grid gap-4">
            <p className="caps text-terracota">Resultados</p>
            <ul className="divide-y divide-rose-claro">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/produto/$id" params={{ id: p.slug }}
                    onClick={() => { s.addRecent(q); s.setSearchOpen(false); }}
                    className="flex items-center gap-4 py-4 hover:bg-porcelana/40"
                  >
                    <div className="w-16"><ProductImage duotone={p.duotone} label="" aspect="1/1" arch={false} /></div>
                    <div className="flex-1">
                      <p className="font-medium">{p.name}</p>
                      <p className="caps text-muted-foreground">{p.category}</p>
                    </div>
                    <span className="text-terracota">{brl(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <p className="caps text-terracota">Buscas populares</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {POPULAR.map((t) => (
                  <button key={t} onClick={() => setQ(t)} className="border border-rose-claro px-3 py-2 caps hover:bg-porcelana">
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {s.recentSearches.length > 0 && (
              <div>
                <p className="caps text-terracota">Recentes</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.recentSearches.map((t) => (
                    <button key={t} onClick={() => setQ(t)} className="border border-rose-claro px-3 py-2 caps hover:bg-porcelana">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
