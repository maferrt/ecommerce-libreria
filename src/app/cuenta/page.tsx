export default function CuentaPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full border border-[rgba(82,31,18,0.16)] bg-[rgba(246,235,217,0.72)] px-4 py-2 font-sans text-xs font-bold uppercase tracking-[0.25em] text-[var(--mel-caramel)]">
          Mi cuenta
        </span>

        <h1 className="mt-5 font-serif text-5xl font-black leading-tight text-[var(--mel-brown)] sm:text-6xl">
          Accede a tu perfil lector
        </h1>

        <p className="mx-auto mt-5 max-w-2xl font-sans text-base leading-7 text-[var(--mel-brown-soft)]">
          En esta sección podrás iniciar sesión, consultar tus pedidos, favoritos y datos personales.
        </p>
      </header>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-white/50 bg-[rgba(246,235,217,0.72)] p-8 shadow-xl backdrop-blur-md">
          <p className="text-4xl">👤</p>

          <h2 className="mt-4 font-serif text-3xl font-black text-[var(--mel-brown)]">
            Iniciar sesión
          </h2>

          <p className="mt-3 font-sans text-sm leading-6 text-[var(--mel-brown-soft)]">
            Acceso de usuarios próximamente disponible.
          </p>
        </article>

        <article className="rounded-[2rem] border border-white/50 bg-[rgba(246,235,217,0.72)] p-8 shadow-xl backdrop-blur-md">
          <p className="text-4xl">💌</p>

          <h2 className="mt-4 font-serif text-3xl font-black text-[var(--mel-brown)]">
            Crear cuenta
          </h2>

          <p className="mt-3 font-sans text-sm leading-6 text-[var(--mel-brown-soft)]">
            Registro de nuevos lectores en construcción.
          </p>
        </article>
      </div>
    </section>
  );
}