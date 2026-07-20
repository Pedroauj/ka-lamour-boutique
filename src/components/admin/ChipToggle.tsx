import * as React from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Botões que ligam/desligam valores pré-definidos + campo para adicionar custom.
// Usado para tamanhos e volumes. Salva como string[].
export function ChipToggle({
  value,
  onChange,
  presets,
  placeholder = "Adicionar outro",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  presets: string[];
  placeholder?: string;
}) {
  const [custom, setCustom] = React.useState("");

  function toggle(item: string) {
    onChange(value.includes(item) ? value.filter((v) => v !== item) : [...value, item]);
  }

  function addCustom() {
    const v = custom.trim();
    if (!v || value.includes(v)) { setCustom(""); return; }
    onChange([...value, v]);
    setCustom("");
  }

  // valores escolhidos que não estão nos presets (customizados) aparecem também como chips ativos
  const extras = value.filter((v) => !presets.includes(v));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {[...presets, ...extras].map((item) => {
          const active = value.includes(item);
          return (
            <button
              key={item}
              type="button"
              onClick={() => toggle(item)}
              className={`min-w-9 h-9 px-3 rounded-md border text-sm transition-colors ${
                active ? "bg-primary text-primary-foreground border-primary" : "border-input hover:border-primary"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2 max-w-xs">
        <Input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
          placeholder={placeholder}
          className="h-9"
        />
        <Button type="button" variant="outline" size="icon" onClick={addCustom}><Plus className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
