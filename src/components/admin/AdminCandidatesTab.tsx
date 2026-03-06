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
import { Trash2, Pencil, Save, X } from "lucide-react";
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
  candidates: Profile[];
  setCandidates: React.Dispatch<React.SetStateAction<Profile[]>>;
}

export default function AdminCandidatesTab({ candidates, setCandidates }: Props) {
  const { toast } = useToast();
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });

  const toggleActive = async (c: Profile) => {
    const newVal = !c.is_active;
    await supabase.from("profiles").update({ is_active: newVal }).eq("id", c.id);
    setCandidates((prev) => prev.map((p) => (p.id === c.id ? { ...p, is_active: newVal } : p)));
    toast({ title: newVal ? "Candidato activado" : "Candidato desactivado" });
  };

  const startEdit = (c: Profile) => {
    setEditId(c.id);
    setEditName(c.full_name);
    setEditLocation(c.location || "");
  };

  const saveEdit = async (c: Profile) => {
    await supabase.from("profiles").update({ full_name: editName, location: editLocation }).eq("id", c.id);
    setCandidates((prev) =>
      prev.map((p) => (p.id === c.id ? { ...p, full_name: editName, location: editLocation } : p))
    );
    setEditId(null);
    toast({ title: "Candidato actualizado" });
  };

  const deleteCandidate = async (c: Profile) => {
    // We can't delete profiles (no RLS DELETE), so we deactivate
    await supabase.from("profiles").update({ is_active: false }).eq("id", c.id);
    setCandidates((prev) => prev.map((p) => (p.id === c.id ? { ...p, is_active: false } : p)));
    toast({ title: "Candidato desactivado" });
  };

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className="hidden sm:table-cell">Ubicación</TableHead>
            <TableHead className="hidden md:table-cell">Especialidades</TableHead>
            <TableHead className="hidden lg:table-cell">LITSEA</TableHead>
            <TableHead>Activo</TableHead>
            <TableHead className="hidden sm:table-cell">Registro</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                Sin candidatos registrados
              </TableCell>
            </TableRow>
          ) : (
            candidates.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">
                  {editId === c.id ? (
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 w-32" />
                  ) : (
                    c.full_name || "—"
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {editId === c.id ? (
                    <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="h-8 w-28" />
                  ) : (
                    c.location || "—"
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {(c.specialties ?? []).slice(0, 3).map((s) => (
                      <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                    {(c.specialties ?? []).length > 3 && (
                      <Badge variant="secondary" className="text-xs">+{c.specialties!.length - 3}</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {c.is_litsea_graduate ? "✅" : "—"}
                </TableCell>
                <TableCell>
                  <Switch checked={!!c.is_active} onCheckedChange={() => toggleActive(c)} />
                </TableCell>
                <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                  {fmtDate(c.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {editId === c.id ? (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => saveEdit(c)}>
                          <Save size={14} className="text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditId(null)}>
                          <X size={14} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => startEdit(c)}>
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteCandidate(c)}>
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
