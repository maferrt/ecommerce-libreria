"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { useAccount } from "@/context/AccountContext";
import { useOrders } from "@/context/OrderContext";
import styles from "./OrdersClient.module.css";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

function formatOrderDate(date: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function getShortOrderId(orderId: string, orderNumber?: string) {
  if (orderNumber) {
    return orderNumber;
  }

  return orderId.replace("order-", "").slice(0, 8).toUpperCase();
}

export function OrdersClient() {
  const { isAuthenticated } = useAccount();
  const { orders, totalOrders } = useOrders();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <main className={styles.page}>
        <section className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <ShoppingBag size={42} />
          </div>

          <h1>Inicia sesión para ver tus pedidos</h1>

          <p>
            Tu historial de pedidos está ligado a tu cuenta de Mundo Entre
            Libros.
          </p>

          <Link href="/cuenta">Ir a mi cuenta</Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <Link href="/cuenta" className={styles.backLink}>
          <ArrowLeft size={17} />
          Volver a mi cuenta
        </Link>

        <span>Historial de pedidos</span>

        <h1>Mis pedidos</h1>

        <p>
          Consulta los pedidos que has generado y revisa los productos incluidos
          en cada compra.
        </p>
      </header>

      <section className={styles.summaryCard}>
        <div className={styles.summaryIcon}>
          <PackageCheck size={32} />
        </div>

        <div>
          <span>Total de pedidos</span>
          <strong>{totalOrders}</strong>
        </div>
      </section>

      {orders.length === 0 ? (
        <section className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <ShoppingBag size={42} />
          </div>

          <h2>Aún no tienes pedidos</h2>

          <p>
            Cuando finalices una compra, tus pedidos aparecerán aquí.
          </p>

          <Link href="/catalogo">Explorar catálogo</Link>
        </section>
      ) : (
        <section className={styles.ordersList}>
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            return (
              <article key={order.id} className={styles.orderCard}>
                <button
                  type="button"
                  className={styles.orderHeader}
                  onClick={() =>
                    setExpandedOrderId((currentOrderId) =>
                      currentOrderId === order.id ? null : order.id,
                    )
                  }
                >
                  <div>
                    <span>
                      Pedido #{getShortOrderId(order.id, order.orderNumber)}
                    </span>

                    <h2>{currencyFormatter.format(order.paidAmount)}</h2>

                    <p>{formatOrderDate(order.createdAt)}</p>
                  </div>

                  <ChevronDown
                    size={24}
                    className={isExpanded ? styles.orderIconOpen : ""}
                  />
                </button>

                <div className={styles.orderMetaGrid}>
                  <div>
                    <span>ID interno</span>
                    <strong>{order.id}</strong>
                  </div>

                  <div>
                    <span>Número de pedido</span>
                    <strong>
                      {getShortOrderId(order.id, order.orderNumber)}
                    </strong>
                  </div>

                  <div>
                    <span>Fecha</span>
                    <strong>{formatOrderDate(order.createdAt)}</strong>
                  </div>

                  <div>
                    <span># productos</span>
                    <strong>{order.totalItems}</strong>
                  </div>

                  <div>
                    <span>Monto pagado</span>
                    <strong>{currencyFormatter.format(order.paidAmount)}</strong>
                  </div>

                  <div>
                    <span>Estatus</span>
                    <strong>{order.status}</strong>
                  </div>

                  <div>
                    <span>Método de pago</span>
                    <strong>{order.paymentMethod || "Simulado"}</strong>
                  </div>
                </div>

                {isExpanded && (
                  <section className={styles.orderDetails}>
                    <h3>Detalle del pedido</h3>

                    <div className={styles.orderItems}>
                      {order.items.map((item) => (
                        <div key={item.id} className={styles.orderItem}>
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={80}
                            height={115}
                          />

                          <div>
                            <span>
                              {item.type === "saga"
                                ? "Paquete de saga"
                                : "Libro"}
                            </span>

                            <strong>{item.title}</strong>

                            <p>{item.subtitle}</p>

                            <small>
                              Cantidad: {item.quantity} · Precio unitario:{" "}
                              {currencyFormatter.format(item.price)}
                            </small>

                            <small>
                              Subtotal:{" "}
                              {currencyFormatter.format(
                                item.price * item.quantity,
                              )}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={styles.shippingCard}>
                      <h3>Dirección de envío</h3>

                      <p>
                        {order.shippingAddress.street}{" "}
                        {order.shippingAddress.exteriorNumber}
                        {order.shippingAddress.interiorNumber
                          ? ` Int. ${order.shippingAddress.interiorNumber}`
                          : ""}
                      </p>

                      <p>
                        {order.shippingAddress.neighborhood},{" "}
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state},{" "}
                        {order.shippingAddress.zipCode}
                      </p>

                      <p>{order.shippingAddress.country}</p>

                      {order.shippingAddress.references && (
                        <small>
                          Referencias: {order.shippingAddress.references}
                        </small>
                      )}

                      {order.deliveryNotes && (
                        <small>Notas: {order.deliveryNotes}</small>
                      )}
                    </div>
                  </section>
                )}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}