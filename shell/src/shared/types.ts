export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
  category: string;
  rating: number;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
