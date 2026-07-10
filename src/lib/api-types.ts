export type ApiUserRole = "USER" | "ADMIN";

export type ApiAuthUser = {
  id: number;
  name: string;
  email: string;
  role: ApiUserRole;
};

export type ApiAuthResponse = {
  token: string;
  user: ApiAuthUser;
};

export type ApiRegisterRequest = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ApiLoginRequest = {
  email: string;
  password: string;
};

export type ApiAddress = {
  id?: number;
  street: string;
  exteriorNumber: string;
  interiorNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  references: string;
};

export type ApiProfile = {
  id: number;
  userId: number;
  email: string;
  displayName: string;
  avatar: string | null;
  currentReading: string;
  readerStatus: string;
  bio: string;
  favoriteGenre: string;
  address: ApiAddress;
};

export type ApiProfileUpdateRequest = {
  displayName: string;
  avatar: string | null;
  currentReading: string;
  readerStatus: string;
  bio: string;
  favoriteGenre: string;
  address: {
    street: string;
    exteriorNumber: string;
    interiorNumber: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    references: string;
  };
};

export type ApiWishlistItemType = "BOOK" | "SAGA";

export type ApiWishlistItem = {
  id: number;
  type: ApiWishlistItemType;
  bookId: number | null;
  sagaId: string | null;
  title: string;
  author: string;
  price: number;
  coverImage: string;
};

export type ApiWishlistResponse = {
  id: number;
  items: ApiWishlistItem[];
};

export type ApiCartItemType = "BOOK" | "SAGA";

export type ApiCartItem = {
  id: number;
  type: ApiCartItemType;
  bookId: number | null;
  sagaId: string | null;
  title: string;
  author: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  coverImage: string;
};

export type ApiCartResponse = {
  id: number;
  items: ApiCartItem[];
  totalItems: number;
  total: number;
};

export type ApiOrderStatus =
  | "CREATED"
  | "PAID"
  | "PREPARING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type ApiOrderItem = {
  id: number;
  type: "BOOK" | "SAGA";
  bookId: number | null;
  sagaId: string | null;
  title: string;
  author: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  coverImage: string;
};

export type ApiShippingAddress = {
  street: string;
  exteriorNumber: string;
  interiorNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  references: string;
};

export type ApiOrderResponse = {
  id: number;
  orderNumber: string;
  status: ApiOrderStatus;
  totalItems: number;
  total: number;
  paymentMethod: string;
  deliveryNotes: string;
  shippingAddress: ApiShippingAddress;
  items: ApiOrderItem[];
  createdAt: string;
};

export type ApiCheckoutRequest = {
  paymentMethod: string;
  deliveryNotes: string;
};

export type ApiForumAuthor = {
  id: number;
  name: string;
  avatar: string | null;
};

export type ApiForumResponse = {
  id: number;
  slug: string;
  name: string;
  description: string;
  coverImage: string | null;
  subscribed: boolean;
  points: number;
  postCount: number;
};

export type ApiForumPostRequest = {
  title: string;
  contentHtml: string;
};

export type ApiForumReplyRequest = {
  contentHtml: string;
};

export type ApiForumPostResponse = {
  id: number;
  forumSlug: string;
  title: string;
  contentHtml: string;
  author: ApiForumAuthor;
  replyCount: number;
  currentUserCanDelete: boolean;
  createdAt: string;
};

export type ApiForumReplyResponse = {
  id: number;
  postId: number;
  contentHtml: string;
  author: ApiForumAuthor;
  currentUserCanDelete: boolean;
  createdAt: string;
};

export type ApiForumPostDetailResponse = {
  post: ApiForumPostResponse;
  replies: ApiForumReplyResponse[];
};