import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useCatalogTechniques } from "@/hooks/useCatalogs";

const MAX_CUSTOM = 3;

interface SpecialtiesSelectorProps {
  selected: string[];
  onChange: (specialties: string[]) => void;
}

export default function SpecialtiesSelector({
  selected,
  onChange,
}: SpecialtiesSelectorProps) {
  const { grouped, loading } = useCatalogTechniques();

  const allPredefined = grouped.flatMap((c) => c.options);

  const [visibleCustom, setVisibleCustom] = useState<Record<number, number>>(
    () => {
      const initial: Record<number, number> = {};
      grouped.forEach((_, i) => {
        const count = selected.filter(
          (s) => s.startsWith(`custom_${i}_`) && !allPredefined.includes(s)
        ).length;
        initial[i] = count;
      });
      return initial;
    }
  );

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const addCustomSlot = (catIndex: number) => {
    const current = visibleCustom[catIndex] || 0;
    if (current < MAX_CUSTOM) {
      setVisibleCustom({ ...visibleCustom, [catIndex]: current + 1 });
    }
  };

  const updateCustom = (catIndex: number, slotIndex: number, value: string) => {
    const cleaned = selected.filter((s) => {
      if (!s.startsWith(`custom_${catIndex}_`)) return true;
      const parts = s.split("_");
      return parts.length < 3 || parts[2] !== String(slotIndex);
    });
    if (value.trim()) {
      onChange([...cleaned, `custom_${catIndex}_${slotIndex}_${value.trim()}`]);
    } else {
      onChange(cleaned);
    }
  };

  const getCustomValue = (catIndex: number, slotIndex: number): string => {
    const prefix = `custom_${catIndex}_${slotIndex}_`;
    const found = selected.find((s) => s.startsWith(prefix));
    return found ? found.slice(prefix.length) : "";
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Cargando especialidades...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Label className="block text-base">Especialidades</Label>
      {grouped.map((cat, catIndex) => (
        <div key={cat.title} className="space-y-2">
          <p className="font-semibold text-sm">{cat.title}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 pl-1">
            {cat.options.map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selected.includes(opt)}
                  onCheckedChange={() => toggleOption(opt)}
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>

          {Array.from({ length: visibleCustom[catIndex] || 0 }).map(
            (_, slotIndex) => (
              <Input
                key={`custom-${catIndex}-${slotIndex}`}
                className="max-w-xs"
                placeholder="Agregar técnica adicional..."
                value={getCustomValue(catIndex, slotIndex)}
                onChange={(e) => updateCustom(catIndex, slotIndex, e.target.value)}
              />
            )
          )}

          {(visibleCustom[catIndex] || 0) < MAX_CUSTOM && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs gap-1"
              onClick={() => addCustomSlot(catIndex)}
            >
              <Plus size={14} /> Agregar técnica
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
