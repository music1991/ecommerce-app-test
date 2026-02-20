import React from "react";

function Item({ ok, children }) {
  return (
    <li className={`flex items-center gap-2 text-xs ${ok ? "text-green-400" : "text-gray-400"}`}>
      <span className={`inline-block w-2 h-2 rounded-full ${ok ? "bg-green-400" : "bg-gray-600"}`} />
      <span>{children}</span>
    </li>
  );
}

export default function PasswordRequirements({ rules }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">
        Requisitos de contraseña
      </p>
      <ul className="space-y-2">
        <Item ok={rules.len}>Mínimo 8 caracteres</Item>
        <Item ok={rules.lower}>Al menos 1 minúscula</Item>
        <Item ok={rules.upper}>Al menos 1 mayúscula</Item>
        <Item ok={rules.number}>Al menos 1 número</Item>
        <Item ok={rules.dot}>Debe incluir un punto “.”</Item>
        <Item ok={rules.match}>Las contraseñas coinciden</Item>
      </ul>
    </div>
  );
}