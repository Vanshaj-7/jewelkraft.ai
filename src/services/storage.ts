import { Design, Product } from '../types';
import storageData from '../data/storage.json';

interface StorageData {
  designs: Design[];
  products: Product[];
  cart: { productId: string; quantity: number }[];
}

class StorageService {
  private data: StorageData;

  constructor() {
    this.data = storageData;
  }

  // Design methods
  saveDesign(design: Design): void {
    const existingIndex = this.data.designs.findIndex(d => d.id === design.id);
    if (existingIndex >= 0) {
      this.data.designs[existingIndex] = design;
    } else {
      this.data.designs.push(design);
    }
    this.saveToFile();
  }

  getDesigns(): Design[] {
    return this.data.designs;
  }

  getDesignById(id: string): Design | undefined {
    return this.data.designs.find(d => d.id === id);
  }

  deleteDesign(id: string): void {
    this.data.designs = this.data.designs.filter(d => d.id !== id);
    this.saveToFile();
  }

  // Product methods
  saveProduct(product: Product): void {
    const existingIndex = this.data.products.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) {
      this.data.products[existingIndex] = product;
    } else {
      this.data.products.push(product);
    }
    this.saveToFile();
  }

  getProducts(): Product[] {
    return this.data.products;
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  deleteProduct(id: string): void {
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.saveToFile();
  }

  // Cart methods
  addToCart(productId: string, quantity: number): void {
    const existingItem = this.data.cart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.data.cart.push({ productId, quantity });
    }
    this.saveToFile();
  }

  removeFromCart(productId: string): void {
    this.data.cart = this.data.cart.filter(item => item.productId !== productId);
    this.saveToFile();
  }

  updateCartItemQuantity(productId: string, quantity: number): void {
    const item = this.data.cart.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      this.saveToFile();
    }
  }

  getCart(): { productId: string; quantity: number }[] {
    return this.data.cart;
  }

  clearCart(): void {
    this.data.cart = [];
    this.saveToFile();
  }

  // Helper method to save data to file
  private saveToFile(): void {
    // In a real application, this would write to the JSON file
    // For now, we'll just update the in-memory data
    console.log('Data saved:', this.data);
  }
}

export const storageService = new StorageService(); 