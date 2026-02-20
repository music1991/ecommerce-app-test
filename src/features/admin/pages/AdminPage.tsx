import { ShoppingBag, Users, DollarSign, ArrowUpRight } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} text-white`}>
        <Icon size={24} />
      </div>
      <span className="flex items-center text-green-500 text-xs font-bold">
        +12% <ArrowUpRight size={14} />
      </span>
    </div>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</p>
    <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
  </div>
);

export const AdminPage = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Bienvenido, Boss</h1>
        <p className="text-slate-500 font-medium">Aquí tienes el resumen de tu tienda hoy.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard label="Ventas Totales" value="$12,850.00" icon={DollarSign} color="bg-blue-600" />
        <StatCard label="Productos Activos" value="48" icon={ShoppingBag} color="bg-purple-600" />
        <StatCard label="Clientes Nuevos" value="156" icon={Users} color="bg-orange-500" />
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-2">Análisis de Inventario</h2>
          <p className="text-slate-400 max-w-md text-sm">Tienes 5 productos con stock bajo. Te recomendamos revisar el catálogo.</p>
          <button className="mt-6 bg-white text-slate-950 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest">Revisar Ahora</button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
};