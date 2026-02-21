import React, { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Edit3, Trash2, FolderTree } from "lucide-react";

export const CategoryTable = ({ data, onEdit, onDelete }: any) => {
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <FolderTree size={18} />
          </div>
          <span className="font-bold text-slate-800">{row.original.name}</span>
        </div>
      )
    },
    {
      accessorKey: "description",
      header: "Descripción",
      cell: ({ getValue }) => <span className="text-slate-500 text-sm">{(getValue() as string) || "-"}</span>
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ getValue }) => {
        const active = getValue() === "active";
        return (
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
            active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"
          }`}>
            {active ? "Activo" : "Inactivo"}
          </span>
        );
      }
    },
    {
      id: "actions",
      header: () => <div className="text-right">Acciones</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => onEdit(row.original)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 size={18}/></button>
          <button onClick={() => onDelete(row.original)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={18}/></button>
        </div>
      )
    }
  ], [onEdit, onDelete]);

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50/50 border-b border-slate-200">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(header => (
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
                <td key={cell.id} className="p-6">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
