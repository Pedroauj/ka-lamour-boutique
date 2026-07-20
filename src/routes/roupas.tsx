import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { CatalogView } from "@/components/catalog/CatalogView";
import { byType } from "@/data/products";

export const Route = createFileRoute("/roupas")({
  head: () => ({ meta: [{ title: "Roupas — Ka Lamour Store" }, { name: "description", content: "Vestidos, alfaiataria e conjuntos com curadoria Ka Lamour." }] }),
  component: () => (
    <SiteShell>
      <CatalogView title="Roupas" subtitle="Silhuetas fluidas, alfaiataria feminina e vestidos que se movem com você." items={byType("roupa")} />
    </SiteShell>
  ),
});
