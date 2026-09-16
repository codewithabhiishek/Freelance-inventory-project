# 📦 StockFlow — Enterprise Inventory & Billing Management System

> **Client Project Showcase**  
> Custom-built freelance enterprise web application delivered for a retail and distribution client to streamline multi-location inventory tracking, automated GST-compliant billing, supplier procurement, and financial reporting.

---

## 🌟 Project Overview

**StockFlow** is a comprehensive, production-grade inventory management and point-of-sale (POS) billing platform engineered to replace fragmented spreadsheets and legacy desktop accounting software.

Built with a fast, modern web stack (**React 18**, **TypeScript**, **Tailwind CSS**, and **Zustand**), the application delivers real-time stock reconciliation, automated inventory deduction on sales, procurement lifecycle tracking, customer credit monitoring, and interactive financial analytics.

### 💼 Business Problem & Solution
- **The Challenge:** The client operated across multiple product categories with high daily transaction volumes. They struggled with stockouts, delayed reorders, manual GST billing errors, and lack of visibility into inventory valuation.
- **The Solution:** StockFlow provides a unified, single-pane-of-glass dashboard that enforces inventory consistency across every sale, purchase, and manual adjustment, with instant invoice generation and executive-level financial reporting.

---

## ✨ Key Modules & Capabilities

### 1. 📊 Executive Dashboard & Real-Time KPIs
- **Live Business Metrics:** Real-time revenue counters, net profit margins, inventory valuation, and active invoice tracking.
- **Revenue & Expense Trend Analysis:** Interactive multi-axis charts powered by Recharts with time-range filtering.
- **Low-Stock Early Warning:** Proactive indicators highlighting items nearing or below safety reorder levels.
- **Recent Activity Feed:** Real-time audit log of sales, procurement receipts, and stock adjustments.

### 2. 🏷️ Product & Inventory Control
- **SKU & Barcode Management:** Full catalog management with categories, units of measure, cost price, and selling price.
- **Automated Stock Adjustments:** Inventory automatically increments when purchase orders are received and decrements when invoices are finalized.
- **Stock Audit & History:** Complete transaction trail for every item (damage write-offs, incoming restocks, physical count audits).
- **Bulk Operations & Export:** Fast search, multi-column sorting, and one-click CSV export for offline audits.

### 3. 🧾 Sales & Smart Billing (Invoicing)
- **Point-of-Sale Billing:** Fast checkout with item search, quantity adjustment, and line-item discount calculation.
- **GST & Tax Compliance:** Automatic tax breakdown (CGST/SGST/IGST calculation) with customizable rates.
- **Sequential Invoicing:** Automated, tamper-proof invoice numbering sequence (`INV-2026-XXXX`).
- **Payment Lifecycle:** Track Paid, Partially Paid, and Overdue statuses with multiple payment modes (Cash, UPI, Card, Bank Transfer).
- **Print & PDF Ready:** Clean print-optimized layout for immediate receipt and invoice printing.

### 4. 🚚 Supplier Procurement & Purchase Orders
- **Purchase Order Lifecycle:** Draft, Issue, Received, and Cancelled state machines.
- **Automated Receiving:** Mark purchase orders as received to instantly increment warehouse inventory levels.
- **Vendor Balance Tracking:** Maintain running accounts of amounts owed to suppliers with payment logging.

### 5. 👥 Customer & Credit Management
- **Customer CRM:** Contact details, delivery addresses, GSTIN validation, and lifetime purchase history.
- **Credit & Receivables:** Monitor outstanding customer dues, credit limits, and historical invoice settlements.

### 6. 📈 Financial Reporting & Analytics
- **P&L Breakdown:** Monthly and annual revenue vs. operational expenses.
- **Inventory Valuation Report:** Real-time calculation of total asset value based on weighted cost prices.
- **Category Profitability:** Visual breakdown of top revenue-driving categories and high-margin SKUs.

### 7. 🔐 Role-Based Access Control (RBAC)
- **Admin:** Full access to financial settings, user permissions, tax configurations, and system data.
- **Store Manager:** Catalog management, stock adjustments, purchase orders, and operational reports.
- **Billing Staff:** Point-of-sale invoicing, customer management, and receipt printing.

