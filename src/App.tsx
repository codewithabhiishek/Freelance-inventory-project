import React, { useEffect } from 'react';
import { useStore } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Inventory } from './pages/Inventory';
import { Sales } from './pages/Sales';
import { Invoices } from './pages/Invoices';
import { Customers } from './pages/Customers';
import { Suppliers } from './pages/Suppliers';
import { Payments } from './pages/Payments';
import { Purchases } from './pages/Purchases';
import { Expenses } from './pages/Expenses';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Users } from './pages/Users';
import { Auth } from './pages/Auth';
import { DashboardSkeleton, PageSkeleton } from './components/ui';

function App() {
  const { isAuthenticated, currentPage, theme } = useStore();
  const [isPageLoading, setIsPageLoading] = React.useState(true);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.body.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.body.classList.remove('light');
    }
  }, [theme]);

  // Smooth skeleton transition on route changes
  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => setIsPageLoading(false), 240);
    return () => clearTimeout(timer);
  }, [currentPage]);

  if (!isAuthenticated) {
    return <Auth />;
  }

  const renderPage = () => {
    if (isPageLoading) {
      if (currentPage === 'dashboard') {
        return <DashboardSkeleton />;
      }
      return <PageSkeleton />;
    }

    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'products': return <Products />;
      case 'inventory': return <Inventory />;
      case 'sales': return <Sales />;
      case 'invoices': return <Invoices />;
      case 'customers': return <Customers />;
      case 'suppliers': return <Suppliers />;
      case 'payments': return <Payments />;
      case 'purchases': return <Purchases />;
      case 'expenses': return <Expenses />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      case 'users': return <Users />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}

export default App;
