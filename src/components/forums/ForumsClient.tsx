"use client";

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
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Swal from "sweetalert2";
import {
  forumCategories,
  POINTS_BY_POST,
  POINTS_BY_REPLY,
} from "@/data/forums";
import type {
  ForumCategory,
  ForumMembershipsByUser,
  ForumPost,
  ForumReply,
  ForumUser,
} from "@/types/forum";
import styles from "./ForumsClient.module.css";

const USER_STORAGE_KEY = "mel_logged_user";
const MEMBERSHIPS_STORAGE_KEY = "mel_forum_memberships";

function getForumPostsStorageKey(forumId: string) {
  return `mel_forum_posts_${forumId}`;
}

function getForumRepliesStorageKey(forumId: string, postId: string) {
  return `mel_forum_replies_${forumId}_${postId}`;
}

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) return fallback;

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

function saveJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getStoredUser() {
  return safeReadJson<ForumUser | null>(USER_STORAGE_KEY, null);
}

function saveStoredUser(user: ForumUser | null) {
  if (!user) {
    window.localStorage.removeItem(USER_STORAGE_KEY);
    return;
  }

  saveJson(USER_STORAGE_KEY, user);
}

function getStoredPosts(forumId: string) {
  return safeReadJson<ForumPost[]>(getForumPostsStorageKey(forumId), []);
}

function saveStoredPosts(forumId: string, posts: ForumPost[]) {
  saveJson(getForumPostsStorageKey(forumId), posts);
}

function getStoredReplies(forumId: string, postId: string) {
  return safeReadJson<ForumReply[]>(
    getForumRepliesStorageKey(forumId, postId),
    [],
  );
}

function saveStoredReplies(
  forumId: string,
  postId: string,
  replies: ForumReply[],
) {
  saveJson(getForumRepliesStorageKey(forumId, postId), replies);
}

function removeStoredReplies(forumId: string, postId: string) {
  window.localStorage.removeItem(getForumRepliesStorageKey(forumId, postId));
}

function getAllMemberships() {
  return safeReadJson<ForumMembershipsByUser>(MEMBERSHIPS_STORAGE_KEY, {});
}

function saveAllMemberships(memberships: ForumMembershipsByUser) {
  saveJson(MEMBERSHIPS_STORAGE_KEY, memberships);
}

function getUserForumMembership(userId: string, forumId: string) {
  const memberships = getAllMemberships();

  return memberships[userId]?.[forumId] ?? null;
}

function isUserSubscribedToForum(userId: string, forumId: string) {
  return Boolean(getUserForumMembership(userId, forumId));
}

function subscribeUserToForum(userId: string, forumId: string) {
  const memberships = getAllMemberships();

  if (!memberships[userId]) {
    memberships[userId] = {};
  }

  if (!memberships[userId][forumId]) {
    memberships[userId][forumId] = {
      forumId,
      joinedAt: new Date().toISOString(),
      points: 0,
    };
  }

  saveAllMemberships(memberships);
}

function unsubscribeUserFromForum(userId: string, forumId: string) {
  const memberships = getAllMemberships();

  if (!memberships[userId]?.[forumId]) return;

  delete memberships[userId][forumId];

  if (Object.keys(memberships[userId]).length === 0) {
    delete memberships[userId];
  }

  saveAllMemberships(memberships);
}

function updateUserForumPoints(userId: string, forumId: string, delta: number) {
  const memberships = getAllMemberships();

  if (!memberships[userId]) {
    memberships[userId] = {};
  }

  if (!memberships[userId][forumId]) {
    memberships[userId][forumId] = {
      forumId,
      joinedAt: new Date().toISOString(),
      points: 0,
    };
  }

  memberships[userId][forumId].points = Math.max(
    0,
    memberships[userId][forumId].points + delta,
  );

  saveAllMemberships(memberships);
}

function getForumMembersCount(forumId: string) {
  const memberships = getAllMemberships();

  return Object.values(memberships).filter((userMemberships) =>
    Boolean(userMemberships[forumId]),
  ).length;
}

function getForumTopicsCount(forumId: string) {
  return getStoredPosts(forumId).length;
}

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

