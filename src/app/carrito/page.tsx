export default function CarritoPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full border border-[rgba(82,31,18,0.16)] bg-[rgba(246,235,217,0.72)] px-4 py-2 font-sans text-xs font-bold uppercase tracking-[0.25em] text-[var(--mel-caramel)]">
          Carrito
        </span>

        <h1 className="mt-5 font-serif text-5xl font-black leading-tight text-[var(--mel-brown)] sm:text-6xl">
          Tu carrito de compras
        </h1>

        <p className="mx-auto mt-5 max-w-2xl font-sans text-base leading-7 text-[var(--mel-brown-soft)]">
          Aquí podrás revisar los libros seleccionados antes de finalizar tu compra.
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-3xl rounded-[2rem] border border-white/50 bg-[rgba(246,235,217,0.72)] p-8 text-center shadow-xl backdrop-blur-md">
        <p className="text-5xl">🛒</p>

        <h2 className="mt-4 font-serif text-3xl font-black text-[var(--mel-brown)]">
          Tu carrito está vacío
        </h2>

        <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-6 text-[var(--mel-brown-soft)]">
          Agrega libros desde el catálogo para que aparezcan aquí.
        </p>
      </div>
    </section>
  );
}