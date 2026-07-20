import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { listProductsAdmin, deleteProduct, type ProductWithCategory } from "@/lib/supabase-catalog";

export const Route = createFileRoute("/admin/produtos/")({
  component: ProductsList,
});

function ProductsList() {
  const [products, setProducts] = React.useState<ProductWithCategory[] | null>(null);
  const [search, setSearch] = React.useState("");

  async function load() {
    const data = await listProductsAdmin(search ? { search } : undefined);
    setProducts(data);
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    await load();
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Excluir "${name}"? Essa ação não pode ser desfeita.`)) return;
    try {
      await deleteProduct(id);
      toast.success("Produto excluído.");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl">Produtos</h1>
        <Button asChild>
          <Link to="/admin/produtos/novo"><Plus className="h-4 w-4" /> Novo produto</Link>
        </Button>
      </div>

      <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-sm">
        <Input placeholder="Buscar por nome…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button type="submit" variant="outline">Buscar</Button>
      </form>

      <div className="mt-6 border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.categories?.name ?? "—"}</TableCell>
                <TableCell>R$ {p.price.toFixed(2)}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>
                  {p.is_active ? (
                    <span className="text-xs text-green-700">ativo</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">inativo</span>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button asChild size="icon" variant="ghost">
                    <Link to="/admin/produtos/$id" params={{ id: p.id }}><Pencil className="h-4 w-4" /></Link>
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id, p.name)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {products?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
