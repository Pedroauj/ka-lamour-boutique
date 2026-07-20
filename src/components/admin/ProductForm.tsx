import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Json } from "@/integrations/supabase/types";
import {
  upsertProduct,
  updateProduct,
  type CategoryRow,
  type ProductRow,
  type ProductImageRow,
} from "@/lib/supabase-catalog";

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseList(value: string): string[] | null {
  const items = value.split(",").map((s) => s.trim()).filter(Boolean);
  return items.length > 0 ? items : null;
}

function serializeList(value: string[] | null | undefined): string {
  return (value ?? []).join(", ");
}

interface ColorEntry { name: string; hex: string }

function parseColors(value: string): ColorEntry[] | null {
  const items = value
    .split(",")
    .map((pair) => {
      const [name, hex] = pair.split(":").map((s) => s.trim());
      return name && hex ? { name, hex } : null;
    })
    .filter((c): c is ColorEntry => c !== null);
  return items.length > 0 ? items : null;
}

function serializeColors(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return (value as ColorEntry[]).map((c) => `${c.name}:${c.hex}`).join(", ");
}

interface Pyramid {
  familia?: string;
  topo: string[];
  coracao: string[];
  fundo: string[];
  fixacao?: string;
  projecao?: string;
  ocasiao?: string;
}

