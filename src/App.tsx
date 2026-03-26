import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './features/auth/store/authStore';
import { MainLayout } from './shared/layout/MainLayout';
import { Home } from './features/home/pages/Home';
import { LoginPage } from './features/auth/pages/LoginPage';
import { AdminPage } from './features/admin/pages/AdminPage';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { ProductsManagement } from './features/admin/pages/ProductsManagement';
import { ProductDetail } from './features/products/pages/ProductDetail';
import { EmployeeManagement } from './features/admin/pages/EmployeeManagement';
import { ClientManagement } from './features/admin/pages/ClientManagement';
import { Cart } from './features/cart/pages/Cart';
import { SalePendingDetail } from './features/admin/pages/SalePendingDetail';
import { AdminLayout } from './shared/layout/AdminLayout';
import { RegisterCustomerPage } from './features/customer/pages/RegisterCustomerPage';
import { Sales } from './features/admin/pages/Sales';

import { CategoriesManagement } from './features/admin/pages/CategoriesManagement';
import { Categories } from './features/products/pages/Categories';
import { CashManagement } from './features/admin/pages/CashManagement';
import { BillPage } from './features/admin/pages/BillPage';
import { ReportsPage } from './features/admin/pages/Report';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  const getRedirectPath = () => {
    if (user?.role === 'admin' || user?.role === 'employee') {
      return "/admin";
    }
    return "/";
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to={getRedirectPath()} replace />}
        />

        <Route path="/customerRegister" element={<RegisterCustomerPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          <Route
            path="/category/:categoryName"
            element={<Categories />}
          />
          <Route path="/cart" element={<Cart />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin', 'employee']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/products" element={<ProductsManagement />} />
            <Route path="/admin/clients" element={<ClientManagement />} />
            <Route path="/admin/sales/list" element={<Sales />} />
            <Route path="/admin/sales/detail/:id" element={<SalePendingDetail />} />
            <Route path="/admin/categories" element={<CategoriesManagement />} />
            <Route path="/admin/cash" element={<CashManagement />} />
            <Route path="/admin/sales/bill/:id" element={<BillPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/employes" element={<EmployeeManagement />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;