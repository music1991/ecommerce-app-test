import { useMemo, useState } from "react";

import { registerCustomer } from "../../../api/customer.service";
import PasswordRequirements from "../../../shared/components/PasswordRequirement";
import PasswordInput from "../../../shared/components/PasswordInput";
import { useNavigate } from "react-router-dom";
import type { CustomerStatus } from "../../../api/types/customer.types";

export const RegisterCustomerPage = () => {
  const navigation = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    dni: "",
    phone: "",
    address: "",
    password: "",
    status: "active",
  });

  const [pw2, setPw2] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const rules = useMemo(() => {
    const p1 = form.password || "";
    const len = p1.length >= 8;
    const lower = /[a-z]/.test(p1);
    const upper = /[A-Z]/.test(p1);
    const number = /\d/.test(p1);
    const dot = /\./.test(p1);
    const match = p1.length > 0 && p1 === pw2;
    return { len, lower, upper, number, dot, match };
  }, [form.password, pw2]);

  const allPwOk = Object.values(rules).every(Boolean);

  const handleChange = (key) => (e) => {
    setErrorMsg("");
    setSuccessMsg("");
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validaciones mínimas
    if (!form.name.trim() || !form.email.trim()) {
      setErrorMsg("Nombre y email son obligatorios.");
      return;
    }
    if (!form.password.trim()) {
      setErrorMsg("La contraseña es obligatoria.");
      return;
    }
    if (!allPwOk) {
      setErrorMsg(!rules.match ? "Las contraseñas no coinciden." : "La contraseña no cumple los requisitos.");
      return;
    }

    setSubmitting(true);
    try {
      // payload final (mock)
      const status: CustomerStatus = "active";

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,

        dni: form.dni.trim() || undefined,
        phone: form.phone.trim() || undefined,
        address: form.address.trim() || undefined,

        status: status,
      };

      const res = await registerCustomer(payload);

      setSuccessMsg(res.message || "Cliente registrado correctamente.");
      setForm({
        name: "",
        email: "",
        dni: "",
        phone: "",
        address: "",
        password: "",
        status: "active"
      });
      setPw2("");
    } catch (err) {
      setErrorMsg(err?.message || "No se pudo registrar el cliente.");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = !submitting && form.name.trim() && form.email.trim() && allPwOk;

  const onGoToLogin = () => navigation("/login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070a] p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] shadow-2xl z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white tracking-tight uppercase">
            Registro de <span className="text-blue-500">Cliente</span>
          </h2>
          <p className="text-gray-400 mt-3 text-sm">
            Crea tu cuenta para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-xs text-center animate-pulse">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-xl text-xs text-center">
              {successMsg}
            </div>
          )}

          {/* Nombre */}
          <div className="group">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Nombre *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={handleChange("name")}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="Juan Pérez"
            />
          </div>

          {/* Email */}
          <div className="group">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={handleChange("email")}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="juan@mail.com"
            />
          </div>

          {/* Password + Repeat */}
          <PasswordInput
            label="Contraseña"
            required
            value={form.password}
            onChange={handleChange("password")}
          />

          <PasswordInput
            label="Repetir contraseña"
            required
            value={pw2}
            onChange={(e) => {
              setErrorMsg("");
              setSuccessMsg("");
              setPw2(e.target.value);
            }}
          />

          <PasswordRequirements rules={rules} />

          {/* Opcionales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                DNI
              </label>
              <input
                type="text"
                value={form.dni}
                onChange={handleChange("dni")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="12345678"
              />
            </div>

            <div className="group">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Teléfono
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={handleChange("phone")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="11 3344 5566"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Dirección
            </label>
            <input
              type="text"
              value={form.address}
              onChange={handleChange("address")}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="Calle 123, Ciudad"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] mt-2
              ${
                canSubmit
                  ? "bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                  : "bg-blue-600/40 cursor-not-allowed"
              }`}
          >
            {submitting ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <div className="mt-10 flex flex-col space-y-4 text-center">
          <div className="pt-6 border-t border-white/5" />
          <button
            type="button"
            onClick={onGoToLogin}
            className="text-xs text-gray-500 hover:text-blue-400 transition-colors"
          >
            ← Volver al login
          </button>
        </div>
      </div>
    </div>
  );
};