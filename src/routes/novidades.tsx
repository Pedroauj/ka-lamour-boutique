import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { CatalogView } from "@/components/catalog/CatalogView";
import { useCatalog } from "@/lib/catalog-store";

export const Route = createFileRoute("/novidades")({
  head: () => ({ meta: [{ title: "Novidades — Ka Lamour Store" }, { name: "description", content: "As últimas chegadas da curadoria Ka Lamour." }] }),
  component: () => (
    <SiteShell>
      <NovidadesView />
    </SiteShell>
  ),
});

function NovidadesView() {
  const { novidades, loading } = useCatalog();
  return <CatalogView title="Novidades" subtitle="Recém-chegadas à boutique." items={novidades()} loading={loading} />;
}
