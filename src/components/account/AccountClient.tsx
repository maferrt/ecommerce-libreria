"use client";

import Link from "next/link";
import {
  BookHeart,
  Heart,
  LogOut,
  PackageCheck,
  Save,
  ShoppingBag,
  Sparkles,
  Trophy,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAccount } from "@/context/AccountContext";
import { useOrders } from "@/context/OrderContext";
import { useWishlist } from "@/context/WishlistContext";
import type {
  AccountLoginInput,
  AccountRegisterInput,
  ReaderStatus,
  UserProfile,
} from "@/types/account";
import styles from "./AccountClient.module.css";

const readerStatuses: ReaderStatus[] = [
  "Leyendo ahora",
  "Buscando nueva lectura",
  "En pausa lectora",
  "Fan de sagas",
  "Modo terror activado",
  "Releyendo favoritos",
];

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

function formatOrderDate(date: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getShortOrderId(orderId: string, orderNumber?: string) {
  if (orderNumber) {
    return orderNumber;
  }

  return orderId.replace("order-", "").slice(0, 8).toUpperCase();
}

function createEmptyProfile(userId: string, name: string): UserProfile {
  return {
    userId,
    displayName: name,
    avatar: null,
    currentReading: "",
    readerStatus: "Buscando nueva lectura",
    bio: "Lector/a de Mundo Entre Libros.",
    favoriteGenre: "Novela Juvenil",
    address: {
      street: "",
      exteriorNumber: "",
      interiorNumber: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      country: "México",
      references: "",
    },
  };
}

export function AccountClient() {
  const {
    currentUser,
    currentProfile,
    isAuthenticated,
    isLoadingAccount,
    totalForumPoints,
    registerUser,
    loginUser,
    logoutUser,
    updateProfile,
  } = useAccount();

  const { orders, totalOrders } = useOrders();
  const { items: wishlistItems, totalWishlistItems, removeItem } = useWishlist();

  const [loginForm, setLoginForm] = useState<AccountLoginInput>({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState<AccountRegisterInput>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [profileForm, setProfileForm] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeAuthTab, setActiveAuthTab] = useState<"login" | "register">(
    "login",
  );

  useEffect(() => {
    if (currentProfile) {
      setProfileForm(currentProfile);
      return;
    }

    if (currentUser) {
      setProfileForm(createEmptyProfile(currentUser.id, currentUser.name));
    }
  }, [currentProfile, currentUser]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = await loginUser(loginForm);

    if (!result.ok) {
      await Swal.fire({
        icon: "error",
        title: "No se pudo iniciar sesión",
        text: result.message,
        confirmButtonColor: "#521f12",
        background: "#f6ebd9",
        color: "#521f12",
      });

      return;
    }

    await Swal.fire({
      icon: "success",
      title: "Sesión iniciada",
      text: result.message,
      confirmButtonColor: "#521f12",
      background: "#f6ebd9",
      color: "#521f12",
    });

    setLoginForm({
      email: "",
      password: "",
    });
  }

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = await registerUser(registerForm);

    if (!result.ok) {
      await Swal.fire({
        icon: "error",
        title: "No se pudo crear la cuenta",
        text: result.message,
        confirmButtonColor: "#521f12",
        background: "#f6ebd9",
        color: "#521f12",
      });

      return;
    }

    await Swal.fire({
      icon: "success",
      title: "Cuenta creada",
      text: result.message,
      confirmButtonColor: "#521f12",
      background: "#f6ebd9",
      color: "#521f12",
    });

    setRegisterForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }

  async function handleSaveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!profileForm) return;

    const result = await updateProfile(profileForm);

    if (!result.ok) {
      await Swal.fire({
        icon: "error",
        title: "No se pudo actualizar",
        text: result.message,
        confirmButtonColor: "#521f12",
        background: "#f6ebd9",
        color: "#521f12",
      });

      return;
    }

    setIsEditingProfile(false);

    await Swal.fire({
      icon: "success",
      title: "Perfil actualizado",
      text: result.message,
      confirmButtonColor: "#521f12",
      background: "#f6ebd9",
      color: "#521f12",
    });
  }

  function handleLogout() {
    logoutUser();
    setIsEditingProfile(false);
    setProfileForm(null);
  }

  function updateProfileField<K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K],
  ) {
    setProfileForm((currentProfileForm) => {
      if (!currentProfileForm) return currentProfileForm;

      return {
        ...currentProfileForm,
        [key]: value,
      };
    });
  }

  function updateAddressField(
    key: keyof UserProfile["address"],
    value: string,
  ) {
    setProfileForm((currentProfileForm) => {
      if (!currentProfileForm) return currentProfileForm;

      return {
        ...currentProfileForm,
        address: {
          ...currentProfileForm.address,
          [key]: value,
        },
      };
    });
  }

  if (isLoadingAccount) {
    return (
      <main className={styles.page}>
        <section className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Sparkles size={42} />
          </div>

          <h1>Cargando tu cuenta...</h1>

          <p>Estamos revisando tu sesión con el backend.</p>
        </section>
      </main>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return (
      <main className={styles.page}>
        <header className={styles.hero}>
          <span>Mi cuenta</span>

          <h1>Entra a tu espacio lector</h1>

          <p>
            Inicia sesión o crea una cuenta para guardar favoritos, comprar
            libros y participar en foros.
          </p>
        </header>

        <section className={styles.authShell}>
          <div className={styles.authTabs}>
            <button
              type="button"
              className={activeAuthTab === "login" ? styles.activeTab : ""}
              onClick={() => setActiveAuthTab("login")}
            >
              Iniciar sesión
            </button>

            <button
              type="button"
              className={activeAuthTab === "register" ? styles.activeTab : ""}
              onClick={() => setActiveAuthTab("register")}
            >
              Crear cuenta
            </button>
          </div>

          {activeAuthTab === "login" ? (
            <form className={styles.authForm} onSubmit={handleLogin}>
              <h2>Bienvenida de nuevo</h2>

              <label>
                Correo electrónico
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(event) =>
                    setLoginForm((currentForm) => ({
                      ...currentForm,
                      email: event.target.value,
                    }))
                  }
                  placeholder="tu-correo@email.com"
                />
              </label>

              <label>
                Contraseña
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
                />
              </label>

              <button type="submit">Entrar</button>
            </form>
          ) : (
            <form className={styles.authForm} onSubmit={handleRegister}>
              <h2>Crea tu cuenta lectora</h2>

              <label>
                Nombre
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
                />
              </label>

              <label>
                Correo electrónico
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(event) =>
                    setRegisterForm((currentForm) => ({
                      ...currentForm,
                      email: event.target.value,
                    }))
                  }
                  placeholder="tu-correo@email.com"
                />
              </label>

              <label>
                Contraseña
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
                />
              </label>

              <label>
                Confirmar contraseña
                <input
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(event) =>
                    setRegisterForm((currentForm) => ({
                      ...currentForm,
                      confirmPassword: event.target.value,
                    }))
                  }
                  placeholder="Repite tu contraseña"
                />
              </label>

              <button type="submit">Crear cuenta</button>
            </form>
          )}
        </section>
      </main>
    );
  }

  const latestOrders = orders.slice(0, 3);
  const latestWishlistItems = wishlistItems.slice(0, 4);

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <span>Mi cuenta</span>

        <h1>Hola, {profileForm?.displayName || currentUser.name}</h1>

        <p>
          Administra tu perfil lector, revisa tus pedidos y consulta tus
          favoritos.
        </p>

        <button
          type="button"
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </header>

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <PackageCheck size={24} />
          <span>Pedidos</span>
          <strong>{totalOrders}</strong>
        </article>

        <article className={styles.statCard}>
          <Heart size={24} />
          <span>Favoritos</span>
          <strong>{totalWishlistItems}</strong>
        </article>

        <article className={styles.statCard}>
          <Trophy size={24} />
          <span>Puntos en foros</span>
          <strong>{totalForumPoints}</strong>
        </article>
      </section>

      {profileForm && (
        <section className={styles.profileCard}>
          <div className={styles.sectionHeader}>
            <div>
              <span>Perfil lector</span>
              <h2>Tus datos</h2>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingProfile((current) => !current)}
            >
              {isEditingProfile ? "Cancelar" : "Editar perfil"}
            </button>
          </div>

          <form className={styles.profileForm} onSubmit={handleSaveProfile}>
            <div className={styles.avatarPreview}>
              <div className={styles.avatarCircle}>
                {profileForm.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profileForm.avatar} alt={profileForm.displayName} />
                ) : (
                  <UserRound size={42} />
                )}
              </div>

              <div>
                <h3>{profileForm.displayName}</h3>
                <p>{currentUser.email}</p>
              </div>
            </div>

            <div className={styles.formGrid}>
              <label>
                Nombre visible
                <input
                  type="text"
                  value={profileForm.displayName}
                  disabled={!isEditingProfile}
                  onChange={(event) =>
                    updateProfileField("displayName", event.target.value)
                  }
                />
              </label>

              <label>
                Avatar URL
                <input
                  type="text"
                  value={profileForm.avatar ?? ""}
                  disabled={!isEditingProfile}
                  onChange={(event) =>
                    updateProfileField(
                      "avatar",
                      event.target.value.trim() || null,
                    )
                  }
                  placeholder="https://..."
                />
              </label>

              <label>
                Lectura actual
                <input
                  type="text"
                  value={profileForm.currentReading}
                  disabled={!isEditingProfile}
                  onChange={(event) =>
                    updateProfileField("currentReading", event.target.value)
                  }
                  placeholder="¿Qué estás leyendo?"
                />
              </label>

              <label>
                Estado lector
                <select
                  value={profileForm.readerStatus}
                  disabled={!isEditingProfile}
                  onChange={(event) =>
                    updateProfileField(
                      "readerStatus",
                      event.target.value as ReaderStatus,
                    )
                  }
                >
                  {readerStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Género favorito
                <input
                  type="text"
                  value={profileForm.favoriteGenre}
                  disabled={!isEditingProfile}
                  onChange={(event) =>
                    updateProfileField("favoriteGenre", event.target.value)
                  }
                />
              </label>

              <label className={styles.fullField}>
                Bio
                <textarea
                  value={profileForm.bio}
                  disabled={!isEditingProfile}
                  onChange={(event) =>
                    updateProfileField("bio", event.target.value)
                  }
                />
              </label>
            </div>

            <div className={styles.addressSection}>
              <h3>Dirección de envío</h3>

              <div className={styles.formGrid}>
                <label>
                  Calle
                  <input
                    type="text"
                    value={profileForm.address.street}
                    disabled={!isEditingProfile}
                    onChange={(event) =>
                      updateAddressField("street", event.target.value)
                    }
                  />
                </label>

                <label>
                  Número exterior
                  <input
                    type="text"
                    value={profileForm.address.exteriorNumber}
                    disabled={!isEditingProfile}
                    onChange={(event) =>
                      updateAddressField("exteriorNumber", event.target.value)
                    }
                  />
                </label>

                <label>
                  Número interior
                  <input
                    type="text"
                    value={profileForm.address.interiorNumber}
                    disabled={!isEditingProfile}
                    onChange={(event) =>
                      updateAddressField("interiorNumber", event.target.value)
                    }
                  />
                </label>

                <label>
                  Colonia
                  <input
                    type="text"
                    value={profileForm.address.neighborhood}
                    disabled={!isEditingProfile}
                    onChange={(event) =>
                      updateAddressField("neighborhood", event.target.value)
                    }
                  />
                </label>

                <label>
                  Ciudad
                  <input
                    type="text"
                    value={profileForm.address.city}
                    disabled={!isEditingProfile}
                    onChange={(event) =>
                      updateAddressField("city", event.target.value)
                    }
                  />
                </label>

                <label>
                  Estado
                  <input
                    type="text"
                    value={profileForm.address.state}
                    disabled={!isEditingProfile}
                    onChange={(event) =>
                      updateAddressField("state", event.target.value)
                    }
                  />
                </label>

                <label>
                  Código postal
                  <input
                    type="text"
                    value={profileForm.address.zipCode}
                    disabled={!isEditingProfile}
                    onChange={(event) =>
                      updateAddressField("zipCode", event.target.value)
                    }
                  />
                </label>

                <label>
                  País
                  <input
                    type="text"
                    value={profileForm.address.country}
                    disabled={!isEditingProfile}
                    onChange={(event) =>
                      updateAddressField("country", event.target.value)
                    }
                  />
                </label>

                <label className={styles.fullField}>
                  Referencias
                  <textarea
                    value={profileForm.address.references}
                    disabled={!isEditingProfile}
                    onChange={(event) =>
                      updateAddressField("references", event.target.value)
                    }
                  />
                </label>
              </div>
            </div>

            {isEditingProfile && (
              <button type="submit" className={styles.saveButton}>
                <Save size={17} />
                Guardar perfil
              </button>
            )}
          </form>
        </section>
      )}

      <section className={styles.dashboardGrid}>
        <article className={styles.panelCard}>
          <div className={styles.sectionHeader}>
            <div>
              <span>Pedidos recientes</span>
              <h2>Historial</h2>
            </div>

            <Link href="/cuenta/pedidos">Ver todos</Link>
          </div>

          {latestOrders.length === 0 ? (
            <div className={styles.emptyMiniState}>
              <ShoppingBag size={30} />
              <p>Aún no tienes pedidos.</p>
            </div>
          ) : (
            <div className={styles.ordersPreview}>
              {latestOrders.map((order) => (
                <article key={order.id} className={styles.previewItem}>
                  <div>
                    <span>
                      Pedido #{getShortOrderId(order.id, order.orderNumber)}
                    </span>

                    <strong>{currencyFormatter.format(order.paidAmount)}</strong>

                    <small>{formatOrderDate(order.createdAt)}</small>
                  </div>

                  <small>{order.status}</small>
                </article>
              ))}
            </div>
          )}
        </article>

        <article className={styles.panelCard}>
          <div className={styles.sectionHeader}>
            <div>
              <span>Wishlist</span>
              <h2>Favoritos</h2>
            </div>

            <Link href="/catalogo">Explorar</Link>
          </div>

          {latestWishlistItems.length === 0 ? (
            <div className={styles.emptyMiniState}>
              <BookHeart size={30} />
              <p>Aún no guardas favoritos.</p>
            </div>
          ) : (
            <div className={styles.wishlistPreview}>
              {latestWishlistItems.map((item) => (
                <article key={item.id} className={styles.wishlistItem}>
                  <div>
                    <span>{item.type === "saga" ? "Saga" : "Libro"}</span>
                    <strong>{item.title}</strong>
                    <small>{item.subtitle}</small>
                  </div>

                  <button
                    type="button"
                    onClick={() => void removeItem(item.id)}
                  >
                    Quitar
                  </button>
                </article>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}