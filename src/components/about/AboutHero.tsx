import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookHeart, Sparkles } from "lucide-react";

export function AboutHero() {
  return (
    <section className="about-hero-section">
      <div className="about-hero-card">
        <div className="about-hero-content">
          <span className="about-eyebrow">
            <BookHeart size={16} />
            Sobre el proyecto
          </span>

          <h1 className="about-hero-title">
            Somos el equipo detrás de
            <span> Mundo Entre Libros</span>
          </h1>

          <p className="about-hero-description">
            Creamos una experiencia literaria digital donde las personas puedan
            descubrir libros, explorar géneros, compartir opiniones y sentirse
            parte de una comunidad lectora.
          </p>

          <div className="about-hero-actions">
            <Link href="/catalogo" className="hero-primary-button">
              Ver catálogo
              <ArrowRight size={18} />
            </Link>

            <Link href="/foros" className="hero-secondary-button">
              Ir a foros
            </Link>
          </div>
        </div>

        <div className="about-hero-visual">
          <div className="about-hero-glow" />

          <Image
            src="/images/hero/tinta.png"
            alt="Tinta, mascota de Mundo Entre Libros"
            width={420}
            height={420}
            priority
            className="about-hero-mascot"
          />

          <div className="about-floating-note about-note-one">
            <Sparkles size={16} />
            Diseño + código
          </div>

          <div className="about-floating-note about-note-two">
            📚 Comunidad lectora
          </div>
        </div>
      </div>
    </section>
  );
}