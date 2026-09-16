import { Product, Customer, Supplier, Category, Sale, Invoice, Payment, Purchase, Expense, InventoryTransaction, Notification, User, CompanySettings } from '../types';

export const seedUsers: User[] = [
  { id: 'u1', name: 'Arjun Mehta', email: 'arjun@stockflow.io', role: 'admin', active: true },
  { id: 'u2', name: 'Priya Sharma', email: 'priya@stockflow.io', role: 'manager', active: true },
  { id: 'u3', name: 'Rahul Verma', email: 'rahul@stockflow.io', role: 'staff', active: true },
];

export const seedCategories: Category[] = [
  { id: 'cat1', name: 'Computer Peripherals', description: 'Keyboards, mice, webcams', productCount: 4 },
  { id: 'cat2', name: 'Displays & Monitors', description: 'Monitors and screens', productCount: 2 },
  { id: 'cat3', name: 'Storage Devices', description: 'External drives and SSDs', productCount: 2 },
  { id: 'cat4', name: 'Networking', description: 'Routers, hubs, adapters', productCount: 2 },
  { id: 'cat5', name: 'Audio', description: 'Headphones, speakers, microphones', productCount: 2 },
  { id: 'cat6', name: 'Accessories', description: 'Stands, cables, adapters', productCount: 2 },
];

