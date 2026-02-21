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
import { CategoriesManagement } from './features/products/pages/CategoriesManagement';
import { EmployeeManagement } from './features/admin/pages/EmployeeManagement';
import { ClientManagement } from './features/admin/pages/ClientManagement';
import { Cart } from './features/cart/pages/Cart';
import { SalePendingDetail } from './features/admin/pages/SalePendingDetail';
import { AdminLayout } from './shared/layout/AdminLayout';
import { RegisterCustomerPage } from './features/customer/pages/RegisterCustomerPage';
import { Sales } from './features/admin/pages/Sales';

function App() {
  const { isAuthenticated, user } = useAuthStore(); // Traemos al usuario para saber su rol

  // Función para decidir a dónde mandar al usuario si ya está logueado
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

        {/* Rutas Públicas y de Cliente */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          
      {/*     <Route path="/category/laptops" element={<CategoriesManagement categoryName="Laptops" />} /> */}
          <Route path="/cart" element={<Cart />} />
        </Route>

        {/* Rutas Protegidas - Agregamos 'employee' a los permitidos si corresponde */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'employee']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/products" element={<ProductsManagement />} />
            <Route path="/admin/employes" element={<EmployeeManagement />} />
            <Route path="/admin/clients" element={<ClientManagement />} />
            <Route path="/admin/sales/list" element={<Sales />} />
            <Route path="/admin/sales/detail/:id" element={<SalePendingDetail />} />
            <Route path="/admin/categories" element={<CategoriesManagement />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;