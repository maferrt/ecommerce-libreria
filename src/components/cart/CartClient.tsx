"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import styles from "./CartClient.module.css";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export function CartClient() {
  const {
    items,
    subtotal,
    totalItems,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  } = useCart();

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Carrito</span>

        <h1>Tu carrito de compras</h1>

        <p>
          Revisa tus libros y paquetes de saga antes de continuar con tu compra.
        </p>
      </header>

      {items.length === 0 ? (
        <section className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <ShoppingBag size={40} />
          </div>

          <h2>Tu carrito está vacío</h2>

          <p>Agrega libros o sagas desde el catálogo para que aparezcan aquí.</p>

          <Link href="/catalogo">
            Explorar catálogo
            <ArrowRight size={17} />
          </Link>
        </section>
      ) : (
        <section className={styles.cartLayout}>
          <div className={styles.itemsPanel}>
            {items.map((item) => (
              <article key={item.id} className={styles.itemCard}>
                <div className={styles.itemImage}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={120}
                    height={170}
                  />
                </div>

                <div className={styles.itemInfo}>
                  <span className={styles.itemType}>
                    {item.type === "saga" ? "Paquete de saga" : "Libro"}
                  </span>

                  <h2>{item.title}</h2>

                  <p>{item.subtitle}</p>

                  <small>{item.meta}</small>

                  <strong>{currencyFormatter.format(item.price)}</strong>
                </div>

                <div className={styles.itemControls}>
                  <div className={styles.quantityControl}>
                    <button
                      type="button"
                      onClick={() => decrementItem(item.id)}
                      aria-label="Reducir cantidad"
                    >
                      <Minus size={16} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => incrementItem(item.id)}
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className={styles.summaryPanel}>
            <h2>Resumen</h2>

            <div className={styles.summaryRow}>
              <span>Productos</span>
              <strong>{totalItems}</strong>
            </div>

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <strong>{currencyFormatter.format(subtotal)}</strong>
            </div>

            <div className={styles.summaryRow}>
              <span>Envío</span>
              <strong>Por definir</strong>
            </div>

            <div className={styles.totalRow}>
              <span>Total estimado</span>
              <strong>{currencyFormatter.format(subtotal)}</strong>
            </div>

            <button type="button" className={styles.checkoutButton}>
              Continuar compra
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className={styles.clearButton}
              onClick={clearCart}
            >
              Vaciar carrito
            </button>
          </aside>
        </section>
      )}
    </main>
  );
}