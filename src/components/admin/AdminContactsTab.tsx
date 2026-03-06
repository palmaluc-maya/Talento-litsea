import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Trash2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
}

interface EmployerCandidateRequest {
  id: string;
  employer_id: string;
  candidate_id: string;
  specialty: string | null;
  status: string;
  created_at: string;
  employer?: { full_name: string; company_name: string | null } | null;
  candidate?: { full_name: string } | null;
}

interface Application {
  id: string;
  candidate_id: string;
  job_posting_id: string;
  status: string;
  message: string | null;
  created_at: string;
  candidate?: { full_name: string } | null;
  job?: { title: string } | null;
}

interface Props {
  contacts: ContactRequest[];
  setContacts: React.Dispatch<React.SetStateAction<ContactRequest[]>>;
  employerRequests: EmployerCandidateRequest[];
  setEmployerRequests: React.Dispatch<React.SetStateAction<EmployerCandidateRequest[]>>;
}

export default function AdminContactsTab({ contacts, setContacts, employerRequests, setEmployerRequests }: Props) {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    supabase
      .from("applications")
      .select("*, candidate:candidate_id(full_name), job:job_posting_id(title)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setApplications(data as any);
      });
  }, []);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });

  const updateContactStatus = async (id: string, status: string) => {
    await supabase.from("contact_requests").update({ status }).eq("id", id);
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    toast({ title: "Estado actualizado" });
  };

  const deleteContact = async (id: string) => {
    await supabase.from("contact_requests").delete().eq("id", id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Solicitud eliminada" });
  };

  const markContacted = async (id: string) => {
    await supabase.from("employer_candidate_requests" as any).update({ status: "contacted" } as any).eq("id", id);
    setEmployerRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "contacted" } : r)));
    toast({ title: "Marcado como contactado" });
  };

  const updateAppStatus = async (id: string, status: string) => {
    await supabase.from("applications").update({ status } as any).eq("id", id);
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    toast({ title: "Estado de aplicación actualizado" });
  };

  const statusBadge = (s: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      contacted: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-destructive/10 text-destructive",
    };
    return colors[s] ?? "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-8">
      {/* Contact Requests */}
      <div>
        <h3 className="mb-3 font-heading text-lg font-semibold">Solicitudes de Contacto</h3>
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Mensaje</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Sin solicitudes</TableCell></TableRow>
              ) : contacts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">{c.email}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-[200px] truncate">{c.message}</TableCell>
                  <TableCell>
                    <Select value={c.status} onValueChange={(v) => updateContactStatus(c.id, v)}>
                      <SelectTrigger className="h-8 w-[120px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="contacted">Contactado</SelectItem>
                        <SelectItem value="resolved">Resuelto</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{fmtDate(c.created_at)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => deleteContact(c.id)}>
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Employer → Candidate Requests */}
      <div>
        <h3 className="mb-3 font-heading text-lg font-semibold">Solicitudes Empleador → Candidato</h3>
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleador</TableHead>
                <TableHead className="hidden sm:table-cell">Candidato</TableHead>
                <TableHead className="hidden md:table-cell">Especialidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employerRequests.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Sin solicitudes</TableCell></TableRow>
              ) : employerRequests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{(r.employer as any)?.full_name || "—"}</TableCell>
                  <TableCell className="hidden sm:table-cell">{(r.candidate as any)?.full_name || "—"}</TableCell>
                  <TableCell className="hidden md:table-cell">{r.specialty || "—"}</TableCell>
                  <TableCell>
                    <Badge className={statusBadge(r.status)}>
                      {r.status === "pending" ? "Pendiente" : "Contactado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{fmtDate(r.created_at)}</TableCell>
                  <TableCell>
                    {r.status === "pending" && (
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => markContacted(r.id)}>
                        <Check size={14} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Applications */}
      <div>
        <h3 className="mb-3 font-heading text-lg font-semibold">Aplicaciones a Vacantes</h3>
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidato</TableHead>
                <TableHead className="hidden sm:table-cell">Vacante</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden sm:table-cell">Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Sin aplicaciones</TableCell></TableRow>
              ) : applications.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{(a.candidate as any)?.full_name || "—"}</TableCell>
                  <TableCell className="hidden sm:table-cell">{(a.job as any)?.title || "—"}</TableCell>
                  <TableCell>
                    <Select value={a.status} onValueChange={(v) => updateAppStatus(a.id, v)}>
                      <SelectTrigger className="h-8 w-[120px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="accepted">Aceptada</SelectItem>
                        <SelectItem value="rejected">Rechazada</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{fmtDate(a.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
