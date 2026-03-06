import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Building2, MapPin, Users, Pencil, Save, X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  location: string | null;
  phone: string | null;
  specialties: string[] | null;
  is_active: boolean | null;
  is_litsea_graduate: boolean | null;
  company_name: string | null;
  zones: string[] | null;
  whatsapp: string | null;
  created_at: string;
}

interface Props {
  employers: Profile[];
  setEmployers: React.Dispatch<React.SetStateAction<Profile[]>>;
  candidates: Profile[];
}

const ZONE_COLORS: Record<string, string> = {
  "Cancún": "bg-accent text-accent-foreground",
  "Playa del Carmen": "bg-primary/10 text-primary",
  "Tulum": "bg-secondary/20 text-secondary-foreground",
  "Akumal": "bg-muted text-muted-foreground",
};

export default function AdminEmployersTab({ employers, setEmployers, candidates }: Props) {
  const { toast } = useToast();
  const [selectedEmployer, setSelectedEmployer] = useState<Profile | null>(null);
  const [showCandidates, setShowCandidates] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editCompany, setEditCompany] = useState("");

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });

  const getMatchingCandidates = (employer: Profile) => {
    const employerZones = employer.zones ?? [];
    return candidates.filter((c) => {
      const loc = c.location?.toLowerCase() ?? "";
      return employerZones.some(
        (z) => loc.includes(z.toLowerCase()) || z.toLowerCase().includes(loc)
      );
    });
  };

  const toggleActive = async (e: Profile) => {
    const newVal = !e.is_active;
    await supabase.from("profiles").update({ is_active: newVal }).eq("id", e.id);
    setEmployers((prev) => prev.map((p) => (p.id === e.id ? { ...p, is_active: newVal } : p)));
    toast({ title: newVal ? "Empleador activado" : "Empleador desactivado" });
  };

  const startEdit = (e: Profile) => {
    setEditId(e.id);
    setEditCompany(e.company_name || e.full_name);
  };

  const saveEdit = async (e: Profile) => {
    await supabase.from("profiles").update({ company_name: editCompany }).eq("id", e.id);
    setEmployers((prev) =>
      prev.map((p) => (p.id === e.id ? { ...p, company_name: editCompany } : p))
    );
    setEditId(null);
    toast({ title: "Empleador actualizado" });
  };

  const deactivate = async (e: Profile) => {
    await supabase.from("profiles").update({ is_active: false }).eq("id", e.id);
    setEmployers((prev) => prev.map((p) => (p.id === e.id ? { ...p, is_active: false } : p)));
    toast({ title: "Empleador desactivado" });
  };

  return (
    <>
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead className="hidden sm:table-cell">Contacto</TableHead>
              <TableHead className="hidden md:table-cell">Zonas</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead className="hidden sm:table-cell">Fecha</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">Sin empleadores</TableCell>
              </TableRow>
            ) : (
              employers.map((e) => {
                const zones = e.zones ?? (e.location ? [e.location] : []);
                const matchCount = getMatchingCandidates(e).length;
                return (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">
                      {editId === e.id ? (
                        <Input value={editCompany} onChange={(ev) => setEditCompany(ev.target.value)} className="h-8 w-36" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-primary shrink-0" />
                          {e.company_name || e.full_name || "—"}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {e.phone || e.whatsapp || "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {zones.map((z) => (
                          <Badge key={z} className={`text-xs ${ZONE_COLORS[z] ?? "bg-muted text-muted-foreground"}`}>
                            <MapPin size={10} className="mr-0.5" />{z}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch checked={!!e.is_active} onCheckedChange={() => toggleActive(e)} />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                      {fmtDate(e.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {editId === e.id ? (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => saveEdit(e)}>
                              <Save size={14} className="text-primary" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setEditId(null)}>
                              <X size={14} />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedEmployer(e); setShowCandidates(true); }}>
                              <Users size={14} className="text-primary" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => startEdit(e)}>
                              <Pencil size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deactivate(e)}>
                              <Trash2 size={14} className="text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog: matching candidates */}
      <Dialog open={showCandidates} onOpenChange={setShowCandidates}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Users size={18} />
              Candidatos para {selectedEmployer?.company_name || selectedEmployer?.full_name}
            </DialogTitle>
          </DialogHeader>
          {selectedEmployer && (() => {
            const matched = getMatchingCandidates(selectedEmployer);
            if (matched.length === 0) {
              return <p className="py-6 text-center text-muted-foreground">No hay candidatos en esta zona.</p>;
            }
            return (
              <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                {matched.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                      {(c.full_name || "?")[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{c.full_name}</p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {(c.specialties ?? []).slice(0, 3).map((s) => (
                          <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{c.location || "Sin ubicación"}</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </>
  );
}
