import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { CatalogView } from "@/components/catalog/CatalogView";
import { novidades } from "@/data/products";

export const Route = createFileRoute("/novidades")({
  head: () => ({ meta: [{ title: "Novidades — Ka Lamour Store" }, { name: "description", content: "As últimas chegadas da curadoria Ka Lamour." }] }),
  component: () => (
    <SiteShell>
      <CatalogView title="Novidades" subtitle="Recém-chegadas à boutique." items={novidades()} />
    </SiteShell>
  ),
});
