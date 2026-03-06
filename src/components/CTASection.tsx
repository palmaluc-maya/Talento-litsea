import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => (
  <section className="py-16 md:py-24">
    <div className="container">
      <div className="mx-auto max-w-3xl rounded-2xl gradient-turquesa p-10 text-center text-primary-foreground shadow-spa md:p-16">
        <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
          ¿Listo para dar el siguiente paso?
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-primary-foreground/80">
          Ya sea que busques tu empleo ideal o al candidato perfecto, Litsea te conecta con lo mejor del bienestar en la Riviera Maya.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/auth?mode=register&role=candidate">
            <Button size="lg" variant="secondary" className="gap-2 px-8">
              Soy Candidato <ArrowRight size={16} />
            </Button>
          </Link>
          <Link to="/auth?mode=register&role=employer">
            <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 px-8 text-primary-foreground hover:bg-primary-foreground/10">
              Soy Empleador <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
