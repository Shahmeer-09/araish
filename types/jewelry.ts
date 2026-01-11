export interface JewelryProduct {
  id: string;
  name: string;
  category: 'rings' | 'necklaces' | 'earrings' | 'bracelets' | 'sets';
  description: string;
  price: number;
  images: string[];
  material: string;
  inStock: boolean;
  featured: boolean;
}

// Database types
export interface DbProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  material: string;
  inStock: boolean;
  featured: boolean;
  images: DbImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DbImage {
  id: string;
  mimeType: string;
  productId: string;
}

