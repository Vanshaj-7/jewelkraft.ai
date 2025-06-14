export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Design {
  id: string;
  userId: string;
  prompt: string;
  images: string[];
  createdAt: string;
  status: 'draft' | 'saved' | 'ordered';
}

export interface Product {
  id: string;
  designId: string;
  material: string;
  size: string;
  karat: number;
  color: string;
  hallmark: string;
  purity: string;
  weight: string;
  quantity: number;
  status: 'draft' | 'cart' | 'ordered';
  createdAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  createdAt: string;
  updatedAt: string;
} 