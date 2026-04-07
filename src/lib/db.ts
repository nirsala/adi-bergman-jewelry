import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

export type CustomerGroup = 'new' | 'regular' | 'vip';

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
  customerGroup: CustomerGroup;
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
  minOrderQty: number;
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

// Cart
export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: string;
  status: 'active' | 'submitted';
}

export function getCarts(): Cart[] {
  try {
    return readJson<Cart[]>('carts.json');
  } catch {
    writeJson('carts.json', []);
    return [];
  }
}

export function saveCarts(carts: Cart[]): void {
  writeJson('carts.json', carts);
}

export function getCartByUserId(userId: string): Cart | undefined {
  return getCarts().find(c => c.userId === userId && c.status === 'active');
}

export function upsertCart(userId: string, items: CartItem[]): Cart {
  const carts = getCarts();
  const index = carts.findIndex(c => c.userId === userId && c.status === 'active');
  if (index !== -1) {
    carts[index].items = items;
    carts[index].updatedAt = new Date().toISOString();
    saveCarts(carts);
    return carts[index];
  }
  const newCart: Cart = {
    id: require('uuid').v4(),
    userId,
    items,
    updatedAt: new Date().toISOString(),
    status: 'active',
  };
  carts.push(newCart);
  saveCarts(carts);
  return newCart;
}

export function submitCart(userId: string): Cart | null {
  const carts = getCarts();
  const index = carts.findIndex(c => c.userId === userId && c.status === 'active');
  if (index === -1) return null;
  carts[index].status = 'submitted';
  carts[index].updatedAt = new Date().toISOString();
  saveCarts(carts);
  return carts[index];
}

export function clearCart(userId: string): boolean {
  const carts = getCarts();
  const index = carts.findIndex(c => c.userId === userId && c.status === 'active');
  if (index === -1) return false;
  carts.splice(index, 1);
  saveCarts(carts);
  return true;
}

// Orders (submitted carts become orders)
export interface OrderItem {
  productId: string;
  nameHe: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export function getOrders(): Order[] {
  try {
    return readJson<Order[]>('orders.json');
  } catch {
    writeJson('orders.json', []);
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  writeJson('orders.json', orders);
}

export function addOrder(order: Order): void {
  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);
}

export function getOrdersByUserId(userId: string): Order[] {
  return getOrders().filter(o => o.userId === userId).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function updateOrder(id: string, updates: Partial<Order>): Order | null {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...updates, updatedAt: new Date().toISOString() };
  saveOrders(orders);
  return orders[index];
}

// Wholesale Settings
export const CUSTOMER_GROUP_DEFAULTS: Record<CustomerGroup, number> = {
  new: 0,
  regular: 10,
  vip: 20,
};

export const MIN_ORDER_TOTAL = 1000; // ₪1,000 minimum order

// Settings
export function getSettings(): SiteSettings {
  return readJson<SiteSettings>('settings.json');
}
