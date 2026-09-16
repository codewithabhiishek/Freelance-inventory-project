import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import {
  User, Product, Customer, Supplier, Category, Sale, Invoice, Payment,
  Purchase, Expense, InventoryTransaction, Notification, CompanySettings, PageKey
} from '../types';
import {
  seedUsers, seedProducts, seedCustomers, seedSuppliers, seedCategories,
  seedSales, seedInvoices, seedPayments, seedPurchases, seedExpenses,
  seedInventoryTransactions, seedNotifications, seedSettings
} from '../data/seed';

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Navigation
  currentPage: PageKey;
  setCurrentPage: (page: PageKey) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Shortcuts
  shortcutsOpen: boolean;
  setShortcutsOpen: (open: boolean) => void;

  // Data
  users: User[];
  products: Product[];
  customers: Customer[];
  suppliers: Supplier[];
  categories: Category[];
  sales: Sale[];
  invoices: Invoice[];
  payments: Payment[];
  purchases: Purchase[];
  expenses: Expense[];
  inventoryTransactions: InventoryTransaction[];
  notifications: Notification[];
  settings: CompanySettings;

  // Product CRUD
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Customer CRUD
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Supplier CRUD
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // Category CRUD
  addCategory: (name: string, description?: string) => void;
  deleteCategory: (id: string) => void;

  // Sales
  createSale: (sale: Omit<Sale, 'id' | 'invoiceNumber'>) => string;

  // Invoices
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'paidAmount'>) => string;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;

  // Payments
  createPayment: (payment: Omit<Payment, 'id'>) => void;

  // Purchases
  createPurchase: (purchase: Omit<Purchase, 'id' | 'purchaseNumber'>) => string;
  updatePurchaseStatus: (id: string, status: Purchase['status']) => void;

  // Expenses
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;

  // Inventory
  adjustStock: (productId: string, type: InventoryTransaction['type'], quantity: number, reason: string, notes?: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;

  // Settings
  updateSettings: (settings: Partial<CompanySettings>) => void;

  // Users
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      currentUser: null,
      isAuthenticated: false,
      login: (email: string, _password: string) => {
        const user = get().users.find(u => u.email === email);
        if (user && user.active) {
          set({ currentUser: user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ currentUser: null, isAuthenticated: false }),

      // Navigation
      currentPage: 'dashboard',
      setCurrentPage: (page) => set({ currentPage: page }),
      sidebarCollapsed: false,
      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // Theme
      theme: 'dark',
      toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      // Shortcuts
      shortcutsOpen: false,
      setShortcutsOpen: (open) => set({ shortcutsOpen: open }),

      // Data
      users: seedUsers,
      products: seedProducts,
      customers: seedCustomers,
      suppliers: seedSuppliers,
      categories: seedCategories,
      sales: seedSales,
      invoices: seedInvoices,
      payments: seedPayments,
      purchases: seedPurchases,
      expenses: seedExpenses,
      inventoryTransactions: seedInventoryTransactions,
      notifications: seedNotifications,
      settings: seedSettings,

      // Product CRUD
      addProduct: (product) => {
        const now = new Date().toISOString().split('T')[0];
        const newProduct: Product = { ...product, id: uuid(), createdAt: now, updatedAt: now };
        set(s => ({
          products: [...s.products, newProduct],
          categories: s.categories.map(c => c.id === product.categoryId ? { ...c, productCount: c.productCount + 1 } : c)
        }));
      },
      updateProduct: (id, updates) => {
        const now = new Date().toISOString().split('T')[0];
        set(s => ({
          products: s.products.map(p => p.id === id ? { ...p, ...updates, updatedAt: now } : p)
        }));
      },
      deleteProduct: (id) => {
        const product = get().products.find(p => p.id === id);
        set(s => ({
          products: s.products.filter(p => p.id !== id),
          categories: product ? s.categories.map(c => c.id === product.categoryId ? { ...c, productCount: Math.max(0, c.productCount - 1) } : c) : s.categories
        }));
      },

      // Customer CRUD
      addCustomer: (customer) => {
        const now = new Date().toISOString().split('T')[0];
        set(s => ({ customers: [...s.customers, { ...customer, id: uuid(), createdAt: now }] }));
      },
      updateCustomer: (id, updates) => {
        set(s => ({ customers: s.customers.map(c => c.id === id ? { ...c, ...updates } : c) }));
      },
      deleteCustomer: (id) => {
        set(s => ({ customers: s.customers.filter(c => c.id !== id) }));
      },

      // Supplier CRUD
      addSupplier: (supplier) => {
        const now = new Date().toISOString().split('T')[0];
        set(s => ({ suppliers: [...s.suppliers, { ...supplier, id: uuid(), createdAt: now }] }));
      },
      updateSupplier: (id, updates) => {
        set(s => ({ suppliers: s.suppliers.map(sup => sup.id === id ? { ...sup, ...updates } : sup) }));
      },
      deleteSupplier: (id) => {
        set(s => ({ suppliers: s.suppliers.filter(sup => sup.id !== id) }));
      },

      // Category CRUD
      addCategory: (name, description) => {
        set(s => ({ categories: [...s.categories, { id: uuid(), name, description, productCount: 0 }] }));
      },
      deleteCategory: (id) => {
        set(s => ({ categories: s.categories.filter(c => c.id !== id) }));
      },

      // Sales
      createSale: (sale) => {
        const state = get();
        const counter = state.sales.length + 1;
        const invoiceNumber = `SAL-2026-${String(counter).padStart(4, '0')}`;
        const newSale: Sale = { ...sale, id: uuid(), invoiceNumber };

        // Decrease stock for each item
        const updatedProducts = [...state.products];
        const transactions: InventoryTransaction[] = [];
        sale.items.forEach(item => {
          const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
          if (productIndex >= 0) {
            const prev = updatedProducts[productIndex].stock;
            updatedProducts[productIndex] = {
              ...updatedProducts[productIndex],
              stock: prev - item.quantity,
              updatedAt: new Date().toISOString().split('T')[0]
            };
            transactions.push({
              id: uuid(),
              productId: item.productId,
              productName: item.productName,
              type: 'stock_out',
              quantity: item.quantity,
              previousStock: prev,
              newStock: prev - item.quantity,
              reason: `Sale ${invoiceNumber}`,
              date: new Date().toISOString().split('T')[0],
              performedBy: state.currentUser?.name || 'System'
            });
          }
        });

        // Update customer
        const updatedCustomers = state.customers.map(c =>
          c.id === sale.customerId
            ? { ...c, totalPurchases: c.totalPurchases + sale.total, lastPurchase: sale.date }
            : c
        );

        set(s => ({
          sales: [newSale, ...s.sales],
          products: updatedProducts,
          inventoryTransactions: [...transactions, ...s.inventoryTransactions],
          customers: updatedCustomers,
        }));

        return invoiceNumber;
      },

      // Invoices
      createInvoice: (invoice) => {
        const state = get();
        const nextCounter = state.settings.invoiceCounter + 1;
        const invoiceNumber = `${state.settings.invoicePrefix}${String(nextCounter).padStart(4, '0')}`;
        const newInvoice: Invoice = { ...invoice, id: uuid(), invoiceNumber, paidAmount: 0 };
        set(s => ({
          invoices: [newInvoice, ...s.invoices],
          settings: { ...s.settings, invoiceCounter: nextCounter }
        }));
        // Add notification
        get().addNotification({
          type: 'invoice_created',
          title: 'Invoice Created',
          message: `${invoiceNumber} created for ${invoice.customerName}`,
        });
        return invoiceNumber;
      },
      updateInvoiceStatus: (id, status) => {
        set(s => ({ invoices: s.invoices.map(inv => inv.id === id ? { ...inv, status } : inv) }));
      },

      // Payments
      createPayment: (payment) => {
        const newPayment: Payment = { ...payment, id: uuid() };
        set(s => {
          let invoices = s.invoices;
          if (payment.invoiceId) {
            invoices = s.invoices.map(inv => {
              if (inv.id === payment.invoiceId) {
                const newPaid = inv.paidAmount + payment.amount;
                let status: Invoice['status'] = inv.status;
                if (newPaid >= inv.total) status = 'paid';
                else if (newPaid > 0) status = 'partially_paid';
                return { ...inv, paidAmount: newPaid, status };
              }
              return inv;
            });
          }
          return { payments: [newPayment, ...s.payments], invoices };
        });
        get().addNotification({
          type: 'payment_received',
          title: 'Payment Received',
          message: `₹${payment.amount.toLocaleString()} received from ${payment.customerName}`,
        });
      },

      // Purchases
      createPurchase: (purchase) => {
        const state = get();
        const nextCounter = state.settings.purchaseCounter + 1;
        const purchaseNumber = `${state.settings.purchasePrefix}${String(nextCounter).padStart(4, '0')}`;
        const newPurchase: Purchase = { ...purchase, id: uuid(), purchaseNumber };
        set(s => ({
          purchases: [newPurchase, ...s.purchases],
          settings: { ...s.settings, purchaseCounter: nextCounter }
        }));
        return purchaseNumber;
      },
      updatePurchaseStatus: (id, status) => {
        const state = get();
        const purchase = state.purchases.find(p => p.id === id);
        if (!purchase) return;

        if (status === 'received' && purchase.status !== 'received') {
          // Increase stock
          const updatedProducts = [...state.products];
          const transactions: InventoryTransaction[] = [];
          purchase.items.forEach(item => {
            const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
            if (productIndex >= 0) {
              const prev = updatedProducts[productIndex].stock;
              updatedProducts[productIndex] = {
                ...updatedProducts[productIndex],
                stock: prev + item.quantity,
                updatedAt: new Date().toISOString().split('T')[0]
              };
              transactions.push({
                id: uuid(),
                productId: item.productId,
                productName: item.productName,
                type: 'stock_in',
                quantity: item.quantity,
                previousStock: prev,
                newStock: prev + item.quantity,
                reason: `Purchase ${purchase.purchaseNumber} received`,
                date: new Date().toISOString().split('T')[0],
                performedBy: state.currentUser?.name || 'System'
              });
            }
          });

          // Update supplier
          const updatedSuppliers = state.suppliers.map(sup =>
            sup.id === purchase.supplierId
              ? { ...sup, totalPurchases: sup.totalPurchases + purchase.total, outstandingPayable: sup.outstandingPayable + purchase.total }
              : sup
          );

          set(s => ({
            purchases: s.purchases.map(p => p.id === id ? { ...p, status } : p),
            products: updatedProducts,
            inventoryTransactions: [...transactions, ...s.inventoryTransactions],
            suppliers: updatedSuppliers,
          }));

          get().addNotification({
            type: 'purchase_received',
            title: 'Purchase Received',
            message: `${purchase.purchaseNumber} from ${purchase.supplierName} has been received`,
          });
        } else {
          set(s => ({ purchases: s.purchases.map(p => p.id === id ? { ...p, status } : p) }));
        }
      },

      // Expenses
      addExpense: (expense) => {
        const now = new Date().toISOString().split('T')[0];
        set(s => ({ expenses: [...s.expenses, { ...expense, id: uuid(), createdAt: now }] }));
      },
      deleteExpense: (id) => {
        set(s => ({ expenses: s.expenses.filter(e => e.id !== id) }));
      },

      // Inventory
      adjustStock: (productId, type, quantity, reason, notes) => {
        const state = get();
        const product = state.products.find(p => p.id === productId);
        if (!product) return;

        let newStock = product.stock;
        if (type === 'stock_in' || type === 'return') newStock += quantity;
        else newStock -= quantity;

        const transaction: InventoryTransaction = {
          id: uuid(),
          productId,
          productName: product.name,
          type,
          quantity,
          previousStock: product.stock,
          newStock,
          reason,
          notes,
          date: new Date().toISOString().split('T')[0],
          performedBy: state.currentUser?.name || 'System'
        };

        set(s => ({
          products: s.products.map(p => p.id === productId ? { ...p, stock: newStock, updatedAt: new Date().toISOString().split('T')[0] } : p),
          inventoryTransactions: [transaction, ...s.inventoryTransactions],
        }));

        // Check for low stock
        if (newStock <= product.minStock && newStock > 0) {
          get().addNotification({
            type: 'low_stock',
            title: 'Low Stock Alert',
            message: `${product.name} is below minimum stock (${newStock} remaining, min: ${product.minStock})`,
          });
        } else if (newStock <= 0) {
          get().addNotification({
            type: 'out_of_stock',
            title: 'Out of Stock',
            message: `${product.name} is out of stock`,
          });
        }
      },

      // Notifications
      markNotificationRead: (id) => {
        set(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
      },
      markAllNotificationsRead: () => {
        set(s => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) }));
      },
      deleteNotification: (id) => {
        set(s => ({ notifications: s.notifications.filter(n => n.id !== id) }));
      },
      clearAllNotifications: () => {
        set({ notifications: [] });
      },
      addNotification: (notification) => {
        set(s => ({
          notifications: [{
            ...notification,
            id: uuid(),
            date: new Date().toISOString().split('T')[0],
            read: false,
          }, ...s.notifications]
        }));
      },

      // Settings
      updateSettings: (updates) => {
        set(s => ({ settings: { ...s.settings, ...updates } }));
      },

      // Users
      addUser: (user) => {
        set(s => ({ users: [...s.users, { ...user, id: uuid() }] }));
      },
      updateUser: (id, updates) => {
        set(s => ({ users: s.users.map(u => u.id === id ? { ...u, ...updates } : u) }));
      },
      deleteUser: (id) => {
        set(s => ({ users: s.users.filter(u => u.id !== id) }));
      },
    }),
    {
      name: 'stockflow-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        products: state.products,
        customers: state.customers,
        suppliers: state.suppliers,
        categories: state.categories,
        sales: state.sales,
        invoices: state.invoices,
        payments: state.payments,
        purchases: state.purchases,
        expenses: state.expenses,
        inventoryTransactions: state.inventoryTransactions,
        notifications: state.notifications,
        settings: state.settings,
        users: state.users,
      })
    }
  )
);
