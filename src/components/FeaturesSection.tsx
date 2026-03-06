import { Award, ShieldCheck, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Award,
    title: "Badge Egresado Litsea",
    description: "Los graduados de Litsea cuentan con un distintivo especial que valida su formación profesional.",
  },
  {
    icon: MapPin,
    title: "Riviera Maya",
    description: "Vacantes en Playa del Carmen, Cancún, Tulum y Akumal — los destinos de bienestar más exclusivos.",
  },
  {
    icon: ShieldCheck,
    title: "Perfiles Verificados",
    description: "Sube tus certificados y diplomas para que los empleadores validen tu experiencia.",
  },
  {
    icon: Users,
    title: "Conexión Directa",
    description: "Los empleadores revisan perfiles y documentos de quienes aplican a sus vacantes.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => (
  <section className="py-16 md:py-24">
    <div className="container">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="mb-3 font-heading text-3xl font-bold md:text-4xl">¿Por qué Litsea?</h2>
        <p className="text-muted-foreground">La bolsa de trabajo especializada en bienestar y turismo de la Riviera Maya.</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            className="group rounded-xl border border-border bg-card p-6 shadow-spa transition-shadow hover:shadow-card-hover"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg gradient-turquesa text-primary-foreground">
              <f.icon size={22} />
            </div>
            <h3 className="mb-2 font-heading text-lg font-semibold">{f.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default FeaturesSection;
