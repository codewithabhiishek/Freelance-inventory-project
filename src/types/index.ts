export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  avatar?: string;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  categoryId: string;
  description?: string;
  costPrice: number;
  sellingPrice: number;
  taxRate: number;
  stock: number;
  minStock: number;
  supplierId?: string;
  image?: string;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  address?: string;
  gstin?: string;
  totalPurchases: number;
  outstandingBalance: number;
  lastPurchase?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address?: string;
  gstin?: string;
  productsSupplied: string[];
  totalPurchases: number;
  outstandingPayable: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'completed' | 'returned' | 'partial';
  date: string;
  notes?: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
  date: string;
  dueDate: string;
  notes?: string;
}

export interface Payment {
  id: string;
  invoiceId?: string;
  invoiceNumber?: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: 'cash' | 'bank_transfer' | 'upi' | 'card' | 'other';
  date: string;
  status: 'completed' | 'pending' | 'failed';
  notes?: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  costPrice: number;
  taxRate: number;
  total: number;
}

export interface Purchase {
  id: string;
  purchaseNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'draft' | 'ordered' | 'received' | 'partially_received' | 'cancelled';
  date: string;
  notes?: string;
}

export interface Expense {
  id: string;
  title: string;
  category: 'rent' | 'utilities' | 'salaries' | 'marketing' | 'transport' | 'software' | 'maintenance' | 'other';
  amount: number;
  date: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'upi' | 'card';
  notes?: string;
  createdAt: string;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'stock_in' | 'stock_out' | 'damage' | 'return' | 'adjustment';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  notes?: string;
  date: string;
  performedBy: string;
}

export interface Notification {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'overdue_invoice' | 'payment_received' | 'purchase_received' | 'invoice_created' | 'error';
  title: string;
  message: string;
  read: boolean;
  date: string;
  link?: string;
}

export interface CompanySettings {
  name: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  currency: string;
  currencySymbol: string;
  taxDefault: number;
  invoicePrefix: string;
  invoiceCounter: number;
  purchasePrefix: string;
  purchaseCounter: number;
}

export type PageKey = 'dashboard' | 'products' | 'inventory' | 'sales' | 'purchases' | 'customers' | 'suppliers' | 'invoices' | 'payments' | 'expenses' | 'reports' | 'users' | 'settings';