export const seedProducts: Product[] = [
  { id: 'p1', name: 'Wireless Mechanical Keyboard', sku: 'KB-001', barcode: '8901234567001', categoryId: 'cat1', description: 'Compact 75% wireless mechanical keyboard with hot-swappable switches', costPrice: 3200, sellingPrice: 5499, taxRate: 18, stock: 45, minStock: 10, supplierId: 's1', status: 'active', createdAt: '2025-11-15', updatedAt: '2026-01-10' },
  { id: 'p2', name: 'Ergonomic Wireless Mouse', sku: 'MS-002', barcode: '8901234567002', categoryId: 'cat1', description: 'Vertical ergonomic mouse with 6 buttons', costPrice: 850, sellingPrice: 1499, taxRate: 18, stock: 120, minStock: 20, supplierId: 's1', status: 'active', createdAt: '2025-10-20', updatedAt: '2026-01-08' },
  { id: 'p3', name: 'USB-C Multiport Hub 7-in-1', sku: 'HB-003', barcode: '8901234567003', categoryId: 'cat4', description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader', costPrice: 1100, sellingPrice: 2199, taxRate: 18, stock: 8, minStock: 15, supplierId: 's2', status: 'active', createdAt: '2025-09-05', updatedAt: '2026-01-12' },
  { id: 'p4', name: '27" 4K IPS Monitor', sku: 'MN-004', barcode: '8901234567004', categoryId: 'cat2', description: '27-inch 4K UHD IPS display with USB-C connectivity', costPrice: 18500, sellingPrice: 28999, taxRate: 18, stock: 12, minStock: 5, supplierId: 's3', status: 'active', createdAt: '2025-08-12', updatedAt: '2026-01-05' },
  { id: 'p5', name: 'Adjustable Laptop Stand', sku: 'LS-005', barcode: '8901234567005', categoryId: 'cat6', description: 'Aluminum adjustable laptop stand with cable management', costPrice: 650, sellingPrice: 1299, taxRate: 18, stock: 67, minStock: 15, supplierId: 's4', status: 'active', createdAt: '2025-10-01', updatedAt: '2026-01-11' },
  { id: 'p6', name: 'HD Webcam 1080p', sku: 'WC-006', barcode: '8901234567006', categoryId: 'cat1', description: '1080p webcam with auto-focus and noise cancellation mic', costPrice: 1400, sellingPrice: 2799, taxRate: 18, stock: 34, minStock: 10, supplierId: 's2', status: 'active', createdAt: '2025-11-20', updatedAt: '2026-01-09' },
  { id: 'p7', name: 'Portable SSD 1TB', sku: 'SD-007', barcode: '8901234567007', categoryId: 'cat3', description: 'Portable SSD with 1050MB/s read speed', costPrice: 4200, sellingPrice: 6999, taxRate: 18, stock: 3, minStock: 8, supplierId: 's3', status: 'active', createdAt: '2025-07-15', updatedAt: '2026-01-13' },
  { id: 'p8', name: 'Noise-Cancelling Headphones', sku: 'HP-008', barcode: '8901234567008', categoryId: 'cat5', description: 'Over-ear ANC headphones with 30hr battery', costPrice: 2800, sellingPrice: 4999, taxRate: 18, stock: 28, minStock: 10, supplierId: 's1', status: 'active', createdAt: '2025-12-01', updatedAt: '2026-01-07' },
  { id: 'p9', name: 'Wireless Charging Pad', sku: 'CP-009', barcode: '8901234567009', categoryId: 'cat6', description: '15W Qi wireless charging pad with LED indicator', costPrice: 350, sellingPrice: 799, taxRate: 18, stock: 0, minStock: 20, supplierId: 's4', status: 'active', createdAt: '2025-06-10', updatedAt: '2026-01-14' },
  { id: 'p10', name: 'Condenser USB Microphone', sku: 'MC-010', barcode: '8901234567010', categoryId: 'cat5', description: 'Cardioid condenser mic with pop filter and stand', costPrice: 1800, sellingPrice: 3499, taxRate: 18, stock: 19, minStock: 8, supplierId: 's2', status: 'active', createdAt: '2025-11-05', updatedAt: '2026-01-06' },
  { id: 'p11', name: '24" FHD Monitor', sku: 'MN-011', barcode: '8901234567011', categoryId: 'cat2', description: '24-inch Full HD IPS monitor with 75Hz refresh', costPrice: 7200, sellingPrice: 11499, taxRate: 18, stock: 22, minStock: 5, supplierId: 's3', status: 'active', createdAt: '2025-09-20', updatedAt: '2026-01-04' },
  { id: 'p12', name: 'NVMe External SSD 500GB', sku: 'SD-012', barcode: '8901234567012', categoryId: 'cat3', description: 'Compact NVMe external SSD with 2000MB/s speed', costPrice: 2800, sellingPrice: 4499, taxRate: 18, stock: 41, minStock: 10, supplierId: 's3', status: 'active', createdAt: '2025-10-15', updatedAt: '2026-01-03' },
];

export const seedCustomers: Customer[] = [
  { id: 'c1', name: 'Vikram Singh', company: 'TechVista Solutions', email: 'vikram@techvista.com', phone: '+91 98765 43210', address: '42, MG Road, Bangalore', gstin: '29AABCT1234F1ZP', totalPurchases: 187500, outstandingBalance: 28999, lastPurchase: '2026-01-10', status: 'active', createdAt: '2025-06-15' },
  { id: 'c2', name: 'Ananya Patel', company: 'DesignCraft Studio', email: 'ananya@designcraft.in', phone: '+91 87654 32109', address: '15, Linking Road, Mumbai', gstin: '27AADCD5678G1ZQ', totalPurchases: 94200, outstandingBalance: 0, lastPurchase: '2026-01-08', status: 'active', createdAt: '2025-07-20' },
  { id: 'c3', name: 'Karthik Reddy', company: 'DataPrime Analytics', email: 'karthik@dataprime.io', phone: '+91 76543 21098', address: '88, Cyber Towers, Hyderabad', gstin: '36AADCD9012H1ZR', totalPurchases: 245000, outstandingBalance: 45998, lastPurchase: '2026-01-12', status: 'active', createdAt: '2025-05-10' },
  { id: 'c4', name: 'Meera Nair', company: '', email: 'meera.nair@gmail.com', phone: '+91 65432 10987', address: '23, Park Street, Kolkata', totalPurchases: 32498, outstandingBalance: 0, lastPurchase: '2025-12-28', status: 'active', createdAt: '2025-09-01' },
  { id: 'c5', name: 'Aditya Joshi', company: 'CloudNine IT Services', email: 'aditya@cloudnine.co.in', phone: '+91 54321 09876', address: '7, IT Park, Pune', gstin: '27AAECC3456J1ZS', totalPurchases: 312800, outstandingBalance: 15499, lastPurchase: '2026-01-14', status: 'active', createdAt: '2025-04-05' },
  { id: 'c6', name: 'Sneha Gupta', company: 'Pixel Perfect Media', email: 'sneha@pixelperfect.com', phone: '+91 43210 98765', address: '56, Sector 18, Noida', gstin: '09AADCP7890K1ZT', totalPurchases: 67800, outstandingBalance: 0, lastPurchase: '2026-01-05', status: 'active', createdAt: '2025-08-12' },
  { id: 'c7', name: 'Rohan Malhotra', company: '', email: 'rohan.m@yahoo.com', phone: '+91 32109 87654', address: '12, Anna Nagar, Chennai', totalPurchases: 18999, outstandingBalance: 6999, lastPurchase: '2026-01-11', status: 'active', createdAt: '2025-11-20' },
  { id: 'c8', name: 'Divya Krishnan', company: 'GreenLeaf Organics', email: 'divya@greenleaf.in', phone: '+91 21098 76543', address: '34, Residency Road, Bangalore', gstin: '29AADCG1234L1ZU', totalPurchases: 54200, outstandingBalance: 0, lastPurchase: '2025-12-15', status: 'inactive', createdAt: '2025-07-01' },
];

export const seedSuppliers: Supplier[] = [
  { id: 's1', name: 'Rajesh Kumar', company: 'PeriTech Distributors', email: 'rajesh@peritech.com', phone: '+91 99887 76655', address: 'Plot 45, Industrial Area, Delhi', gstin: '07AABCP2345M1ZV', productsSupplied: ['p1', 'p2', 'p8'], totalPurchases: 456000, outstandingPayable: 82000, status: 'active', createdAt: '2025-03-10' },
  { id: 's2', name: 'Sanjay Agarwal', company: 'Digital Wave Electronics', email: 'sanjay@digitalwave.in', phone: '+91 88776 65544', address: '22, Electronics City, Bangalore', gstin: '29AABCD5678N1ZW', productsSupplied: ['p3', 'p6', 'p10'], totalPurchases: 289000, outstandingPayable: 0, status: 'active', createdAt: '2025-04-15' },
  { id: 's3', name: 'Amit Shah', company: 'ScreenTech India', email: 'amit@screentech.co.in', phone: '+91 77665 54433', address: '78, SEEPZ, Andheri East, Mumbai', gstin: '27AABCS9012O1ZX', productsSupplied: ['p4', 'p7', 'p11', 'p12'], totalPurchases: 678000, outstandingPayable: 125000, status: 'active', createdAt: '2025-02-20' },
  { id: 's4', name: 'Neha Desai', company: 'AccesSource Trading', email: 'neha@accessource.com', phone: '+91 66554 43322', address: '15, Trade Center, Ahmedabad', gstin: '24AABCA3456P1ZY', productsSupplied: ['p5', 'p9'], totalPurchases: 134000, outstandingPayable: 0, status: 'active', createdAt: '2025-05-01' },
];

export const seedSales: Sale[] = [
  { id: 'sl1', invoiceNumber: 'SAL-2026-0001', customerId: 'c1', customerName: 'Vikram Singh', items: [{ productId: 'p1', productName: 'Wireless Mechanical Keyboard', quantity: 3, unitPrice: 5499, discount: 5, taxRate: 18, total: 15672 }], subtotal: 16497, discount: 825, tax: 2832, total: 18504, status: 'completed', date: '2026-01-10', notes: '' },
  { id: 'sl2', invoiceNumber: 'SAL-2026-0002', customerId: 'c3', customerName: 'Karthik Reddy', items: [{ productId: 'p4', productName: '27" 4K IPS Monitor', quantity: 2, unitPrice: 28999, discount: 0, taxRate: 18, total: 57998 }, { productId: 'p5', productName: 'Adjustable Laptop Stand', quantity: 2, unitPrice: 1299, discount: 0, taxRate: 18, total: 2598 }], subtotal: 60596, discount: 0, tax: 10907, total: 71503, status: 'completed', date: '2026-01-12' },
  { id: 'sl3', invoiceNumber: 'SAL-2026-0003', customerId: 'c5', customerName: 'Aditya Joshi', items: [{ productId: 'p7', productName: 'Portable SSD 1TB', quantity: 5, unitPrice: 6999, discount: 10, taxRate: 18, total: 31496 }], subtotal: 34995, discount: 3500, tax: 5669, total: 37164, status: 'completed', date: '2026-01-14' },
  { id: 'sl4', invoiceNumber: 'SAL-2026-0004', customerId: 'c2', customerName: 'Ananya Patel', items: [{ productId: 'p8', productName: 'Noise-Cancelling Headphones', quantity: 1, unitPrice: 4999, discount: 0, taxRate: 18, total: 4999 }, { productId: 'p10', productName: 'Condenser USB Microphone', quantity: 1, unitPrice: 3499, discount: 0, taxRate: 18, total: 3499 }], subtotal: 8498, discount: 0, tax: 1530, total: 10028, status: 'completed', date: '2026-01-08' },
  { id: 'sl5', invoiceNumber: 'SAL-2026-0005', customerId: 'c6', customerName: 'Sneha Gupta', items: [{ productId: 'p2', productName: 'Ergonomic Wireless Mouse', quantity: 10, unitPrice: 1499, discount: 5, taxRate: 18, total: 14241 }], subtotal: 14990, discount: 750, tax: 2564, total: 16804, status: 'completed', date: '2026-01-05' },
  { id: 'sl6', invoiceNumber: 'SAL-2025-0048', customerId: 'c4', customerName: 'Meera Nair', items: [{ productId: 'p6', productName: 'HD Webcam 1080p', quantity: 1, unitPrice: 2799, discount: 0, taxRate: 18, total: 2799 }], subtotal: 2799, discount: 0, tax: 504, total: 3303, status: 'completed', date: '2025-12-28' },
  { id: 'sl7', invoiceNumber: 'SAL-2026-0006', customerId: 'c7', customerName: 'Rohan Malhotra', items: [{ productId: 'p7', productName: 'Portable SSD 1TB', quantity: 1, unitPrice: 6999, discount: 0, taxRate: 18, total: 6999 }], subtotal: 6999, discount: 0, tax: 1260, total: 8259, status: 'completed', date: '2026-01-11' },
];

export const seedInvoices: Invoice[] = [
  { id: 'inv1', invoiceNumber: 'INV-2026-0001', customerId: 'c1', customerName: 'Vikram Singh', items: [{ productId: 'p1', productName: 'Wireless Mechanical Keyboard', quantity: 5, unitPrice: 5499, discount: 0, taxRate: 18, total: 27495 }], subtotal: 27495, discount: 0, tax: 4949, total: 32444, paidAmount: 32444, status: 'paid', date: '2026-01-02', dueDate: '2026-01-16', notes: 'Net 14 payment terms' },
  { id: 'inv2', invoiceNumber: 'INV-2026-0002', customerId: 'c3', customerName: 'Karthik Reddy', items: [{ productId: 'p4', productName: '27" 4K IPS Monitor', quantity: 2, unitPrice: 28999, discount: 0, taxRate: 18, total: 57998 }, { productId: 'p3', productName: 'USB-C Multiport Hub 7-in-1', quantity: 2, unitPrice: 2199, discount: 0, taxRate: 18, total: 4398 }], subtotal: 62396, discount: 0, tax: 11231, total: 73627, paidAmount: 27629, status: 'partially_paid', date: '2026-01-05', dueDate: '2026-01-19', notes: '' },
  { id: 'inv3', invoiceNumber: 'INV-2026-0003', customerId: 'c5', customerName: 'Aditya Joshi', items: [{ productId: 'p11', productName: '24" FHD Monitor', quantity: 3, unitPrice: 11499, discount: 5, taxRate: 18, total: 32772 }], subtotal: 34497, discount: 1725, tax: 5897, total: 38669, paidAmount: 0, status: 'overdue', date: '2025-12-20', dueDate: '2026-01-03', notes: 'Urgent delivery requested' },
  { id: 'inv4', invoiceNumber: 'INV-2026-0004', customerId: 'c7', customerName: 'Rohan Malhotra', items: [{ productId: 'p7', productName: 'Portable SSD 1TB', quantity: 1, unitPrice: 6999, discount: 0, taxRate: 18, total: 6999 }], subtotal: 6999, discount: 0, tax: 1260, total: 8259, paidAmount: 0, status: 'sent', date: '2026-01-11', dueDate: '2026-01-25', notes: '' },
  { id: 'inv5', invoiceNumber: 'INV-2026-0005', customerId: 'c2', customerName: 'Ananya Patel', items: [{ productId: 'p8', productName: 'Noise-Cancelling Headphones', quantity: 2, unitPrice: 4999, discount: 0, taxRate: 18, total: 9998 }], subtotal: 9998, discount: 0, tax: 1800, total: 11798, paidAmount: 11798, status: 'paid', date: '2026-01-08', dueDate: '2026-01-22', notes: '' },
  { id: 'inv6', invoiceNumber: 'INV-2026-0006', customerId: 'c6', customerName: 'Sneha Gupta', items: [{ productId: 'p12', productName: 'NVMe External SSD 500GB', quantity: 4, unitPrice: 4499, discount: 0, taxRate: 18, total: 17996 }], subtotal: 17996, discount: 0, tax: 3239, total: 21235, paidAmount: 21235, status: 'paid', date: '2026-01-06', dueDate: '2026-01-20', notes: '' },
];

export const seedPayments: Payment[] = [
  { id: 'pay1', invoiceId: 'inv1', invoiceNumber: 'INV-2026-0001', customerId: 'c1', customerName: 'Vikram Singh', amount: 32444, method: 'bank_transfer', date: '2026-01-10', status: 'completed', notes: '' },
  { id: 'pay2', invoiceId: 'inv2', invoiceNumber: 'INV-2026-0002', customerId: 'c3', customerName: 'Karthik Reddy', amount: 27629, method: 'upi', date: '2026-01-08', status: 'completed', notes: 'Partial payment' },
  { id: 'pay3', invoiceId: 'inv5', invoiceNumber: 'INV-2026-0005', customerId: 'c2', customerName: 'Ananya Patel', amount: 11798, method: 'card', date: '2026-01-08', status: 'completed', notes: '' },
  { id: 'pay4', invoiceId: 'inv6', invoiceNumber: 'INV-2026-0006', customerId: 'c6', customerName: 'Sneha Gupta', amount: 21235, method: 'bank_transfer', date: '2026-01-09', status: 'completed', notes: '' },
];

export const seedPurchases: Purchase[] = [
  { id: 'pur1', purchaseNumber: 'PO-2026-0001', supplierId: 's1', supplierName: 'PeriTech Distributors', items: [{ productId: 'p1', productName: 'Wireless Mechanical Keyboard', quantity: 50, costPrice: 3200, taxRate: 18, total: 160000 }, { productId: 'p2', productName: 'Ergonomic Wireless Mouse', quantity: 100, costPrice: 850, taxRate: 18, total: 85000 }], subtotal: 245000, tax: 44100, discount: 5000, total: 284100, status: 'received', date: '2026-01-03', notes: '' },
  { id: 'pur2', purchaseNumber: 'PO-2026-0002', supplierId: 's3', supplierName: 'ScreenTech India', items: [{ productId: 'p4', productName: '27" 4K IPS Monitor', quantity: 10, costPrice: 18500, taxRate: 18, total: 185000 }, { productId: 'p7', productName: 'Portable SSD 1TB', quantity: 20, costPrice: 4200, taxRate: 18, total: 84000 }], subtotal: 269000, tax: 48420, discount: 10000, total: 307420, status: 'received', date: '2026-01-06', notes: '' },
  { id: 'pur3', purchaseNumber: 'PO-2026-0003', supplierId: 's2', supplierName: 'Digital Wave Electronics', items: [{ productId: 'p3', productName: 'USB-C Multiport Hub 7-in-1', quantity: 30, costPrice: 1100, taxRate: 18, total: 33000 }, { productId: 'p6', productName: 'HD Webcam 1080p', quantity: 25, costPrice: 1400, taxRate: 18, total: 35000 }], subtotal: 68000, tax: 12240, discount: 0, total: 80240, status: 'ordered', date: '2026-01-12', notes: 'Expected delivery: Jan 18' },
  { id: 'pur4', purchaseNumber: 'PO-2026-0004', supplierId: 's4', supplierName: 'AccesSource Trading', items: [{ productId: 'p5', productName: 'Adjustable Laptop Stand', quantity: 40, costPrice: 650, taxRate: 18, total: 26000 }, { productId: 'p9', productName: 'Wireless Charging Pad', quantity: 50, costPrice: 350, taxRate: 18, total: 17500 }], subtotal: 43500, tax: 7830, discount: 2000, total: 49330, status: 'received', date: '2025-12-28', notes: '' },
];

export const seedExpenses: Expense[] = [
  { id: 'exp1', title: 'Office Rent - January', category: 'rent', amount: 45000, date: '2026-01-01', paymentMethod: 'bank_transfer', notes: 'Monthly rent for warehouse + office', createdAt: '2026-01-01' },
  { id: 'exp2', title: 'Electricity Bill', category: 'utilities', amount: 8500, date: '2026-01-05', paymentMethod: 'bank_transfer', notes: 'December electricity', createdAt: '2026-01-05' },
  { id: 'exp3', title: 'Staff Salaries', category: 'salaries', amount: 185000, date: '2026-01-01', paymentMethod: 'bank_transfer', notes: 'Monthly payroll - 5 employees', createdAt: '2026-01-01' },
  { id: 'exp4', title: 'Google Ads Campaign', category: 'marketing', amount: 15000, date: '2026-01-08', paymentMethod: 'card', notes: 'January ad spend', createdAt: '2026-01-08' },
  { id: 'exp5', title: 'Courier & Shipping', category: 'transport', amount: 12000, date: '2026-01-10', paymentMethod: 'cash', notes: 'Weekly shipments', createdAt: '2026-01-10' },
  { id: 'exp6', title: 'AWS Hosting', category: 'software', amount: 4500, date: '2026-01-01', paymentMethod: 'card', notes: 'Monthly cloud hosting', createdAt: '2026-01-01' },
  { id: 'exp7', title: 'AC Maintenance', category: 'maintenance', amount: 3500, date: '2026-01-12', paymentMethod: 'cash', notes: 'Quarterly service', createdAt: '2026-01-12' },
  { id: 'exp8', title: 'Internet Bill', category: 'utilities', amount: 2500, date: '2026-01-03', paymentMethod: 'bank_transfer', notes: 'Fiber connection', createdAt: '2026-01-03' },
];

export const seedInventoryTransactions: InventoryTransaction[] = [
  { id: 'it1', productId: 'p1', productName: 'Wireless Mechanical Keyboard', type: 'stock_in', quantity: 50, previousStock: 0, newStock: 50, reason: 'Purchase PO-2026-0001 received', date: '2026-01-03', performedBy: 'Arjun Mehta' },
  { id: 'it2', productId: 'p1', productName: 'Wireless Mechanical Keyboard', type: 'stock_out', quantity: 5, previousStock: 50, newStock: 45, reason: 'Sale SAL-2026-0001', date: '2026-01-10', performedBy: 'Priya Sharma' },
  { id: 'it3', productId: 'p7', productName: 'Portable SSD 1TB', type: 'stock_out', quantity: 5, previousStock: 8, newStock: 3, reason: 'Sale SAL-2026-0003', date: '2026-01-14', performedBy: 'Priya Sharma' },
  { id: 'it4', productId: 'p7', productName: 'Portable SSD 1TB', type: 'stock_out', quantity: 1, previousStock: 4, newStock: 3, reason: 'Sale SAL-2026-0006', date: '2026-01-11', performedBy: 'Rahul Verma' },
  { id: 'it5', productId: 'p4', productName: '27" 4K IPS Monitor', type: 'stock_in', quantity: 10, previousStock: 5, newStock: 15, reason: 'Purchase PO-2026-0002 received', date: '2026-01-06', performedBy: 'Arjun Mehta' },
  { id: 'it6', productId: 'p4', productName: '27" 4K IPS Monitor', type: 'stock_out', quantity: 3, previousStock: 15, newStock: 12, reason: 'Sales INV-2026-0001, SAL-2026-0002', date: '2026-01-12', performedBy: 'Priya Sharma' },
  { id: 'it7', productId: 'p9', productName: 'Wireless Charging Pad', type: 'stock_out', quantity: 20, previousStock: 20, newStock: 0, reason: 'Bulk sale to retail partner', date: '2026-01-09', performedBy: 'Arjun Mehta' },
  { id: 'it8', productId: 'p3', productName: 'USB-C Multiport Hub 7-in-1', type: 'stock_out', quantity: 7, previousStock: 15, newStock: 8, reason: 'Multiple sales', date: '2026-01-12', performedBy: 'Priya Sharma' },
];

export const seedNotifications: Notification[] = [
  { id: 'n1', type: 'low_stock', title: 'Low Stock Alert', message: 'USB-C Multiport Hub 7-in-1 is below minimum stock (8 remaining, min: 15)', read: false, date: '2026-01-14', link: '/inventory' },
  { id: 'n2', type: 'out_of_stock', title: 'Out of Stock', message: 'Wireless Charging Pad is out of stock', read: false, date: '2026-01-14', link: '/inventory' },
  { id: 'n3', type: 'low_stock', title: 'Low Stock Alert', message: 'Portable SSD 1TB is below minimum stock (3 remaining, min: 8)', read: false, date: '2026-01-14', link: '/inventory' },
  { id: 'n4', type: 'overdue_invoice', title: 'Overdue Invoice', message: 'INV-2026-0003 for Aditya Joshi (₹38,669) is overdue', read: false, date: '2026-01-13', link: '/invoices' },
  { id: 'n5', type: 'payment_received', title: 'Payment Received', message: '₹21,235 received from Sneha Gupta for INV-2026-0006', read: true, date: '2026-01-09', link: '/payments' },
  { id: 'n6', type: 'purchase_received', title: 'Purchase Received', message: 'PO-2026-0002 from ScreenTech India has been received', read: true, date: '2026-01-06', link: '/purchases' },
];

export const seedSettings: CompanySettings = {
  name: 'StockFlow Electronics',
  address: '42, Tech Park, Whitefield, Bangalore - 560066',
  phone: '+91 80 4567 8900',
  email: 'contact@stockflow.io',
  gstin: '29AABCS1234F1Z0',
  currency: 'INR',
  currencySymbol: '₹',
  taxDefault: 18,
  invoicePrefix: 'INV-2026-',
  invoiceCounter: 7,
  purchasePrefix: 'PO-2026-',
  purchaseCounter: 5,
};
