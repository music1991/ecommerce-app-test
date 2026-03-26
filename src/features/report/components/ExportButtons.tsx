import { FileSpreadsheet, FileText } from "lucide-react";
import { exportToExcel, exportToPDF } from "../util/exporters";


type ExportButtonsProps<T> = {
  fileName: string;
  title: string;
  sheetName?: string;
  columns: {
    header: string;
    accessor: keyof T | ((row: T) => string | number);
  }[];
  data: T[];
};

export const ExportButtons = <T,>({
  fileName,
  title,
  sheetName,
  columns,
  data,
}: ExportButtonsProps<T>) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() =>
          exportToExcel({
            fileName,
            sheetName,
            title,
            columns,
            data,
          })
        }
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all"
      >
        <FileSpreadsheet size={18} />
        Excel
      </button>

      <button
        onClick={() =>
          exportToPDF({
            fileName,
            title,
            columns,
            data,
          })
        }
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-all"
      >
        <FileText size={18} />
        PDF
      </button>
    </div>
  );
};