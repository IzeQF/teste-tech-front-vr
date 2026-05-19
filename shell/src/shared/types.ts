export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
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
  weight?: number;
  dimensions?: ProductDimensions;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
