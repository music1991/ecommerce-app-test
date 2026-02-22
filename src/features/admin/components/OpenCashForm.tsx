import React, { useState } from 'react';
import { DollarSign, FileText } from 'lucide-react';

export const OpenCashForm = ({ onSave, onCancel }: any) => {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
      initial_amount: Number(amount), 
      notes: notes.trim() || "Apertura de turno" 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Campo Monto */}
        <div className="group">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
            Monto Inicial en Caja ($)
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <DollarSign size={20} />
            </div>
            <input
              type="number"
              required
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-slate-800 font-bold focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
        </div>

        {/* Campo Notas */}
        <div className="group">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
            Notas de Apertura (Opcional)
          </label>
          <div className="relative">
            <div className="absolute left-4 top-4 text-slate-400">
              <FileText size={20} />
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Fondo para cambio de moneda..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-slate-800 font-medium focus:outline-none focus:border-blue-500/50 transition-all min-h-[100px]"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="w-1/2 px-4 py-3 !bg-slate-100 !text-slate-700 font-bold rounded-xl border border-slate-200 hover:!bg-slate-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-4 !bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
        >
          Abrir Caja
        </button>
      </div>
    </form>
  );
};
