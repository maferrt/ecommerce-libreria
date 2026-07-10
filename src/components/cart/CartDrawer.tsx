"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import styles from "./CartDrawer.module.css";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    subtotal,
    totalItems,
    closeCart,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className={styles.backdrop} onClick={closeCart}>
      <aside className={styles.drawer} onClick={(event) => event.stopPropagation()}>
        <header className={styles.header}>
          <div>
            <span>Carrito</span>
            <h2>Tu selección</h2>
          </div>

          <button type="button" onClick={closeCart} aria-label="Cerrar carrito">
            <X size={20} />
          </button>
        </header>

        {items.length === 0 ? (
          <section className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <ShoppingBag size={34} />
            </div>

            <h3>Tu carrito está vacío</h3>

            <p>Agrega libros o paquetes de saga desde el catálogo.</p>

            <Link href="/catalogo" onClick={closeCart}>
              Ir al catálogo
              <ArrowRight size={16} />
            </Link>
          </section>
        ) : (
          <>
            <section className={styles.itemsList}>
              {items.map((item) => (
                <article key={item.id} className={styles.itemCard}>
                  <div className={styles.itemImage}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={90}
                      height={130}
                    />
                  </div>

                  <div className={styles.itemInfo}>
                    <div>
                      <span className={styles.itemType}>
                        {item.type === "saga" ? "Paquete de saga" : "Libro"}
                      </span>

                      <h3>{item.title}</h3>

                      <p>{item.subtitle}</p>

                      <small>{item.meta}</small>
                    </div>

                    <strong>{currencyFormatter.format(item.price)}</strong>

                    <div className={styles.itemActions}>
                      <div className={styles.quantityControl}>
                        <button
                          type="button"
                          onClick={() => void decrementItem(item.id)}
                          aria-label="Reducir cantidad"
                        >
                          <Minus size={15} />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() => void incrementItem(item.id)}
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => void removeItem(item.id)}
                        aria-label="Eliminar producto"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <footer className={styles.footer}>
              <div className={styles.summaryRow}>
                <span>Productos</span>
                <strong>{totalItems}</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <strong>{currencyFormatter.format(subtotal)}</strong>
              </div>

              <Link
                href="/carrito"
                className={styles.checkoutButton}
                onClick={closeCart}
              >
                Ver carrito completo
                <ArrowRight size={16} />
              </Link>

              <button
                type="button"
                className={styles.clearButton}
                onClick={() => void clearCart()}
              >
                Vaciar carrito
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}