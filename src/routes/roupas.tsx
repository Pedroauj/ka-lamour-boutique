import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { CatalogView } from "@/components/catalog/CatalogView";
import { useCatalog } from "@/lib/catalog-store";

export const Route = createFileRoute("/roupas")({
  head: () => ({ meta: [{ title: "Roupas — Ka Lamour Store" }, { name: "description", content: "Vestidos, alfaiataria e conjuntos com curadoria Ka Lamour." }] }),
  component: () => (
    <SiteShell>
      <RoupasView />
    </SiteShell>
  ),
});

function RoupasView() {
  const { byType, loading } = useCatalog();
  return <CatalogView title="Roupas" subtitle="Silhuetas fluidas, alfaiataria feminina e vestidos que se movem com você." items={byType("roupa")} loading={loading} />;
}
