import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Save, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CatalogZone {
  id: string;
  name: string;
  sort_order: number;
}

interface CatalogTechnique {
  id: string;
  category: string;
  name: string;
  sort_order: number;
}

export default function AdminConfigTab() {
  const { toast } = useToast();
  const [zones, setZones] = useState<CatalogZone[]>([]);
  const [techniques, setTechniques] = useState<CatalogTechnique[]>([]);
  const [loading, setLoading] = useState(true);

  // Zone editing
  const [newZone, setNewZone] = useState("");
  const [editZoneId, setEditZoneId] = useState<string | null>(null);
  const [editZoneName, setEditZoneName] = useState("");

  // Technique editing
  const [newTechName, setNewTechName] = useState("");
  const [newTechCategory, setNewTechCategory] = useState("");
  const [editTechId, setEditTechId] = useState<string | null>(null);
  const [editTechName, setEditTechName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [zRes, tRes] = await Promise.all([
      supabase.from("catalog_zones").select("*").order("sort_order"),
      supabase.from("catalog_techniques").select("*").order("category").order("sort_order"),
    ]);
    if (zRes.data) setZones(zRes.data as any);
    if (tRes.data) setTechniques(tRes.data as any);
    setLoading(false);
  };

  // --- Zone CRUD ---
  const addZone = async () => {
    if (!newZone.trim()) return;
    const maxOrder = zones.length > 0 ? Math.max(...zones.map((z) => z.sort_order)) + 1 : 1;
    const { data, error } = await supabase
      .from("catalog_zones")
      .insert({ name: newZone.trim(), sort_order: maxOrder } as any)
      .select()
      .single();
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (data) {
      setZones([...zones, data as any]);
      setNewZone("");
      toast({ title: "Zona agregada" });
    }
  };

  const saveZone = async (id: string) => {
    if (!editZoneName.trim()) return;
    const { error } = await supabase
      .from("catalog_zones")
      .update({ name: editZoneName.trim() } as any)
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setZones(zones.map((z) => (z.id === id ? { ...z, name: editZoneName.trim() } : z)));
      setEditZoneId(null);
      toast({ title: "Zona actualizada" });
    }
  };

  const deleteZone = async (id: string) => {
    const { error } = await supabase.from("catalog_zones").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setZones(zones.filter((z) => z.id !== id));
      toast({ title: "Zona eliminada" });
    }
  };

  // --- Technique CRUD ---
  const addTechnique = async () => {
    if (!newTechName.trim() || !newTechCategory.trim()) return;
    const catTechs = techniques.filter((t) => t.category === newTechCategory.trim());
    const maxOrder = catTechs.length > 0 ? Math.max(...catTechs.map((t) => t.sort_order)) + 1 : 1;
    const { data, error } = await supabase
      .from("catalog_techniques")
      .insert({ name: newTechName.trim(), category: newTechCategory.trim(), sort_order: maxOrder } as any)
      .select()
      .single();
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (data) {
      setTechniques([...techniques, data as any]);
      setNewTechName("");
      toast({ title: "Técnica agregada" });
    }
  };

  const saveTechnique = async (id: string) => {
    if (!editTechName.trim()) return;
    const { error } = await supabase
      .from("catalog_techniques")
      .update({ name: editTechName.trim() } as any)
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setTechniques(techniques.map((t) => (t.id === id ? { ...t, name: editTechName.trim() } : t)));
      setEditTechId(null);
      toast({ title: "Técnica actualizada" });
    }
  };

  const deleteTechnique = async (id: string) => {
    const { error } = await supabase.from("catalog_techniques").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setTechniques(techniques.filter((t) => t.id !== id));
      toast({ title: "Técnica eliminada" });
    }
  };

  const categories = [...new Set(techniques.map((t) => t.category))];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ZONES */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Zonas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {zones.map((z) => (
            <div key={z.id} className="flex items-center gap-2">
              {editZoneId === z.id ? (
                <>
                  <Input
                    value={editZoneName}
                    onChange={(e) => setEditZoneName(e.target.value)}
                    className="h-8 flex-1"
                    onKeyDown={(e) => e.key === "Enter" && saveZone(z.id)}
                  />
                  <Button variant="ghost" size="icon" onClick={() => saveZone(z.id)}>
                    <Save size={14} className="text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setEditZoneId(null)}>
                    <X size={14} />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm">{z.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditZoneId(z.id);
                      setEditZoneName(z.name);
                    }}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteZone(z.id)}>
                    <Trash2 size={14} className="text-destructive" />
                  </Button>
                </>
              )}
            </div>
          ))}

          <div className="flex items-center gap-2 pt-2 border-t">
            <Input
              placeholder="Nueva zona..."
              value={newZone}
              onChange={(e) => setNewZone(e.target.value)}
              className="h-8 flex-1"
              onKeyDown={(e) => e.key === "Enter" && addZone()}
            />
            <Button size="sm" onClick={addZone} disabled={!newZone.trim()}>
              <Plus size={14} /> Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TECHNIQUES */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Técnicas / Especialidades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map((cat) => (
            <div key={cat} className="space-y-2">
              <Badge variant="outline" className="text-xs font-semibold">
                {cat}
              </Badge>
              {techniques
                .filter((t) => t.category === cat)
                .map((t) => (
                  <div key={t.id} className="flex items-center gap-2 pl-3">
                    {editTechId === t.id ? (
                      <>
                        <Input
                          value={editTechName}
                          onChange={(e) => setEditTechName(e.target.value)}
                          className="h-8 flex-1"
                          onKeyDown={(e) => e.key === "Enter" && saveTechnique(t.id)}
                        />
                        <Button variant="ghost" size="icon" onClick={() => saveTechnique(t.id)}>
                          <Save size={14} className="text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditTechId(null)}>
                          <X size={14} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm">{t.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditTechId(t.id);
                            setEditTechName(t.name);
                          }}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteTechnique(t.id)}>
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
            </div>
          ))}

          {/* Add new technique */}
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs text-muted-foreground font-medium">Agregar nueva técnica</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Input
                placeholder="Categoría (ej: Masaje Terapéutico)"
                value={newTechCategory}
                onChange={(e) => setNewTechCategory(e.target.value)}
                className="h-8 flex-1"
                list="cat-suggestions"
              />
              <datalist id="cat-suggestions">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              <Input
                placeholder="Nombre de la técnica"
                value={newTechName}
                onChange={(e) => setNewTechName(e.target.value)}
                className="h-8 flex-1"
                onKeyDown={(e) => e.key === "Enter" && addTechnique()}
              />
              <Button
                size="sm"
                onClick={addTechnique}
                disabled={!newTechName.trim() || !newTechCategory.trim()}
              >
                <Plus size={14} /> Agregar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
