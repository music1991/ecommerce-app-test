import React, { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormField } from "./FormField";

type CustomerStatus = "active" | "inactive" | "suspended";

type CustomerFormData = {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;

  dni?: string;
  phone?: string;
  address?: string;
  initialDebt?: number;

  status: CustomerStatus;
};

export const CustomerForm = ({ initialData, onSave, onCancel }: any) => {
  const isEdit = !!initialData?.id;

  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const [formData, setFormData] = useState<CustomerFormData>({
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    dni: initialData?.dni ?? "",
    address: initialData?.address ?? "",
    initialDebt: initialData?.initialDebt ?? 0,
    status: (initialData?.status as CustomerStatus) ?? "active",

    password: "",
    repeatPassword: "",
  });
  
  const shouldValidatePw = !isEdit || formData.password.trim().length > 0;

  const rules = useMemo(() => {
    const p1 = formData.password ?? "";
    const len = p1.length >= 8;
    const lower = /[a-z]/.test(p1);
    const upper = /[A-Z]/.test(p1);
    const number = /\d/.test(p1);
    const dot = /\./.test(p1);
    const match = p1.length > 0 && p1 === formData.repeatPassword;
    return { len, lower, upper, number, dot, match };
  }, [formData.password, formData.repeatPassword]);

  const allPwOk = Object.values(rules).every(Boolean);

  const canSubmit =
    !!formData.name.trim() &&
    !!formData.email.trim() &&
    (!shouldValidatePw || allPwOk) &&
    (isEdit ? true : !!formData.password.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) return;

    if (!isEdit && !formData.password.trim()) return;

    if (shouldValidatePw && !allPwOk) return;

    const payload: any = {
      name: formData.name.trim(),
      email: formData.email.trim(),

      dni: formData.dni?.trim() || undefined,
      phone: formData.phone?.trim() || undefined,
      address: formData.address?.trim() || undefined,
      initialDebt: Number(formData.initialDebt) || 0,

      status: formData.status,
    };

    if (formData.password.trim()) {
      payload.password = formData.password;
    }

    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Nombre"
          value={formData.name}
          onChange={(v: string) => setFormData({ ...formData, name: v })}
          required
        />

        <FormField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(v: string) => setFormData({ ...formData, email: v })}
          required
        />

        <FormField
          label="DNI"
          value={formData.dni ?? ""}
          onChange={(v: string) => setFormData({ ...formData, dni: v })}
        />

        <FormField
          label="Teléfono"
          value={formData.phone ?? ""}
          onChange={(v: string) => setFormData({ ...formData, phone: v })}
        />

        <FormField
          label="Dirección"
          value={formData.address ?? ""}
          onChange={(v: string) => setFormData({ ...formData, address: v })}
        />

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-600 ml-1">
            Deuda inicial (opcional)
          </label>
          <input
            type="number"
            min={0}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none"
            value={formData.initialDebt ?? 0}
            onChange={(e) => setFormData({ ...formData, initialDebt: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-600 ml-1">
            {isEdit ? "Nueva contraseña (opcional)" : "Contraseña"}
          </label>

          <div className="relative">
            <input
              type={showPw1 ? "text" : "password"}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-12 outline-none"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!isEdit}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPw1((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
              aria-label={showPw1 ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPw1 ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {shouldValidatePw && (
            <div className="text-xs grid grid-cols-2 gap-2 pt-1">
              <span className={rules.len ? "text-green-600" : "text-slate-400"}>• 8+ caracteres</span>
              <span className={rules.lower ? "text-green-600" : "text-slate-400"}>• 1 minúscula</span>
              <span className={rules.upper ? "text-green-600" : "text-slate-400"}>• 1 mayúscula</span>
              <span className={rules.number ? "text-green-600" : "text-slate-400"}>• 1 número</span>
              <span className={rules.dot ? "text-green-600" : "text-slate-400"}>• incluye “.”</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-600 ml-1">
            {isEdit ? "Repetir nueva contraseña" : "Repetir contraseña"}
          </label>

          <div className="relative">
            <input
              type={showPw2 ? "text" : "password"}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-12 outline-none"
              value={formData.repeatPassword}
              onChange={(e) => setFormData({ ...formData, repeatPassword: e.target.value })}
              required={!isEdit}
              disabled={!shouldValidatePw}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPw2((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 disabled:opacity-50"
              aria-label={showPw2 ? "Ocultar contraseña" : "Mostrar contraseña"}
              disabled={!shouldValidatePw}
            >
              {showPw2 ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {shouldValidatePw && (
            <div className={`text-xs pt-1 ${rules.match ? "text-green-600" : "text-red-500"}`}>
              {formData.repeatPassword.length === 0
                ? " "
                : rules.match
                  ? "✓ Las contraseñas coinciden"
                  : "✗ Las contraseñas no coinciden"}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-600 ml-1">Estado</label>
          <select
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as CustomerStatus })}
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="suspended">Suspendido</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4">
                <button
          type="submit"
          disabled={!canSubmit}
          className="w-1/2 py-4 !bg-slate-900 text-white rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEdit ? "Guardar cambios" : "Crear cliente"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-1/2 px-4 py-3 !bg-slate-100 !text-slate-700 font-bold rounded-xl border border-slate-200 hover:!bg-slate-200 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};