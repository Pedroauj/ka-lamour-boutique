import * as React from "react";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getProductImageUrl,
  uploadProductImage,
  deleteProductImage,
  reorderProductImages,
  type ProductImageRow,
} from "@/lib/supabase-catalog";

export function ImageUploader({
  productId,
  images,
  onChange,
}: {
  productId: string;
  images: ProductImageRow[];
  onChange: (images: ProductImageRow[]) => void;
}) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: ProductImageRow[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadProductImage(productId, file));
      }
      onChange([...images, ...uploaded].sort((a, b) => a.position - b.position));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao subir a foto.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    const withPositions = next.map((img, i) => ({ ...img, position: i }));
    onChange(withPositions);
    await reorderProductImages(withPositions.map((i) => ({ id: i.id, position: i.position })));
  }

  async function remove(image: ProductImageRow) {
    try {
      await deleteProductImage(image);
      onChange(images.filter((i) => i.id !== image.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao remover a foto.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div key={img.id} className="relative w-28 h-32 border rounded-md overflow-hidden group">
            <img src={getProductImageUrl(img.storage_path)} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <div className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="h-6 w-6 flex items-center justify-center bg-white/90 rounded disabled:opacity-40">
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="h-6 w-6 flex items-center justify-center bg-white/90 rounded disabled:opacity-40">
                  <ArrowDown className="h-3 w-3" />
                </button>
              </div>
              <button type="button" onClick={() => remove(img)} className="h-6 w-6 flex items-center justify-center bg-white/90 rounded text-destructive">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-28 h-32 border border-dashed rounded-md flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Enviando…" : "Adicionar foto"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
