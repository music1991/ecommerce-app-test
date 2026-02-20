import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function PasswordInput({
  label,
  value,
  onChange,
  placeholder = "••••••••",
  required = false,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="group">
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
        {label}{required ? " *" : ""}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          placeholder={placeholder}
        />

        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors text-sm"
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {!show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}


