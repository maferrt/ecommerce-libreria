export default function ForosPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full border border-[rgba(82,31,18,0.16)] bg-[rgba(246,235,217,0.72)] px-4 py-2 font-sans text-xs font-bold uppercase tracking-[0.25em] text-[var(--mel-caramel)]">
          Foros
        </span>

        <h1 className="mt-5 font-serif text-5xl font-black leading-tight text-[var(--mel-brown)] sm:text-6xl">
          Comunidad lectora
        </h1>

        <p className="mx-auto mt-5 max-w-2xl font-sans text-base leading-7 text-[var(--mel-brown-soft)]">
          Participa en conversaciones por género literario, comparte reseñas y recomienda tus libros favoritos.
        </p>
      </header>

      <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {["Fantasía", "Terror", "Ciencia ficción", "Romance", "Psicología", "Misterio"].map(
          (genre) => (
            <article
              key={genre}
              className="rounded-[1.6rem] border border-white/50 bg-[rgba(246,235,217,0.72)] p-6 shadow-lg backdrop-blur-md"
            >
              <p className="text-3xl">💬</p>

              <h2 className="mt-4 font-serif text-2xl font-black text-[var(--mel-brown)]">
                {genre}
              </h2>

              <p className="mt-2 font-sans text-sm leading-6 text-[var(--mel-brown-soft)]">
                Espacio para compartir opiniones, teorías y recomendaciones.
              </p>
            </article>
          ),
        )}
      </div>
    </section>
  );
}