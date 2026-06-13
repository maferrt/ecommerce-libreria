"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  MessageCircle,
  Tags,
  Cat,
  type LucideIcon,
} from "lucide-react";

type HeroSlide = {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  icon: LucideIcon;
  visualType: "welcome" | "promos" | "forums";
  backgroundImage: string;
};

const heroSlides: HeroSlide[] = [
  {
    eyebrow: "Versión Full Stack Individual",
    title: "Bienvenida a Mundo Entre Libros",
    highlight: "tu espacio lector",
    description:
      "Explora libros, descubre nuevos géneros y vive la lectura de una forma más interactiva.",
    primaryLabel: "Explorar catálogo",
    primaryHref: "/catalogo",
    secondaryLabel: "Conocer el proyecto",
    secondaryHref: "/nosotros",
    icon: BookOpen,
    visualType: "welcome",
    backgroundImage: "/images/hero/welcome.png",
  },
  {
    eyebrow: "Promociones especiales",
    title: "Libros más vendidos",
    highlight: "con descuentos únicos",
    description:
      "Encuentra historias populares, sagas favoritas y recomendaciones para tu próxima lectura.",
    primaryLabel: "Ver promociones",
    primaryHref: "/catalogo",
    secondaryLabel: "Ir al carrito",
    secondaryHref: "/carrito",
    icon: Tags,
    visualType: "promos",
    backgroundImage: "/images/hero/promos.jpg",
  },
  {
    eyebrow: "Comunidad lectora",
    title: "Únete a los foros",
    highlight: "y comparte tus opiniones",
    description:
      "Participa en conversaciones por género literario, recomienda libros y conecta con otros lectores.",
    primaryLabel: "Entrar a foros",
    primaryHref: "/foros",
    secondaryLabel: "Ver géneros",
    secondaryHref: "/catalogo",
    icon: MessageCircle,
    visualType: "forums",
    backgroundImage: "/images/hero/forums.jpg",
  },
];


export function HomeHero() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const activeSlide = heroSlides[activeSlideIndex];
  const ActiveIcon = activeSlide.icon;

  function goToNextSlide() {
    setActiveSlideIndex((currentIndex) => {
      const isLastSlide = currentIndex === heroSlides.length - 1;

      if (isLastSlide) {
        return 0;
      }

      return currentIndex + 1;
    });
  }

  function goToPreviousSlide() {
    setActiveSlideIndex((currentIndex) => {
      const isFirstSlide = currentIndex === 0;

      if (isFirstSlide) {
        return heroSlides.length - 1;
      }

      return currentIndex - 1;
    });
  }

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      goToNextSlide();
    }, 6500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="hero-carousel-shell">
        <div className="hero-carousel-background" aria-hidden="true">
          <Image
            key={activeSlide.backgroundImage}
            src={activeSlide.backgroundImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-carousel-background-image"
          />
        </div>

        <div className="hero-carousel-overlay" aria-hidden="true" />

        <div className="hero-carousel-inner">
          <div className="hero-carousel-content-grid">
            <div key={activeSlide.title} className="hero-slide-content">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(82,31,18,0.16)] bg-[rgba(246,235,217,0.82)] px-4 py-2 font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--mel-caramel)] shadow-sm backdrop-blur-md">
                <ActiveIcon size={15} />
                {activeSlide.eyebrow}
              </div>

              <h1 className="mt-5 max-w-'2xl font-serif text-4xl font-black leading-[1.04] text-[var(--mel-brown)] sm:text-5xl lg:text-[3.25rem]">
                {activeSlide.title}
                <span className="block text-[var(--mel-caramel)]">
                  {activeSlide.highlight}
                </span>
              </h1>

              <p className="mt-5 max-w-xl font-sans text-sm leading-7 text-[var(--mel-brown-soft)] sm:text-base">
                {activeSlide.description}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href={activeSlide.primaryHref} className="hero-primary-button">
                  {activeSlide.primaryLabel}
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href={activeSlide.secondaryHref}
                  className="hero-secondary-button"
                >
                  {activeSlide.secondaryLabel}
                </Link>
              </div>
            </div>

            <div key={activeSlide.visualType} className="hero-slide-visual">
              {activeSlide.visualType === "welcome" && <WelcomeVisual />}
              {activeSlide.visualType === "promos" && <PromosVisual />}
              {activeSlide.visualType === "forums" && <ForumsVisual />}
            </div>
          </div>

          <div className="hero-carousel-controls">
            <div className="flex gap-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  aria-label={`Ir a la diapositiva ${index + 1}`}
                  onClick={() => setActiveSlideIndex(index)}
                  className={
                    index === activeSlideIndex
                      ? "hero-dot hero-dot-active"
                      : "hero-dot"
                  }
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="hero-carousel-button"
                aria-label="Diapositiva anterior"
                onClick={goToPreviousSlide}
              >
                <ArrowLeft size={18} />
              </button>

              <button
                type="button"
                className="hero-carousel-button"
                aria-label="Siguiente diapositiva"
                onClick={goToNextSlide}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WelcomeVisual() {
  return (
    <FloatingHeroVisual
      src="/images/hero/tinta.png"
      alt="Mascota de Mundo Entre Libros"
      badgeIcon={Cat}
      badgeText="Tinta, tu guía lectora"
      variant="welcome"
    />
  );
}

function PromosVisual() {
  return (
    <FloatingHeroVisual
      src="/images/hero/tinta-promos.png"
      alt="Tinta mostrando promociones de libros"
      badgeIcon={Tags}
      badgeText="Promos destacadas"
      variant="promos"
    />
  );
}

function ForumsVisual() {
  return (
    <FloatingHeroVisual
      src="/images/hero/tinta-forums.png"
      alt="Tinta escribiendo notas para los foros literarios"
      badgeIcon={MessageCircle}
      badgeText="Comunidad lectora"
      variant="forums"
    />
  );
}

type FloatingHeroVisualProps = {
  src: string;
  alt: string;
  badgeIcon: LucideIcon;
  badgeText: string;
  variant: "welcome" | "promos" | "forums";
};

function FloatingHeroVisual({
  src,
  alt,
  badgeIcon: BadgeIcon,
  badgeText,
  variant,
}: FloatingHeroVisualProps) {
  return (
    <div className={`floating-hero-visual-card floating-hero-${variant}`}>
      <div className="floating-hero-glow" />

      <Image
        src={src}
        alt={alt}
        width={420}
        height={420}
        priority
        className="floating-hero-image"
      />

      <div className="floating-hero-pill">
        <BadgeIcon size={18} />
        <span>{badgeText}</span>
      </div>
    </div>
  );
}