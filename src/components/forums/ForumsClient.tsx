"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ImagePlus,
  Link2,
  List,
  ListOrdered,
  Lock,
  LogOut,
  MessageCircle,
  PenLine,
  Send,
  Sparkles,
  Star,
  Trash2,
  Trophy,
  UserPlus,
  UsersRound,
  X,
} from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Swal from "sweetalert2";
import { ClientPortal } from "@/components/ui/ClientPortal";
import { useAccount } from "@/context/AccountContext";
import { forumCategories, POINTS_BY_POST, POINTS_BY_REPLY } from "@/data/forums";
import {
  createForumPostRequest,
  createForumReplyRequest,
  deleteForumPostRequest,
  deleteForumReplyRequest,
  getForumPostDetailRequest,
  getForumPostsRequest,
  getForumsRequest,
  subscribeForumRequest,
  unsubscribeForumRequest,
} from "@/lib/forum-api";
import type {
  ApiForumAuthor,
  ApiForumPostDetailResponse,
  ApiForumPostResponse,
  ApiForumReplyResponse,
  ApiForumResponse,
} from "@/lib/api-types";
import styles from "./ForumsClient.module.css";

const FORUM_MEMBERSHIPS_STORAGE_KEY = "mel_forum_memberships";

type ForumUser = {
  id: string;
  username: string;
  avatar?: string | null;
};

type ForumCardData = {
  slug: string;
  name: string;
  description: string;
  icono: string;
  subscribed: boolean;
  points: number;
  postCount: number;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function getPlainTextFromHtml(html: string) {
  if (typeof document === "undefined") return "";

  const element = document.createElement("div");
  element.innerHTML = html;

  return element.textContent?.trim() ?? "";
}

function getForumIcon(slug: string) {
  return forumCategories.find((forum) => forum.id === slug)?.icono ?? "📚";
}

function toForumCardData(forum: ApiForumResponse): ForumCardData {
  return {
    slug: forum.slug,
    name: forum.name,
    description: forum.description,
    icono: getForumIcon(forum.slug),
    subscribed: forum.subscribed,
    points: forum.points,
    postCount: Number(forum.postCount ?? 0),
  };
}

function getFallbackForumCards(): ForumCardData[] {
  return forumCategories.map((forum) => ({
    slug: forum.id,
    name: forum.nombre,
    description: forum.descripcion,
    icono: forum.icono,
    subscribed: false,
    points: 0,
    postCount: 0,
  }));
}

function syncForumPointsForAccount(userId: string, forums: ApiForumResponse[]) {
  if (typeof window === "undefined") return;

  const userMemberships = forums.reduce<
    Record<string, { forumId: string; joinedAt: string; points: number }>
  >((memberships, forum) => {
    if (!forum.subscribed) return memberships;

    memberships[forum.slug] = {
      forumId: forum.slug,
      joinedAt: new Date().toISOString(),
      points: forum.points,
    };

    return memberships;
  }, {});

  const storedMemberships = JSON.parse(
    window.localStorage.getItem(FORUM_MEMBERSHIPS_STORAGE_KEY) ?? "{}",
  ) as Record<string, Record<string, { forumId: string; joinedAt: string; points: number }>>;

  storedMemberships[userId] = userMemberships;

  window.localStorage.setItem(
    FORUM_MEMBERSHIPS_STORAGE_KEY,
    JSON.stringify(storedMemberships),
  );
}

function sanitizeRichHtml(html: string) {
  if (typeof document === "undefined") return html;

  const template = document.createElement("template");
  template.innerHTML = html;

  const allowedTags = new Set([
    "B",
    "I",
    "U",
    "STRONG",
    "EM",
    "UL",
    "OL",
    "LI",
    "A",
    "IMG",
    "BR",
    "DIV",
    "P",
    "SPAN",
  ]);

  function cleanNode(node: Node) {
    const children = Array.from(node.childNodes);

    children.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) return;

      if (!(child instanceof HTMLElement)) {
        child.remove();
        return;
      }

      if (!allowedTags.has(child.tagName)) {
        child.replaceWith(...Array.from(child.childNodes));
        return;
      }

      Array.from(child.attributes).forEach((attribute) => {
        const name = attribute.name.toLowerCase();
        const value = attribute.value;

        if (name.startsWith("on")) {
          child.removeAttribute(attribute.name);
          return;
        }

        if (child.tagName === "A" && name === "href") {
          const isSafeLink =
            value.startsWith("http://") ||
            value.startsWith("https://") ||
            value.startsWith("mailto:");

          if (!isSafeLink) {
            child.removeAttribute("href");
            return;
          }

          child.setAttribute("target", "_blank");
          child.setAttribute("rel", "noopener noreferrer");
          return;
        }

        if (child.tagName === "IMG" && name === "src") {
          const isSafeImage =
            value.startsWith("data:image/") ||
            value.startsWith("http://") ||
            value.startsWith("https://");

          if (!isSafeImage) {
            child.remove();
          }

          return;
        }

        if (child.tagName === "IMG" && name === "alt") return;

        child.removeAttribute(attribute.name);
      });

      cleanNode(child);
    });
  }

  cleanNode(template.content);

  return template.innerHTML.trim();
}

