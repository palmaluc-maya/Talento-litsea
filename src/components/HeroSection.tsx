import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Briefcase, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => (
  <section className="relative overflow-hidden gradient-hero py-16 md:py-28">
    {/* Decorative elements */}
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
    </div>

    <div className="container relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-3xl text-center"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground">
          <Sparkles size={14} />
          Riviera Maya · Bienestar · Turismo
        </div>
        <h1 className="mb-6 font-heading text-4xl font-bold leading-tight md:text-6xl">
          Tu carrera en{" "}
          <span className="text-primary">bienestar</span>{" "}
          comienza aquí
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
          Conectamos a los mejores especialistas en spa, cosmetología y terapias holísticas con los centros más exclusivos de la Riviera Maya.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/vacantes">
            <Button size="lg" className="gap-2 px-8">
              <Search size={18} />
              Buscar Vacantes
            </Button>
          </Link>
          <Link to="/auth?mode=register&role=employer">
            <Button variant="outline" size="lg" className="gap-2 border-secondary/40 px-8 text-secondary hover:bg-secondary/10 hover:text-secondary">
              <Briefcase size={18} />
              Publicar Vacante
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
