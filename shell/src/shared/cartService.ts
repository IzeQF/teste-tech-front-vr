import { CartItem } from "./types";

const CARTS_API = "https://dummyjson.com/carts";

export interface CartSyncPayload {
  userId: number;
  products: { id: number; quantity: number }[];
}

export interface CartSyncResponse {
  id: number;
  products: {
    id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
    discountPercentage: number;
    discountedTotal: number;
    thumbnail: string;
  }[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export async function syncCartWithApi(
  items: CartItem[],
  userId = 1
): Promise<CartSyncResponse> {
  const payload: CartSyncPayload = {
    userId,
    products: items.map((i) => ({ id: i.product.id, quantity: i.quantity })),
  };

  const response = await fetch(`${CARTS_API}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Erro ao sincronizar carrinho: ${response.status}`);
  }

  return response.json();
}
