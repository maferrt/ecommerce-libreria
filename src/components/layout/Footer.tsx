import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/foros", label: "Foros" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

const socialLinks = [
  {
    href: "https://github.com/mafernandarodrigueztdev-byte",
    label: "GitHub de Mafer",
    emoji: "🌷",
  },
  {
    href: "https://www.linkedin.com/in/maria-fernanda-rodriguez-trinidad-926346396/",
    label: "LinkedIn de Mafer",
    emoji: "💼",
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-[rgba(82,31,18,0.12)] bg-[rgba(248,225,193,0.72)] px-4 py-10 backdrop-blur-md">
      <div className="pointer-events-none absolute left-8 top-8 text-3xl opacity-40 footer-float-one">
        📚
      </div>
      <div className="pointer-events-none absolute bottom-8 right-10 text-3xl opacity-40 footer-float-two">
        ✨
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_0.8fr_1fr] md:items-center">
        <div>
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/images/icons/logo-mel-horizontal.png"
              alt="Mundo Entre Libros"
              width={260}
              height={120}
              className="h-auto w-56 transition-transform duration-300 hover:scale-105"
            />
          </Link>

          <p className="mt-4 max-w-md font-sans text-sm leading-6 text-[var(--mel-brown-soft)]">
            Un espacio digital para descubrir libros, crear comunidad lectora y
            vivir la lectura de una forma más interactiva.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-bold text-[var(--mel-brown)]">
            Explora
          </h2>

          <ul className="mt-4 grid gap-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2rem] border border-white/50 bg-[rgba(246,235,217,0.75)] p-6 shadow-[0_16px_35px_rgba(82,31,18,0.10)]">
          <p className="font-serif text-2xl font-bold text-[var(--mel-brown)]">
            ¡Pasa a saludar!
          </p>

          <p className="mt-2 font-sans text-sm leading-6 text-[var(--mel-brown-soft)]">
            Esta versión individual está pensada para practicar, mejorar la
            arquitectura y darle más vida al proyecto.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-bubble"
                aria-label={link.label}
              >
                <span>{link.emoji}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-[rgba(82,31,18,0.12)] pt-5 text-center font-sans text-sm text-[var(--mel-brown-soft)]">
        <p>© 2026 Mundo Entre Libros — Versión Full Stack Individual</p>
      </div>
    </footer>
  );
}