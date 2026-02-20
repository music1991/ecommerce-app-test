import React, { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Edit3, Search, Ban, CheckCircle2 } from "lucide-react";

interface ProductTableProps {
  data: any[];
  onEdit: (product: any) => void;
  // antes era "onDelete", ahora lo usamos como toggle active
  onDelete: (product: any) => void;
}

export const ProductTable = ({ data, onEdit, onDelete }: ProductTableProps) => {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Producto",
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <img
              src={row.original.images?.[0] || "https://via.placeholder.com/150"}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              alt={row.original.name}
            />
            <div className="flex flex-col">
              <span className="font-bold text-slate-900">{row.original.name}</span>
              <span className="text-xs text-slate-500 line-clamp-1">
                {row.original.description}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Categoría",
      },

      // ✅ NUEVA COLUMNA ESTADO
      {
        accessorKey: "active",
        header: "Estado",
        cell: ({ row }) => {
          const active = !!row.original.active;
          return (
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"
              }`}
            >
              {active ? "Activo" : "Inactivo"}
            </span>
          );
        },
      },

      {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ getValue, row }) => {
          const stock = Number(getValue());
          const minStock = Number(row.original.min_stock ?? 0);

          const low = stock <= Math.max(3, minStock || 0);

          return (
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                low ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {stock} unidades
            </span>
          );
        },
      },
      {
        accessorKey: "price",
        header: "Precio",
        cell: ({ getValue }) => (
          <span className="font-black text-slate-900">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(Number(getValue()))}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Acciones</div>,
        cell: ({ row }) => {
          const active = !!row.original.active;

          return (
            <div className="flex justify-end gap-2">
              <button
                onClick={() => onEdit(row.original)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit3 size={18} />
              </button>

              {/* ✅ en vez de borrar, activamos/desactivamos */}
              <button
                onClick={() => onDelete(row.original)}
                className={`p-2 rounded-lg transition-colors ${
                  active
                    ? "text-emerald-600 hover:bg-emerald-50"
                    : "text-rose-600 hover:bg-rose-50"
                }`}
                title={active ? "Desactivar" : "Activar"}
              >
                {active ? <CheckCircle2 size={18} /> : <Ban size={18} />}
              </button>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50/30">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Buscar productos..."
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-6">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};