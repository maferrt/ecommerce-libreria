"use client";

import Image from "next/image";
import {
  BookOpen,
  CheckCircle2,
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
import type {
  AccountLoginInput,
  AccountRegisterInput,
  ReaderStatus,
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
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<UserProfile | null>(null);

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
          <strong>0</strong>
        </article>

        <article className={styles.summaryCard}>
          <div>
            <ShoppingBag size={24} />
          </div>
          <span>Pedidos</span>
          <strong>0</strong>
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
            </div>
          )}
        </section>

        <aside className={styles.sidePanel}>
          <article>
            <h2>Wishlist</h2>
            <p>
              En el siguiente paso conectaremos los botones de favoritos desde el
              catálogo.
            </p>
          </article>

          <article>
            <h2>Pedidos</h2>
            <p>
              Después conectaremos “Continuar compra” para generar pedidos
              simulados desde el carrito.
            </p>
          </article>

          <article>
            <h2>Foros</h2>
            <p>
              Luego unificaremos la sesión de foros con esta cuenta para que los
              puntos se acumulen aquí.
            </p>
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