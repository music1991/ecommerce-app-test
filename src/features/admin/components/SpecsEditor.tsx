import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface Spec { key: string; value: string; }

interface SpecsEditorProps {
  specs: Spec[];
  onChange: (specs: Spec[]) => void;
}

export const SpecsEditor = ({ specs, onChange }: SpecsEditorProps) => {
  const handleSpecChange = (index: number, field: keyof Spec, val: string) => {
    const updated = specs.map((s, i) => i === index ? { ...s, [field]: val } : s);
    onChange(updated);
  };

  const addSpec = () => onChange([...specs, { key: "", value: "" }]);
  const removeSpec = (index: number) => onChange(specs.filter((_, i) => i !== index));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-black text-slate-800 uppercase tracking-wider">Especificaciones</p>
        <button type="button" onClick={addSpec} className="bg-blue-50 text-blue-600 p-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
          <Plus size={18} />
        </button>
      </div>
      <div className="space-y-3">
        {specs.map((s, i) => (
          <div key={i} className="flex gap-3">
            <input placeholder="Ej: Procesador" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none" value={s.key} onChange={e => handleSpecChange(i, "key", e.target.value)} />
            <input placeholder="Ej: M3 Max" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none" value={s.value} onChange={e => handleSpecChange(i, "value", e.target.value)} />
            {specs.length > 1 && (
              <button type="button" onClick={() => removeSpec(i)} className="px-3 text-slate-300 hover:text-rose-600 transition-colors">
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};