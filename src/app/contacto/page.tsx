export default function ContactoPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full border border-[rgba(82,31,18,0.16)] bg-[rgba(246,235,217,0.72)] px-4 py-2 font-sans text-xs font-bold uppercase tracking-[0.25em] text-[var(--mel-caramel)]">
          Contacto
        </span>

        <h1 className="mt-5 font-serif text-5xl font-black leading-tight text-[var(--mel-brown)] sm:text-6xl">
          Escríbenos
        </h1>

        <p className="mx-auto mt-5 max-w-2xl font-sans text-base leading-7 text-[var(--mel-brown-soft)]">
          ¿Tienes dudas, sugerencias o comentarios? Muy pronto podrás contactarnos desde esta sección.
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-3xl rounded-[2rem] border border-white/50 bg-[rgba(246,235,217,0.72)] p-8 shadow-xl backdrop-blur-md">
        <div className="grid gap-5">
          <div>
            <label className="font-sans text-sm font-bold text-[var(--mel-brown)]">
              Nombre
            </label>
            <div className="mt-2 rounded-full border border-[rgba(82,31,18,0.16)] bg-white/40 px-4 py-3 font-sans text-sm text-[var(--mel-brown-soft)]">
              Campo próximamente disponible
            </div>
          </div>

          <div>
            <label className="font-sans text-sm font-bold text-[var(--mel-brown)]">
              Mensaje
            </label>
            <div className="mt-2 min-h-32 rounded-[1.5rem] border border-[rgba(82,31,18,0.16)] bg-white/40 px-4 py-3 font-sans text-sm text-[var(--mel-brown-soft)]">
              Formulario en construcción
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}