import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from './Footer';
import { LanguageProvider } from '../context/LanguageContext';

export const MainLayout = () => {
  return (
    <LanguageProvider>
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
    </LanguageProvider>
  );
};