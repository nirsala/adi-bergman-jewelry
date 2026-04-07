import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  discountPercent: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  category: 'rings' | 'necklaces' | 'earrings' | 'bracelets';
  basePrice: number;
  images: string[];
  inStock: boolean;
  featured: boolean;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  siteNameHe: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: Record<string, string>;
}

function readJson<T>(filename: string): T {
  const filePath = path.join(dataDir, filename);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function writeJson<T>(filename: string, data: T): void {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Users
export function getUsers(): User[] {
  return readJson<User[]>('users.json');
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

export function getUserByUsername(username: string): User | undefined {
  return getUsers().find(u => u.username === username);
}

export function saveUsers(users: User[]): void {
  writeJson('users.json', users);
}

export function addUser(user: User): void {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  return users[index];
}

// Products
export function getProducts(): Product[] {
  return readJson<Product[]>('products.json');
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find(p => p.id === id);
}

export function saveProducts(products: Product[]): void {
  writeJson('products.json', products);
}

export function addProduct(product: Product): void {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates };
  saveProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

// Settings
export function getSettings(): SiteSettings {
  return readJson<SiteSettings>('settings.json');
}
