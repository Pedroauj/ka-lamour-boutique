import { createFileRoute } from "@tanstack/react-router";
import { ProductForm } from "@/components/admin/ProductForm";
import { listCategories } from "@/lib/supabase-catalog";

export const Route = createFileRoute("/admin/produtos/novo")({
  loader: () => listCategories(),
  component: NewProduct,
});

function NewProduct() {
  const categories = Route.useLoaderData();
  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Novo produto</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
