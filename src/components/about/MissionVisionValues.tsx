import { Eye, HeartHandshake, Target } from "lucide-react";

const items = [
  {
    icon: Target,
    title: "Misión",
    description:
      "Desarrollar una plataforma literaria accesible, visualmente atractiva y funcional para facilitar la búsqueda de libros y la interacción entre lectores.",
  },
  {
    icon: Eye,
    title: "Visión",
    description:
      "Convertir Mundo Entre Libros en un espacio digital donde la lectura, la tecnología y la comunidad se encuentren de forma natural.",
  },
  {
    icon: HeartHandshake,
    title: "Valores",
    description:
      "Trabajo en equipo, creatividad, responsabilidad, aprendizaje constante y amor por las historias que conectan a las personas.",
  },
];

export function MissionVisionValues() {
  return (
    <section className="about-section">
      <header className="about-section-header">
        <span className="about-eyebrow">Nuestra esencia</span>

        <h2>Lo que guía este proyecto</h2>

        <p>
          Mundo Entre Libros combina desarrollo web, diseño visual y experiencia
          de usuario para crear una propuesta funcional y con identidad propia.
        </p>
      </header>

      <div className="mission-grid">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.title} className="mission-card">
              <div className="mission-icon">
                <Icon size={26} />
              </div>

              <h3>{item.title}</h3>

              <p>{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}