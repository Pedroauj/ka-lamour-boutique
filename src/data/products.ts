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
  duotone: number; // 0..5
}

const p = (o: Product) => o;

export const products: Product[] = [
  // ROUPAS
  p({
    id: "kls-0001", ref: "KLS-0001", slug: "vestido-midi-entardecer",
    name: "Vestido Midi Entardecer", type: "roupa", category: "Vestidos",
    price: 289.90, compareAt: 349.90,
    description: "Silhueta fluida em viscose com toque de seda, decote coração e amarração nas costas. Cai como um entardecer sobre a pele — quente, dourado, íntimo.",
    rating: 4.9, reviews: 148, stock: 12, isBestseller: true,
    sizes: ["PP","P","M","G","GG"],
    colors: [{name:"Ameixa", hex:"#6b3a4a"},{name:"Terracota", hex:"#9C4F44"}],
    fabric: "92% Viscose · 8% Elastano",
    care: ["Lavar à mão em água fria","Não usar alvejante","Secar à sombra","Passar em temperatura baixa"],
    testimonial: { name:"Marina L.", city:"São Paulo, SP", quote:"O caimento é surreal. Recebi elogios a noite inteira.", rating:5 },
    imageLabel: "foto editorial · vestido ka lamour", duotone: 0,
  }),
  p({
    id: "kls-0002", ref: "KLS-0002", slug: "blusa-ombro-a-ombro-rouge",
    name: "Blusa Ombro a Ombro Rouge", type: "roupa", category: "Blusas",
    price: 129.90,
    description: "Ombros expostos, elástico invisível e um tom rouge que aquece o rosto. A peça que resolve o jantar de última hora.",
    rating: 4.7, reviews: 92, stock: 20,
    sizes: ["PP","P","M","G"], colors: [{name:"Rouge",hex:"#B0746A"},{name:"Marfim",hex:"#FAF6F1"}],
    fabric: "100% Algodão penteado",
    imageLabel: "look ka lamour · blusa rouge", duotone: 1,
  }),
  p({
    id: "kls-0003", ref: "KLS-0003", slug: "calca-wide-leg-alfaiataria",
    name: "Calça Wide Leg Alfaiataria", type: "roupa", category: "Calças",
    price: 219.90,
    description: "Alfaiataria feminina de cintura alta, pregas frontais e caimento longo que alonga a silhueta. Sofisticada do café ao coquetel.",
    rating: 4.8, reviews: 134, stock: 15,
    sizes: ["36","38","40","42","44"],
    colors: [{name:"Preto",hex:"#2D2A29"},{name:"Areia",hex:"#c9b39a"}],
    fabric: "Tecido de alfaiataria com toque frio",
    imageLabel: "editorial · alfaiataria feminina", duotone: 2,
  }),
  p({
    id: "kls-0004", ref: "KLS-0004", slug: "saia-cetim-ameixa",
    name: "Saia Cetim Ameixa", type: "roupa", category: "Saias",
    price: 159.90, isNew: true,
    description: "Cetim líquido cor de ameixa madura, corte enviesado e fenda discreta. Move como se tivesse vida própria.",
    rating: 4.9, reviews: 61, stock: 9,
    sizes: ["PP","P","M","G"], colors: [{name:"Ameixa",hex:"#6b3a4a"}],
    fabric: "Cetim de viscose",
    imageLabel: "detalhe · cetim ameixa", duotone: 3,
  }),
  p({
    id: "kls-0005", ref: "KLS-0005", slug: "cropped-canelado-nude",
    name: "Cropped Canelado Nude", type: "roupa", category: "Blusas",
    price: 89.90,
    description: "Canelado colado ao corpo em tom nude quente. Base curinga para calças de cintura alta e saias midi.",
    rating: 4.6, reviews: 210, stock: 34, isBestseller: true,
    sizes: ["Único"], colors: [{name:"Nude",hex:"#ECD3CA"},{name:"Preto",hex:"#2D2A29"},{name:"Chocolate",hex:"#5a3a2e"}],
    fabric: "Viscose canelada",
    testimonial: { name:"Julia P.", city:"Belo Horizonte, MG", quote:"Comprei três cores. Uso com absolutamente tudo.", rating:5 },
    imageLabel: "look básico ka lamour", duotone: 4,
  }),
  p({
    id: "kls-0006", ref: "KLS-0006", slug: "blazer-oversized-tinta",
    name: "Blazer Oversized Tinta", type: "roupa", category: "Casacos",
    price: 329.90,
    description: "Ombros marcados, forro de cetim e cor tinta profunda. O blazer que faz o look sozinho.",
    rating: 4.8, reviews: 74, stock: 7,
    sizes: ["P","M","G"], colors: [{name:"Tinta",hex:"#1a2340"}],
    fabric: "Poliéster técnico com forro em cetim",
    imageLabel: "campanha · alfaiataria tinta", duotone: 5,
  }),
  p({
    id: "kls-0007", ref: "KLS-0007", slug: "conjunto-linho-creme",
    name: "Conjunto Linho Creme", type: "roupa", category: "Conjuntos",
    price: 269.90, soldOut: true,
    description: "Camisa e bermuda em linho puro cor de creme fresco. A dupla de verão que respira com você.",
    rating: 4.9, reviews: 88, stock: 0,
    sizes: ["P","M","G"], colors: [{name:"Creme",hex:"#e8dfd0"}],
    fabric: "100% Linho",
    imageLabel: "verão ka lamour · linho", duotone: 0,
  }),
  p({
    id: "kls-0008", ref: "KLS-0008", slug: "vestido-longo-fenda-cereja",
    name: "Vestido Longo Fenda Cereja", type: "roupa", category: "Vestidos",
    price: 359.90, isNew: true,
    description: "Vermelho cereja profundo, alcinhas finas e fenda até a coxa. Para as noites que pedem presença.",
    rating: 5.0, reviews: 42, stock: 6,
    sizes: ["PP","P","M","G"], colors: [{name:"Cereja",hex:"#7a1e2b"}],
    fabric: "Cetim com elastano",
    testimonial: { name:"Beatriz A.", city:"Rio de Janeiro, RJ", quote:"Usei no meu aniversário. Não teve foto ruim.", rating:5 },
    imageLabel: "vestido cereja · noite", duotone: 1,
  }),

  // PERFUMES
  p({
    id: "kls-0101", ref: "KLS-0101", slug: "rubra-edp-50ml",
    name: "Rubra Eau de Parfum 50ml", type: "perfume", category: "Perfumes",
    price: 249.90,
    description: "Um floral âmbar que abre com pimenta rosa e bergamota, floresce em rosa turca e jasmim, e assina com âmbar, baunilha e almíscar. Envolvente do primeiro spray à última hora.",
    rating: 4.9, reviews: 312, stock: 42, isBestseller: true,
    volumes: ["30ml","50ml","100ml"],
    pyramid: {
      familia: "floral",
      topo: ["Pimenta rosa","Bergamota","Cassis"],
      coracao: ["Rosa turca","Jasmim","Pêssego"],
      fundo: ["Âmbar","Baunilha","Almíscar branco"],
      fixacao: "8–10 horas", projecao: "Média-alta", ocasiao: "Noite, encontros, ocasiões especiais",
    },
    testimonial: { name:"Camila R.", city:"Curitiba, PR", quote:"Ganhei três elogios só no elevador. Virou meu perfume assinatura.", rating:5 },
    imageLabel: "rubra edp · assinatura", duotone: 2,
  }),
  p({
    id: "kls-0102", ref: "KLS-0102", slug: "layali-al-sharq",
    name: "Layali Al Sharq Oriental Intenso", type: "perfume", category: "Perfumes",
    price: 189.90,
    description: "Uma noite árabe em frasco: incenso, oud suave, mel escuro e resinas doces. Pele quente, memória longa.",
    rating: 4.8, reviews: 176, stock: 28,
    volumes: ["50ml","100ml"],
    pyramid: {
      familia: "oriental",
      topo: ["Açafrão","Cardamomo"],
      coracao: ["Oud","Rosa damascena","Mel"],
      fundo: ["Âmbar","Benjoim","Baunilha"],
      fixacao: "10–12 horas", projecao: "Alta", ocasiao: "Noite, inverno, ocasiões marcantes",
    },
    imageLabel: "layali · oriental intenso", duotone: 3,
  }),
  p({
    id: "kls-0103", ref: "KLS-0103", slug: "nevoa-capilar-flor-laranjeira",
    name: "Névoa Capilar Flor de Laranjeira", type: "perfume", category: "Perfumes",
    price: 89.90,
    description: "Uma bruma leve para os cabelos: flor de laranjeira, neroli e um véu de almíscar. Perfume que segue você quando o vento passa.",
    rating: 4.7, reviews: 98, stock: 60,
    volumes: ["120ml"],
    pyramid: {
      familia: "floral",
      topo: ["Neroli","Bergamota"],
      coracao: ["Flor de laranjeira","Jasmim sambac"],
      fundo: ["Almíscar branco","Cedro"],
      fixacao: "4–6 horas", projecao: "Suave", ocasiao: "Dia a dia, verão",
    },
    imageLabel: "névoa capilar · flor de laranjeira", duotone: 4,
  }),
  p({
    id: "kls-0104", ref: "KLS-0104", slug: "vetiver-noir-100ml",
    name: "Vetiver Noir 100ml", type: "perfume", category: "Perfumes",
    price: 279.90, isNew: true,
    description: "Vetiver defumado, couro macio e um fio de tabaco doce. Sofisticação sem esforço, para peles que gostam de deixar rastro.",
    rating: 4.9, reviews: 64, stock: 18,
    volumes: ["50ml","100ml"],
    pyramid: {
      familia: "amadeirado",
      topo: ["Bergamota","Cardamomo"],
      coracao: ["Vetiver do Haiti","Íris"],
      fundo: ["Couro","Tabaco doce","Âmbar cinza"],
      fixacao: "10+ horas", projecao: "Alta", ocasiao: "Noite, inverno",
    },
    imageLabel: "vetiver noir · amadeirado", duotone: 5,
  }),
  p({
    id: "kls-0105", ref: "KLS-0105", slug: "kit-rubra",
    name: "Kit Rubra — Eau de Parfum + Body Splash", type: "perfume", category: "Kits",
    price: 319.90, compareAt: 379.80,
    description: "O ritual completo de Rubra: eau de parfum 50ml + body splash 200ml para camadas de perfume que duram o dia inteiro.",
    rating: 4.9, reviews: 87, stock: 22,
    volumes: ["Kit"],
    pyramid: {
      familia: "floral",
      topo: ["Pimenta rosa","Bergamota"],
      coracao: ["Rosa turca","Jasmim"],
      fundo: ["Âmbar","Baunilha","Almíscar"],
      fixacao: "Camadas · o dia todo", projecao: "Média-alta", ocasiao: "Presente, ritual completo",
    },
    imageLabel: "kit rubra · ritual", duotone: 0,
  }),

  // COSMÉTICOS
  p({
    id: "kls-0201", ref: "KLS-0201", slug: "manteiga-corporal-karite-48h",
    name: "Manteiga Corporal Karité 48h", type: "cosmetico", category: "Corpo",
    price: 79.90,
    description: "Manteiga densa de karité e óleo de amêndoas doces com hidratação clínica de 48 horas. Toque aveludado, sem pegajoso.",
    rating: 4.8, reviews: 244, stock: 55, isBestseller: true,
    volumes: ["200ml"],
    actives: ["Manteiga de karité 15%","Óleo de amêndoas doces","Pantenol","Vitamina E"],
    testimonial: { name:"Renata M.", city:"Florianópolis, SC", quote:"Minha pele nunca ficou tão macia. O cheiro é um afago.", rating:5 },
    imageLabel: "manteiga karité · ritual corpo", duotone: 1,
  }),
  p({
    id: "kls-0202", ref: "KLS-0202", slug: "serum-vitamina-c-10",
    name: "Sérum Vitamina C 10%", type: "cosmetico", category: "Rosto",
    price: 119.90,
    description: "Vitamina C estabilizada 10% + ácido ferúlico para brilho de manhã e antioxidação o dia inteiro. Textura fluida, absorção imediata.",
    rating: 4.7, reviews: 189, stock: 40,
    volumes: ["30ml"],
    actives: ["Vitamina C 10% (etil ascórbico)","Ácido ferúlico","Vitamina E","Niacinamida 2%"],
    imageLabel: "sérum vit c · brilho", duotone: 2,
  }),
  p({
    id: "kls-0203", ref: "KLS-0203", slug: "sabonete-vegetal-ameixa-negra",
    name: "Sabonete Vegetal Ameixa Negra", type: "cosmetico", category: "Banho",
    price: 34.90,
    description: "Sabonete em barra com óleos vegetais e extrato de ameixa negra. Espuma cremosa, aroma frutal aveludado, deixa um véu de perfume na pele.",
    rating: 4.6, reviews: 156, stock: 120,
    volumes: ["120g"],
    actives: ["Óleo de coco","Manteiga de cacau","Extrato de ameixa"],
    imageLabel: "sabonete ameixa · banho", duotone: 3,
  }),
  p({
    id: "kls-0204", ref: "KLS-0204", slug: "mascara-labial-overnight",
    name: "Máscara Labial Overnight", type: "cosmetico", category: "Lábios",
    price: 59.90, isNew: true,
    description: "Bálsamo de dormir com manteiga de manga e óleo de rosa mosqueta. Você deita, ele repara. Você acorda, seus lábios agradecem.",
    rating: 4.9, reviews: 73, stock: 44,
    volumes: ["15g"],
    actives: ["Manteiga de manga","Óleo de rosa mosqueta","Ceramida NP","Ácido hialurônico"],
    imageLabel: "máscara labial · overnight", duotone: 4,
  }),
  p({
    id: "kls-0205", ref: "KLS-0205", slug: "bruma-facial-hidratante",
    name: "Bruma Facial Hidratante", type: "cosmetico", category: "Rosto",
    price: 69.90,
    description: "Água floral de rosa damascena com ácido hialurônico. Um refresco entre as camadas, um respiro no meio da tarde.",
    rating: 4.7, reviews: 118, stock: 68,
    volumes: ["100ml"],
    actives: ["Água floral de rosa","Ácido hialurônico","Pantenol","Aloe vera"],
    imageLabel: "bruma facial · refresco", duotone: 5,
  }),
];

export const getProduct = (id: string) => products.find(p => p.id === id || p.slug === id);
export const byType = (t: ProductType) => products.filter(p => p.type === t);
export const bestsellers = () => products.filter(p => p.isBestseller);
export const novidades = () => products.filter(p => p.isNew);
export const ofertas = () => products.filter(p => p.compareAt);
