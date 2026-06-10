import { PageContainer } from "@/components/layout/PageContainer";

export default function HomePage() {
  return (
    <PageContainer
      eyebrow="Comunidad lectora"
      title="Mundo Entre Libros"
      description="Descubre historias, explora géneros literarios y conecta con una comunidad de lectores."
    >
      <section className="grid gap-6 md:grid-cols-3">
        <article className="rounded-[2rem] bg-[rgba(246,235,217,0.78)] p-6 shadow-[0_16px_35px_rgba(82,31,18,0.10)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_22px_45px_rgba(82,31,18,0.16)]">
          <span className="text-4xl">📚</span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-[var(--mel-brown)]">
            Catálogo
          </h2>
          <p className="mt-2 font-sans text-sm leading-6 text-[var(--mel-brown-soft)]">
            Explora libros por categorías, sagas y recomendaciones.
          </p>
        </article>

        <article className="rounded-[2rem] bg-[rgba(246,235,217,0.78)] p-6 shadow-[0_16px_35px_rgba(82,31,18,0.10)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_22px_45px_rgba(82,31,18,0.16)]">
          <span className="text-4xl">💬</span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-[var(--mel-brown)]">
            Foros
          </h2>
          <p className="mt-2 font-sans text-sm leading-6 text-[var(--mel-brown-soft)]">
            Participa en conversaciones por género literario.
          </p>
        </article>

        <article className="rounded-[2rem] bg-[rgba(246,235,217,0.78)] p-6 shadow-[0_16px_35px_rgba(82,31,18,0.10)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_22px_45px_rgba(82,31,18,0.16)]">
          <span className="text-4xl">🛒</span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-[var(--mel-brown)]">
            Carrito
          </h2>
          <p className="mt-2 font-sans text-sm leading-6 text-[var(--mel-brown-soft)]">
            Agrega libros, revisa tu compra y guarda favoritos.
          </p>
        </article>
      </section>
    </PageContainer>
  );
}