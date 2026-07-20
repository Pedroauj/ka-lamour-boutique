import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Search, User, Heart, ShoppingBag, Menu } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useStore } from "@/lib/store";

const NAV = [
  { to: "/roupas", label: "Roupas" },
  { to: "/perfumes", label: "Perfumes" },
  { to: "/cosmeticos", label: "Cosméticos" },
  { to: "/novidades", label: "Novidades" },
  { to: "/ofertas", label: "Ofertas" },
] as const;

export function Header({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = React.useState(false);
  const { setSearchOpen, setCartOpen, setFavOpen, setMobileOpen, cartCount, favorites } = useStore();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !transparent || scrolled;

  return (
    <header
      className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "top-0" : "top-10"
      } ${
        solid
          ? "bg-marfim/85 backdrop-blur-md border-b border-rose-claro"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 h-20 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3 lg:hidden">
          <button aria-label="Abrir menu" onClick={() => setMobileOpen(true)} className="p-2">
            <Menu className="h-5 w-5 text-grafite" />
          </button>
        </div>
        <Link to="/" className="flex-shrink-0" aria-label="Ir para a home">
          <Logo variant={solid ? "dark" : "dark"} />
        </Link>
        <nav className="hidden lg:flex items-center gap-8 caps text-grafite">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="relative py-2 hover:text-terracota transition-colors"
              activeProps={{ className: "text-terracota" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1 md:gap-2">
          <button aria-label="Buscar" onClick={() => setSearchOpen(true)} className="p-2 hover:text-terracota">
            <Search className="h-5 w-5" />
          </button>
          <Link to="/favoritos" className="p-2 hover:text-terracota hidden md:inline-flex" aria-label="Conta">
            <User className="h-5 w-5" />
          </Link>
          <button aria-label="Favoritos" onClick={() => setFavOpen(true)} className="p-2 hover:text-terracota relative">
            <Heart className="h-5 w-5" />
            {favorites.length > 0 && <Badge>{favorites.length}</Badge>}
          </button>
          <button aria-label="Sacola" onClick={() => setCartOpen(true)} className="p-2 hover:text-terracota relative">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && <Badge>{cartCount}</Badge>}
          </button>
        </div>
      </div>
    </header>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-terracota text-marfim text-[10px] font-medium flex items-center justify-center">
      {children}
    </span>
  );
}
