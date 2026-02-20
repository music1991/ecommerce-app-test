import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCartStore } from '../../../features/cart/store/useCartStore';
import { useAuthStore } from '../../../features/auth/store/authStore';
import {
  Search,
  ShoppingCart,
  Monitor,
  Laptop,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User,
  AlertTriangle
} from "lucide-react";
import { Modal } from '../../modals/Modal';
import { AuthRoles } from '../../../api/types/sales.types';

const DropdownItem = ({ to, label }: { to: string, label: string }) => (
  <Link
    to={to}
    className="block px-4 py-2 text-[10px] text-slate-400 hover:text-blue-500 hover:bg-white/5 transition-all"
  >
    {label}
  </Link>
);

export const Navbar = () => {
  const { t } = useLanguage();
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user, logout } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsModalOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const initialCart = useCartStore.getState().cart;
    setCount(initialCart.reduce((acc, item) => acc + item.quantity, 0));
    const unsub = useCartStore.subscribe((state) => {
      setCount(state.cart.reduce((acc, item) => acc + item.quantity, 0));
    });
    return unsub;
  }, []);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 h-20">
        <div className="container mx-auto px-4 h-full flex items-center justify-between gap-8">
          <div>
            <Link to="/" className="font-black text-2xl text-white shrink-0 tracking-tighter hover:opacity-80 transition-opacity">
              TECH<span className="text-blue-600">STORE</span>
            </Link>
            {user && (
              <div className="flex justify-center">
                <span className="text-[10px] text-white font-bold uppercase tracking-tight">Bienvenido</span>
                <span className="text-[10px] text-white font-bold uppercase tracking-tight ml-1">{user.name}</span>
              </div>
            )}
          </div>


          <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 h-full">
            <div className="relative group h-full flex items-center px-4 cursor-pointer">
              <div className="flex items-center gap-2 group-hover:text-white transition-colors">
                <Laptop size={16} className="text-blue-500" />
                <span>Laptops</span>
                <ChevronDown size={12} className="group-hover:rotate-180 transition-transform" />
              </div>
              <div className="absolute top-[80px] left-0 w-48 bg-slate-950 border border-white/10 rounded-b-2xl py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl">
                <DropdownItem to="/category/Laptops" label="Ver Todas" />
                <DropdownItem to="/search?q=MacBook" label="MacBook" />
                <DropdownItem to="/search?q=Gaming" label="Gaming Laptops" />
              </div>
            </div>

            <div className="relative group h-full flex items-center px-4 cursor-pointer">
              <div className="flex items-center gap-2 group-hover:text-white transition-colors">
                <Monitor size={16} className="text-blue-500" />
                <span>Monitors</span>
                <ChevronDown size={12} className="group-hover:rotate-180 transition-transform" />
              </div>
              <div className="absolute top-[80px] left-0 w-48 bg-slate-950 border border-white/10 rounded-b-2xl py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl">
                <DropdownItem to="/category/Monitors" label="Ver Todos" />
                <DropdownItem to="/search?q=Ultrawide" label="Ultrawide" />
                <DropdownItem to="/search?q=4K" label="4K / UHD" />
              </div>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-md relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search')}
              className="w-full bg-white/5 border border-white/10 py-2.5 pl-12 pr-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
            />
          </form>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative group">
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 group-hover:border-blue-500/50 transition-all">
                <ShoppingCart size={20} className="text-slate-300 group-hover:text-blue-500" />
              </div>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-slate-950">
                  {count}
                </span>
              )}
            </Link>

            <div className="gap-2 ml-2 pl-4 border-l border-white/10">
              <div className='flex flex-row'>
                {(user?.role === AuthRoles.Admin || user?.role === AuthRoles.Employee) && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase text-blue-400 hover:bg-blue-600 hover:text-white transition-all group"
                  >
                    <LayoutDashboard size={16} />
                    <span className="hidden xl:inline">Dashboard</span>
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex flex-col items-center justify-center p-2 bg-red-500/5 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/40 rounded-xl text-red-500 transition-all group min-w-[80px]"
                    title="Cerrar Sesión"
                  >
                    <span className="text-[10px] text-white font-bold uppercase tracking-tight">Log Out</span>
                    <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex flex-col items-center justify-center p-2 bg-blue-500/5 hover:bg-blue-500/20 border border-blue-500/10 hover:border-blue-500/40 rounded-xl text-blue-500 transition-all group min-w-[80px]"
                  >
                    <span className="text-[10px] text-white font-bold uppercase tracking-tight">Log In</span>
                    <User size={20} className="group-hover:scale-110 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirmar"
      >
        <div className="p-4">
          <p className="text-slate-600 mb-8 text-center font-medium">
            ¿Estás seguro que deseas cerrar sesión?
          </p>

          <div className="flex gap-4 w-full mt-10">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-3 !bg-slate-100 !text-slate-700 font-bold rounded-xl border border-slate-200 hover:!bg-slate-200 transition-colors"
            >
              Cancelar
            </button>

            <button
              onClick={handleLogoutConfirm}
              className="flex-1 px-4 py-3 !bg-sky-500 !text-white font-bold rounded-xl shadow-lg shadow-sky-200 hover:!bg-sky-600 transition-all active:scale-95 border border-sky-600"
            >
              Confirmar
            </button>
          </div>

        </div>
      </Modal>
    </>
  );
};
