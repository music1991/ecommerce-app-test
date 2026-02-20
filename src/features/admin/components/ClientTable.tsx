import React, { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Edit3, Trash2, Search, Mail, Phone } from "lucide-react";

interface ClientTableProps {
  data: any[];
  onEdit: (client: any) => void;
  onDelete: (client: any) => void;
}

export const ClientTable = ({ data, onEdit, onDelete }: ClientTableProps) => {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: "name",
      header: "Cliente",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.original.name}</span>
          <span className="text-xs text-slate-500">ID: {row.original.id}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Contacto",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Mail size={14} /> {row.original.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Phone size={14} /> {row.original.phone}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ getValue }) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
          getValue() === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
        }`}>
          {getValue() === 'active' ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Acciones</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => onEdit(row.original)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Edit3 size={18} />
          </button>
          <button onClick={() => onDelete(row.original)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ], [onEdit, onDelete]);

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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Buscar clientes..."
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                {row.getVisibleCells().map(cell => (
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