export const Categories = () => {
  return (
    <section className="py-12 md:py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-slate-900">Explora por Categoría</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[500px]">
          
          <div className="md:col-span-2 bg-slate-200 rounded-3xl overflow-hidden relative group cursor-pointer h-64 md:h-full">
            <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/30 flex items-end p-8">
              <h3 className="text-white text-2xl font-bold">Laptops & Trabajo</h3>
            </div>
          </div>

          <div className="bg-blue-600 rounded-3xl overflow-hidden relative group cursor-pointer h-64 md:h-full">
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 flex items-end p-8">
              <h3 className="text-white text-2xl font-bold">Gadgets</h3>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};