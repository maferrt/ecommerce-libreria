"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Edit3,
  Heart,
  ImagePlus,
  Lock,
  LogOut,
  Mail,
  Save,
  ShoppingBag,
  Sparkles,
  Trophy,
  UserRound,
} from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAccount } from "@/context/AccountContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import type { WishlistItem } from "@/types/wishlist";
import type {
  AccountLoginInput,
  AccountRegisterInput,
  ReaderStatus,
  UserAddress,
  UserProfile,
} from "@/types/account";
import styles from "./AccountClient.module.css";

const readerStatusOptions: ReaderStatus[] = [
  "Leyendo ahora",
  "Buscando nueva lectura",
  "En pausa lectora",
  "Fan de sagas",
  "Modo terror activado",
  "Releyendo favoritos",
];

const genreOptions = [
  "Novela Juvenil",
  "Fantasía",
  "Terror",
  "Desarrollo personal",
  "Ciencia Ficción",
  "Educación financiera",
  "Psicología",
];

const initialLoginForm: AccountLoginInput = {
  email: "",
  password: "",
};

const initialRegisterForm: AccountRegisterInput = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

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

function getShortOrderId(orderId: string) {
  return orderId.replace("order-", "").slice(0, 8).toUpperCase();
}

export function AccountClient() {
  const { isAuthenticated } = useAccount();

  if (!isAuthenticated) {
    return <AuthPanel />;
  }

  return <AccountDashboard />;
}

