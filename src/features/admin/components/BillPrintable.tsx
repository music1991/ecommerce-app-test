import React, { forwardRef } from "react";

export const BillPrintable = forwardRef(({ sale }: any, ref: any) => {
  const money = (n: number) => new Intl.NumberFormat("es-AR", { 
    style: "currency", 
    currency: "ARS",
    maximumFractionDigits: 0 
  }).format(n);

  return (
    <div ref={ref} className="p-10 bg-white text-black font-mono text-sm uppercase">
      {/* HEADER EMISOR */}
      <div className="text-center border-b-2 border-black pb-4 mb-4">
        <h1 className="text-2xl font-black tracking-tighter">TECH STORE</h1>
        <p className="text-[10px]">CUIT: 30-71234567-9</p>
        <p className="text-[10px]">Av. Principal 123 - Yerba Buena, Tucumán</p>
      </div>

      {/* INFO FACTURA Y CLIENTE */}
      <div className="flex justify-between mb-6">
        <div>
          <p className="font-bold text-lg tracking-tighter">FACTURA Nº {sale.id.toString().padStart(8, '0')}</p>
          <p className="text-[11px]">Fecha: {new Date(sale.paidAt || Date.now()).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-900">CLIENTE: {sale.actorName || "Consumidor Final"}</p>
          <p className="text-[11px]">ID/DNI: {sale.actorId || "—"}</p>
        </div>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <table className="w-full mb-6">
        <thead className="border-b border-black">
          <tr>
            <th className="text-left py-2 text-[11px]">Detalle</th>
            <th className="text-center py-2 text-[11px]">Cant</th>
            <th className="text-right py-2 text-[11px]">Total</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((it: any) => (
            <tr key={it.id} className="border-b border-dashed border-slate-300">
              <td className="py-2 text-[11px]">{it.name}</td>
              <td className="py-2 text-center text-[11px]">x{it.quantity}</td>
              <td className="py-2 text-right text-[11px]">{money(it.price * it.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALES */}
      <div className="text-right text-xl font-black pt-4 border-t-2 border-black">
        TOTAL: {money(sale.total)}
      </div>

      {/* FOOTER AUDITORÍA (LO NUEVO) */}
      <div className="mt-12 pt-4 border-t border-slate-200 flex justify-between items-end">
        <div className="text-[10px] space-y-1">
          <p className="font-bold">OPERACIÓN REALIZADA POR:</p>
          {/* Mostramos el nombre del empleado que completó la venta */}
          <p className="text-slate-700">{sale.completedBy?.actorName || "Sistema POS"}</p>
          <p className="text-slate-400 italic">ID Operador: {sale.completedBy?.actorId || "N/A"}</p>
        </div>
        <div className="text-right">
            <p className="text-[9px] text-slate-400">PUNTO DE VENTA Nº 001</p>
        </div>
      </div>
      
      <p className="mt-8 text-center text-[10px] font-bold tracking-widest border-t border-black pt-4">
        Gracias por su compra • TECH STORE 2026
      </p>
    </div>
  );
});