export function ProductForm({
  categories,
  initial,
}: {
  categories: CategoryRow[];
  initial?: { product: ProductRow; images: ProductImageRow[] };
}) {
  const navigate = useNavigate();
  const p = initial?.product;
  const [images, setImages] = React.useState<ProductImageRow[]>(initial?.images ?? []);
  const [saving, setSaving] = React.useState(false);

  const [categoryId, setCategoryId] = React.useState(p?.category_id ?? "");
  const category = categories.find((c) => c.id === categoryId);
  const type = category?.product_type;

  const [ref, setRef] = React.useState(p?.ref ?? "");
  const [slug, setSlug] = React.useState(p?.slug ?? "");
  const [name, setName] = React.useState(p?.name ?? "");
  const [price, setPrice] = React.useState(p?.price?.toString() ?? "");
  const [compareAt, setCompareAt] = React.useState(p?.compare_at_price?.toString() ?? "");
  const [description, setDescription] = React.useState(p?.description ?? "");
  const [stock, setStock] = React.useState(p?.stock?.toString() ?? "0");
  const [isNew, setIsNew] = React.useState(p?.is_new ?? false);
  const [isBestseller, setIsBestseller] = React.useState(p?.is_bestseller ?? false);
  const [isActive, setIsActive] = React.useState(p?.is_active ?? true);

  const [sizes, setSizes] = React.useState(serializeList(p?.sizes));
  const [colors, setColors] = React.useState(serializeColors(p?.colors));
  const [fabric, setFabric] = React.useState(p?.fabric ?? "");
  const [care, setCare] = React.useState(serializeList(p?.care));

  const [volumes, setVolumes] = React.useState(serializeList(p?.volumes));
  const [actives, setActives] = React.useState(serializeList(p?.actives));

  const pyramidInitial = (p?.pyramid ?? null) as Pyramid | null;
  const [familia, setFamilia] = React.useState(pyramidInitial?.familia ?? "");
  const [topo, setTopo] = React.useState(serializeList(pyramidInitial?.topo));
  const [coracao, setCoracao] = React.useState(serializeList(pyramidInitial?.coracao));
  const [fundo, setFundo] = React.useState(serializeList(pyramidInitial?.fundo));
  const [fixacao, setFixacao] = React.useState(pyramidInitial?.fixacao ?? "");
  const [projecao, setProjecao] = React.useState(pyramidInitial?.projecao ?? "");
  const [ocasiao, setOcasiao] = React.useState(pyramidInitial?.ocasiao ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId) { toast.error("Escolha uma categoria."); return; }
    setSaving(true);
    try {
      const pyramid = type === "perfume"
        ? { familia: familia || undefined, topo: parseList(topo) ?? [], coracao: parseList(coracao) ?? [], fundo: parseList(fundo) ?? [], fixacao: fixacao || undefined, projecao: projecao || undefined, ocasiao: ocasiao || undefined }
        : null;

      const payload = {
        ref, slug: slug || slugify(name), name,
        category_id: categoryId,
        price: parseFloat(price || "0"),
        compare_at_price: compareAt ? parseFloat(compareAt) : null,
        description: description || null,
        stock: parseInt(stock || "0", 10),
        is_new: isNew,
        is_bestseller: isBestseller,
        is_active: isActive,
        sizes: type === "roupa" ? parseList(sizes) : null,
        colors: (type === "roupa" ? parseColors(colors) : null) as unknown as Json | null,
        fabric: type === "roupa" ? (fabric || null) : null,
        care: type === "roupa" ? parseList(care) : null,
        volumes: type !== "roupa" ? parseList(volumes) : null,
        actives: type === "cosmetico" || type === "perfume" ? parseList(actives) : null,
        pyramid: pyramid as unknown as Json | null,
      };

      if (p) {
        await updateProduct(p.id, payload);
        toast.success("Produto atualizado.");
      } else {
        const created = await upsertProduct(payload);
        toast.success("Produto criado. Agora adicione as fotos.");
        navigate({ to: "/admin/produtos/$id", params: { id: created.id } });
        return;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar o produto.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ref">Referência (SKU)</Label>
          <Input id="ref" value={ref} onChange={(e) => setRef(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="gerado a partir do nome se vazio" />
        </div>
      </div>

      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <Label>Categoria</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger><SelectValue placeholder="Escolha a categoria" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name} ({c.product_type})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Preço</Label>
          <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="compareAt">Preço "de" (opcional)</Label>
          <Input id="compareAt" type="number" step="0.01" value={compareAt} onChange={(e) => setCompareAt(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="stock">Estoque</Label>
          <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="flex gap-8">
        <label className="flex items-center gap-2">
          <Switch checked={isNew} onCheckedChange={setIsNew} /> Novidade
        </label>
        <label className="flex items-center gap-2">
          <Switch checked={isBestseller} onCheckedChange={setIsBestseller} /> Mais vendido
        </label>
        <label className="flex items-center gap-2">
          <Switch checked={isActive} onCheckedChange={setIsActive} /> Ativo na loja
        </label>
      </div>

      {type === "roupa" && (
        <div className="border rounded-md p-4 space-y-4">
          <p className="text-sm font-medium">Detalhes de roupa</p>
          <div>
            <Label htmlFor="sizes">Tamanhos (separados por vírgula)</Label>
            <Input id="sizes" value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="PP, P, M, G, GG" />
          </div>
          <div>
            <Label htmlFor="colors">Cores (formato Nome:#hex, separadas por vírgula)</Label>
            <Input id="colors" value={colors} onChange={(e) => setColors(e.target.value)} placeholder="Ameixa:#6b3a4a, Terracota:#9C4F44" />
          </div>
          <div>
            <Label htmlFor="fabric">Tecido</Label>
            <Input id="fabric" value={fabric} onChange={(e) => setFabric(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="care">Cuidados (separados por vírgula)</Label>
            <Input id="care" value={care} onChange={(e) => setCare(e.target.value)} placeholder="Lavar à mão, Não usar alvejante" />
          </div>
        </div>
      )}

      {type !== "roupa" && type && (
        <div className="border rounded-md p-4 space-y-4">
          <p className="text-sm font-medium">Detalhes de {type === "perfume" ? "perfume" : "cosmético"}</p>
          <div>
            <Label htmlFor="volumes">Volumes (separados por vírgula)</Label>
            <Input id="volumes" value={volumes} onChange={(e) => setVolumes(e.target.value)} placeholder="30ml, 50ml, 100ml" />
          </div>
          <div>
            <Label htmlFor="actives">Ativos/ingredientes (separados por vírgula)</Label>
            <Input id="actives" value={actives} onChange={(e) => setActives(e.target.value)} />
          </div>
        </div>
      )}

      {type === "perfume" && (
        <div className="border rounded-md p-4 space-y-4">
          <p className="text-sm font-medium">Pirâmide olfativa</p>
          <div>
            <Label htmlFor="familia">Família olfativa</Label>
            <Input id="familia" value={familia} onChange={(e) => setFamilia(e.target.value)} placeholder="floral, amadeirado, oriental, citrico" />
          </div>
          <div>
            <Label htmlFor="topo">Notas de topo</Label>
            <Input id="topo" value={topo} onChange={(e) => setTopo(e.target.value)} placeholder="Pimenta rosa, Bergamota" />
          </div>
          <div>
            <Label htmlFor="coracao">Notas de coração</Label>
            <Input id="coracao" value={coracao} onChange={(e) => setCoracao(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="fundo">Notas de fundo</Label>
            <Input id="fundo" value={fundo} onChange={(e) => setFundo(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fixacao">Fixação</Label>
              <Input id="fixacao" value={fixacao} onChange={(e) => setFixacao(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="projecao">Projeção</Label>
              <Input id="projecao" value={projecao} onChange={(e) => setProjecao(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="ocasiao">Ocasião</Label>
              <Input id="ocasiao" value={ocasiao} onChange={(e) => setOcasiao(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {p && (
        <div>
          <Label>Fotos</Label>
          <div className="mt-2">
            <ImageUploader productId={p.id} images={images} onChange={setImages} />
          </div>
        </div>
      )}

      <Button type="submit" disabled={saving}>
        {saving ? "Salvando…" : p ? "Salvar alterações" : "Criar produto"}
      </Button>
    </form>
  );
}
