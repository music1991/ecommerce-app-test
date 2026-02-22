import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, Users, UserRoundCog, 
  ChevronRight, Home, BadgeDollarSign, ChevronDown, FolderTree, 
  ListFilterPlus
} from 'lucide-react';
import { useAuthStore } from '../../auth/store/authStore';

export const AdminSidebar = () => {
  const location = useLocation();
  // Estado para controlar la apertura del submenú Catálogo
    const { user } = useAuthStore();
  const [catalogOpen, setCatalogOpen] = useState(location.pathname.includes('/catalog'));

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Panel' },
    ...(user?.role === 'admin' 
      ? [{ path: '/admin/employes', icon: UserRoundCog, label: 'Empleados' }] 
      : []),
    /*     { path: '/admin/employes', icon: UserRoundCog, label: 'Empleados' }, */
    { 
      label: 'Catálogo', 
      icon: FolderTree, 
      isParent: true,
      isOpen: catalogOpen,
      setOpen: setCatalogOpen,
      subItems: [
        { path: '/admin/products', icon: ShoppingBag, label: 'Productos' },
        { path: '/admin/categories', icon: ListFilterPlus, label: 'Categorías' },
      ]
    },
    { path: '/admin/clients', icon: Users, label: 'Clientes' },
    { path: '/admin/sales/list', icon: BadgeDollarSign, label: 'Ventas' },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-white/5 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <h2 className="text-white text-xl">Administracion 
        {/*   <span className="text-blue-600"></span> */}
          </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          if (item.isParent) {
            return (
              <div key={item.label} className="space-y-1">
                <button
                  onClick={() => item.setOpen(!item.isOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-slate-400 hover:bg-white/5 hover:text-white`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    <span className="text-sm font-bold">{item.label}</span>
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${item.isOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {item.isOpen && (
                  <div className="ml-4 pl-4 border-l border-white/10 space-y-1">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          location.pathname === sub.path ? 'text-blue-500' : 'text-slate-500 hover:text-white'
                        }`}
                      >
                        <sub.icon size={16} />
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

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
