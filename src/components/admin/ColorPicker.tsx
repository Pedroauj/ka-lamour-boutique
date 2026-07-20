import * as React from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ColorEntry { name: string; hex: string }

// Paleta de atalho com as cores da marca Ka Lamour (styles.css) + neutros comuns.
const PRESETS: ColorEntry[] = [
  { name: "Marfim", hex: "#FAF6F1" },
  { name: "Nude", hex: "#ECD3CA" },
  { name: "Rosé", hex: "#D9A79B" },
  { name: "Rosewood", hex: "#B0746A" },
  { name: "Terracota", hex: "#9C4F44" },
  { name: "Ameixa", hex: "#6b3a4a" },
  { name: "Cereja", hex: "#7a1e2b" },
  { name: "Grafite", hex: "#4A4644" },
  { name: "Carvão", hex: "#2D2A29" },
  { name: "Branco", hex: "#FFFFFF" },
  { name: "Preto", hex: "#000000" },
  { name: "Areia", hex: "#c9b39a" },
];

export function ColorPicker({
  value,
  onChange,
}: {
  value: ColorEntry[];
  onChange: (colors: ColorEntry[]) => void;
}) {
  const [name, setName] = React.useState("");
  const [hex, setHex] = React.useState("#9C4F44");

  function add(entry: ColorEntry) {
    if (!entry.name.trim()) return;
    if (value.some((c) => c.name.toLowerCase() === entry.name.toLowerCase())) return;
    onChange([...value, entry]);
  }

  function addManual() {
    add({ name: name.trim(), hex });
    setName("");
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-3">
      {/* chips já escolhidos */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-2 border rounded-full pl-1.5 pr-2 py-1 text-sm">
              <span className="h-4 w-4 rounded-full border" style={{ background: c.hex }} />
              {c.name}
              <button type="button" onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* paleta de atalho */}
      <div>
        <p className="text-xs text-muted-foreground mb-1.5">Cores da marca (clique para adicionar)</p>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => {
            const used = value.some((c) => c.name.toLowerCase() === p.name.toLowerCase());
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => add(p)}
                disabled={used}
                title={p.name}
                className="h-8 w-8 rounded-full border-2 hover:scale-110 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: p.hex, borderColor: used ? "var(--primary)" : "rgba(0,0,0,.15)" }}
              />
            );
          })}
        </div>
      </div>

      {/* adicionar cor personalizada */}
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1.5">Cor personalizada</p>
          <Input
            placeholder="Nome da cor (ex: Verde-oliva)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addManual(); } }}
          />
        </div>
        <input
          type="color"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="h-9 w-12 rounded-md border cursor-pointer bg-transparent"
          aria-label="Escolher tom da cor"
        />
        <Button type="button" variant="outline" onClick={addManual}>
          <Plus className="h-4 w-4" /> Adicionar
        </Button>
      </div>
    </div>
  );
}
