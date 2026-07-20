import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { listCategories, upsertCategory, deleteCategory, type CategoryRow } from "@/lib/supabase-catalog";

export const Route = createFileRoute("/admin/categorias")({
  loader: () => listCategories(),
  component: CategoriesPage,
});

const TYPE_LABEL: Record<string, string> = { roupa: "Roupa", perfume: "Perfume", cosmetico: "Cosmético" };

function CategoriesPage() {
  const initial = Route.useLoaderData();
  const [categories, setCategories] = React.useState<CategoryRow[]>(initial);
  const [editing, setEditing] = React.useState<CategoryRow | null>(null);
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [productType, setProductType] = React.useState<"roupa" | "perfume" | "cosmetico">("roupa");
  const [saving, setSaving] = React.useState(false);

  function resetForm() {
    setEditing(null);
    setName("");
    setSlug("");
    setProductType("roupa");
  }

  function startEdit(c: CategoryRow) {
    setEditing(c);
    setName(c.name);
    setSlug(c.slug);
    setProductType(c.product_type as "roupa" | "perfume" | "cosmetico");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await upsertCategory({ id: editing?.id, name, slug, product_type: productType });
      setCategories((cs) => {
        const rest = cs.filter((c) => c.id !== saved.id);
        return [...rest, saved].sort((a, b) => a.name.localeCompare(b.name));
      });
      toast.success(editing ? "Categoria atualizada." : "Categoria criada.");
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar categoria.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(c: CategoryRow) {
    if (!window.confirm(`Excluir a categoria "${c.name}"? Produtos ligados a ela ficam sem categoria.`)) return;
    try {
      await deleteCategory(c.id);
      setCategories((cs) => cs.filter((x) => x.id !== c.id));
      toast.success("Categoria excluída.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir.");
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Categorias</h1>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 border rounded-lg p-4 max-w-2xl">
        <div>
          <Label htmlFor="cat-name">Nome</Label>
          <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} required className="w-40" />
        </div>
        <div>
          <Label htmlFor="cat-slug">Slug</Label>
          <Input id="cat-slug" value={slug} onChange={(e) => setSlug(e.target.value)} required className="w-40" />
        </div>
        <div>
          <Label>Tipo</Label>
          <Select value={productType} onValueChange={(v) => setProductType(v as typeof productType)}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="roupa">Roupa</SelectItem>
              <SelectItem value="perfume">Perfume</SelectItem>
              <SelectItem value="cosmetico">Cosmético</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={saving}>
          <Plus className="h-4 w-4" /> {editing ? "Salvar" : "Adicionar"}
        </Button>
        {editing && (
          <Button type="button" variant="ghost" onClick={resetForm}>Cancelar</Button>
        )}
      </form>

      <div className="mt-6 border rounded-lg max-w-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.slug}</TableCell>
                <TableCell>{TYPE_LABEL[c.product_type]}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => startEdit(c)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(c)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
