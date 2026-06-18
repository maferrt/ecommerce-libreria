"use client";

import {
  BookHeart,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import Swal from "sweetalert2";
import styles from "./ContactClient.module.css";

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  reason: string;
};

const initialFormState: ContactFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  reason: "Duda sobre catálogo",
};

const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ContactClient() {
  const [formData, setFormData] = useState<ContactFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof ContactFormState, value: string) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim();
    const cleanSubject = formData.subject.trim();
    const cleanMessage = formData.message.trim();

    if (!cleanName || !cleanEmail || !cleanSubject || !cleanMessage) {
      await Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa nombre, correo, asunto y mensaje.",
        confirmButtonColor: "#521f12",
        background: "#f6ebd9",
        color: "#521f12",
      });

      return;
    }

    if (!isValidEmail(cleanEmail)) {
      await Swal.fire({
        icon: "warning",
        title: "Correo inválido",
        text: "Revisa que el correo electrónico esté escrito correctamente.",
        confirmButtonColor: "#521f12",
        background: "#f6ebd9",
        color: "#521f12",
      });

      return;
    }

    if (!formspreeEndpoint) {
      await Swal.fire({
        icon: "error",
        title: "Falta configurar Formspree",
        text: "Agrega NEXT_PUBLIC_FORMSPREE_ENDPOINT en tu archivo .env.local.",
        confirmButtonColor: "#521f12",
        background: "#f6ebd9",
        color: "#521f12",
      });

      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: cleanName,
          correo: cleanEmail,
          asunto: cleanSubject,
          motivo: formData.reason,
          mensaje: cleanMessage,
          _subject: `Mundo Entre Libros | ${cleanSubject}`,
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo enviar el mensaje.");
      }

      setFormData(initialFormState);

      await Swal.fire({
        icon: "success",
        title: "Mensaje enviado",
        text: "Gracias por escribirnos. Te responderemos lo antes posible.",
        confirmButtonColor: "#521f12",
        background: "#f6ebd9",
        color: "#521f12",
      });
    } catch {
      await Swal.fire({
        icon: "error",
        title: "No se pudo enviar",
        text: "Intenta nuevamente en unos minutos.",
        confirmButtonColor: "#521f12",
        background: "#f6ebd9",
        color: "#521f12",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            <Sparkles size={16} />
            Contacto
          </span>

          <h1>Escríbenos y sigamos leyendo juntos</h1>

          <p>
            ¿Tienes dudas sobre el catálogo, los foros o una recomendación de
            lectura? Envíanos un mensaje y el equipo de Mundo Entre Libros se
            pondrá en contacto contigo.
          </p>
        </div>

        <div className={styles.heroNote}>
          <BookHeart size={38} />
          <strong>Tu opinión también construye esta comunidad</strong>
          <span>Lectores, historias y recomendaciones</span>
        </div>
      </section>

      <section className={styles.contactLayout}>
        <aside className={styles.infoPanel}>
          <article className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Mail size={22} />
            </div>

            <div>
              <h2>Correo</h2>
              <p>Recibimos tus mensajes mediante Formspree.</p>
            </div>
          </article>

          <article className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Clock size={22} />
            </div>

            <div>
              <h2>Tiempo de respuesta</h2>
              <p>Responderemos lo antes posible según la disponibilidad del equipo.</p>
            </div>
          </article>

          <article className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <MessageCircle size={22} />
            </div>

            <div>
              <h2>Motivos de contacto</h2>
              <p>Dudas, sugerencias, catálogo, pedidos, comunidad y soporte.</p>
            </div>
          </article>

          <article className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <MapPin size={22} />
            </div>

            <div>
              <h2>Proyecto</h2>
              <p>Mundo Entre Libros, plataforma digital para lectores.</p>
            </div>
          </article>
        </aside>

        <section className={styles.formCard}>
          <div className={styles.formHeader}>
            <span>
              <CheckCircle2 size={16} />
              Formulario conectado
            </span>

            <h2>Envíanos un mensaje</h2>

            <p>
              Completa el formulario y recibiremos tu mensaje directamente desde
              Formspree.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGrid}>
              <label className={styles.field}>
                <span>Nombre</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Tu nombre"
                  autoComplete="name"
                />
              </label>

              <label className={styles.field}>
                <span>Correo electrónico</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                />
              </label>
            </div>

            <label className={styles.field}>
              <span>Motivo</span>
              <select
                name="reason"
                value={formData.reason}
                onChange={(event) => updateField("reason", event.target.value)}
              >
                <option>Duda sobre catálogo</option>
                <option>Duda sobre carrito o compra</option>
                <option>Sugerencia de libro</option>
                <option>Comentarios sobre foros</option>
                <option>Soporte general</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>Asunto</span>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={(event) => updateField("subject", event.target.value)}
                placeholder="Escribe el asunto de tu mensaje"
              />
            </label>

            <label className={styles.field}>
              <span>Mensaje</span>
              <textarea
                name="message"
                value={formData.message}
                onChange={(event) => updateField("message", event.target.value)}
                placeholder="Cuéntanos cómo podemos ayudarte..."
                rows={7}
              />
            </label>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              <Send size={17} />
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}