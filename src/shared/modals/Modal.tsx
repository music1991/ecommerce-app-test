import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  // Añadimos una prop opcional para controlar el ancho si quieres reusarlo en modales pequeños
  size?: 'md' | 'lg' | '2xl' | '6xl'; 
}

export const Modal = ({ isOpen, onClose, title, children, size = '6xl' }: ModalProps) => {
  if (!isOpen) return null;

  // Mapa de tamaños para mantener flexibilidad
  const sizeClasses = {
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    '2xl': 'max-w-2xl',
    '6xl': 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Contenedor del Modal */}
      <div className={`relative bg-white w-full ${sizeClasses[size]} rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]`}>
        
        {/* Header - Fijo arriba */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white rounded-t-3xl">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-all"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body - Con Scroll interno si el contenido es largo */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};