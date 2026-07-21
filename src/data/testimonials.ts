// Depoimentos de clientes — conteúdo de marketing (prova social).
// Estático por enquanto; um sistema de avaliações ligado a pedidos é fase futura.
import type { Testimonial } from "./products";

export interface ReviewShowcase extends Testimonial {
  product: string;
}

export const testimonials: ReviewShowcase[] = [
  { name: "Marina L.", city: "São Paulo, SP", quote: "O caimento é surreal. Recebi elogios a noite inteira.", rating: 5, product: "Vestido Midi Entardecer" },
  { name: "Camila R.", city: "Curitiba, PR", quote: "Ganhei três elogios só no elevador. Virou meu perfume assinatura.", rating: 5, product: "Rubra Eau de Parfum 50ml" },
  { name: "Renata M.", city: "Florianópolis, SC", quote: "Minha pele nunca ficou tão macia. O cheiro é um afago.", rating: 5, product: "Manteiga Corporal Karité 48h" },
  { name: "Julia P.", city: "Belo Horizonte, MG", quote: "Comprei três cores. Uso com absolutamente tudo.", rating: 5, product: "Cropped Canelado Nude" },
];
