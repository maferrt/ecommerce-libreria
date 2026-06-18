export type CartItemType = "book" | "saga";

export type CartItem = {
  id: string;
  type: CartItemType;
  productId: string | number;
  title: string;
  subtitle: string;
  image: string;
  price: number;
  quantity: number;
  meta: string;
};

export type AddCartItemInput = Omit<CartItem, "quantity">;