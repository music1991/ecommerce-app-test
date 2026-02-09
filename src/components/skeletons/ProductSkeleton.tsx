export const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm animate-pulse w-full">
      {/* Espacio para la imagen */}
      <div className="aspect-square bg-slate-200 rounded-[2rem] mb-6" />
      
      {/* Espacio para el contenido */}
      <div className="px-2 space-y-4">
        {/* Skeleton de la categoría (pequeño y arriba) */}
        <div className="h-3 bg-slate-200 rounded-full w-1/4" />
        
        {/* Skeleton del título (más grueso) */}
        <div className="h-5 bg-slate-200 rounded-full w-3/4" />
        
        <div className="flex justify-between items-center pt-2">
          {/* Skeleton del precio */}
          <div className="h-6 bg-slate-200 rounded-full w-1/3" />
          
          {/* Skeleton del botón circular */}
          <div className="h-10 w-10 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};