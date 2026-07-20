import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type CategoryRow = Tables<"categories">;
export type ProductRow = Tables<"products">;
export type ProductImageRow = Tables<"product_images">;

const IMAGES_BUCKET = "product-images";

export function getProductImageUrl(storagePath: string): string {
  return supabase.storage.from(IMAGES_BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

// ---------- categorias ----------

export async function listCategories(): Promise<CategoryRow[]> {
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return data;
}

export async function upsertCategory(input: TablesInsert<"categories"> & { id?: string }): Promise<CategoryRow> {
  const { data, error } = await supabase.from("categories").upsert(input).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

// ---------- produtos ----------

export interface ProductWithCategory extends ProductRow {
  categories: Pick<CategoryRow, "id" | "name" | "slug" | "product_type"> | null;
}

export async function listProductsAdmin(params?: { search?: string; categoryId?: string }): Promise<ProductWithCategory[]> {
  let query = supabase
    .from("products")
    .select("*, categories(id, name, slug, product_type)")
    .order("created_at", { ascending: false });

  if (params?.categoryId) query = query.eq("category_id", params.categoryId);
  if (params?.search) query = query.ilike("name", `%${params.search}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as ProductWithCategory[];
}

export async function getProductAdmin(id: string): Promise<{ product: ProductRow; images: ProductImageRow[] }> {
  const [{ data: product, error: productError }, { data: images, error: imagesError }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("product_images").select("*").eq("product_id", id).order("position"),
  ]);
  if (productError) throw productError;
  if (imagesError) throw imagesError;
  return { product, images };
}

export async function upsertProduct(input: TablesInsert<"products"> & { id?: string }): Promise<ProductRow> {
  const { data, error } = await supabase.from("products").upsert(input).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, input: TablesUpdate<"products">): Promise<ProductRow> {
  const { data, error } = await supabase.from("products").update(input).eq("id", id).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// Sugere o próximo SKU no padrão KLS-XXxx conforme o tipo do produto:
// roupa -> 00xx, perfume -> 01xx, cosmetico -> 02xx.
const SKU_BASE: Record<string, number> = { roupa: 0, perfume: 100, cosmetico: 200 };

export async function nextSku(type: "roupa" | "perfume" | "cosmetico"): Promise<string> {
  const base = SKU_BASE[type] ?? 0;
  const { data } = await supabase
    .from("products")
    .select("ref")
    .ilike("ref", "KLS-%")
    .order("ref", { ascending: false });

  let max = base;
  for (const row of data ?? []) {
    const n = parseInt(row.ref.replace(/^KLS-/, ""), 10);
    if (!Number.isNaN(n) && n >= base && n < base + 100 && n > max) max = n;
  }
  return `KLS-${String(max + 1).padStart(4, "0")}`;
}

// ---------- fotos de produto ----------

export async function listProductImages(productId: string): Promise<ProductImageRow[]> {
  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("position");
  if (error) throw error;
  return data;
}

export async function uploadProductImage(productId: string, file: File): Promise<ProductImageRow> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${productId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(IMAGES_BUCKET).upload(path, file, { upsert: false });
  if (uploadError) throw uploadError;

  const existing = await listProductImages(productId);
  const nextPosition = existing.length > 0 ? Math.max(...existing.map((i) => i.position)) + 1 : 0;

  const { data, error } = await supabase
    .from("product_images")
    .insert({ product_id: productId, storage_path: path, position: nextPosition })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProductImage(image: ProductImageRow): Promise<void> {
  await supabase.storage.from(IMAGES_BUCKET).remove([image.storage_path]);
  const { error } = await supabase.from("product_images").delete().eq("id", image.id);
  if (error) throw error;
}

export async function reorderProductImages(images: { id: string; position: number }[]): Promise<void> {
  await Promise.all(
    images.map(({ id, position }) => supabase.from("product_images").update({ position }).eq("id", id))
  );
}
