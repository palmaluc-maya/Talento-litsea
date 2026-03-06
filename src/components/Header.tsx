import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, ShieldCheck, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import logoLitsea from "@/assets/logo-litsea.png";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) { setRole(null); setIsAdmin(false); return; }
    // Check profile role and admin role in parallel
    Promise.all([
      supabase.from("profiles").select("role").eq("user_id", user.id).single(),
      supabase.rpc("has_admin_role", { _user_id: user.id }),
    ]).then(([profileRes, adminRes]) => {
      setRole(profileRes.data?.role ?? null);
      setIsAdmin(adminRes.data === true);
    });
  }, [user]);

  const dashboardPath = isAdmin ? "/admin" : role === "employer" ? "/dashboard/empleador" : "/dashboard/candidato";
  const dashboardLabel = isAdmin ? "Panel Admin" : role === "employer" ? "Mi Dashboard" : "Mi Perfil";
  const DashboardIcon = isAdmin ? ShieldCheck : role === "employer" ? Building2 : User;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoLitsea} alt="Litsea Bolsa de Trabajo" className="h-12 w-12 md:h-14 md:w-14 rounded-full shadow-spa" />
          <div className="hidden sm:block">
            <span className="block font-heading text-lg font-bold text-primary leading-tight">Litsea</span>
            <span className="block text-xs font-medium tracking-wider text-muted-foreground">Bolsa de Trabajo</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">Inicio</Link>
          <Link to="/vacantes" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">Vacantes</Link>
          <Link to="/candidatos" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">Candidatos</Link>
          <Link to="/empleadores" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">Empleadores</Link>
          {!loading && user && (role || isAdmin) ? (
            <>
              <Link to={dashboardPath} className="ml-2">
                <Button variant="outline" size="sm" className="gap-1.5"><DashboardIcon size={14} /> {dashboardLabel}</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-muted-foreground">
                <LogOut size={14} /> Cerrar Sesión
              </Button>
            </>
          ) : !loading ? (
            <>
              <Link to="/auth" className="ml-2">
                <Button variant="outline" size="sm">Iniciar Sesión</Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button size="sm">Registrarse</Button>
              </Link>
            </>
          ) : null}
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-border bg-card px-6 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground/80">Inicio</Link>
            <Link to="/vacantes" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground/80">Vacantes</Link>
            <Link to="/candidatos" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground/80">Candidatos</Link>
            <Link to="/empleadores" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground/80">Empleadores</Link>
            {!loading && user && (role || isAdmin) ? (
              <>
                <Link to={dashboardPath} onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full gap-1.5"><DashboardIcon size={14} /> {dashboardLabel}</Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start gap-1.5 text-muted-foreground" onClick={handleLogout}>
                  <LogOut size={14} /> Cerrar Sesión
                </Button>
              </>
            ) : !loading ? (
              <>
                <Link to="/auth" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">Iniciar Sesión</Button>
                </Link>
                <Link to="/auth?mode=register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Registrarse</Button>
                </Link>
              </>
            ) : null}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