function AuthPanel() {
  const { loginUser, registerUser } = useAccount();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginForm, setLoginForm] = useState<AccountLoginInput>(initialLoginForm);
  const [registerForm, setRegisterForm] =
    useState<AccountRegisterInput>(initialRegisterForm);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = loginUser(loginForm);

    if (!result.ok) {
      await Swal.fire({
        icon: "warning",
        title: "No se pudo iniciar sesión",
        text: result.message,
        confirmButtonColor: "#521f12",
        background: "#f6ebd9",
        color: "#521f12",
      });

      return;
    }

    setLoginForm(initialLoginForm);

    await Swal.fire({
      icon: "success",
      title: "Bienvenida/o",
      text: result.message,
      confirmButtonColor: "#521f12",
      background: "#f6ebd9",
      color: "#521f12",
    });
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = registerUser(registerForm);

    if (!result.ok) {
      await Swal.fire({
        icon: "warning",
        title: "No se pudo crear la cuenta",
        text: result.message,
        confirmButtonColor: "#521f12",
        background: "#f6ebd9",
        color: "#521f12",
      });

      return;
    }

    setRegisterForm(initialRegisterForm);

    await Swal.fire({
      icon: "success",
      title: "Cuenta creada",
      text: result.message,
      confirmButtonColor: "#521f12",
      background: "#f6ebd9",
      color: "#521f12",
    });
  }

  return (
    <main className={styles.page}>
      <section className={styles.authHero}>
        <div>
          <span className={styles.eyebrow}>
            <Sparkles size={16} />
            Mi cuenta
          </span>

          <h1>Tu espacio lector en Mundo Entre Libros</h1>

          <p>
            Crea una cuenta para personalizar tu perfil, guardar favoritos,
            consultar pedidos y acumular puntos dentro de los foros.
          </p>
        </div>

        <div className={styles.authNote}>
          <UserRound size={38} />
          <strong>Registro local para demo de frontend</strong>
          <span>Listo para conectar backend después</span>
        </div>
      </section>

      <section className={styles.authLayout}>
        <aside className={styles.authSideCard}>
          <h2>¿Qué podrás hacer?</h2>

          <ul>
            <li>
              <CheckCircle2 size={17} />
              Personalizar tu perfil lector
            </li>
            <li>
              <CheckCircle2 size={17} />
              Guardar libros en wishlist
            </li>
            <li>
              <CheckCircle2 size={17} />
              Ver pedidos simulados
            </li>
            <li>
              <CheckCircle2 size={17} />
              Consultar puntos de foros
            </li>
          </ul>

          <p>
            Por ahora los datos se guardan en localStorage. Cuando exista backend,
            este flujo puede migrarse a base de datos y JWT.
          </p>
        </aside>

        <section className={styles.authCard}>
          <div className={styles.authTabs}>
            <button
              type="button"
              className={mode === "login" ? styles.activeTab : ""}
              onClick={() => setMode("login")}
            >
              Iniciar sesión
            </button>

            <button
              type="button"
              className={mode === "register" ? styles.activeTab : ""}
              onClick={() => setMode("register")}
            >
              Crear cuenta
            </button>
          </div>

          {mode === "login" ? (
            <form className={styles.form} onSubmit={handleLogin}>
              <div className={styles.formHeader}>
                <h2>Iniciar sesión</h2>
                <p>Entra con el correo y contraseña que registraste.</p>
              </div>

              <label className={styles.field}>
                <span>Correo electrónico</span>
                <div className={styles.inputWithIcon}>
                  <Mail size={17} />
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(event) =>
                      setLoginForm((currentForm) => ({
                        ...currentForm,
                        email: event.target.value,
                      }))
                    }
                    placeholder="correo@ejemplo.com"
                    autoComplete="email"
                  />
                </div>
              </label>

              <label className={styles.field}>
                <span>Contraseña</span>
                <div className={styles.inputWithIcon}>
                  <Lock size={17} />
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((currentForm) => ({
                        ...currentForm,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                  />
                </div>
              </label>

              <button type="submit" className={styles.submitButton}>
                Entrar a mi cuenta
              </button>
            </form>
          ) : (
            <form className={styles.form} onSubmit={handleRegister}>
              <div className={styles.formHeader}>
                <h2>Crear cuenta</h2>
                <p>Regístrate para crear tu perfil lector.</p>
              </div>

              <label className={styles.field}>
                <span>Nombre</span>
                <div className={styles.inputWithIcon}>
                  <UserRound size={17} />
                  <input
                    type="text"
                    value={registerForm.name}
                    onChange={(event) =>
                      setRegisterForm((currentForm) => ({
                        ...currentForm,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Tu nombre"
                    autoComplete="name"
                  />
                </div>
              </label>

              <label className={styles.field}>
                <span>Correo electrónico</span>
                <div className={styles.inputWithIcon}>
                  <Mail size={17} />
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(event) =>
                      setRegisterForm((currentForm) => ({
                        ...currentForm,
                        email: event.target.value,
                      }))
                    }
                    placeholder="correo@ejemplo.com"
                    autoComplete="email"
                  />
                </div>
              </label>

              <div className={styles.fieldGrid}>
                <label className={styles.field}>
                  <span>Contraseña</span>
                  <div className={styles.inputWithIcon}>
                    <Lock size={17} />
                    <input
                      type="password"
                      value={registerForm.password}
                      onChange={(event) =>
                        setRegisterForm((currentForm) => ({
                          ...currentForm,
                          password: event.target.value,
                        }))
                      }
                      placeholder="Mínimo 6 caracteres"
                      autoComplete="new-password"
                    />
                  </div>
                </label>

                <label className={styles.field}>
                  <span>Confirmar contraseña</span>
                  <div className={styles.inputWithIcon}>
                    <Lock size={17} />
                    <input
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={(event) =>
                        setRegisterForm((currentForm) => ({
                          ...currentForm,
                          confirmPassword: event.target.value,
                        }))
                      }
                      placeholder="Repite contraseña"
                      autoComplete="new-password"
                    />
                  </div>
                </label>
              </div>

              <button type="submit" className={styles.submitButton}>
                Crear mi cuenta
              </button>
            </form>
          )}
        </section>
      </section>
    </main>
  );
}

function AccountDashboard() {
  const {
    currentUser,
    currentProfile,
    totalForumPoints,
    logoutUser,
    updateProfile,
  } = useAccount();
  const { addItem: addCartItem } = useCart();

function handleAddWishlistItemToCart(item: WishlistItem) {
  addCartItem({
    id: item.id,
    type: item.type,
    productId: item.productId,
    title: item.title,
    subtitle: item.subtitle,
    image: item.image,
    price: item.price,
    meta: item.meta,
  });
}
  const {
  items: wishlistItems,
  totalWishlistItems,
  removeItem: removeWishlistItem,
} = useWishlist();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<UserProfile | null>(null);

  const { orders, totalOrders } = useOrders();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentProfile) return;

    setProfileForm(currentProfile);
  }, [currentProfile]);

  if (!currentUser || !currentProfile || !profileForm) return null;

  async function handleLogout() {
    logoutUser();

    await Swal.fire({
      icon: "info",
      title: "Sesión cerrada",
      text: "Has salido de tu cuenta.",
      confirmButtonColor: "#521f12",
      background: "#f6ebd9",
      color: "#521f12",
    });
  }

  async function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!profileForm) {
      return;
    }

    updateProfile(profileForm);
    setIsEditingProfile(false);

    await Swal.fire({
      icon: "success",
      title: "Perfil actualizado",
      text: "Tus datos de perfil se guardaron correctamente.",
      confirmButtonColor: "#521f12",
      background: "#f6ebd9",
      color: "#521f12",
    });
  }

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      void Swal.fire({
        icon: "warning",
        title: "Archivo inválido",
        text: "Selecciona una imagen para tu perfil.",
        confirmButtonColor: "#521f12",
        background: "#f6ebd9",
        color: "#521f12",
      });

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfileForm((currentForm) => {
        if (!currentForm) return currentForm;

        return {
          ...currentForm,
          avatar: String(reader.result),
        };
      });
    };

    reader.readAsDataURL(file);
  }

  function updateAddressField(field: keyof UserAddress, value: string) {
    setProfileForm((currentForm) => {
      if (!currentForm) return currentForm;

      return {
        ...currentForm,
        address: {
          ...currentForm.address,
          [field]: value,
        },
      };
    });
  }

  return (
    <main className={styles.page}>
      <section className={styles.profileHero}>
        <div className={styles.avatarBlock}>
          {currentProfile.avatar ? (
            <Image
              src={currentProfile.avatar}
              alt={currentProfile.displayName}
              width={150}
              height={150}
            />
          ) : (
            <UserRound size={58} />
          )}
        </div>

        <div className={styles.profileHeroContent}>
          <span className={styles.eyebrow}>
            <Sparkles size={16} />
            Mi cuenta
          </span>

          <h1>{currentProfile.displayName}</h1>

          <p>{currentProfile.bio}</p>

          <div className={styles.profileTags}>
            <span>{currentProfile.readerStatus}</span>
            <span>{currentProfile.favoriteGenre}</span>
            {currentProfile.currentReading && (
              <span>Leyendo: {currentProfile.currentReading}</span>
            )}
          </div>
        </div>

        <button
          type="button"
          className={styles.logoutButton}
          onClick={() => void handleLogout()}
        >
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </section>

      <section className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <div>
            <Trophy size={24} />
          </div>
          <span>Puntos de foros</span>
          <strong>{totalForumPoints}</strong>
        </article>

        <article className={styles.summaryCard}>
          <div>
            <Heart size={24} />
          </div>
          <span>Wishlist</span>
          <strong>{totalWishlistItems}</strong>
        </article>

        <article className={styles.summaryCard}>
          <div>
            <ShoppingBag size={24} />
          </div>
          <span>Pedidos</span>
          <strong>{totalOrders}</strong>
        </article>

        <article className={styles.summaryCard}>
          <div>
            <BookOpen size={24} />
          </div>
          <span>Lectura actual</span>
          <strong>{currentProfile.currentReading ? "1" : "0"}</strong>
        </article>
      </section>

      <section className={styles.accountLayout}>
        <section className={styles.profileCard}>
          <div className={styles.sectionHeader}>
            <div>
              <span>Perfil lector</span>
              <h2>Personaliza tu espacio</h2>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingProfile((current) => !current)}
            >
              <Edit3 size={16} />
              {isEditingProfile ? "Cancelar" : "Editar perfil"}
            </button>
          </div>

          {isEditingProfile ? (
            <form className={styles.profileForm} onSubmit={handleSaveProfile}>
              <label className={styles.avatarUpload}>
                <input type="file" accept="image/*" onChange={handleAvatarChange} />

                <span>
                  <ImagePlus size={18} />
                  Cambiar foto de perfil
                </span>
              </label>

              <label className={styles.field}>
                <span>Nombre visible</span>
                <input
                  value={profileForm.displayName}
                  onChange={(event) =>
                    setProfileForm((currentForm) => {
                      if (!currentForm) return currentForm;

                      return {
                        ...currentForm,
                        displayName: event.target.value,
                      };
                    })
                  }
                  placeholder="Nombre visible"
                />
              </label>

              <label className={styles.field}>
                <span>Lectura actual</span>
                <input
                  value={profileForm.currentReading}
                  onChange={(event) =>
                    setProfileForm((currentForm) => {
                      if (!currentForm) return currentForm;

                      return {
                        ...currentForm,
                        currentReading: event.target.value,
                      };
                    })
                  }
                  placeholder="Ej. Los Juegos del Hambre"
                />
              </label>

              <div className={styles.fieldGrid}>
                <label className={styles.field}>
                  <span>Estado lector</span>
                  <select
                    value={profileForm.readerStatus}
                    onChange={(event) =>
                      setProfileForm((currentForm) => {
                        if (!currentForm) return currentForm;

                        return {
                          ...currentForm,
                          readerStatus: event.target.value as ReaderStatus,
                        };
                      })
                    }
                  >
                    {readerStatusOptions.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>

                <label className={styles.field}>
                  <span>Género favorito</span>
                  <select
                    value={profileForm.favoriteGenre}
                    onChange={(event) =>
                      setProfileForm((currentForm) => {
                        if (!currentForm) return currentForm;

                        return {
                          ...currentForm,
                          favoriteGenre: event.target.value,
                        };
                      })
                    }
                  >
                    {genreOptions.map((genre) => (
                      <option key={genre}>{genre}</option>
                    ))}
                  </select>
                </label>
              </div>

              <section className={styles.addressSection}>
                <div className={styles.addressHeader}>
                  <span>Dirección</span>
                  <h3>Datos de envío</h3>
                  <p>
                    Esta dirección podrá usarse después para completar pedidos o entregas.
                  </p>
                </div>

                <label className={styles.field}>
                  <span>Calle</span>
                  <input
                    value={profileForm.address.street}
                    onChange={(event) => updateAddressField("street", event.target.value)}
                    placeholder="Ej. Avenida Siempre Viva"
                  />
                </label>

                <div className={styles.fieldGrid}>
                  <label className={styles.field}>
                    <span>Número exterior</span>
                    <input
                      value={profileForm.address.exteriorNumber}
                      onChange={(event) =>
                        updateAddressField("exteriorNumber", event.target.value)
                      }
                      placeholder="Ej. 742"
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Número interior</span>
                    <input
                      value={profileForm.address.interiorNumber}
                      onChange={(event) =>
                        updateAddressField("interiorNumber", event.target.value)
                      }
                      placeholder="Opcional"
                    />
                  </label>
                </div>

                <label className={styles.field}>
                  <span>Colonia</span>
                  <input
                    value={profileForm.address.neighborhood}
                    onChange={(event) =>
                      updateAddressField("neighborhood", event.target.value)
                    }
                    placeholder="Ej. Centro"
                  />
                </label>

                <div className={styles.fieldGrid}>
                  <label className={styles.field}>
                    <span>Ciudad / Municipio</span>
                    <input
                      value={profileForm.address.city}
                      onChange={(event) => updateAddressField("city", event.target.value)}
                      placeholder="Ej. Pachuca de Soto"
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Estado</span>
                    <input
                      value={profileForm.address.state}
                      onChange={(event) => updateAddressField("state", event.target.value)}
                      placeholder="Ej. Hidalgo"
                    />
                  </label>
                </div>

                <div className={styles.fieldGrid}>
                  <label className={styles.field}>
                    <span>Código postal</span>
                    <input
                      value={profileForm.address.zipCode}
                      onChange={(event) => updateAddressField("zipCode", event.target.value)}
                      placeholder="Ej. 42000"
                    />
                  </label>

                  <label className={styles.field}>
                    <span>País</span>
                    <input
                      value={profileForm.address.country}
                      onChange={(event) => updateAddressField("country", event.target.value)}
                      placeholder="México"
                    />
                  </label>
                </div>

                <label className={styles.field}>
                  <span>Referencias</span>
                  <textarea
                    value={profileForm.address.references}
                    onChange={(event) =>
                      updateAddressField("references", event.target.value)
                    }
                    placeholder="Ej. Entre calles, color de fachada, indicaciones de entrega..."
                    rows={4}
                  />
                </label>
              </section>

              <label className={styles.field}>
                <span>Bio corta</span>
                <textarea
                  value={profileForm.bio}
                  onChange={(event) =>
                    setProfileForm((currentForm) => {
                      if (!currentForm) return currentForm;

                      return {
                        ...currentForm,
                        bio: event.target.value,
                      };
                    })
                  }
                  placeholder="Cuéntanos un poco de tu perfil lector"
                  rows={5}
                />
              </label>

              <button type="submit" className={styles.saveButton}>
                <Save size={17} />
                Guardar cambios
              </button>
            </form>
          ) : (
            <div className={styles.profileDetails}>
              <InfoRow label="Nombre" value={currentProfile.displayName} />
              <InfoRow
                label="Lectura actual"
                value={currentProfile.currentReading || "Sin lectura registrada"}
              />
              <InfoRow label="Estado lector" value={currentProfile.readerStatus} />
              <InfoRow label="Género favorito" value={currentProfile.favoriteGenre} />
              <InfoRow label="Correo" value={currentUser.email} />

              <div className={styles.addressPreview}>
                <span>Dirección de envío</span>

                {currentProfile.address.street ||
                currentProfile.address.city ||
                currentProfile.address.zipCode ? (
                  <>
                    <strong>
                      {currentProfile.address.street}{" "}
                      {currentProfile.address.exteriorNumber}
                      {currentProfile.address.interiorNumber
                        ? ` Int. ${currentProfile.address.interiorNumber}`
                        : ""}
                    </strong>

                    <p>
                      {currentProfile.address.neighborhood}
                      {currentProfile.address.neighborhood ? ", " : ""}
                      {currentProfile.address.city}
                      {currentProfile.address.city ? ", " : ""}
                      {currentProfile.address.state}
                    </p>

                    <p>
                      C.P. {currentProfile.address.zipCode || "Sin código postal"} ·{" "}
                      {currentProfile.address.country || "Sin país"}
                    </p>

                    {currentProfile.address.references && (
                      <small>{currentProfile.address.references}</small>
                    )}
                  </>
                ) : (
                  <p>Sin dirección registrada.</p>
                )}
              </div>
            </div>
          )}
        </section>

        <aside className={styles.sidePanel}>
          <article>
            <h2>Wishlist</h2>

            {wishlistItems.length === 0 ? (
              <p>
                Todavía no tienes favoritos guardados. Puedes agregarlos desde el
                catálogo con el botón de corazón.
              </p>
            ) : (
              <div className={styles.wishlistPreview}>
                {wishlistItems.map((item) => (
                  <div key={item.id} className={styles.wishlistItem}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={70}
                      height={95}
                    />

                    <div>
                      <span>{item.type === "saga" ? "Saga" : "Libro"}</span>
                      <strong>{item.title}</strong>
                      <small>{item.subtitle}</small>

                      <div className={styles.wishlistActions}>
                        <button
                          type="button"
                          className={styles.wishlistCartButton}
                          onClick={() => handleAddWishlistItemToCart(item)}
                        >
                          Agregar al carrito
                        </button>

                        <button
                          type="button"
                          className={styles.wishlistRemoveButton}
                          onClick={() => removeWishlistItem(item.id)}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article>
            <h2>Pedidos</h2>

            {orders.length === 0 ? (
              <p>
                Todavía no tienes pedidos. Cuando finalices una compra desde el carrito,
                aparecerá aquí tu historial.
              </p>
            ) : (
              <div className={styles.ordersPreview}>
                {orders.slice(0, 2).map((order) => (
                  <div key={order.id} className={styles.orderPreviewItem}>
                    <span>Pedido #{getShortOrderId(order.id)}</span>
                    <strong>{currencyFormatter.format(order.paidAmount)}</strong>
                    <small>{formatOrderDate(order.createdAt)}</small>
                  </div>
                ))}

                <Link href="/cuenta/pedidos" className={styles.ordersHistoryLink}>
                  Ver historial completo
                </Link>
              </div>
            )}
          </article>
        </aside>
      </section>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}