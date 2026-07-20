import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ColorPicker, type ColorEntry } from "@/components/admin/ColorPicker";
import { ChipToggle } from "@/components/admin/ChipToggle";
import { TagInput } from "@/components/admin/TagInput";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import {
  upsertProduct,
  updateProduct,
  nextSku,
  type CategoryRow,
  type ProductRow,
  type ProductImageRow,
} from "@/lib/supabase-catalog";

const SIZE_PRESETS = ["PP", "P", "M", "G", "GG", "Único", "36", "38", "40", "42", "44"];
const VOLUME_PRESETS = ["15ml", "30ml", "50ml", "100ml", "120ml", "200ml", "15g", "120g"];

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

function toArray(v: unknown): string[] {
  return Array.isArray(v) ? (v as string[]) : [];
}

function toColors(v: unknown): ColorEntry[] {
  return Array.isArray(v) ? (v as ColorEntry[]) : [];
}

interface Pyramid {
  familia?: string;
  topo?: string[];
  coracao?: string[];
  fundo?: string[];
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
  const [generating, setGenerating] = React.useState(false);

  const [categoryId, setCategoryId] = React.useState(p?.category_id ?? "");
  const category = categories.find((c) => c.id === categoryId);
  const type = category?.product_type;

  const [ref, setRef] = React.useState(p?.ref ?? "");
  const [refTouched, setRefTouched] = React.useState(!!p);
  const [slug, setSlug] = React.useState(p?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(!!p);
  const [name, setName] = React.useState(p?.name ?? "");
  const [price, setPrice] = React.useState(p?.price?.toString() ?? "");
  const [compareAt, setCompareAt] = React.useState(p?.compare_at_price?.toString() ?? "");
  const [description, setDescription] = React.useState(p?.description ?? "");
  const [aiBrief, setAiBrief] = React.useState("");
  const [stock, setStock] = React.useState(p?.stock?.toString() ?? "0");
  const [isNew, setIsNew] = React.useState(p?.is_new ?? false);
  const [isBestseller, setIsBestseller] = React.useState(p?.is_bestseller ?? false);
  const [isActive, setIsActive] = React.useState(p?.is_active ?? true);

  const [sizes, setSizes] = React.useState<string[]>(toArray(p?.sizes));
  const [colors, setColors] = React.useState<ColorEntry[]>(toColors(p?.colors));
  const [fabric, setFabric] = React.useState(p?.fabric ?? "");
  const [care, setCare] = React.useState<string[]>(toArray(p?.care));

  const [volumes, setVolumes] = React.useState<string[]>(toArray(p?.volumes));
  const [actives, setActives] = React.useState<string[]>(toArray(p?.actives));

  const pyramidInitial = (p?.pyramid ?? null) as Pyramid | null;
  const [familia, setFamilia] = React.useState(pyramidInitial?.familia ?? "");
  const [topo, setTopo] = React.useState<string[]>(toArray(pyramidInitial?.topo));
  const [coracao, setCoracao] = React.useState<string[]>(toArray(pyramidInitial?.coracao));
  const [fundo, setFundo] = React.useState<string[]>(toArray(pyramidInitial?.fundo));
  const [fixacao, setFixacao] = React.useState(pyramidInitial?.fixacao ?? "");
  const [projecao, setProjecao] = React.useState(pyramidInitial?.projecao ?? "");
  const [ocasiao, setOcasiao] = React.useState(pyramidInitial?.ocasiao ?? "");

  // slug automático ao digitar o nome (até o usuário editar o slug manualmente)
  function onNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  // ao escolher categoria, sugere o próximo SKU (se ainda não foi digitado à mão)
  async function onCategoryChange(id: string) {
    setCategoryId(id);
    const cat = categories.find((c) => c.id === id);
    if (cat && !refTouched) {
      try {
        setRef(await nextSku(cat.product_type as "roupa" | "perfume" | "cosmetico"));
      } catch {
        /* silencioso — usuário pode digitar manualmente */
      }
    }
  }

  async function generateDescription() {
    if (!name.trim()) { toast.error("Preencha o nome do produto primeiro."); return; }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-product-description", {
        body: {
          nome: name,
          categoria: category?.name ?? "",
          tipo: type ?? "",
          rascunho: aiBrief,
          atributos: {
            cores: colors.map((c) => c.name),
            tamanhos: sizes,
            volumes,
            notas: [...topo, ...coracao, ...fundo],
            ativos: actives,
            tecido: fabric,
          },
        },
      });
      if (error) throw error;
      const text = (data as { description?: string })?.description?.trim();
      if (!text) throw new Error("A IA não retornou texto. Tente de novo.");
      setDescription(text);
      toast.success("Descrição gerada ✦ revise e ajuste se quiser.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível gerar a descrição.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId) { toast.error("Escolha uma categoria."); return; }
    setSaving(true);
    try {
      const pyramid = type === "perfume"
        ? { familia: familia || undefined, topo, coracao, fundo, fixacao: fixacao || undefined, projecao: projecao || undefined, ocasiao: ocasiao || undefined }
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
        sizes: type === "roupa" && sizes.length ? sizes : null,
        colors: (type === "roupa" && colors.length ? colors : null) as unknown as Json | null,
        fabric: type === "roupa" ? (fabric || null) : null,
        care: type === "roupa" && care.length ? care : null,
        volumes: type !== "roupa" && volumes.length ? volumes : null,
        actives: (type === "cosmetico" || type === "perfume") && actives.length ? actives : null,
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
      <div>
        <Label htmlFor="name">Nome do produto</Label>
        <Input id="name" value={name} onChange={(e) => onNameChange(e.target.value)} required placeholder="Ex: Vestido Midi Entardecer" />
      </div>

      <div>
        <Label>Categoria</Label>
        <Select value={categoryId} onValueChange={onCategoryChange}>
          <SelectTrigger><SelectValue placeholder="Escolha a categoria" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name} ({c.product_type})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ref">Código do produto (SKU)</Label>
          <Input id="ref" value={ref} onChange={(e) => { setRef(e.target.value); setRefTouched(true); }} required placeholder="Escolha a categoria e ele é sugerido" />
        </div>
        <div>
          <Label htmlFor="slug">Endereço na loja (URL)</Label>
          <Input id="slug" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} placeholder="gerado a partir do nome" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Preço (R$)</Label>
          <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="compareAt">Preço "de" (opcional)</Label>
          <Input id="compareAt" type="number" step="0.01" value={compareAt} onChange={(e) => setCompareAt(e.target.value)} placeholder="preço antigo riscado" />
        </div>
        <div>
          <Label htmlFor="stock">Estoque</Label>
          <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
        </div>
      </div>

