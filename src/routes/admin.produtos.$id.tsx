import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductForm } from "@/components/admin/ProductForm";
import { listCategories, getProductAdmin } from "@/lib/supabase-catalog";

export const Route = createFileRoute("/admin/produtos/$id")({
  loader: async ({ params }) => {
    const [categories, productData] = await Promise.all([
      listCategories(),
      getProductAdmin(params.id).catch(() => null),
    ]);
    if (!productData) throw notFound();
    return { categories, ...productData };
  },
  component: EditProduct,
});

function EditProduct() {
  const { categories, product, images } = Route.useLoaderData();
  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Editar produto</h1>
      <ProductForm categories={categories} initial={{ product, images }} />
    </div>
  );
}
