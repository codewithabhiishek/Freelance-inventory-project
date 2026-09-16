import React from 'react';
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

function App() {
  const { isAuthenticated, currentPage } = useStore();

  if (!isAuthenticated) {
    return <Auth />;
  }

  const renderPage = () => {
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
