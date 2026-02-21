import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { MOCK_CUSTOMERS_AUTH_DB } from "../../../shared/mocks/customersAuth.mock";
import { MOCK_STAFF_DB } from "../../../shared/mocks/staff.mock";
import { ArrowRight } from "lucide-react"; // Importamos el icono

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailKey = email.toLowerCase().trim();

    const staffUser = MOCK_STAFF_DB[emailKey];
    if (staffUser) {
      if (staffUser.password !== password) {
        setError("Credenciales inválidas.");
        return;
      }
      if (staffUser.status !== "active") {
        setError("Tu cuenta no está activa.");
        return;
      }

      login({
        id: staffUser.id,
        name: staffUser.name,
        email: staffUser.email,
        role: staffUser.role,
      });
      return;
    }

    const customerUser = MOCK_CUSTOMERS_AUTH_DB[emailKey];
    if (customerUser) {
      if (customerUser.password !== password) {
        setError("Credenciales inválidas.");
        return;
      }
      if (customerUser.status !== "active") {
        setError("Tu cuenta no está activa.");
        return;
      }

      login({
        id: customerUser.id,
        name: customerUser.name,
        email: customerUser.email,
        role: "customer",
      });
      return;
    }

    setError("Credenciales inválidas. Intenta nuevamente.");
  };

  const onGoRegister = () => navigation("/customerRegister");
  const onSkipLogin = () => navigation("/"); // Función para entrar como invitado

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070a] p-4 relative overflow-hidden">
      {/* --- BOTÓN INVITADO (Esquina superior derecha) --- */}
      <button
        onClick={onSkipLogin}
        className="absolute top-8 right-8 z-20 flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white text-xs font-bold uppercase tracking-widest transition-all group active:scale-95"
      >
        Entrar como invitado
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Fondos de gradiente */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] shadow-2xl z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white tracking-tight uppercase">
            Inicia Sesión en <span className="text-blue-500">TechStore</span>
          </h2>
          <p className="text-gray-400 mt-3 text-sm">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-xs text-center animate-pulse">
              {error}
            </div>
          )}

          <div className="group">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="admin@techstore.com"
            />
          </div>

          <div className="group">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all transform active:scale-[0.98] mt-4"
          >
            Entrar
          </button>
        </form>

        <div className="mt-10 flex flex-col space-y-4 text-center">
          <div className="pt-6 border border-white">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">
              Usuarios de prueba:
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-[16px] text-gray-400">
              <span className="bg-white/5 px-2 py-1 rounded">admin@techstore.com</span>
              <span className="bg-white/5 px-2 py-1 rounded">emp@techstore.com</span>
              <span className="bg-white/5 px-2 py-1 rounded">user@techstore.com</span>
            </div>
            <p className="text-[16px] text-white mt-2">
              (Passwords mock: Admin.123 / Emp.1234 / User.1234)
            </p>
          </div>

          <a
            href="#"
            className="text-xs text-gray-500 hover:text-blue-400 transition-colors pt-4"
          >
            ¿Olvidaste tu contraseña?
          </a>

          <p className="text-sm text-gray-400">
            ¿No tienes cuenta?{" "}
            <span
              onClick={onGoRegister}
              className="text-blue-500 font-bold cursor-pointer hover:underline"
            >
              Regístrate
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
