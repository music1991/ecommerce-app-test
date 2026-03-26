import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ExportColumn<T> = {
  header: string;
  accessor: keyof T | ((row: T) => string | number);
};

type ExportOptions<T> = {
  fileName: string;
  sheetName?: string;
  title?: string;
  columns: ExportColumn<T>[];
  data: T[];
};

const getCellValue = <T,>(row: T, accessor: ExportColumn<T>["accessor"]) => {
  if (typeof accessor === "function") return accessor(row);
  return row[accessor] as string | number;
};

export const exportToExcel = <T,>({
  fileName,
  sheetName = "Reporte",
  columns,
  data,
}: ExportOptions<T>) => {
  const formattedData = data.map((row) => {
    const result: Record<string, string | number> = {};

    columns.forEach((col) => {
      result[col.header] = getCellValue(row, col.accessor);
    });

    return result;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = <T,>({
  fileName,
  title = "Reporte",
  columns,
  data,
}: ExportOptions<T>) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  const tableColumn = columns.map((col) => col.header);
  const tableRows = data.map((row) =>
    columns.map((col) => String(getCellValue(row, col.accessor) ?? ""))
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, 40, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generado: ${new Date().toLocaleString()}`, 40, 60);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 80,
    styles: {
      fontSize: 9,
      cellPadding: 6,
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 40, right: 40 },
  });

  doc.save(`${fileName}.pdf`);
};