      {/* Descrição + IA */}
      <div className="border rounded-md p-4 space-y-3 bg-accent/20">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="description">Descrição</Label>
          <Button type="button" variant="outline" size="sm" onClick={generateDescription} disabled={generating}>
            <Sparkles className="h-4 w-4" /> {generating ? "Gerando…" : "Gerar com IA"}
          </Button>
        </div>
        <Input
          value={aiBrief}
          onChange={(e) => setAiBrief(e.target.value)}
          placeholder="Descreva em poucas palavras para a IA (ex: vestido de viscose, cor ameixa, para a noite)"
        />
        <Textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A descrição comercial aparece aqui — escreva ou gere com IA e ajuste." />
      </div>

      <div className="flex flex-wrap gap-8">
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={isNew} onCheckedChange={setIsNew} /> Novidade
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={isBestseller} onCheckedChange={setIsBestseller} /> Mais vendido
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={isActive} onCheckedChange={setIsActive} /> Ativo na loja
        </label>
      </div>

      {type === "roupa" && (
        <div className="border rounded-md p-4 space-y-5">
          <p className="text-sm font-medium">Detalhes de roupa</p>
          <div>
            <Label>Tamanhos</Label>
            <div className="mt-2"><ChipToggle value={sizes} onChange={setSizes} presets={SIZE_PRESETS} placeholder="Outro tamanho" /></div>
          </div>
          <div>
            <Label>Cores</Label>
            <div className="mt-2"><ColorPicker value={colors} onChange={setColors} /></div>
          </div>
          <div>
            <Label htmlFor="fabric">Tecido / composição</Label>
            <Input id="fabric" value={fabric} onChange={(e) => setFabric(e.target.value)} placeholder="Ex: 92% Viscose · 8% Elastano" />
          </div>
          <div>
            <Label>Cuidados</Label>
            <div className="mt-2"><TagInput value={care} onChange={setCare} placeholder="Ex: Lavar à mão (Enter para adicionar)" /></div>
          </div>
        </div>
      )}

      {type !== "roupa" && type && (
        <div className="border rounded-md p-4 space-y-5">
          <p className="text-sm font-medium">Detalhes de {type === "perfume" ? "perfume" : "cosmético"}</p>
          <div>
            <Label>Volumes / tamanhos</Label>
            <div className="mt-2"><ChipToggle value={volumes} onChange={setVolumes} presets={VOLUME_PRESETS} placeholder="Outro volume" /></div>
          </div>
          <div>
            <Label>Ativos / ingredientes</Label>
            <div className="mt-2"><TagInput value={actives} onChange={setActives} placeholder="Ex: Ácido hialurônico (Enter para adicionar)" /></div>
          </div>
        </div>
      )}

      {type === "perfume" && (
        <div className="border rounded-md p-4 space-y-5">
          <p className="text-sm font-medium">Pirâmide olfativa</p>
          <div>
            <Label htmlFor="familia">Família olfativa</Label>
            <Select value={familia} onValueChange={setFamilia}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Escolha a família" /></SelectTrigger>
              <SelectContent>
                {["floral", "amadeirado", "oriental", "citrico"].map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Notas de topo</Label>
            <div className="mt-2"><TagInput value={topo} onChange={setTopo} placeholder="Ex: Bergamota (Enter para adicionar)" /></div>
          </div>
          <div>
            <Label>Notas de coração</Label>
            <div className="mt-2"><TagInput value={coracao} onChange={setCoracao} placeholder="Ex: Jasmim (Enter para adicionar)" /></div>
          </div>
          <div>
            <Label>Notas de fundo</Label>
            <div className="mt-2"><TagInput value={fundo} onChange={setFundo} placeholder="Ex: Âmbar (Enter para adicionar)" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fixacao">Fixação</Label>
              <Input id="fixacao" value={fixacao} onChange={(e) => setFixacao(e.target.value)} placeholder="8–10 horas" />
            </div>
            <div>
              <Label htmlFor="projecao">Projeção</Label>
              <Input id="projecao" value={projecao} onChange={(e) => setProjecao(e.target.value)} placeholder="Média-alta" />
            </div>
            <div>
              <Label htmlFor="ocasiao">Ocasião</Label>
              <Input id="ocasiao" value={ocasiao} onChange={(e) => setOcasiao(e.target.value)} placeholder="Noite, encontros" />
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
