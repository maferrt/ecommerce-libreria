"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import { useAccount } from "@/context/AccountContext";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import styles from "./CartClient.module.css";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export function CartClient() {
  const router = useRouter();
  const { isAuthenticated } = useAccount();
  const { createOrder } = useOrders();

  const {
    items,
    subtotal,
    totalItems,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
    refreshCart,
  } = useCart();

  async function handleCheckout() {
    if (!isAuthenticated) {
      const result = await Swal.fire({
        icon: "info",
        title: "Inicia sesión",
        text: "Para finalizar tu compra necesitas iniciar sesión.",
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

      return;
    }

    if (items.length === 0) {
      await Swal.fire({
        icon: "info",
        title: "Tu carrito está vacío",
        text: "Agrega al menos un libro o saga para generar un pedido.",
        confirmButtonColor: "#521f12",
        background: "#f6ebd9",
        color: "#521f12",
      });

      return;
    }

    const confirmation = await Swal.fire({
      icon: "question",
      title: "¿Finalizar compra?",
      text: "Se generará un pedido con los productos actuales del carrito.",
      confirmButtonText: "Sí, generar pedido",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#521f12",
      cancelButtonColor: "#a0653d",
      background: "#f6ebd9",
      color: "#521f12",
    });

    if (!confirmation.isConfirmed) return;

    const orderResult = await createOrder(
      "Simulado",
      "Pedido generado desde el carrito web.",
    );

    if (!orderResult.ok) {
      await Swal.fire({
        icon: "error",
        title: "No se pudo generar el pedido",
        text: orderResult.message,
        confirmButtonColor: "#521f12",
        background: "#f6ebd9",
        color: "#521f12",
      });

      return;
    }

    await refreshCart();

    const successResult = await Swal.fire({
      icon: "success",
      title: "Pedido generado",
      text: orderResult.message,
      confirmButtonText: "Ver mis pedidos",
      showCancelButton: true,
      cancelButtonText: "Seguir comprando",
      confirmButtonColor: "#521f12",
      cancelButtonColor: "#a0653d",
      background: "#f6ebd9",
      color: "#521f12",
    });

    if (successResult.isConfirmed) {
      router.push("/cuenta/pedidos");
      return;
    }

    router.push("/catalogo");
  }

  async function handleClearCart() {
    if (items.length === 0) return;

    const confirmation = await Swal.fire({
      icon: "warning",
      title: "¿Vaciar carrito?",
      text: "Se eliminarán todos los productos del carrito.",
      confirmButtonText: "Sí, vaciar",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#521f12",
      cancelButtonColor: "#a0653d",
      background: "#f6ebd9",
      color: "#521f12",
    });

    if (!confirmation.isConfirmed) return;

    const result = await clearCart();

    if (!result.ok) {
      await Swal.fire({
        icon: "error",
        title: "No se pudo vaciar",
        text: result.message,
        confirmButtonColor: "#521f12",
        background: "#f6ebd9",
        color: "#521f12",
      });

      return;
    }

    await Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: result.message,
      showConfirmButton: false,
      timer: 1600,
      timerProgressBar: true,
      background: "#f6ebd9",
      color: "#521f12",
    });
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <Link href="/catalogo" className={styles.backLink}>
          <ArrowLeft size={17} />
          Volver al catálogo
        </Link>

        <span>Carrito de compra</span>

        <h1>Revisa tus próximas lecturas</h1>

        <p>
          Ajusta cantidades, elimina productos o finaliza tu compra para generar
          un pedido.
        </p>
      </header>

      {items.length === 0 ? (
        <section className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <ShoppingBag size={42} />
          </div>

          <h2>Tu carrito está vacío</h2>

          <p>
            Explora el catálogo y agrega libros o sagas para comenzar tu compra.
          </p>

          <Link href="/catalogo">Explorar catálogo</Link>
        </section>
      ) : (
        <section className={styles.cartLayout}>
          <div className={styles.itemsList}>
            {items.map((item) => (
              <article key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={110}
                    height={160}
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
                      onClick={() => void decrementItem(item.id)}
                      aria-label="Reducir cantidad"
                    >
                      <Minus size={16} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => void incrementItem(item.id)}
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => void removeItem(item.id)}
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

            <button
              type="button"
              className={styles.checkoutButton}
              onClick={() => void handleCheckout()}
            >
              Continuar compra
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className={styles.clearButton}
              onClick={() => void handleClearCart()}
            >
              Vaciar carrito
            </button>
          </aside>
        </section>
      )}
    </main>
  );
}