async function showLoginAlert() {
  const result = await Swal.fire<string>({
    title: "Inicia sesión",
    text: "Para entrar a un foro necesitas iniciar sesión primero.",
    input: "text",
    inputLabel: "Nombre de usuario",
    inputPlaceholder: "Ej. Mafer",
    confirmButtonText: "Entrar",
    cancelButtonText: "Cancelar",
    showCancelButton: true,
    confirmButtonColor: "#521f12",
    cancelButtonColor: "#a0653d",
    background: "#f6ebd9",
    color: "#521f12",
    inputValidator: (value) => {
      if (!value.trim()) {
        return "Escribe un nombre de usuario.";
      }

      return null;
    },
  });

  if (!result.isConfirmed || !result.value) {
    return null;
  }

  const username = result.value.trim();

  return {
    id: `local-user-${username.toLowerCase().replace(/\s+/g, "-")}`,
    username,
  } satisfies ForumUser;
}

async function confirmAction(title: string, text: string) {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#7a2626",
    cancelButtonColor: "#a0653d",
    background: "#f6ebd9",
    color: "#521f12",
  });

  return result.isConfirmed;
}

export function ForumsClient() {
  const [currentUser, setCurrentUser] = useState<ForumUser | null>(() =>
    getStoredUser(),
  );
  const [selectedForum, setSelectedForum] = useState<ForumCategory | null>(null);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedForumPosts = useMemo(() => {
    if (!selectedForum) return [];

    const posts = getStoredPosts(selectedForum.id).sort(
      (firstPost, secondPost) =>
        new Date(secondPost.createdAt).getTime() -
        new Date(firstPost.createdAt).getTime(),
    );

    return showAllPosts ? posts : posts.slice(0, 3);
  }, [selectedForum, showAllPosts, refreshKey]);

  const allSelectedForumPosts = selectedForum
    ? getStoredPosts(selectedForum.id)
    : [];

  const isSubscribed =
    currentUser && selectedForum
      ? isUserSubscribedToForum(currentUser.id, selectedForum.id)
      : false;

  const currentPoints =
    currentUser && selectedForum
      ? getUserForumMembership(currentUser.id, selectedForum.id)?.points ?? 0
      : 0;

  const forumMembers = selectedForum ? getForumMembersCount(selectedForum.id) : 0;
  const forumTopics = selectedForum ? getForumTopicsCount(selectedForum.id) : 0;

  function refresh() {
    setRefreshKey((currentValue) => currentValue + 1);
  }

  async function handleForumClick(forum: ForumCategory) {
    let user = currentUser;

    if (!user) {
      user = await showLoginAlert();

      if (!user) return;

      saveStoredUser(user);
      setCurrentUser(user);
      showToast(`Bienvenida, ${user.username}.`, "success");
    }

    setSelectedForum(forum);
    setSelectedPost(null);
    setShowAllPosts(false);
  }

  function handleLogout() {
    saveStoredUser(null);
    setCurrentUser(null);
    setSelectedForum(null);
    setSelectedPost(null);
    setShowAllPosts(false);
    showToast("Sesión cerrada.", "info");
  }

  function handleBackToForums() {
    setSelectedForum(null);
    setSelectedPost(null);
    setShowAllPosts(false);
  }

  function handleSubscribe() {
    if (!currentUser || !selectedForum) return;

    subscribeUserToForum(currentUser.id, selectedForum.id);
    refresh();
    showToast("Te suscribiste a este foro. Ya puedes participar.", "success");
  }

  async function handleUnsubscribe() {
    if (!currentUser || !selectedForum) return;

    const confirmed = await Swal.fire({
        title: "¿Desuscribirte del foro?",
        text: "Ya no podrás publicar ni responder en este foro. Tus puntos de este foro también se reiniciarán.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, desuscribirme",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#7a2626",
        cancelButtonColor: "#a0653d",
        background: "#f6ebd9",
        color: "#521f12",
    });

    if (!confirmed.isConfirmed) return;

    unsubscribeUserFromForum(currentUser.id, selectedForum.id);

    refresh();

    showToast("Te desuscribiste de este foro.", "info");
  }

  function requireSubscription() {
    if (!currentUser || !selectedForum) {
      showToast("Debes iniciar sesión y entrar a un foro.", "warning");
      return false;
    }

    if (!isUserSubscribedToForum(currentUser.id, selectedForum.id)) {
      showToast("Debes suscribirte a este foro para participar.", "warning");
      return false;
    }

    return true;
  }

  function handleCreatePost(title: string, contentHtml: string) {
    if (!selectedForum || !currentUser) return;

    if (!requireSubscription()) return;

    const cleanTitle = title.trim();
    const cleanText = getPlainTextFromHtml(contentHtml);

    if (!cleanTitle || !cleanText) {
      showToast("La publicación necesita título y contenido.", "warning");
      return;
    }

    const newPost: ForumPost = {
      id: createId("post"),
      forumId: selectedForum.id,
      title: cleanTitle,
      contentHtml,
      authorId: currentUser.id,
      authorName: currentUser.username,
      createdAt: new Date().toISOString(),
    };

    const currentPosts = getStoredPosts(selectedForum.id);

    saveStoredPosts(selectedForum.id, [newPost, ...currentPosts]);
    updateUserForumPoints(currentUser.id, selectedForum.id, POINTS_BY_POST);

    refresh();
    showToast(`Publicación creada. +${POINTS_BY_POST} puntos.`, "success");
  }

  function handleOpenPost(post: ForumPost) {
    setSelectedPost(post);
  }

  function handlePostDeleted() {
    setSelectedPost(null);
    refresh();
  }

  if (!selectedForum) {
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

            <div className={styles.grid}>
              {forumCategories.map((forum) => (
                <button
                  type="button"
                  key={forum.id}
                  className={styles.forumCard}
                  onClick={() => void handleForumClick(forum)}
                >
                  <span className={styles.cardIcon}>{forum.icono}</span>

                  <div>
                    <h3>{forum.nombre}</h3>
                    <p>{forum.descripcion}</p>

                    <div className={styles.cardStats}>
                      <span>
                        <MessageCircle size={15} />
                        {getForumTopicsCount(forum.id)} temas activos
                      </span>

                      <span>
                        <UsersRound size={15} />
                        {getForumMembersCount(forum.id)} miembros
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
              {forumCategories.map((forum) => (
                <button
                  type="button"
                  key={forum.id}
                  className={
                    forum.id === selectedForum.id
                      ? `${styles.genreButton} ${styles.genreButtonActive}`
                      : styles.genreButton
                  }
                  onClick={() => void handleForumClick(forum)}
                >
                  <span>{forum.icono}</span>
                  {forum.nombre}
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
            <div className={styles.detailIcon}>{selectedForum.icono}</div>

            <div>
              <h1>Foro de {selectedForum.nombre}</h1>
              <p>{selectedForum.descripcion}</p>
            </div>
          </header>

          <CreatePostCard
            canParticipate={Boolean(isSubscribed)}
            onCreatePost={handleCreatePost}
          />

          <section className={styles.postsSection}>
            <h2>Publicaciones recientes</h2>

            <div className={styles.postsList}>
              {selectedForumPosts.length === 0 ? (
                <article className={styles.emptyCard}>
                  <BookOpen size={26} />
                  <p>Este foro todavía no tiene publicaciones.</p>
                </article>
              ) : (
                selectedForumPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onOpen={() => handleOpenPost(post)}
                  />
                ))
              )}
            </div>

            {allSelectedForumPosts.length > 3 && (
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
                    onClick={handleSubscribe}
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
                Miembros activos
              </span>
              <strong>{forumMembers}</strong>
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

            <button type="button" onClick={handleLogout}>
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </section>
        </aside>
      </section>

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          currentUser={currentUser}
          canParticipate={Boolean(isSubscribed)}
          onClose={() => setSelectedPost(null)}
          onRefresh={refresh}
          onPostDeleted={handlePostDeleted}
        />
      )}
    </main>
  );
}

type CreatePostCardProps = {
  canParticipate: boolean;
  onCreatePost: (title: string, contentHtml: string) => void;
};

function CreatePostCard({ canParticipate, onCreatePost }: CreatePostCardProps) {
  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onCreatePost(title, contentHtml);

    if (title.trim() && getPlainTextFromHtml(contentHtml)) {
      setTitle("");
      setContentHtml("");
    }
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
          disabled={!canParticipate}
          placeholder="Título"
        />

        <RichTextEditor
          value={contentHtml}
          onChange={setContentHtml}
          disabled={!canParticipate}
          placeholder="Escribe tu comentario..."
        />

        <button
          type="submit"
          className={styles.publishButton}
          disabled={!canParticipate}
        >
          Publicar
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
    onChange(editorRef.current?.innerHTML ?? "");
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

type PostCardProps = {
  post: ForumPost;
  onOpen: () => void;
};

function PostCard({ post, onOpen }: PostCardProps) {
  return (
    <article className={styles.postCard}>
      <div className={styles.postMain}>
        <div className={styles.avatar}>{post.authorName.charAt(0)}</div>

        <div>
          <h3>{post.title}</h3>
          <p>
            {post.authorName} · {formatDate(post.createdAt)}
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
  post: ForumPost;
  currentUser: ForumUser | null;
  canParticipate: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onPostDeleted: () => void;
};

function PostDetailModal({
  post,
  currentUser,
  canParticipate,
  onClose,
  onRefresh,
  onPostDeleted,
}: PostDetailModalProps) {
  const [replyHtml, setReplyHtml] = useState("");
  const [repliesRefreshKey, setRepliesRefreshKey] = useState(0);

  const replies = useMemo(() => {
    return getStoredReplies(post.forumId, post.id);
  }, [post.forumId, post.id, repliesRefreshKey]);

  function refreshReplies() {
    setRepliesRefreshKey((currentValue) => currentValue + 1);
    onRefresh();
  }

  function handleCreateReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentUser) return;

    if (!canParticipate) {
      showToast("Debes suscribirte a este foro para responder.", "warning");
      return;
    }

    const cleanText = getPlainTextFromHtml(replyHtml);

    if (!cleanText) {
      showToast("Escribe una respuesta antes de publicar.", "warning");
      return;
    }

    const newReply: ForumReply = {
      id: createId("reply"),
      forumId: post.forumId,
      postId: post.id,
      contentHtml: replyHtml,
      authorId: currentUser.id,
      authorName: currentUser.username,
      createdAt: new Date().toISOString(),
    };

    saveStoredReplies(post.forumId, post.id, [...replies, newReply]);
    updateUserForumPoints(currentUser.id, post.forumId, POINTS_BY_REPLY);

    setReplyHtml("");
    refreshReplies();
    showToast(`Respuesta publicada. +${POINTS_BY_REPLY} puntos.`, "success");
  }

  async function handleDeletePost() {
    if (!currentUser || post.authorId !== currentUser.id) {
      showToast("Solo puedes borrar publicaciones que tú escribiste.", "warning");
      return;
    }

    const confirmed = await confirmAction(
      "¿Eliminar publicación?",
      "Se eliminará la publicación, sus respuestas y se descontarán los puntos correspondientes.",
    );

    if (!confirmed) return;

    const posts = getStoredPosts(post.forumId);

    saveStoredPosts(
      post.forumId,
      posts.filter((storedPost) => storedPost.id !== post.id),
    );

    updateUserForumPoints(post.authorId, post.forumId, -POINTS_BY_POST);

    replies.forEach((reply) => {
      updateUserForumPoints(reply.authorId, reply.forumId, -POINTS_BY_REPLY);
    });

    removeStoredReplies(post.forumId, post.id);

    showToast("Publicación eliminada y puntos descontados.", "success");
    onPostDeleted();
  }

  async function handleDeleteReply(reply: ForumReply) {
    if (!currentUser || reply.authorId !== currentUser.id) {
      showToast("Solo puedes borrar respuestas que tú escribiste.", "warning");
      return;
    }

    const confirmed = await confirmAction(
      "¿Eliminar respuesta?",
      "Se eliminará la respuesta y se descontarán sus puntos.",
    );

    if (!confirmed) return;

    saveStoredReplies(
      post.forumId,
      post.id,
      replies.filter((storedReply) => storedReply.id !== reply.id),
    );

    updateUserForumPoints(reply.authorId, reply.forumId, -POINTS_BY_REPLY);

    refreshReplies();
    showToast("Respuesta eliminada y puntos descontados.", "success");
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <article className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <header className={styles.modalHeader}>
          <div>
            <span>
              {post.authorName} · {formatDate(post.createdAt)}
            </span>

            <h2>{post.title}</h2>
          </div>

          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </header>

        <div
          className={styles.modalBody}
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {currentUser?.id === post.authorId && (
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
                    <div>
                      <strong>{reply.authorName}</strong>
                      <span>{formatDate(reply.createdAt)}</span>
                    </div>

                    {currentUser?.id === reply.authorId && (
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
                    dangerouslySetInnerHTML={{ __html: reply.contentHtml }}
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
              disabled={!canParticipate}
              placeholder="Escribe tu respuesta..."
            />

            <button
              type="submit"
              className={styles.publishButton}
              disabled={!canParticipate}
            >
              Responder
              <Send size={16} />
            </button>
          </form>
        </section>
      </article>
    </div>
  );
}