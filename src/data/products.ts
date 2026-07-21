// Tipos do catálogo. Os DADOS agora vêm do Supabase (ver src/lib/catalog-store.tsx).
// Este arquivo mantém apenas as interfaces que os componentes da vitrine consomem.

export type ProductType = "roupa" | "perfume" | "cosmetico";

export interface Testimonial {
  name: string;
  city: string;
  quote: string;
  rating: number;
}

export interface OlfactoryPyramid {
  topo: string[];
  coracao: string[];
  fundo: string[];
  fixacao?: string;
  projecao?: string;
  ocasiao?: string;
  familia?: "floral" | "amadeirado" | "oriental" | "citrico";
}

export interface Product {
  id: string;
  ref: string;
  slug: string;
  name: string;
  type: ProductType;
  category: string;
  price: number;
  compareAt?: number;
  description: string;
  rating: number;
  reviews: number;
  stock: number;
  isNew?: boolean;
  isBestseller?: boolean;
  soldOut?: boolean;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  volumes?: string[];
  pyramid?: OlfactoryPyramid;
  actives?: string[];
  fabric?: string;
  care?: string[];
  testimonial?: Testimonial;
  imageLabel: string;
  duotone: number; // 0..5 — placeholder quando não há foto
  images: string[]; // URLs públicas das fotos reais (vazio = usa placeholder)
}
