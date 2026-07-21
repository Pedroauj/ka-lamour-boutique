import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import type { Product, ProductType, OlfactoryPyramid } from "@/data/products";
import {
  listPublicCatalog,
  getProductImageUrl,
  type PublicProductRow,
} from "@/lib/supabase-catalog";

// placeholder determinístico (0..5) a partir do id, para produtos sem foto
function duotoneFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 6;
}

export function rowToProduct(row: PublicProductRow): Product {
  const images = (row.product_images ?? []).map((i) => getProductImageUrl(i.storage_path));
  return {
    id: row.id,
    ref: row.ref,
    slug: row.slug,
    name: row.name,
    type: (row.categories?.product_type ?? "roupa") as ProductType,
    category: row.categories?.name ?? "",
    price: Number(row.price),
    compareAt: row.compare_at_price != null ? Number(row.compare_at_price) : undefined,
    description: row.description ?? "",
    rating: 0,
    reviews: 0,
    stock: row.stock,
    isNew: row.is_new,
    isBestseller: row.is_bestseller,
    soldOut: row.stock <= 0,
    sizes: row.sizes ?? undefined,
    colors: (row.colors as Product["colors"]) ?? undefined,
    volumes: row.volumes ?? undefined,
    pyramid: (row.pyramid as OlfactoryPyramid) ?? undefined,
    actives: row.actives ?? undefined,
    fabric: row.fabric ?? undefined,
    care: row.care ?? undefined,
    testimonial: undefined,
    imageLabel: row.name,
    duotone: duotoneFromId(row.id),
    images,
  };
}

interface CatalogValue {
  products: Product[];
  loading: boolean;
  byType: (t: ProductType) => Product[];
  bestsellers: () => Product[];
  novidades: () => Product[];
  ofertas: () => Product[];
  getProduct: (slugOrId: string) => Product | undefined;
}

const Ctx = React.createContext<CatalogValue | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ["public-catalog"],
    queryFn: listPublicCatalog,
    staleTime: 60_000,
  });

  const products = React.useMemo(() => (data ?? []).map(rowToProduct), [data]);

  const value = React.useMemo<CatalogValue>(() => ({
    products,
    loading: isLoading,
    byType: (t) => products.filter((p) => p.type === t),
    bestsellers: () => products.filter((p) => p.isBestseller),
    novidades: () => products.filter((p) => p.isNew),
    ofertas: () => products.filter((p) => p.compareAt),
    getProduct: (slugOrId) => products.find((p) => p.slug === slugOrId || p.id === slugOrId),
  }), [products, isLoading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalog(): CatalogValue {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useCatalog fora do CatalogProvider");
  return c;
}
