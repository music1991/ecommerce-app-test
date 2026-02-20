import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, CreditCard, UserRoundCog, ChevronRight, Home, BadgeDollarSign } from 'lucide-react';
import { useAuthStore } from '../../auth/store/authStore';

export const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/employes', icon: UserRoundCog, label: 'Empleados' },
    { path: '/admin/products', icon: ShoppingBag, label: 'Productos' },
    { path: '/admin/clients', icon: Users, label: 'Clientes' },

    { path: '/admin/sales/list', icon: BadgeDollarSign, label: 'Ventas' },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-white/5 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <h2 className="text-white font-black text-xl tracking-tighter">GESTION <span className="text-blue-600">PANEL</span></h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="text-sm font-bold">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link 
          to={"/"}
          className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold text-sm"
        >
          <Home size={20} /> Home
        </Link>
      </div>
    </aside>
  );
};