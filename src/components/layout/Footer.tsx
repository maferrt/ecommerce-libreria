import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/foros", label: "Foros" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

const teamSprites = [
  {
    name: "Mafer",
    role: "Desarrolladora",
    github: "https://github.com/mafernandarodrigueztdev-byte",
    spriteClass: "pixel-mafer",
  },
  {
    name: "Adri",
    role: "Desarrolladora",
    github: "https://github.com/iladricg14-lab",
    spriteClass: "pixel-ilse",
  },
];

export function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-[rgba(82,31,18,0.12)] bg-[rgba(248,225,193,0.72)] px-4 py-12 backdrop-blur-md">
      <div className="pointer-events-none absolute left-10 top-8 text-4xl opacity-20 footer-float-one">
        📚
      </div>

      <div className="pointer-events-none absolute bottom-10 right-12 text-4xl opacity-20 footer-float-two">
        ✨
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.8fr_1.4fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-full bg-[var(--mel-paper)] shadow-md">
              <Image
                src="/images/icons/logo-mel.png"
                alt="Logo Mundo Entre Libros"
                fill
                sizes="56px"
                className="object-contain p-1.5"
              />
            </div>

            <div>
              <p className="font-serif text-2xl font-black leading-none text-[var(--mel-brown)]">
                Mundo
              </p>
              <p className="font-serif text-xl font-bold leading-none text-[var(--mel-caramel)]">
                Entre Libros
              </p>
            </div>
          </Link>

          <p className="mt-5 max-w-sm font-sans text-sm leading-7 text-[var(--mel-brown-soft)]">
            Un espacio literario para descubrir libros, compartir opiniones y
            conectar con más lectores.
          </p>
        </div>

        <nav aria-label="Enlaces del sitio">
          <h2 className="font-serif text-2xl font-black text-[var(--mel-brown)]">
            Explora
          </h2>

          <div className="mt-4 grid gap-3">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="footer-link">
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <section className="pixel-section" aria-labelledby="pixel-team-title">
          <h2 id="pixel-team-title" className="pixel-interaction-title">
            ¡Pasa a saludarnos!
          </h2>

          <div className="pixel-team">
            {teamSprites.map((member) => (
              <a
                key={member.name}
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`pixel-member ${member.spriteClass}`}
                aria-label={`Ver GitHub de ${member.name}`}
                title={member.name}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-[rgba(82,31,18,0.12)] pt-6 text-center font-sans text-xs font-semibold text-[var(--mel-brown-soft)] sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p>© 2026 Mundo Entre Libros. Todos los derechos reservados.</p>
        <p>Hecho con café, libros y mucho código.</p>
      </div>
    </footer>
  );
}