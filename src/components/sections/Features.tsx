// src/components/sections/Features.tsx
const features = [
  { title: "Envío Nacional", desc: "A todo el país", icon: "🚚" },
  { title: "3 Cuotas Sin Interés", desc: "Con todas las tarjetas", icon: "💳" },
  { title: "Garantía Oficial", desc: "Soporte técnico 24/7", icon: "🛡️" },
  { title: "15% OFF Transferencia", desc: "Descuento inmediato", icon: "💰" },
];

export const Features = () => {
  return (
    <div className="py-8 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex lg:grid lg:grid-cols-4 gap-8 min-w-[800px] lg:min-w-full">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{f.icon}</span>
              <div>
                <h4 className="font-bold text-slate-900 text-sm uppercase">{f.title}</h4>
                <p className="text-slate-500 text-xs">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};