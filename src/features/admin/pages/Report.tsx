import { useMemo, useState } from "react";
import {
  BarChart3,
  ArrowUpRight,
  Wallet,
  Users,
  Cpu,
  TriangleAlert,
  FileText,
  FileSpreadsheet,
  ChevronDown,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { exportToExcel, exportToPDF } from "../../report/util/exporters";



const COLORS = ["#2563eb", "#7c3aed", "#f97316", "#0f172a", "#14b8a6"];

type ReportType = "clientes" | "ventas" | "stock";

const salesElectronicsMock = [
  { month: "Ene", ventas: 18500 },
  { month: "Feb", ventas: 22300 },
  { month: "Mar", ventas: 19800 },
  { month: "Abr", ventas: 26700 },
  { month: "May", ventas: 31200 },
  { month: "Jun", ventas: 28900 },
];

const clientsElectronicsMock = [
  { month: "Ene", clientes: 18 },
  { month: "Feb", clientes: 26 },
  { month: "Mar", clientes: 22 },
  { month: "Abr", clientes: 34 },
  { month: "May", clientes: 41 },
  { month: "Jun", clientes: 38 },
];

const stockElectronicsByCategoryMock = [
  { name: "Smartphones", value: 48 },
  { name: "Laptops", value: 22 },
  { name: "Accesorios", value: 95 },
  { name: "Tablets", value: 16 },
  { name: "Audio", value: 37 },
];

const lowStockElectronicsMock = [
  {
    id: 1,
    product: "MacBook Air M2",
    category: "Laptops",
    quantity: 2,
    minStock: 6,
    status: "Crítico",
    costPrice: 920,
    salePrice: 1199,
  },
  {
    id: 2,
    product: "iPhone 14 Pro",
    category: "Smartphones",
    quantity: 4,
    minStock: 10,
    status: "Bajo",
    costPrice: 780,
    salePrice: 999,
  },
  {
    id: 3,
    product: "AirPods Pro",
    category: "Audio",
    quantity: 3,
    minStock: 8,
    status: "Crítico",
    costPrice: 165,
    salePrice: 249,
  },
  {
    id: 4,
    product: "Cargador USB-C 30W",
    category: "Accesorios",
    quantity: 6,
    minStock: 15,
    status: "Bajo",
    costPrice: 12,
    salePrice: 25,
  },
  {
    id: 5,
    product: "Galaxy Tab S9",
    category: "Tablets",
    quantity: 2,
    minStock: 5,
    status: "Crítico",
    costPrice: 540,
    salePrice: 699,
  },
];

const customersReportMock = [
  {
    id: 1,
    name: "Carlos Méndez",
    phone: "809-555-1020",
    email: "carlos@email.com",
    hasPurchases: "Sí",
    purchasesCount: 6,
    totalPurchased: 4280,
  },
  {
    id: 2,
    name: "Laura Pérez",
    phone: "809-555-3321",
    email: "laura@email.com",
    hasPurchases: "Sí",
    purchasesCount: 3,
    totalPurchased: 1890,
  },
  {
    id: 3,
    name: "Miguel Santos",
    phone: "809-555-9911",
    email: "miguel@email.com",
    hasPurchases: "No",
    purchasesCount: 0,
    totalPurchased: 0,
  },
  {
    id: 4,
    name: "Andrea López",
    phone: "809-555-8080",
    email: "andrea@email.com",
    hasPurchases: "Sí",
    purchasesCount: 8,
    totalPurchased: 6540,
  },
];

const salesReportMock = [
  {
    id: "V-1001",
    date: "2026-03-01",
    customer: "Carlos Méndez",
    paymentMethod: "Tarjeta",
    total: 1299,
  },
  {
    id: "V-1002",
    date: "2026-03-02",
    customer: "Laura Pérez",
    paymentMethod: "Efectivo",
    total: 699,
  },
  {
    id: "V-1003",
    date: "2026-03-03",
    customer: "Andrea López",
    paymentMethod: "Transferencia",
    total: 249,
  },
  {
    id: "V-1004",
    date: "2026-03-04",
    customer: "Carlos Méndez",
    paymentMethod: "Tarjeta",
    total: 999,
  },
];

type StatCardProps = {
  label: string;
  value: string;
  icon: any;
  color: string;
  trend?: string;
};

const StatCard = ({ label, value, icon: Icon, color, trend = "+12%" }: StatCardProps) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} text-white`}>
        <Icon size={24} />
      </div>
      <span className="flex items-center text-green-500 text-xs font-bold">
        {trend} <ArrowUpRight size={14} />
      </span>
    </div>

    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</p>
    <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
  </div>
);

const ChartCard = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
    <div className="mb-6">
      <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
    </div>
    {children}
  </div>
);

export const ReportsPage = () => {
  const [reportType, setReportType] = useState<ReportType>("clientes");

  const totalVentas = salesElectronicsMock.reduce((acc, item) => acc + item.ventas, 0);
  const totalClientes = clientsElectronicsMock.reduce((acc, item) => acc + item.clientes, 0);
  const totalStock = stockElectronicsByCategoryMock.reduce((acc, item) => acc + item.value, 0);
  const totalLowStock = lowStockElectronicsMock.length;

  const reportConfig = useMemo(() => {
    if (reportType === "clientes") {
      return {
        title: "Detalle de Clientes",
        fileName: "reporte-clientes",
        data: customersReportMock,
        columns: [
          { header: "Cliente", accessor: (row: any) => row.name },
          { header: "Teléfono", accessor: (row: any) => row.phone },
          { header: "Email", accessor: (row: any) => row.email },
          { header: "Tiene compras", accessor: (row: any) => row.hasPurchases },
          { header: "Cantidad compras", accessor: (row: any) => row.purchasesCount },
          {
            header: "Monto total compras",
            accessor: (row: any) => `$${Number(row.totalPurchased).toLocaleString()}`,
          },
        ],
      };
    }

    if (reportType === "ventas") {
      return {
        title: "Detalle de Ventas",
        fileName: "reporte-ventas",
        data: salesReportMock,
        columns: [
          { header: "Nro. Venta", accessor: (row: any) => row.id },
          { header: "Fecha", accessor: (row: any) => row.date },
          { header: "Cliente", accessor: (row: any) => row.customer },
          { header: "Método de pago", accessor: (row: any) => row.paymentMethod },
          {
            header: "Ingresado por venta",
            accessor: (row: any) => `$${Number(row.total).toLocaleString()}`,
          },
        ],
      };
    }

    return {
      title: "Detalle de Stock",
      fileName: "reporte-stock",
      data: lowStockElectronicsMock,
      columns: [
        { header: "Producto", accessor: (row: any) => row.product },
        { header: "Categoría", accessor: (row: any) => row.category },
        { header: "Cantidad", accessor: (row: any) => row.quantity },
        { header: "Stock mínimo", accessor: (row: any) => row.minStock },
        { header: "Estado", accessor: (row: any) => row.status },
        {
          header: "Precio compra",
          accessor: (row: any) => `$${Number(row.costPrice).toLocaleString()}`,
        },
        {
          header: "Precio venta",
          accessor: (row: any) => `$${Number(row.salePrice).toLocaleString()}`,
        },
      ],
    };
  }, [reportType]);

  const handleExportExcel = () => {
    exportToExcel({
      fileName: reportConfig.fileName,
      sheetName: reportConfig.title,
      title: reportConfig.title,
      columns: reportConfig.columns,
      data: reportConfig.data,
    });
  };

  const handleExportPDF = () => {
    exportToPDF({
      fileName: reportConfig.fileName,
      title: reportConfig.title,
      columns: reportConfig.columns,
      data: reportConfig.data,
    });
  };

  return (
    <div className="p-6 animate-in fade-in duration-500">
      <header className="mb-10">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-600/20">
            <BarChart3 size={28} />
          </div>

          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
              Reportes
            </h1>
            <p className="text-slate-500 font-medium">
              Vista general del rendimiento comercial e inventario.
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <StatCard
          label="Ventas Electrónica"
          value={`$${totalVentas.toLocaleString()}`}
          icon={Wallet}
          color="bg-blue-600"
        />
        <StatCard
          label="Clientes de Electrónica"
          value={String(totalClientes)}
          icon={Users}
          color="bg-orange-500"
        />
        <StatCard
          label="Stock Disponible"
          value={String(totalStock)}
          icon={Cpu}
          color="bg-purple-600"
        />
        <StatCard
          label="Alertas Stock Bajo"
          value={String(totalLowStock)}
          icon={TriangleAlert}
          color="bg-slate-900"
          trend="+4%"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
        <ChartCard
          title="Ventas de Electrónica"
          subtitle="Ingresos mensuales del área de electrónica"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesElectronicsMock}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, "Ventas"]} />
                <Bar dataKey="ventas" radius={[12, 12, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Clientes en Electrónica"
          subtitle="Cantidad de clientes compradores por mes"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={clientsElectronicsMock}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip formatter={(value: any) => [value, "Clientes"]} />
                <Line
                  type="monotone"
                  dataKey="clientes"
                  stroke="#7c3aed"
                  strokeWidth={4}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
        <div className="xl:col-span-1">
          <ChartCard
            title="Stock por Categoría"
            subtitle="Inventario actual de productos electrónicos"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockElectronicsByCategoryMock}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={55}
                  >
                    {stockElectronicsByCategoryMock.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [value, "Stock"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-3">
              {stockElectronicsByCategoryMock.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="xl:col-span-2">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-slate-500 font-medium">
                  Selecciona el tipo de planilla que deseas consultar o exportar.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative min-w-[240px]">
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as ReportType)}
                    className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 pr-10 text-sm font-bold text-slate-700 outline-none focus:border-blue-500"
                  >
                    <option value="clientes">Clientes</option>
                    <option value="ventas">Ventas</option>
                    <option value="stock">Stock</option>
                  </select>

                  <ChevronDown
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>

                <button
                  onClick={handleExportExcel}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl !bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-md"
                >
                  <FileSpreadsheet size={18} />
                  Excel
                </button>

                <button
                  onClick={handleExportPDF}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl !bg-rose-600 text-white font-bold hover:bg-rose-700 transition-all shadow-md"
                >
                  <FileText size={18} />
                  PDF
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    {reportConfig.columns.map((column: any) => (
                      <th
                        key={column.header}
                        className="text-left pb-4 text-xs uppercase tracking-widest text-slate-400 font-black"
                      >
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {reportConfig.data.map((row: any, index: number) => (
                    <tr key={row.id ?? index} className="border-b border-slate-50">
                      {reportConfig.columns.map((column: any) => {
                        const value =
                          typeof column.accessor === "function"
                            ? column.accessor(row)
                            : row[column.accessor];

                        return (
                          <td
                            key={column.header}
                            className="py-4 text-sm font-medium text-slate-700"
                          >
                            {column.header === "Estado" ? (
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-black ${
                                  value === "Crítico"
                                    ? "bg-red-100 text-red-600"
                                    : value === "Bajo"
                                    ? "bg-orange-100 text-orange-600"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {value}
                              </span>
                            ) : column.header === "Tiene compras" ? (
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-black ${
                                  value === "Sí"
                                    ? "bg-emerald-100 text-emerald-600"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {value}
                              </span>
                            ) : (
                              value
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};