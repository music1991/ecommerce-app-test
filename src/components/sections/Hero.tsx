export const Hero = () => {
  return (
    <section className="relative bg-slate-950 pt-48 pb-32 overflow-hidden">
      {/* Efectos de luz ambiental */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <span className="inline-block bg-blue-600/10 text-blue-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-500/20">
            Nuevos Ingresos 2026
          </span>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.85]">
            Lleva tu Setup al <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-700">
              Siguiente Nivel
            </span>
          </h1>

          <p className="text-slate-500 text-xl md:text-2xl max-w-2xl leading-relaxed font-medium">
            Equipamiento premium diseñado para gaming profesional, estaciones de trabajo y entusiastas de la tecnología.
          </p>
        </div>
      </div>
    </section>
  );
};