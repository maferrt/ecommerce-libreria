"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { type ReactNode, useMemo, useRef, useState } from "react";
import { catalogData, categoryLabels, categoryOrder } from "@/data/catalog";
import type { Book, Saga } from "@/types/book";
import { useCart } from "@/context/CartContext";
import styles from "./CatalogClient.module.css";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export function CatalogClient() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedSaga, setSelectedSaga] = useState<Saga | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { addBook, addSaga } = useCart();

  const filteredBooks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return catalogData.libros;

    return catalogData.libros.filter((book) => {
      return (
        book.titulo.toLowerCase().includes(normalizedSearch) ||
        book.autor.toLowerCase().includes(normalizedSearch) ||
        book.editorial.toLowerCase().includes(normalizedSearch) ||
        book.categoria.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [searchTerm]);

  const booksByCategory = useMemo(() => {
    return filteredBooks.reduce<Record<string, Book[]>>((acc, book) => {
      if (!acc[book.categoria]) {
        acc[book.categoria] = [];
      }

      acc[book.categoria].push(book);

      return acc;
    }, {});
  }, [filteredBooks]);

  function getSagaBooks(saga: Saga) {
    return catalogData.libros.filter((book) => saga.libros.includes(book.id));
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Catálogo</span>

        <h1>Explora nuestro catálogo</h1>

        <p>
          Descubre libros por género, sagas destacadas, autores y lecturas para
          tu próxima aventura literaria.
        </p>

        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por título, autor, editorial o categoría..."
          />
        </div>
      </header>

      <section className={styles.categorySection}>
        <h2>📚 Sagas</h2>

        <CatalogCarousel>
          {catalogData.sagas.map((saga) => (
            <article key={saga.id} className={styles.bookCard}>
              <div className={styles.coverWrapper}>
                <Image
                  src={saga.portada}
                  alt={saga.nombre}
                  width={260}
                  height={380}
                  className={styles.cover}
                />
              </div>

              <div className={styles.cardBody}>
                <h3>{saga.nombre}</h3>
                <p>{saga.libros.length} libros</p>

                <strong>{currencyFormatter.format(saga.precioSaga)}</strong>

                <button type="button" onClick={() => setSelectedSaga(saga)}>
                  Ver más
                </button>
              </div>
            </article>
          ))}
        </CatalogCarousel>
      </section>

      {categoryOrder.map((category) => {
        const books = booksByCategory[category] ?? [];

        if (books.length === 0) return null;

        return (
          <section key={category} className={styles.categorySection}>
            <h2>{categoryLabels[category]}</h2>

            <CatalogCarousel>
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onOpen={() => setSelectedBook(book)}
                />
              ))}
            </CatalogCarousel>
          </section>
        );
      })}

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onAddToCart={() => addBook(selectedBook)}
        />
      )}

      {selectedSaga && (
        <SagaModal
          saga={selectedSaga}
          books={getSagaBooks(selectedSaga)}
          onClose={() => setSelectedSaga(null)}
          onOpenBook={(book) => {
            setSelectedSaga(null);
            setSelectedBook(book);
          }}
          onAddToCart={() => addSaga(selectedSaga, selectedSaga.libros.length)}
        />
      )}
    </main>
  );
}

type CatalogCarouselProps = {
  children: ReactNode;
  compact?: boolean;
};

