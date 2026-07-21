import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { CatalogView } from "@/components/catalog/CatalogView";
import { useCatalog } from "@/lib/catalog-store";

export const Route = createFileRoute("/cosmeticos")({
  head: () => ({ meta: [{ title: "Cosméticos — Ka Lamour Store" }, { name: "description", content: "Skincare, corpo e lábios com ativos que cuidam de verdade." }] }),
  component: () => (
    <SiteShell>
      <CosmeticosView />
    </SiteShell>
  ),
});

function CosmeticosView() {
  const { byType, loading } = useCatalog();
  return <CatalogView title="Cosméticos" subtitle="Rituais de cuidado com ativos escolhidos a dedo." items={byType("cosmetico")} loading={loading} />;
}
