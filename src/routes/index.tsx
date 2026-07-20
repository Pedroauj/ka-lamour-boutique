import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/home/Hero";
import { Universos } from "@/components/home/Universos";
import { Categorias } from "@/components/home/Categorias";
import { Lancamentos } from "@/components/home/Lancamentos";
import { Ranking } from "@/components/home/Ranking";
import { ShopTheLook } from "@/components/home/ShopTheLook";
import { Ritual } from "@/components/home/Ritual";
import { Campanha } from "@/components/home/Campanha";
import { Beneficios } from "@/components/home/Beneficios";
import { ProvaSocial } from "@/components/home/ProvaSocial";
import { Mural } from "@/components/home/Mural";
import { Newsletter } from "@/components/home/Newsletter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ka Lamour Store — Moda, Perfumaria e Cosméticos" },
      { name: "description", content: "Vista o que você sente. Perfume o resto. Boutique digital com curadoria editorial de moda feminina, perfumes e cosméticos." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteShell transparentHeader>
      <Hero />
      <Universos />
      <Categorias />
      <Lancamentos />
      <Ranking />
      <ShopTheLook />
      <Ritual />
      <Campanha />
      <Beneficios />
      <ProvaSocial />
      <Mural />
      <Newsletter />
    </SiteShell>
  );
}
