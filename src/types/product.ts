export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  details: {
    stretch: boolean;
    compression: 'light' | 'medium' | 'maximum';
    material: string[];
    careInstructions: string[];
  };
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
  colors: {
    name: string;
    code: string;
  }[];
  category: 'cinturilla' | 'faja-completa' | 'short-control' | 'body-shaper' | 'top-control';
  images: {
    main: string;
    gallery: string[];
  };
  stock: number;
  isNew: boolean;
  discount?: {
    percentage: number;
    endDate: string;
  };
  features: string[];
} 