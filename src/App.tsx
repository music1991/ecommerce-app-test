import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart'; // 1. Importamos la nueva página
import { Footer } from './components/layout/Footer';
import { CategoryPage } from './pages/CategoryPage';
import { SearchPage } from './pages/SearchPage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <LanguageProvider>
      <Router>
        {/* Cambiamos el div principal para que sea un contenedor Flex vertical */}
        <div className="flex flex-col min-h-screen bg-white">
          <Navbar />
          
          {/* El flex-1 hace que este main crezca y empuje al footer hacia abajo */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/category/laptops" element={<CategoryPage categoryName="Laptops" />} />
<Route path="/category/monitors" element={<CategoryPage categoryName="Monitors" />} />
<Route path="/search" element={<SearchPage />} />
<Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;