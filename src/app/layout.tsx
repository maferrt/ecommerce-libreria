import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "sweetalert2/dist/sweetalert2.min.css";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mundo Entre Libros",
  description:
    "E-commerce literario con catálogo, carrito, comunidad lectora y foros por género.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${cormorant.variable} ${inter.variable}`}>
        <div className="site-shell">
          <div className="ambient-background" aria-hidden="true">
            <span className="ambient-orb ambient-orb-one" />
            <span className="ambient-orb ambient-orb-two" />
            <span className="ambient-orb ambient-orb-three" />

            <span className="floating-book floating-book-one">📖</span>
            <span className="floating-book floating-book-two">☕</span>
            <span className="floating-book floating-book-three">✦</span>
          </div>

          <Navbar />

          <div className="h-24 shrink-0" aria-hidden="true" />

          <main className="main-content page-enter">{children}</main>

          <Footer />
        </div>
      </body>
    </html>
  );
}