function showToast(
  title: string,
  icon: "success" | "error" | "warning" | "info" = "info",
) {
  void Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: "#f6ebd9",
    color: "#521f12",
  });
}

async function confirmAction(
  title: string,
  text: string,
  confirmButtonText = "Sí, eliminar",
) {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#7a2626",
    cancelButtonColor: "#a0653d",
    background: "#f6ebd9",
    color: "#521f12",
    customClass: {
      container: "mel-swal-container",
    },
  });

  return result.isConfirmed;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error al conectar con el servidor.";
}

export function ForumsClient() {
  const router = useRouter();

  const {
    currentUser: accountUser,
    currentProfile,
    isAuthenticated,
    logoutUser,
  } = useAccount();

  const currentUser = useMemo<ForumUser | null>(() => {
    if (!accountUser) return null;

    return {
      id: accountUser.id,
      username: currentProfile?.displayName ?? accountUser.name,
      avatar: currentProfile?.avatar ?? null,
    };
  }, [accountUser, currentProfile]);

  const [forums, setForums] = useState<ApiForumResponse[]>([]);
  const [selectedForumSlug, setSelectedForumSlug] = useState<string | null>(null);
  const [selectedForumPosts, setSelectedForumPosts] = useState<ApiForumPostResponse[]>([]);
  const [selectedPostDetail, setSelectedPostDetail] =
    useState<ApiForumPostDetailResponse | null>(null);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [isLoadingForums, setIsLoadingForums] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [forumsError, setForumsError] = useState("");

  const loadForums = useCallback(async () => {
    if (!isAuthenticated || !currentUser) {
      setForums([]);
      return;
    }

    try {
      setIsLoadingForums(true);
      setForumsError("");

      const response = await getForumsRequest();

      setForums(response);
      syncForumPointsForAccount(currentUser.id, response);
    } catch (error) {
      setForumsError(getErrorMessage(error));
    } finally {
      setIsLoadingForums(false);
    }
  }, [currentUser, isAuthenticated]);

  const loadSelectedForumPosts = useCallback(async (forumSlug: string) => {
    try {
      setIsLoadingPosts(true);

      const response = await getForumPostsRequest(forumSlug);

      setSelectedForumPosts(response);
    } catch (error) {
      showToast(getErrorMessage(error), "error");
      setSelectedForumPosts([]);
    } finally {
      setIsLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    void loadForums();
  }, [loadForums]);

  useEffect(() => {
    if (!selectedForumSlug || !isAuthenticated) return;

    void loadSelectedForumPosts(selectedForumSlug);
  }, [selectedForumSlug, isAuthenticated, loadSelectedForumPosts]);

  const forumCards = useMemo(() => {
    if (forums.length > 0) {
      return forums.map(toForumCardData);
    }

    return getFallbackForumCards();
  }, [forums]);

  const selectedForum = useMemo(() => {
    if (!selectedForumSlug) return null;

    return forums.find((forum) => forum.slug === selectedForumSlug) ?? null;
  }, [forums, selectedForumSlug]);

  const selectedForumCard = selectedForum
    ? toForumCardData(selectedForum)
    : selectedForumSlug
      ? forumCards.find((forum) => forum.slug === selectedForumSlug) ?? null
      : null;

  const visiblePosts = showAllPosts
    ? selectedForumPosts
    : selectedForumPosts.slice(0, 3);

  const isSubscribed = Boolean(selectedForum?.subscribed);
  const currentPoints = selectedForum?.points ?? 0;
  const forumTopics = selectedForum?.postCount ?? selectedForumPosts.length;

  async function handleForumClick(forum: ForumCardData) {
    if (!isAuthenticated || !currentUser) {
      const result = await Swal.fire({
        icon: "info",
        title: "Inicia sesión",
        text: "Para entrar a un foro necesitas iniciar sesión o crear una cuenta.",
        showCancelButton: true,
        confirmButtonText: "Ir a mi cuenta",
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

    setSelectedForumSlug(forum.slug);
    setSelectedPostDetail(null);
    setShowAllPosts(false);
  }

  function handleLogout() {
    logoutUser();
    setSelectedForumSlug(null);
    setSelectedPostDetail(null);
    setShowAllPosts(false);
    showToast("Sesión cerrada.", "info");
  }

  function handleBackToForums() {
    setSelectedForumSlug(null);
    setSelectedPostDetail(null);
    setShowAllPosts(false);
  }

  async function reloadForumData() {
    await loadForums();

    if (selectedForumSlug) {
      await loadSelectedForumPosts(selectedForumSlug);
    }
  }

  async function handleSubscribe() {
    if (!selectedForumSlug) return;

    try {
      const response = await subscribeForumRequest(selectedForumSlug);

      setForums((currentForums) =>
        currentForums.map((forum) =>
          forum.slug === response.slug ? response : forum,
        ),
      );

      await reloadForumData();

      showToast("Te suscribiste a este foro. Ya puedes participar.", "success");
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    }
  }

  async function handleUnsubscribe() {
    if (!selectedForumSlug) return;

    const confirmed = await confirmAction(
      "¿Desuscribirte del foro?",
      "Ya no podrás publicar ni responder en este foro hasta suscribirte de nuevo. Tus publicaciones y respuestas no se eliminan.",
      "Sí, desuscribirme",
    );

    if (!confirmed) return;

    try {
      const response = await unsubscribeForumRequest(selectedForumSlug);

      setForums((currentForums) =>
        currentForums.map((forum) =>
          forum.slug === response.slug ? response : forum,
        ),
      );

      await reloadForumData();

      showToast("Te desuscribiste de este foro.", "info");
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    }
  }

  function requireSubscription() {
    if (!currentUser || !selectedForumSlug) {
      showToast("Debes iniciar sesión y entrar a un foro.", "warning");
      return false;
    }

    if (!isSubscribed) {
      showToast("Debes suscribirte a este foro para participar.", "warning");
      return false;
    }

    return true;
  }

  async function handleCreatePost(title: string, contentHtml: string) {
    if (!selectedForumSlug || !currentUser) return false;
    if (!requireSubscription()) return false;

    const cleanTitle = title.trim();
    const cleanHtml = sanitizeRichHtml(contentHtml);
    const cleanText = getPlainTextFromHtml(cleanHtml);

    if (!cleanTitle || !cleanText) {
      showToast("La publicación necesita título y contenido.", "warning");
      return false;
    }

    try {
      await createForumPostRequest(selectedForumSlug, {
        title: cleanTitle,
        contentHtml: cleanHtml,
      });

      await reloadForumData();

      showToast(`Publicación creada. +${POINTS_BY_POST} puntos.`, "success");

      return true;
    } catch (error) {
      showToast(getErrorMessage(error), "error");
      return false;
    }
  }

  async function handleOpenPost(post: ApiForumPostResponse) {
    try {
      const response = await getForumPostDetailRequest(post.id);

      setSelectedPostDetail(response);
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    }
  }

  async function reloadSelectedPostDetail(postId: number) {
    const response = await getForumPostDetailRequest(postId);

    setSelectedPostDetail(response);
  }

  async function handlePostDeleted() {
    setSelectedPostDetail(null);
    await reloadForumData();
  }

  if (!selectedForumSlug || !selectedForumCard) {
    return (
      <main className={styles.page}>
        <section className={styles.homeView}>
          <header className={styles.hero}>
            <div>
              <span className={styles.eyebrow}>
                <MessageCircle size={16} />
                Comunidad lectora
              </span>

              <h1>Foros y comunidades</h1>

              <p>
                Explora nuestros foros por género y únete a conversaciones con
                lectores que comparten tu pasión por los libros.
              </p>
            </div>

            <div className={styles.hubNote}>
              <Sparkles size={32} />
              <strong>Una comunidad para cada tipo de lector</strong>
              <span>Foros por género</span>
            </div>
          </header>

          <section className={styles.listSection}>
            <h2>Elige un género literario</h2>

            {isLoadingForums && (
              <article className={styles.emptyCard}>
                <BookOpen size={26} />
                <p>Cargando foros desde el backend...</p>
              </article>
            )}

            {forumsError && isAuthenticated && (
              <article className={styles.emptyCard}>
                <BookOpen size={26} />
                <p>{forumsError}</p>
              </article>
            )}

            <div className={styles.grid}>
              {forumCards.map((forum) => (
                <button
                  type="button"
                  key={forum.slug}
                  className={styles.forumCard}
                  onClick={() => void handleForumClick(forum)}
                >
                  <span className={styles.cardIcon}>{forum.icono}</span>

                  <div>
                    <h3>{forum.name}</h3>
                    <p>{forum.description}</p>

                    <div className={styles.cardStats}>
                      <span>
                        <MessageCircle size={15} />
                        {forum.postCount} temas activos
                      </span>

                      <span>
                        <UsersRound size={15} />
                        {forum.subscribed ? "Suscrita" : "Disponible"}
                      </span>
                    </div>
                  </div>

                  <span className={styles.enterButton}>
                    {currentUser ? "Entrar al foro" : "Iniciar sesión"}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.detailView}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <h2>Géneros</h2>

            <div className={styles.genreMenu}>
              {forumCards.map((forum) => (
                <button
                  type="button"
                  key={forum.slug}
                  className={
                    forum.slug === selectedForumSlug
                      ? `${styles.genreButton} ${styles.genreButtonActive}`
                      : styles.genreButton
                  }
                  onClick={() => void handleForumClick(forum)}
                >
                  <span>{forum.icono}</span>
                  {forum.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.communityCard}>
            <span>👥</span>
            <h3>Únete a la comunidad</h3>
            <p>Conoce lectores que comparten tu pasión por los libros.</p>
          </div>
        </aside>

        <section className={styles.content}>
          <button
            type="button"
            className={styles.backButton}
            onClick={handleBackToForums}
          >
            ← Volver a foros
          </button>

          <header className={styles.detailHeader}>
            <div className={styles.detailIcon}>{selectedForumCard.icono}</div>

            <div>
              <h1>Foro de {selectedForumCard.name}</h1>
              <p>{selectedForumCard.description}</p>
            </div>
          </header>

          <CreatePostCard
            canParticipate={isSubscribed}
            onCreatePost={handleCreatePost}
          />

          <section className={styles.postsSection}>
            <h2>Publicaciones recientes</h2>

            <div className={styles.postsList}>
              {isLoadingPosts ? (
                <article className={styles.emptyCard}>
                  <BookOpen size={26} />
                  <p>Cargando publicaciones...</p>
                </article>
              ) : visiblePosts.length === 0 ? (
                <article className={styles.emptyCard}>
                  <BookOpen size={26} />
                  <p>Este foro todavía no tiene publicaciones.</p>
                </article>
              ) : (
                visiblePosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onOpen={() => void handleOpenPost(post)}
                  />
                ))
              )}
            </div>

            {selectedForumPosts.length > 3 && (
              <button
                type="button"
                className={styles.loadMoreButton}
                onClick={() => setShowAllPosts((current) => !current)}
              >
                {showAllPosts
                  ? "Ver menos publicaciones ↑"
                  : "Ver más publicaciones ↓"}
              </button>
            )}
          </section>
        </section>

        <aside className={styles.infoPanel}>
          <section className={styles.summaryCard}>
            <h2>Resumen del foro</h2>

            {!isSubscribed ? (
              <button
                type="button"
                className={styles.subscribeButton}
                onClick={() => void handleSubscribe()}
              >
                <UserPlus size={17} />
                Suscribirme al foro
              </button>
            ) : (
              <button
                type="button"
                className={styles.unsubscribeButton}
                onClick={() => void handleUnsubscribe()}
              >
                <UserPlus size={17} />
                Desuscribirme del foro
              </button>
            )}

            <div className={styles.summaryRow}>
              <span>
                <UsersRound size={17} />
                Estado
              </span>
              <strong>{isSubscribed ? "Suscrita" : "No suscrita"}</strong>
            </div>

            <div className={styles.summaryRow}>
              <span>
                <MessageCircle size={17} />
                Temas
              </span>
              <strong>{forumTopics}</strong>
            </div>

            <div className={styles.summaryRow}>
              <span>
                <Star size={17} />
                Mis puntos en este foro
              </span>
              <strong>{currentPoints}</strong>
            </div>
          </section>

          <section className={styles.pointsCard}>
            <h2>
              <Trophy size={22} />
              Gana puntos
            </h2>

            <div className={styles.summaryRow}>
              <span>Crear publicación</span>
              <strong>+{POINTS_BY_POST}</strong>
            </div>

            <div className={styles.summaryRow}>
              <span>Responder publicación</span>
              <strong>+{POINTS_BY_REPLY}</strong>
            </div>

            <p>Debes estar suscrita al foro para acumular puntos.</p>
          </section>

          <section className={styles.userCard}>
            <strong>{currentUser?.username}</strong>

            <div className={styles.userActions}>
              <Link href="/cuenta">Mi cuenta</Link>

              <button type="button" onClick={handleLogout}>
                <LogOut size={16} />
                Salir
              </button>
            </div>
          </section>
        </aside>
      </section>

      {selectedPostDetail && (
        <ClientPortal>
          <PostDetailModal
            detail={selectedPostDetail}
            currentUser={currentUser}
            canParticipate={isSubscribed}
            onClose={() => setSelectedPostDetail(null)}
            onDetailChange={setSelectedPostDetail}
            onReloadPost={reloadSelectedPostDetail}
            onPostDeleted={() => void handlePostDeleted()}
            onPointsChanged={() => void reloadForumData()}
          />
        </ClientPortal>
      )}
    </main>
  );
}

type CreatePostCardProps = {
  canParticipate: boolean;
  onCreatePost: (title: string, contentHtml: string) => Promise<boolean>;
};

function CreatePostCard({ canParticipate, onCreatePost }: CreatePostCardProps) {
  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    const wasCreated = await onCreatePost(title, contentHtml);

    if (wasCreated) {
      setTitle("");
      setContentHtml("");
    }

    setIsSubmitting(false);
  }

  return (
    <section className={styles.createCard}>
      <div className={styles.sectionTitle}>
        <PenLine size={20} />
        <h2>Crear publicación</h2>
      </div>

      {!canParticipate && (
        <div className={styles.warningBox}>
          <Lock size={17} />
          Debes suscribirte al foro para publicar.
        </div>
      )}

      <form className={styles.postForm} onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={!canParticipate || isSubmitting}
          placeholder="Título"
        />

        <RichTextEditor
          value={contentHtml}
          onChange={setContentHtml}
          disabled={!canParticipate || isSubmitting}
          placeholder="Escribe tu comentario."
        />

        <button
          type="submit"
          className={styles.publishButton}
          disabled={!canParticipate || isSubmitting}
        >
          {isSubmitting ? "Publicando..." : "Publicar"}
          <Send size={16} />
        </button>
      </form>
    </section>
  );
}

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
};

function RichTextEditor({
  value,
  onChange,
  placeholder,
  disabled = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  function syncValue() {
    onChange(sanitizeRichHtml(editorRef.current?.innerHTML ?? ""));
  }

  function runCommand(command: string, commandValue?: string) {
    if (disabled) return;

    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    syncValue();
  }

  async function insertLink() {
    if (disabled) return;

    const result = await Swal.fire<string>({
      title: "Agregar enlace",
      input: "url",
      inputLabel: "Pega el link",
      inputPlaceholder: "https://ejemplo.com",
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      confirmButtonColor: "#521f12",
      cancelButtonColor: "#a0653d",
      background: "#f6ebd9",
      color: "#521f12",
    });

    if (!result.isConfirmed || !result.value) return;

    runCommand("createLink", result.value);
  }

  function openImagePicker() {
    if (disabled) return;

    fileInputRef.current?.click();
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Selecciona un archivo de imagen válido.", "warning");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = String(reader.result);

      runCommand("insertImage", imageData);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.readAsDataURL(file);
  }

  return (
    <div
      className={
        disabled
          ? `${styles.richEditor} ${styles.richEditorDisabled}`
          : styles.richEditor
      }
    >
      <div className={styles.editorToolbar}>
        <button
          type="button"
          onClick={() => runCommand("bold")}
          disabled={disabled}
          aria-label="Negritas"
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          onClick={() => runCommand("italic")}
          disabled={disabled}
          aria-label="Cursiva"
        >
          <em>I</em>
        </button>

        <button
          type="button"
          onClick={() => runCommand("underline")}
          disabled={disabled}
          aria-label="Subrayado"
        >
          <u>U</u>
        </button>

        <button
          type="button"
          onClick={() => runCommand("insertUnorderedList")}
          disabled={disabled}
        >
          <List size={15} />
          Lista
        </button>

        <button
          type="button"
          onClick={() => runCommand("insertOrderedList")}
          disabled={disabled}
        >
          <ListOrdered size={15} />
          Lista
        </button>

        <button type="button" onClick={insertLink} disabled={disabled}>
          <Link2 size={15} />
          Link
        </button>

        <button type="button" onClick={openImagePicker} disabled={disabled}>
          <ImagePlus size={15} />
          Imagen
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageUpload}
        />
      </div>

      <div
        ref={editorRef}
        className={styles.editorArea}
        contentEditable={!disabled}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={syncValue}
      />
    </div>
  );
}

type ForumAvatarProps = {
  author: ApiForumAuthor;
  size?: "sm" | "md";
};

function ForumAvatar({ author, size = "md" }: ForumAvatarProps) {
  return (
    <div
      className={
        size === "sm"
          ? `${styles.avatar} ${styles.avatarSmall}`
          : styles.avatar
      }
    >
      {author.avatar ? (
        <img
          src={author.avatar}
          alt={`Foto de perfil de ${author.name}`}
          className={styles.avatarPhoto}
        />
      ) : (
        author.name.charAt(0).toUpperCase()
      )}
    </div>
  );
}

type PostCardProps = {
  post: ApiForumPostResponse;
  onOpen: () => void;
};

function PostCard({ post, onOpen }: PostCardProps) {
  return (
    <article className={styles.postCard}>
      <div className={styles.postMain}>
        <ForumAvatar author={post.author} />

        <div>
          <h3>{post.title}</h3>
          <p>
            {post.author.name} · {formatDate(post.createdAt)} ·{" "}
            {post.replyCount} respuestas
          </p>
        </div>
      </div>

      <button type="button" onClick={onOpen}>
        Ver publicación
      </button>
    </article>
  );
}

type PostDetailModalProps = {
  detail: ApiForumPostDetailResponse;
  currentUser: ForumUser | null;
  canParticipate: boolean;
  onClose: () => void;
  onDetailChange: (detail: ApiForumPostDetailResponse) => void;
  onReloadPost: (postId: number) => Promise<void>;
  onPostDeleted: () => void;
  onPointsChanged: () => void;
};

function PostDetailModal({
  detail,
  currentUser,
  canParticipate,
  onClose,
  onDetailChange,
  onReloadPost,
  onPostDeleted,
  onPointsChanged,
}: PostDetailModalProps) {
  const [replyHtml, setReplyHtml] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const post = detail.post;
  const replies = detail.replies;

  async function handleCreateReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentUser) return;

    if (!canParticipate) {
      showToast("Debes suscribirte a este foro para responder.", "warning");
      return;
    }

    const cleanHtml = sanitizeRichHtml(replyHtml);
    const cleanText = getPlainTextFromHtml(cleanHtml);

    if (!cleanText) {
      showToast("Escribe una respuesta antes de publicar.", "warning");
      return;
    }

    try {
      setIsSubmittingReply(true);

      await createForumReplyRequest(post.id, {
        contentHtml: cleanHtml,
      });

      const updatedDetail = await getForumPostDetailRequest(post.id);

      onDetailChange(updatedDetail);
      onPointsChanged();
      setReplyHtml("");

      showToast(`Respuesta publicada. +${POINTS_BY_REPLY} puntos.`, "success");
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      setIsSubmittingReply(false);
    }
  }

  async function handleDeletePost() {
    if (!post.currentUserCanDelete) {
      showToast("Solo puedes borrar publicaciones que tú escribiste.", "warning");
      return;
    }

    const confirmed = await confirmAction(
      "¿Eliminar publicación?",
      "Se ocultará esta publicación. Las respuestas asociadas dejarán de mostrarse.",
    );

    if (!confirmed) return;

    try {
      await deleteForumPostRequest(post.id);

      showToast("Publicación eliminada.", "success");
      onPostDeleted();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    }
  }

  async function handleDeleteReply(reply: ApiForumReplyResponse) {
    if (!reply.currentUserCanDelete) {
      showToast("Solo puedes borrar respuestas que tú escribiste.", "warning");
      return;
    }

    const confirmed = await confirmAction(
      "¿Eliminar respuesta?",
      "Se ocultará esta respuesta de la publicación.",
    );

    if (!confirmed) return;

    try {
      await deleteForumReplyRequest(reply.id);
      await onReloadPost(post.id);
      onPointsChanged();

      showToast("Respuesta eliminada.", "success");
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    }
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <article
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.modalHeader}>
          <div className={styles.modalAuthorRow}>
            <ForumAvatar author={post.author} size="sm" />

            <div>
              <span>
                {post.author.name} · {formatDate(post.createdAt)}
              </span>

              <h2>{post.title}</h2>
            </div>
          </div>

          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </header>

        <div
          className={styles.modalBody}
          dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(post.contentHtml) }}
        />

        {post.currentUserCanDelete && (
          <button
            type="button"
            className={styles.deleteButton}
            onClick={() => void handleDeletePost()}
          >
            <Trash2 size={16} />
            Eliminar publicación
          </button>
        )}

        <section className={styles.repliesSection}>
          <h3>Respuestas</h3>

          <div className={styles.repliesList}>
            {replies.length === 0 ? (
              <p className={styles.emptyReplies}>
                Todavía no hay respuestas en esta publicación.
              </p>
            ) : (
              replies.map((reply) => (
                <article key={reply.id} className={styles.replyCard}>
                  <div className={styles.replyHeader}>
                    <div className={styles.replyAuthorRow}>
                      <ForumAvatar author={reply.author} size="sm" />

                      <div>
                        <strong>{reply.author.name}</strong>
                        <span>{formatDate(reply.createdAt)}</span>
                      </div>
                    </div>

                    {reply.currentUserCanDelete && (
                      <button
                        type="button"
                        onClick={() => void handleDeleteReply(reply)}
                        aria-label="Eliminar respuesta"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  <div
                    className={styles.replyBody}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeRichHtml(reply.contentHtml),
                    }}
                  />
                </article>
              ))
            )}
          </div>
        </section>

        <section className={styles.replyFormCard}>
          <h3>Responder publicación</h3>

          {!canParticipate && (
            <div className={styles.warningBox}>
              <Lock size={17} />
              Debes suscribirte a este foro para responder.
            </div>
          )}

          <form className={styles.replyForm} onSubmit={handleCreateReply}>
            <RichTextEditor
              value={replyHtml}
              onChange={setReplyHtml}
              disabled={!canParticipate || isSubmittingReply}
              placeholder="Escribe tu respuesta..."
            />

            <button
              type="submit"
              className={styles.publishButton}
              disabled={!canParticipate || isSubmittingReply}
            >
              {isSubmittingReply ? "Publicando..." : "Responder"}
              <Send size={16} />
            </button>
          </form>
        </section>
      </article>
    </div>
  );
}