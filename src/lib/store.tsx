import * as React from "react";
import { products, type Product } from "@/data/products";

export interface CartItem {
  productId: string;
  qty: number;
  size?: string;
  color?: string;
  volume?: string;
}

interface UIState {
  cartOpen: boolean;
  favOpen: boolean;
  searchOpen: boolean;
  mobileOpen: boolean;
  setCartOpen: (v: boolean) => void;
  setFavOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setMobileOpen: (v: boolean) => void;
}

interface StoreState {
  cart: CartItem[];
  favorites: string[];
  recentSearches: string[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (idx: number) => void;
  updateQty: (idx: number, qty: number) => void;
  toggleFav: (id: string) => void;
  addRecent: (q: string) => void;
  cartTotal: number;
  cartCount: number;
  cartProducts: { item: CartItem; product: Product }[];
}

const Ctx = React.createContext<(StoreState & UIState) | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [recentSearches, setRecent] = React.useState<string[]>([]);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [favOpen, setFavOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const cartProducts = React.useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return product ? { item, product } : null;
        })
        .filter(Boolean) as { item: CartItem; product: Product }[],
    [cart]
  );

  const cartTotal = cartProducts.reduce((s, { item, product }) => s + product.price * item.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const value: StoreState & UIState = {
    cart, favorites, recentSearches,
    addToCart: (item) => {
      setCart((c) => {
        const idx = c.findIndex(
          (x) => x.productId === item.productId && x.size === item.size && x.color === item.color && x.volume === item.volume
        );
        if (idx >= 0) {
          const nc = [...c];
          nc[idx] = { ...nc[idx], qty: nc[idx].qty + item.qty };
          return nc;
        }
        return [...c, item];
      });
      setCartOpen(true);
    },
    removeFromCart: (idx) => setCart((c) => c.filter((_, i) => i !== idx)),
    updateQty: (idx, qty) =>
      setCart((c) => (qty <= 0 ? c.filter((_, i) => i !== idx) : c.map((it, i) => (i === idx ? { ...it, qty } : it)))),
    toggleFav: (id) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
    addRecent: (q) => {
      const t = q.trim();
      if (!t) return;
      setRecent((r) => [t, ...r.filter((x) => x !== t)].slice(0, 6));
    },
    cartTotal, cartCount, cartProducts,
    cartOpen, favOpen, searchOpen, mobileOpen,
    setCartOpen, setFavOpen, setSearchOpen, setMobileOpen,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useStore fora do StoreProvider");
  return c;
}
