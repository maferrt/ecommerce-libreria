"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  MessageCircle,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  UsersRound,
} from "lucide-react";
import { catalogData, categoryLabels } from "@/data/catalog";
import { forumCategories } from "@/data/forums";
import { HomeHero } from "./HomeHero";
import styles from "./HomeClient.module.css";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

const featuredBooks = catalogData.libros.slice(0, 8);
const featuredSagas = catalogData.sagas.slice(0, 4);
const featuredForums = forumCategories.slice(0, 6);

export function HomeClient() {
  return (
    <main className={styles.page}>
      <HomeHero />

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionKicker}>Catálogo</span>
            <h2>Sagas destacadas</h2>
          </div>

          <Link href="/catalogo" className={styles.sectionLink}>
            Ver catálogo
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.sagaGrid}>
          {featuredSagas.map((saga) => (
            <article key={saga.id} className={styles.sagaCard}>
              <div className={styles.sagaCover}>
                <Image
                  src={saga.portada}
                  alt={saga.nombre}
                  width={260}
                  height={360}
                />
              </div>

              <div className={styles.sagaInfo}>
                <h3>{saga.nombre}</h3>
                <p>{saga.descripcion}</p>

                <div className={styles.cardMeta}>
                  <span>{saga.libros.length} libros</span>
                  <strong>{currencyFormatter.format(saga.precioSaga)}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.splitSection}>
        <div className={styles.featurePanel}>
          <span className={styles.sectionKicker}>Lecturas</span>
          <h2>Libros para comenzar</h2>

          <Link href="/catalogo" className={styles.primaryButton}>
            Buscar libros
            <Search size={17} />
          </Link>
        </div>

        <div className={styles.bookGrid}>
          {featuredBooks.map((book) => (
            <article key={book.id} className={styles.bookCard}>
              <Image
                src={book.portada}
                alt={book.titulo}
                width={150}
                height={220}
              />

              <div>
                <span>{categoryLabels[book.categoria]}</span>
                <h3>{book.titulo}</h3>
                <p>{book.autor}</p>
                <strong>{currencyFormatter.format(book.precio)}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionKicker}>Comunidad</span>
            <h2>Foros por género</h2>
          </div>

          <Link href="/foros" className={styles.sectionLink}>
            Ver foros
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.forumGrid}>
          {featuredForums.map((forum) => (
            <Link
              href="/foros"
              key={forum.id}
              className={styles.forumCard}
              aria-label={`Ir al foro de ${forum.nombre}`}
            >
              <span className={styles.forumIcon}>{forum.icono}</span>

              <div>
                <h3>{forum.nombre}</h3>
                <p>{forum.descripcion}</p>
              </div>

              <ArrowRight size={18} />
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div>
          <span className={styles.sectionKicker}>Tu próxima lectura</span>
          <h2>Explora, guarda y comparte historias</h2>
          <p>
            Entra al catálogo para descubrir libros o visita los foros para
            conversar con otros lectores.
          </p>
        </div>

        <div className={styles.ctaActions}>
          <Link href="/catalogo" className={styles.primaryButton}>
            <ShoppingCart size={17} />
            Ir al catálogo
          </Link>

          <Link href="/foros" className={styles.secondaryButton}>
            <Star size={17} />
            Ir a la comunidad
          </Link>
        </div>
      </section>
    </main>
  );
}