import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useParams, useNavigate } from "react-router-dom";
import { Printer, ArrowLeft, Download, CheckCircle2 } from "lucide-react";
import { useSalesStore } from "../../sales/store/useSalesStore";
import { BillPrintable } from "../components/BillPrintable";


export const BillPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const sale = useSalesStore((s) => s.getSaleById(Number(id)));

    const componentRef = useRef<HTMLDivElement>(null);

    // 2. Nueva forma de declarar el hook
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Factura_TechStore_${id}`, // 👈 Ponelo ACÁ
    });



    if (!sale) return <p>Venta no encontrada.</p>;

    return (
        <div className="min-h-screen bg-slate-50 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* HEADER DE ACCIONES */}
            <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
                <button
                    onClick={() => navigate("/admin/sales/list")}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors"
                >
                    <ArrowLeft size={20} /> Volver a Ventas
                </button>

                <div className="flex gap-3">
                    <button
                        onClick={() => handlePrint()}
                        className="..."
                    >
                        <Printer size={20} /> Imprimir Comprobante
                    </button>
                </div>
            </div>

            {/* PREVISUALIZACIÓN TIPO GLASS */}
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-emerald-800 font-bold mb-4">
                    <CheckCircle2 size={24} className="text-emerald-500" />
                    ¡Venta completada y cobrada con éxito!
                </div>

                <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden">
                    <div className="p-10">
                        {/* Componente real para imprimir */}
                        <BillPrintable ref={componentRef} sale={sale} />
                    </div>
                </div>
            </div>
        </div>
    );
};
