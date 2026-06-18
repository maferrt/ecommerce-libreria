export type WishlistItemType = "book" | "saga";

export type WishlistItem = {
  id: string;
  type: WishlistItemType;
  productId: string | number;
  title: string;
  subtitle: string;
  image: string;
  price: number;
  meta: string;
  createdAt: string;
};

export type AddWishlistItemInput = Omit<WishlistItem, "createdAt">;