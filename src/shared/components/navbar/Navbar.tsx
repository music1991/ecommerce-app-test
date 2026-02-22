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
  AlertTriangle,
  Menu,
  X,
  LogIn
} from "lucide-react";
import { Modal } from '../../modals/Modal';
import { AuthRoles } from '../../../api/types/sales.types';
import { MOCK_CATEGORIES_DB } from '../../mocks/catetory.mock';

/* const DropdownItem = ({ to, label }: { to: string, label: string }) => (
  <Link
    to={to}
    className="block px-4 py-2 text-[10px] text-slate-400 hover:text-blue-500 hover:bg-white/5 transition-all"
  >
    {label}
  </Link>
); */

export const Navbar = () => {
  const { t } = useLanguage();
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, logout } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => { //AJUSTAR ESTO
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
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          
          {/* LOGO */}
          <div className="flex flex-col">
            <Link to="/" className="font-black text-xl md:text-2xl text-white tracking-tighter hover:opacity-80 transition-opacity">
              TECH<span className="text-blue-600">STORE</span>
            </Link>
            {user && (
              <span className="hidden md:block text-[10px] text-blue-400 font-bold uppercase">
                {user.name}
              </span>
            )}
          </div>

          {/* CATEGORÍAS (Escritorio) */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-slate-400 h-full">
            {Object.values(MOCK_CATEGORIES_DB).map((category) => (
              <Link key={category.id} to={`/category/${category.name.toLowerCase()}`}>
                <div className="relative group h-full flex items-center px-4 cursor-pointer hover:text-white transition-colors">
                   <span>{category.name}</span>
                </div>
              </Link>
            ))}
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

          {/* ACCIONES DERECHA */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* CARRITO (Siempre visible) */}
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

            {/* BOTÓN HAMBURGUESA (Solo móvil) */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 bg-white/5 rounded-xl border border-white/5 text-slate-300"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* BOTONES AUTH (Solo Escritorio) */}
            <div className="hidden lg:flex items-center gap-2 ml-2 pl-4 border-l border-white/10">

{(user?.role === AuthRoles.Admin || user?.role === AuthRoles.Employee) && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase text-blue-400 hover:bg-blue-600 hover:text-white transition-all group"
                  >
                    <LayoutDashboard size={16} />
                    <span className="hidden xl:inline">Panel de Gestion</span>
                  </Link>
                )}
                {user ? (
                  <button onClick={() => setIsModalOpen(true)} className="flex flex-col items-center p-2 bg-red-500/5 border border-red-500/10 rounded-xl text-red-500 min-w-[80px]">
                    <span className="text-[10px] text-white font-bold uppercase">Cerrar Sesion</span>
                    <LogOut size={18} />
                  </button>
                ) : (
                  <Link to="/login" className="flex flex-col items-center p-2 bg-blue-500/5 border border-blue-500/10 rounded-xl text-blue-500 min-w-[80px]">
                    <span className="text-[10px] text-white font-bold uppercase">Inciar Sesion</span>
                    <User size={18} />
                  </Link>
                )}
            </div>
          </div>
        </div>

        {/* MENÚ MÓVIL DESPLEGABLE */}
        {/* MENÚ MÓVIL OVERLAY (Moderno y Estético) */}
        <div 
     
        className={`fixed inset-0 top-20 z-40 lg:hidden transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
          {/* Background Blur Overlay */}
          <div 
          
          className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)} />
          
          {/* Panel Lateral */}
          <div className={`absolute right-0 top-0 h-full w-[80%] 
                            max-w-sm bg-slate-900 border-l border-white/10 
                            shadow-2xl transform transition-transform duration-500 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            
            <div 
           // style={{ border: "1px solid orange", background: "blue"}}
            className="border border-b-white/40 border-l-white/40 p-10 rounded-bl-2xl bg-slate-950">
            {(user?.role === AuthRoles.Admin || user?.role === AuthRoles.Employee) && (

               <div className='mb-10'>
                <h3 className="text-blue-500 text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-blue-500/30"></span> 
                  Administracion
                </h3>
                 <Link
                    to="/admin"
                    className="text-slate-100 font-semibold text-xl flex items-center justify-between group"
                  >
                    
                    <span className="text-white">Panel de Gestion</span>
                  </Link>
               
              </div>
                 
                )}     
              {/* SECCIÓN CATEGORÍAS */}
              <div >
                <h3 className="text-blue-500 text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-blue-500/30"></span> 
                  Explorar Tienda
                </h3>
                <div className="flex flex-col gap-5">
                  {Object.values(MOCK_CATEGORIES_DB).map((category) => (
                    <Link 
                      key={category.id} 
                      to={`/category/${category.name.toLowerCase()}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-slate-100 font-semibold text-xl flex items-center justify-between group"
                    >
                      {category.name}
                      <ChevronDown size={18} className="text-slate-600 -rotate-90 group-hover:text-blue-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>

              

              {/* SECCIÓN SESIÓN (Mismo estilo que categorías) */}
              <div 
          
              className="pt-10">
                <h3 className="text-blue-500 text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-blue-500/30"></span> 
                  Mi Cuenta
                </h3>
                <div className="flex flex-col gap-5">
                  {user ? (
                    <>
         
                      <button 
                        onClick={() => { setIsMenuOpen(false); setIsModalOpen(true); }}
                        className="text-red-400 font-semibold text-xl flex items-center gap-3"
                      >
                        <LogOut size={22} /> Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <Link 
                      to="/login" 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-slate-100 font-semibold text-xl flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <LogIn size={22} className="text-indigo-400" />
                        Iniciar Sesión
                      </div>
                      <ChevronDown size={18} className="text-slate-600 -rotate-90 group-hover:text-indigo-400 transition-colors" />
                    </Link>
                  )}
                </div>
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


