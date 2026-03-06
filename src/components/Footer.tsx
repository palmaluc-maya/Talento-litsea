import { Link } from "react-router-dom";
import logoLitsea from "@/assets/logo-litsea.png";

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img src={logoLitsea} alt="Litsea Bolsa de Trabajo" className="h-10 w-10 rounded-full" />
            <span className="font-heading text-lg font-bold text-primary">Litsea</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Litsea Bolsa de Trabajo — especializada en bienestar y turismo de la Riviera Maya. Conectando talento con las mejores oportunidades.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-heading text-sm font-semibold text-foreground">Navegación</h4>
          <div className="flex flex-col gap-2">
            <Link to="/vacantes" className="text-sm text-muted-foreground hover:text-primary transition-colors">Vacantes</Link>
            <Link to="/candidatos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Candidatos</Link>
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">Iniciar Sesión</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-heading text-sm font-semibold text-foreground">Zonas</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>Playa del Carmen</span>
            <span>Cancún</span>
            <span>Tulum</span>
            <span>Akumal</span>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Litsea Bolsa de Trabajo. Todos los derechos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
