export type ForumUser = {
  id: string;
  username: string;
  avatar?: string | null;
};

export type ForumCategory = {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
};

export type ForumPost = {
  id: string;
  forumId: string;
  title: string;
  contentHtml: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string | null;
  createdAt: string;
};

export type ForumReply = {
  id: string;
  forumId: string;
  postId: string;
  contentHtml: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string | null;
  createdAt: string;
};

export type ForumMembership = {
  forumId: string;
  joinedAt: string;
  points: number;
};

export type ForumMembershipsByUser = Record<
  string,
  Record<string, ForumMembership>
>;