### 8. ⚡ Power-User Features
- **Global Command Palette:** Hit `⌘K` (or `Ctrl+K`) anywhere to jump to products, customers, invoices, or quick actions.
- **Data Persistence:** Local-first reactive state management with Zustand and local storage synchronization.
- **Keyboard-Optimized Navigation:** Fast data entry workflows designed for busy retail cashiers.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18.2 | Component architecture & concurrent rendering |
| **Language** | TypeScript 5.7 | Strict type safety across business data models |
| **Styling & Design** | Tailwind CSS v4 | Custom enterprise design system & responsive layout |
| **State Management** | Zustand 5 | Low-overhead reactive store with persistent state |
| **Data Visualization** | Recharts 2.10 | Interactive revenue, category, and inventory charts |
| **Icons & UI** | Lucide React | Consistent, lightweight iconography |
| **Animation & Motion** | Framer Motion | Smooth page transitions and modal micro-interactions |
| **Build Tooling** | Vite 6 | Lightning-fast HMR and optimized production bundle |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/codewithabhiishek/StockFlow-Inventory.git

# 2. Navigate to the project directory
cd StockFlow-Inventory

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

The application will be running locally at `http://localhost:5173/`.

### Production Build

```bash
# Compile and build production bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 🔑 Demo Access Credentials

The application includes realistic sample retail data and preconfigured role accounts for demonstration:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `arjun@stockflow.io` | `admin123` | Full system access & financial controls |
| **Store Manager** | `priya@stockflow.io` | `admin123` | Inventory, procurement & stock audits |
| **Billing Cashier** | `rahul@stockflow.io` | `admin123` | Invoicing, POS checkout & customer records |

---

## 📁 Project Architecture

```text
StockFlow/
├── public/              # Static assets & icons
├── src/
│   ├── components/      # Reusable UI primitives & layout shells
│   │   ├── Layout.tsx   # Responsive sidebar navigation & top bar
│   │   ├── ui.tsx       # Standardized buttons, inputs, badges, modals
│   │   └── CommandPalette.tsx # Global ⌘K search overlay
│   ├── data/            # Seed data & business model mocks
│   │   └── seed.ts      # Default catalog, customers, and transactions
│   ├── pages/           # Application views & route containers
│   │   ├── Auth.tsx        # Login & credential switching
│   │   ├── Dashboard.tsx   # KPI metric cards & sales trends
│   │   ├── Products.tsx    # Product catalog management
│   │   ├── Inventory.tsx   # Stock tracking & adjustment logs
│   │   ├── Sales.tsx       # POS sales creation
│   │   ├── Invoices.tsx    # Invoice generator & print views
│   │   ├── Purchases.tsx   # Supplier purchase orders
│   │   ├── Customers.tsx   # Customer credit & profile records
│   │   ├── Suppliers.tsx   # Vendor management
│   │   ├── Expenses.tsx    # Operational expense tracking
│   │   ├── Reports.tsx     # Financial analytics & charts
│   │   ├── Settings.tsx    # Tax rates & business profile
│   │   └── Users.tsx       # Team member RBAC management
│   ├── store/           # Zustand state management slices
│   ├── types/           # TypeScript interfaces & domain schemas
│   ├── index.css        # Enterprise design tokens & animations
│   ├── App.tsx          # Application routing & context providers
│   └── main.tsx         # Application entry point
├── package.json         # Dependencies & project scripts
├── tsconfig.json        # TypeScript compiler configuration
└── vite.config.js       # Vite build configuration
```

---

## 📋 Client Deliverable Notes

- **Delivery Date**: September 2026
- **Deliverable Scope**: Full-featured single-page application with mock persistence, responsive tablet/desktop UI, invoice print layouts, and reporting suite.
- **Extensibility**: Designed with modular Zustand stores and clean separation of concerns, enabling straightforward migration to a backend database (PostgreSQL / Supabase / Express API) when needed.

---

## 👨‍💻 Developer & Author

**Abhishek Jain**  
- GitHub: [@codewithabhiishek](https://github.com/codewithabhiishek)  
- Email: [socials.abhiishek@gmail.com](mailto:socials.abhiishek@gmail.com)

*Built as a custom freelance client solution.*
