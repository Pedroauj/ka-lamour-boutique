import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { CatalogView } from "@/components/catalog/CatalogView";
import { useCatalog } from "@/lib/catalog-store";

export const Route = createFileRoute("/perfumes")({
  head: () => ({ meta: [{ title: "Perfumes — Ka Lamour Store" }, { name: "description", content: "Perfumaria autoral: florais, orientais, amadeirados e cítricos." }] }),
  component: () => (
    <SiteShell>
      <PerfumesView />
    </SiteShell>
  ),
});

function PerfumesView() {
  const { byType, loading } = useCatalog();
  return <CatalogView title="Perfumes" subtitle="Perfumaria que fica na pele — e na memória." items={byType("perfume")} loading={loading} />;
}