function CatalogCarousel({ children, compact = false }: CatalogCarouselProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  function scrollCarousel(direction: "left" | "right") {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const scrollAmount = Math.max(carousel.clientWidth * 0.85, 280);

    carousel.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  return (
    <div className={styles.carouselShell}>
      <button
        type="button"
        className={`${styles.carouselButton} ${styles.carouselButtonLeft}`}
        onClick={() => scrollCarousel("left")}
        aria-label="Ver libros anteriores"
      >
        <ChevronLeft size={22} />
      </button>

      <div
        ref={carouselRef}
        className={
          compact
            ? `${styles.carousel} ${styles.carouselCompact}`
            : styles.carousel
        }
      >
        {children}
      </div>

      <button
        type="button"
        className={`${styles.carouselButton} ${styles.carouselButtonRight}`}
        onClick={() => scrollCarousel("right")}
        aria-label="Ver más libros"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}

type BookCardProps = {
  book: Book;
  onOpen: () => void;
};

function BookCard({ book, onOpen }: BookCardProps) {
  return (
    <article className={styles.bookCard}>
      <div className={styles.coverWrapper}>
        <Image
          src={book.portada}
          alt={book.titulo}
          width={260}
          height={380}
          className={styles.cover}
        />
      </div>

      <div className={styles.cardBody}>
        <h3>{book.titulo}</h3>

        <p>
          <strong>Autor:</strong> {book.autor}
        </p>

        <p>
          <strong>Editorial:</strong> {book.editorial}
        </p>

        <strong>{currencyFormatter.format(book.precio)}</strong>

        <button type="button" onClick={onOpen}>
          Ver detalles
        </button>
      </div>
    </article>
  );
}

type BookModalProps = {
  book: Book;
  onClose: () => void;
  onAddToCart: () => void;
};

function BookModal({ book, onClose, onAddToCart }: BookModalProps) {
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <article
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.modalHeader}>
          <h2>{book.titulo}</h2>

          <button type="button" onClick={onClose} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </header>

        <div className={styles.modalGrid}>
          <div className={styles.modalCover}>
            <Image
              src={book.portada}
              alt={book.titulo}
              width={320}
              height={460}
            />
          </div>

          <div className={styles.modalInfo}>
            <InfoCard label="Autor" value={book.autor} />
            <InfoCard label="Saga" value={book.saga ?? "Libro independiente"} />
            <InfoCard label="Editorial" value={book.editorial} />
            <InfoCard label="Edición" value={book.edicion} />
            <InfoCard label="ISBN" value={book.isbn} />

            <div className={styles.priceCard}>
              <span>Precio</span>
              <strong>{currencyFormatter.format(book.precio)}</strong>
            </div>
          </div>
        </div>

        <section className={styles.synopsis}>
          <h3>Sinopsis</h3>
          <p>{book.sinopsis}</p>
        </section>

        <button type="button" className={styles.cartButton} onClick={onAddToCart}>
          <ShoppingCart size={17} />
          Agregar al carrito
        </button>
      </article>
    </div>
  );
}

type SagaModalProps = {
  saga: Saga;
  books: Book[];
  onClose: () => void;
  onOpenBook: (book: Book) => void;
  onAddToCart: () => void;
};

function SagaModal({
  saga,
  books,
  onClose,
  onOpenBook,
  onAddToCart,
}: SagaModalProps) {
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <article
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.modalHeader}>
          <h2>{saga.nombre}</h2>

          <button type="button" onClick={onClose} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </header>

        <div className={styles.modalGrid}>
          <div className={styles.modalCover}>
            <Image
              src={saga.portada}
              alt={saga.nombre}
              width={320}
              height={460}
            />
          </div>

          <div className={styles.modalInfo}>
            <InfoCard label="Nombre de la saga" value={saga.nombre} />
            <InfoCard label="ISBN" value={saga.isbnSaga} />
            <InfoCard label="Libros incluidos" value={`${books.length} libros`} />

            <div className={styles.priceCard}>
              <span>Precio</span>
              <strong>{currencyFormatter.format(saga.precioSaga)}</strong>
            </div>
          </div>
        </div>

        <section className={styles.synopsis}>
          <h3>Descripción</h3>
          <p>{saga.descripcion}</p>
        </section>

        <section className={styles.sagaBooks}>
          <h3>Libros de la saga</h3>

          <CatalogCarousel compact>
            {books.map((book) => (
              <article key={book.id} className={styles.miniBookCard}>
                <Image
                  src={book.portada}
                  alt={book.titulo}
                  width={120}
                  height={170}
                />

                <div>
                  <h4>{book.titulo}</h4>
                  <p>{book.autor}</p>

                  <button type="button" onClick={() => onOpenBook(book)}>
                    Ver detalles
                  </button>
                </div>
              </article>
            ))}
          </CatalogCarousel>
        </section>

        <button type="button" className={styles.cartButton} onClick={onAddToCart}>
          <ShoppingCart size={17} />
          Agregar paquete de saga al carrito
        </button>
      </article>
    </div>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className={styles.infoCard}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}