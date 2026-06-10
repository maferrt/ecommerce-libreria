"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigationLinks = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/foros", label: "Foros" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-[2rem] border border-white/50 bg-[rgba(248,225,193,0.82)] px-5 py-3 shadow-[0_18px_45px_rgba(82,31,18,0.13)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_22px_55px_rgba(82,31,18,0.18)]">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Ir al inicio de Mundo Entre Libros"
        >
          <div className="relative h-16 w-16 overflow-hidden rounded-full bg-[var(--mel-paper)] shadow-md transition-transform duration-300 group-hover:rotate-[-4deg] group-hover:scale-105">
            <Image
              src="/images/icons/logo-mel.png"
              alt="Logo Mundo Entre Libros"
              fill
              priority
              sizes="64px"
              className="object-contain p-1"
            />
          </div>

          <div className="hidden leading-none sm:block">
            <span className="block font-serif text-2xl font-bold text-[var(--mel-brown)]">
              Mundo
            </span>
            <span className="block font-serif text-xl font-semibold text-[var(--mel-caramel)]">
              Entre Libros
            </span>
          </div>
        </Link>

        <button
          type="button"
          className="nav-mobile-button !flex lg:!hidden"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
        >
          <span className={isMenuOpen ? "menu-line line-one-open" : "menu-line"} />
          <span className={isMenuOpen ? "menu-line line-two-open" : "menu-line"} />
          <span className={isMenuOpen ? "menu-line line-three-open" : "menu-line"} />
        </button>

        <div className="hidden items-center gap-3 lg:flex">
          <ul className="flex items-center gap-1">
            {navigationLinks.map((link) => {
              const isActive = isActiveLink(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`nav-link-animated ${
                      isActive ? "nav-link-active" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="ml-3 flex items-center gap-2">
            <Link
                href="/cuenta"
                className="nav-icon-button"
                aria-label="Ir a mi cuenta"
            >
                <UserRound size={26} strokeWidth={2.4} />
            </Link>

            <Link
                href="/carrito"
                className="nav-icon-button"
                aria-label="Ir al carrito"
            >
                <ShoppingCart size={26} strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="mx-auto mt-3 max-w-7xl rounded-[1.5rem] border border-white/50 bg-[rgba(246,235,217,0.95)] p-4 shadow-xl backdrop-blur-xl lg:hidden mobile-menu-enter">
          <ul className="grid gap-2">
            {navigationLinks.map((link) => {
              const isActive = isActiveLink(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block rounded-2xl px-4 py-3 font-serif text-xl font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-[var(--mel-brown)] text-[var(--mel-cream)]"
                        : "text-[var(--mel-brown)] hover:bg-[var(--mel-warm)] hover:translate-x-1"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href="/cuenta"
              onClick={() => setIsMenuOpen(false)}
              className="mobile-action-link"
            >
              Mi cuenta
            </Link>

            <Link
              href="/carrito"
              onClick={() => setIsMenuOpen(false)}
              className="mobile-action-link"
            >
              Carrito
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}