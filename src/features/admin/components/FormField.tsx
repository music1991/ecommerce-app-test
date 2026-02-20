import React from "react";

interface FormFieldProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}

export const FormField = ({ label, value, onChange, type = "text", required, className }: FormFieldProps) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-sm font-bold text-slate-600 ml-1">{label}</label>
    <input
      required={required}
      type={type}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);