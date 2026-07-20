import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { CatalogView } from "@/components/catalog/CatalogView";
import { ofertas } from "@/data/products";

export const Route = createFileRoute("/ofertas")({
  head: () => ({ meta: [{ title: "Ofertas — Ka Lamour Store" }, { name: "description", content: "Peças selecionadas com preços especiais." }] }),
  component: () => (
    <SiteShell>
      <CatalogView title="Ofertas" subtitle="Uma seleção editorial com preços especiais." items={ofertas()} />
    </SiteShell>
  ),
});
