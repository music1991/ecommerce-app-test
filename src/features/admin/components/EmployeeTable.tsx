import React, { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Edit3, Trash2, Search, Calendar, Briefcase } from "lucide-react";

interface EmployeeTableProps {
  data: any[];
  onEdit: (employee: any) => void;
  onDelete: (employee: any) => void;
}

export const EmployeeTable = ({ data, onEdit, onDelete }: EmployeeTableProps) => {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: "name",
      header: "Empleado",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
            {row.original.name.charAt(0)}
          </div>
          <span className="font-bold text-slate-900">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Puesto",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2 text-slate-600">
          <Briefcase size={14} className="text-slate-400" />
          <span>{String(getValue())}</span>
        </div>
      ),
    },
    {
      accessorKey: "startDate",
      header: "Fecha Ingreso",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar size={14} className="text-slate-400" />
          <span>{String(getValue())}</span>
        </div>
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
            placeholder="Buscar empleados..."
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-400 tracking-widest">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="p-6">
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