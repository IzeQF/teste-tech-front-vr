declare module "shell/CartContext" {
  import { CartItem, Product } from "shell/types";
  import { ReactNode } from "react";

  interface CartContextValue {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    isSyncing: boolean;
  }

  export const CartProvider: React.FC<{ children: ReactNode }>;
  export const useCart: () => CartContextValue;
}

declare module "shell/types" {
  export interface ProductReview {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
  }

  export interface Product {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    images: string[];
    description: string;
    category: string;
    rating: number;
    stock: number;
    brand?: string;
    tags?: string[];
    discountPercentage?: number;
    warrantyInformation?: string;
    shippingInformation?: string;
    availabilityStatus?: string;
    returnPolicy?: string;
    reviews?: ProductReview[];
  }

  export interface CartItem {
    product: Product;
    quantity: number;
  }
}