import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { CatalogView } from "@/components/catalog/CatalogView";
import { byType } from "@/data/products";

export const Route = createFileRoute("/perfumes")({
  head: () => ({ meta: [{ title: "Perfumes — Ka Lamour Store" }, { name: "description", content: "Perfumaria autoral: florais, orientais, amadeirados e cítricos." }] }),
  component: () => (
    <SiteShell>
      <CatalogView title="Perfumes" subtitle="Perfumaria que fica na pele — e na memória." items={byType("perfume")} />
    </SiteShell>
  ),
});
