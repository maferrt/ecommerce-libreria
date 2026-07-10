"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Swal from "sweetalert2";
import { ClientPortal } from "@/components/ui/ClientPortal";
import { useAccount } from "@/context/AccountContext";
import { useCart } from "@/context/CartContext";
import {
  type WishlistToggleResult,
  useWishlist,
} from "@/context/WishlistContext";
import {
  categoryLabels as fallbackCategoryLabels,
  categoryOrder as fallbackCategoryOrder,
} from "@/data/catalog";
import {
  getCatalogRequest,
  getCategoriesRequest,
} from "@/lib/catalog-api";
import type { Book, BookCategory, CatalogData, Saga } from "@/types/book";
import styles from "./CatalogClient.module.css";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export function CatalogClient() {
  const router = useRouter();
  const { isAuthenticated } = useAccount();
  const { addBook, addSaga } = useCart();

  const {
    toggleBook,
    toggleSaga,
    isBookSaved,
    isSagaSaved,
  } = useWishlist();

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedSaga, setSelectedSaga] = useState<Saga | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [catalogData, setCatalogData] = useState<CatalogData>({
    libros: [],
    sagas: [],
  });

  const [categoryLabels, setCategoryLabels] = useState<Record<string, string>>({
    ...fallbackCategoryLabels,
  });

  const [categoryOrder, setCategoryOrder] = useState<string[]>([
    ...fallbackCategoryOrder,
  ]);

  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCatalog() {
      try {
        setIsLoadingCatalog(true);
        setCatalogError("");

        const [catalogResponse, categoriesResponse] = await Promise.all([
          getCatalogRequest(),
          getCategoriesRequest(),
        ]);

        if (!isMounted) return;

        const nextCategoryLabels = categoriesResponse.reduce<
          Record<string, string>
        >((labels, category) => {
          labels[category.id] = category.label;
          return labels;
        }, {});

        setCatalogData(catalogResponse);
        setCategoryLabels(nextCategoryLabels);
        setCategoryOrder(categoriesResponse.map((category) => category.id));
      } catch (error) {
        if (!isMounted) return;

        setCatalogError(
          error instanceof Error
            ? error.message
            : "No se pudo cargar el catálogo.",
        );
      } finally {
        if (isMounted) {
          setIsLoadingCatalog(false);
        }
      }
    }

    void loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBooks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return catalogData.libros;

    return catalogData.libros.filter((book) => {
      return (
        book.titulo.toLowerCase().includes(normalizedSearch) ||
        book.autor.toLowerCase().includes(normalizedSearch) ||
        book.editorial.toLowerCase().includes(normalizedSearch) ||
        book.categoria.toLowerCase().includes(normalizedSearch) ||
        book.saga?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [catalogData.libros, searchTerm]);

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

  async function handleWishlistResult(result: WishlistToggleResult) {
    if (!result.ok) {
      const loginResult = await Swal.fire({
        icon: "info",
        title: "Inicia sesión",
        text: "Para guardar favoritos necesitas iniciar sesión o crear una cuenta.",
        confirmButtonText: "Ir a mi cuenta",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#521f12",
        cancelButtonColor: "#a0653d",
        background: "#f6ebd9",
        color: "#521f12",
      });

      if (loginResult.isConfirmed) {
        router.push("/cuenta");
      }

      return;
    }

    await Swal.fire({
      toast: true,
      position: "top-end",
      icon: result.saved ? "success" : "info",
      title: result.message,
      showConfirmButton: false,
      timer: 1600,
      timerProgressBar: true,
      background: "#f6ebd9",
      color: "#521f12",
    });
  }

  async function requireLoginForCart() {
    if (isAuthenticated) return true;

    const result = await Swal.fire({
      icon: "info",
      title: "Inicia sesión",
      text: "Para agregar productos al carrito necesitas iniciar sesión.",
      confirmButtonText: "Ir a mi cuenta",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#521f12",
      cancelButtonColor: "#a0653d",
      background: "#f6ebd9",
      color: "#521f12",
    });

    if (result.isConfirmed) {
      router.push("/cuenta");
    }

    return false;
  }

  async function handleAddBookToCart(book: Book) {
    const canAddToCart = await requireLoginForCart();

    if (!canAddToCart) return;

    addBook(book);

    await Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Libro agregado al carrito",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      background: "#f6ebd9",
      color: "#521f12",
    });
  }

  async function handleAddSagaToCart(saga: Saga) {
    const canAddToCart = await requireLoginForCart();

    if (!canAddToCart) return;

    addSaga(saga, saga.libros.length);

    await Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Saga agregada al carrito",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      background: "#f6ebd9",
      color: "#521f12",
    });
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <span>Catálogo literario</span>

        <h1>Encuentra tu próxima lectura favorita</h1>

        <p>
          Explora libros por categoría, guarda tus favoritos y arma tu carrito
          con historias para todos los gustos.
        </p>

        <div className={styles.searchBox}>
          <Search size={18} />

          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por título, autor, editorial, saga o categoría..."
          />
        </div>
      </header>

      {isLoadingCatalog && (
        <section className={styles.categorySection}>
          <h2>Cargando catálogo...</h2>
          <p>Estamos trayendo los libros desde el backend.</p>
        </section>
      )}

      {catalogError && (
        <section className={styles.categorySection}>
          <h2>No se pudo cargar el catálogo</h2>
          <p>{catalogError}</p>
        </section>
      )}

      {!isLoadingCatalog && !catalogError && (
        <>
          <section className={styles.categorySection}>
            <h2>📚 Sagas</h2>

            <CatalogCarousel>
              {catalogData.sagas.map((saga) => (
                <article key={saga.id} className={styles.bookCard}>
                  <button
                    type="button"
                    className={
                      isSagaSaved(saga.id)
                        ? `${styles.wishlistButton} ${styles.wishlistButtonActive}`
                        : styles.wishlistButton
                    }
                    onClick={() => void handleWishlistResult(toggleSaga(saga))}
                    aria-label={
                      isSagaSaved(saga.id)
                        ? `Quitar ${saga.nombre} de wishlist`
                        : `Guardar ${saga.nombre} en wishlist`
                    }
                  >
                    <Heart
                      size={18}
                      fill={isSagaSaved(saga.id) ? "currentColor" : "none"}
                    />
                  </button>

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
                <h2>
                  {categoryLabels[category] ??
                    fallbackCategoryLabels[category as BookCategory] ??
                    category}
                </h2>

                <CatalogCarousel>
                  {books.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      isSaved={isBookSaved(book.id)}
                      onToggleWishlist={() =>
                        void handleWishlistResult(toggleBook(book))
                      }
                      onOpen={() => setSelectedBook(book)}
                    />
                  ))}
                </CatalogCarousel>
              </section>
            );
          })}
        </>
      )}

      {selectedBook && (
        <ClientPortal>
          <BookModal
            book={selectedBook}
            isSaved={isBookSaved(selectedBook.id)}
            onClose={() => setSelectedBook(null)}
            onAddToCart={() => void handleAddBookToCart(selectedBook)}
            onToggleWishlist={() =>
              void handleWishlistResult(toggleBook(selectedBook))
            }
          />
        </ClientPortal>
      )}

      {selectedSaga && (
        <ClientPortal>
          <SagaModal
            saga={selectedSaga}
            books={getSagaBooks(selectedSaga)}
            isSaved={isSagaSaved(selectedSaga.id)}
            onClose={() => setSelectedSaga(null)}
            onOpenBook={(book) => {
              setSelectedSaga(null);
              setSelectedBook(book);
            }}
            onAddToCart={() => void handleAddSagaToCart(selectedSaga)}
            onToggleWishlist={() =>
              void handleWishlistResult(toggleSaga(selectedSaga))
            }
          />
        </ClientPortal>
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
  isSaved: boolean;
  onToggleWishlist: () => void;
  onOpen: () => void;
};

function BookCard({
  book,
  isSaved,
  onToggleWishlist,
  onOpen,
}: BookCardProps) {
  return (
    <article className={styles.bookCard}>
      <button
        type="button"
        className={
          isSaved
            ? `${styles.wishlistButton} ${styles.wishlistButtonActive}`
            : styles.wishlistButton
        }
        onClick={onToggleWishlist}
        aria-label={
          isSaved
            ? `Quitar ${book.titulo} de wishlist`
            : `Guardar ${book.titulo} en wishlist`
        }
      >
        <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
      </button>

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
  isSaved: boolean;
  onClose: () => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
};

function BookModal({
  book,
  isSaved,
  onClose,
  onAddToCart,
  onToggleWishlist,
}: BookModalProps) {
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

        <div className={styles.modalActions}>
          <button type="button" className={styles.cartButton} onClick={onAddToCart}>
            <ShoppingCart size={17} />
            Agregar al carrito
          </button>

          <button
            type="button"
            className={
              isSaved
                ? `${styles.wishlistModalButton} ${styles.wishlistModalButtonActive}`
                : styles.wishlistModalButton
            }
            onClick={onToggleWishlist}
          >
            <Heart size={17} fill={isSaved ? "currentColor" : "none"} />
            {isSaved ? "Quitar de wishlist" : "Guardar en wishlist"}
          </button>
        </div>
      </article>
    </div>
  );
}

type SagaModalProps = {
  saga: Saga;
  books: Book[];
  isSaved: boolean;
  onClose: () => void;
  onOpenBook: (book: Book) => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
};

function SagaModal({
  saga,
  books,
  isSaved,
  onClose,
  onOpenBook,
  onAddToCart,
  onToggleWishlist,
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

        <div className={styles.modalActions}>
          <button type="button" className={styles.cartButton} onClick={onAddToCart}>
            <ShoppingCart size={17} />
            Agregar paquete de saga al carrito
          </button>

          <button
            type="button"
            className={
              isSaved
                ? `${styles.wishlistModalButton} ${styles.wishlistModalButtonActive}`
                : styles.wishlistModalButton
            }
            onClick={onToggleWishlist}
          >
            <Heart size={17} fill={isSaved ? "currentColor" : "none"} />
            {isSaved ? "Quitar de wishlist" : "Guardar en wishlist"}
          </button>
        </div>
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