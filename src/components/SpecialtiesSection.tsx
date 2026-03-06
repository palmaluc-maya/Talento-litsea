import { motion } from "framer-motion";
import { Droplets, Flower2, Heart } from "lucide-react";

const specialties = [
  {
    icon: Droplets,
    title: "Masaje Terapéutico",
    roles: ["Masaje Relajante", "Masaje Sueco", "Masaje de Tejido Profundo", "Masaje con Piedras Calientes", "Reflexología Podal", "Masaje Prenatal", "Drenaje Linfático"],
  },
  {
    icon: Flower2,
    title: "Cosmetología Estética",
    roles: ["Tratamientos Faciales", "Tratamientos Corporales", "Depilación"],
  },
  {
    icon: Heart,
    title: "Estilismo y Belleza",
    roles: ["Maquillaje Profesional", "Manicure y Pedicure", "Peinados", "Barbería", "Diseño de Cejas"],
  },
];

const SpecialtiesSection = () => (
  <section className="bg-accent/40 py-16 md:py-24">
    <div className="container">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="mb-3 font-heading text-3xl font-bold md:text-4xl">Especialidades</h2>
        <p className="text-muted-foreground">Encuentra tu nicho en el mundo del bienestar y el turismo de lujo.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {specialties.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="rounded-xl border border-border bg-card p-8 shadow-spa"
          >
            <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full gradient-gold text-secondary-foreground">
              <s.icon size={26} />
            </div>
            <h3 className="mb-4 font-heading text-xl font-semibold">{s.title}</h3>
            <ul className="space-y-2">
              {s.roles.map((role) => (
                <li key={role} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {role}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SpecialtiesSection;
