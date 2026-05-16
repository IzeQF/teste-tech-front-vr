export type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
  category: string;
  rating: number;
  stock: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
