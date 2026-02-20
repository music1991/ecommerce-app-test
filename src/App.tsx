// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './features/auth/store/authStore';

// Layouts
import { MainLayout } from './shared/layout/MainLayout'; // Tiene Navbar y Footer

// Páginas
import { Home } from './features/home/pages/Home';
import { LoginPage } from './features/auth/pages/LoginPage';
import { AdminPage } from './features/admin/pages/AdminPage'; // Gestión de productos
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { ProductsManagement } from './features/admin/pages/ProductsManagement';
import { ProductDetail } from './features/products/pages/ProductDetail';
import { CategoryPage } from './features/products/pages/CategoryPage';
import { EmployeeManagement } from './features/admin/pages/EmployeeManagement';
import { ClientManagement } from './features/admin/pages/ClientManagement';
import { Cart } from './features/cart/pages/Cart';
import { SalePendingDetail } from './features/sales/pages/SalePendingDetail';
import { SalesPendingList } from './features/sales/pages/SalesPendingList';
import { AdminLayout } from './shared/layout/AdminLayout';
import { RegisterCustomerPage } from './features/customer/pages/RegisterCustomerPage';

function App() {
  const isAuth = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuth ? <LoginPage /> : <Navigate to="/" replace />}
        />
        <Route path="/customerRegister" element={<RegisterCustomerPage />} />
        
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={isAuth ? <Home /> : <Navigate to="/login" replace />}
          />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/category/laptops" element={<CategoryPage categoryName="Laptops" />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/products" element={<ProductsManagement />} />
            <Route path="/admin/employes" element={<EmployeeManagement />} />
            <Route path="/admin/clients" element={<ClientManagement />} />
            <Route path="/admin/sales/list" element={<SalesPendingList />} />
            <Route path="/admin/sales/detail/:id" element={<SalePendingDetail />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;