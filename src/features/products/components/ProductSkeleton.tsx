export const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm animate-pulse w-full">
      <div className="aspect-square bg-slate-200 rounded-[2rem] mb-6" />
      
      <div className="px-2 space-y-4">
        <div className="h-3 bg-slate-200 rounded-full w-1/4" />
        
        <div className="h-5 bg-slate-200 rounded-full w-3/4" />
        
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-slate-200 rounded-full w-1/3" />
          <div className="h-10 w-10 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};