# StockFlow - Inventory & Billing Management System

A professional, production-ready inventory and billing management system built with modern web technologies.

## 🎨 Design & UX Improvements

### Visual Polish
- **Sophisticated Dark Theme**: Premium neutral palette with subtle gradients and glows
- **Smooth Animations**: 20+ custom animations including fade-ins, slide-ins, scale effects, and staggered reveals
- **Micro-interactions**: Hover effects, button press animations, smooth transitions throughout
- **Professional Typography**: IBM Plex Sans with clear hierarchy
- **Card Design**: Inner glows, subtle gradients, hover lift effects
- **Status Indicators**: Animated notification dots, progress bars, and status badges

### Animation System
- **Page Transitions**: Smooth fade-in animations for all pages
- **Staggered Reveals**: Cards and list items appear with cascading delays
- **Chart Animations**: Animated data visualization with smooth transitions
- **Counter Animations**: Animated number counters for KPIs
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: Slide-in animations with auto-dismiss
- **Modal Transitions**: Scale and fade animations with backdrop blur
- **Dropdown Menus**: Slide-down animations with border highlights
- **Table Rows**: Staggered fade-in with hover highlights
- **Progress Bars**: Animated fill effects

### Professional Features
- **Global Search**: Command palette with ⌘K shortcut, animated results
- **Notification Center**: Animated notification panel with type-based icons
- **Responsive Design**: Mobile-first with collapsible sidebar
- **Role-based Access**: Admin, Manager, Staff permissions
- **Data Persistence**: LocalStorage with Zustand
- **CSV Export**: Export products, sales, expenses, and reports
- **Print Support**: Optimized print styles for invoices

## 🚀 Key Features

### Dashboard
- Real-time KPI cards with animated counters
- Revenue trend chart with gradient fills
- Inventory movement visualization
- Low stock alerts with progress indicators
- Recent sales feed
- Top products with revenue bars
- Profit summary with color-coded metrics

### Product Management
- Full CRUD operations
- Advanced filtering and search
- Sortable columns
- Bulk selection and deletion
- CSV export
- Stock status indicators
- Category management

### Inventory Control
- Real-time stock tracking
- Automatic stock adjustments on sales/purchases
- Manual stock adjustments with history
- Low stock alerts
- Inventory value tracking
- Transaction history

### Sales & Invoicing
- Create sales with automatic stock deduction
- Professional invoice generation
- Automatic invoice numbering
- Payment tracking
- Multiple payment methods
- Invoice status management
- Print-ready invoices

### Customer & Supplier Management
- Complete contact management
- Purchase history tracking
- Outstanding balance monitoring
- GSTIN support
- Status management

### Purchase Orders
- Create purchase orders
- Automatic stock increase on receipt
- Supplier tracking
- Order status management
- Cost tracking

### Expense Management
- Categorized expense tracking
- Multiple payment methods
- Monthly summaries
- Category breakdowns
- CSV export

### Reports & Analytics
- Sales reports with trends
- Revenue vs expenses charts
- Inventory valuation reports
- Customer analysis
- Expense breakdowns with pie charts
- Top products analysis
- Profit/loss summaries
- Date range filtering
- CSV export

### Settings
- Company profile management
- Invoice numbering configuration
- Category management
- Tax settings
- Currency selection

### User Management
- Role-based access control
- User activation/deactivation
- Permission management

## 🎯 Technical Stack

- **React 18** with TypeScript
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **Vite** for build tooling

## 🎨 Design System

### Colors
- Background: `#090A0C`
- Surface: `#101214`
- Elevated: `#151719`
- Borders: `#25282C`
- Text Primary: `#F2F3F5`
- Text Secondary: `#9A9EA5`
- Text Muted: `#6F747C`
- Success: `#34D399`
- Warning: `#FBBF24`
- Error: `#F87171`
- Info: `#60A5FA`

### Animations
- Fade In: `0.35s cubic-bezier(0.16, 1, 0.3, 1)`
- Scale In: `0.3s cubic-bezier(0.16, 1, 0.3, 1)`
- Slide Down: `0.25s cubic-bezier(0.16, 1, 0.3, 1)`
- Stagger Delay: `50ms` increments

### Components
- Cards with inner glow effects
- Buttons with press animations
- Badges with semantic colors
- Modals with backdrop blur
- Dropdowns with border highlights
- Tables with row highlights
- Toasts with slide animations
- Spinners and skeleton loaders

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔐 Demo Accounts

- **Admin**: arjun@stockflow.io / admin123
- **Manager**: priya@stockflow.io / admin123
- **Staff**: rahul@stockflow.io / admin123

## 🎯 Business Logic

### Inventory Consistency
- Sales automatically decrease stock
- Purchases increase stock when marked as received
- Manual adjustments tracked in history
- Low stock alerts triggered automatically
- Out of stock notifications

### Financial Calculations
- Automatic tax calculations (GST)
- Discount application
- Subtotal, tax, and grand total
- Profit tracking
- Outstanding balance management
- Payment reconciliation

### Invoice Management
- Automatic numbering (INV-2026-0001)
- Payment status tracking
- Partial payment support
- Overdue detection
- Print-ready format

## 📱 Responsive Design

- **Desktop**: Full sidebar with dashboard layout
- **Tablet**: Collapsible sidebar
- **Mobile**: Drawer navigation, optimized tables

## 🎨 Professional Touches

- Gradient backgrounds on cards
- Subtle noise textures
- Animated progress bars
- Hover state transitions
- Focus ring animations
- Notification pulse effects
- Chart cursor tracking
- Smooth page transitions
- Staggered list animations
- Icon rotation on hover
- Border glow effects
- Backdrop blur on modals
- Shadow depth variations

## 🚀 Production Ready

- TypeScript for type safety
- Optimized bundle size
- LocalStorage persistence
- Error handling
- Form validation
- Empty states
- Loading states
- Confirmation dialogs
- Toast notifications
- Keyboard shortcuts
- Print optimization
- CSV export functionality

## 📊 Sample Data

Includes realistic seed data with:
- 12 products across 6 categories
- 8 customers with purchase history
- 4 suppliers
- 7 sales transactions
- 6 invoices with various statuses
- 4 payments
- 4 purchase orders
- 8 expense records
- 8 inventory transactions
- 6 notifications

## 🎯 Key Differentiators

1. **Professional Design**: Not a generic admin template - custom designed with attention to detail
2. **Real Business Logic**: Actual inventory tracking, financial calculations, and workflow automation
3. **Smooth Animations**: Every interaction feels polished and responsive
4. **Complete Feature Set**: From basic CRUD to advanced reporting and analytics
5. **Production Quality**: Type-safe, validated, error-handled, and optimized
6. **Modern Stack**: Latest React, TypeScript, and build tools
7. **Responsive**: Works beautifully on all device sizes
8. **Extensible**: Clean architecture makes it easy to add features

## 📝 License

Built as a professional freelance project. Ready for client delivery.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
