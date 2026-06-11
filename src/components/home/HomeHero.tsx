import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  MessageCircle,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

const heroHighlights = [
  {
    icon: BookOpen,
    title: "Catálogo literario",
    description: "Explora libros por género, sagas y recomendaciones.",
  },
  {
    icon: MessageCircle,
    title: "Foros por género",
    description: "Conecta con lectores que comparten tus historias favoritas.",
  },
  {
    icon: ShoppingBag,
    title: "Carrito funcional",
    description: "Guarda libros, revisa tu compra y arma tu lista ideal.",
  },
];

export function HomeHero() {
  return (
    <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <div className="page-header-enter">
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(82,31,18,0.16)] bg-[rgba(246,235,217,0.75)] px-4 py-2 font-sans text-xs font-bold uppercase tracking-[0.22em] text-[var(--mel-caramel)] shadow-sm">
          <Sparkles size={16} />
          Versión Full Stack Individual
        </div>

        <h1 className="mt-5 max-w-2xl font-serif text-4xl font-black leading-[1.04] text-[var(--mel-brown)] sm:text-5xl lg:text-[3.35rem]">
            Descubre libros,
            <span className="block text-[var(--mel-caramel)]">
                comparte historias
            </span>
            <span className="block">y crea comunidad.</span>
        </h1>

        <p className="mt-5 max-w-xl font-sans text-sm leading-7 text-[var(--mel-brown-soft)] sm:text-base">
          Mundo Entre Libros es una plataforma literaria pensada para explorar
          catálogos, participar en foros, guardar favoritos y vivir la lectura
          de una forma más interactiva.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/catalogo" className="hero-primary-button">
            Explorar catálogo
            <ArrowRight size={20} />
          </Link>

          <Link href="/foros" className="hero-secondary-button">
            Ver foros
          </Link>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[360px] content-enter lg:ml-auto">
        <div className="hero-book-card">
          <div className="absolute -left-5 -top-5 rounded-2xl bg-[var(--mel-brown)] px-4 py-3 font-sans text-sm font-bold text-[var(--mel-cream)] shadow-xl hero-floating-label">
            Lectura + comunidad
          </div>

          <div className="hero-book-cover">
            <span className="text-7xl">📖</span>
            <p className="mt-4 font-serif text-4xl font-black leading-none">
              Mundo
              <span className="block text-[var(--mel-caramel)]">
                Entre Libros
              </span>
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {heroHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="hero-highlight-card">
                  <div className="hero-highlight-icon">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h2 className="font-serif text-xl font-bold text-[var(--mel-brown)]">
                      {item.title}
                    </h2>

                    <p className="mt-1 font-sans text-sm leading-6 text-[var(--mel-brown-soft)]">
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="hero-floating-book hero-floating-book-one">☕</div>
        <div className="hero-floating-book hero-floating-book-two">✨</div>
        <div className="hero-floating-book hero-floating-book-three">📚</div>
      </div>
    </section>
  );
}