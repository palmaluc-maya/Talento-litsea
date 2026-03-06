import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobPosting {
  id: string;
  title: string;
  location: string | null;
  specialty: string | null;
  contract_type: string | null;
  salary_range: string | null;
  is_active: boolean | null;
  created_at: string;
  employer: { full_name: string; company_name: string | null } | null;
}

interface Props {
  jobs: JobPosting[];
  setJobs: React.Dispatch<React.SetStateAction<JobPosting[]>>;
}

export default function AdminVacantesTab({ jobs, setJobs }: Props) {
  const { toast } = useToast();
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editLocation, setEditLocation] = useState("");

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });

  const toggleActive = async (j: JobPosting) => {
    const newVal = !j.is_active;
    await supabase.from("job_postings").update({ is_active: newVal }).eq("id", j.id);
    setJobs((prev) => prev.map((p) => (p.id === j.id ? { ...p, is_active: newVal } : p)));
    toast({ title: newVal ? "Vacante activada" : "Vacante desactivada" });
  };

  const startEdit = (j: JobPosting) => {
    setEditId(j.id);
    setEditTitle(j.title);
    setEditLocation(j.location || "");
  };

  const saveEdit = async (j: JobPosting) => {
    await supabase.from("job_postings").update({ title: editTitle, location: editLocation }).eq("id", j.id);
    setJobs((prev) =>
      prev.map((p) => (p.id === j.id ? { ...p, title: editTitle, location: editLocation } : p))
    );
    setEditId(null);
    toast({ title: "Vacante actualizada" });
  };

  const deleteJob = async (j: JobPosting) => {
    await supabase.from("job_postings").delete().eq("id", j.id);
    setJobs((prev) => prev.filter((p) => p.id !== j.id));
    toast({ title: "Vacante eliminada" });
  };

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead className="hidden sm:table-cell">Empresa</TableHead>
            <TableHead className="hidden md:table-cell">Ubicación</TableHead>
            <TableHead className="hidden md:table-cell">Tipo</TableHead>
            <TableHead>Activa</TableHead>
            <TableHead className="hidden sm:table-cell">Fecha</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                Sin vacantes publicadas
              </TableCell>
            </TableRow>
          ) : (
            jobs.map((j) => (
              <TableRow key={j.id}>
                <TableCell className="font-medium">
                  {editId === j.id ? (
                    <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="h-8 w-36" />
                  ) : (
                    j.title
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {(j.employer as any)?.company_name || (j.employer as any)?.full_name || "—"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {editId === j.id ? (
                    <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="h-8 w-28" />
                  ) : (
                    j.location || "—"
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">{j.contract_type || "—"}</TableCell>
                <TableCell>
                  <Switch checked={!!j.is_active} onCheckedChange={() => toggleActive(j)} />
                </TableCell>
                <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                  {fmtDate(j.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {editId === j.id ? (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => saveEdit(j)}>
                          <Save size={14} className="text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditId(null)}>
                          <X size={14} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => startEdit(j)}>
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteJob(j)}>
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
