export interface Variant {
  type: string;
  name: string;
  image?: string;
  price?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  brand?: string;
  description?: string;
  images?: string[];
  defaultPrice?: number;
  categoryId?: string;
  variants?: Variant[];
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  image: string;
  price: number;
  details: { [key: string]: string };
}

