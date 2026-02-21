import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="space-y-4">
            <h2 className="text-white text-2xl font-black tracking-tighter">TECHSTORE</h2>
            <p className="text-sm leading-relaxed">
              Tu destino premium para la mejor tecnología. Calidad garantizada y envío rápido a todo el país.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-blue-500 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Tienda</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Inicio</a></li>
 {/*              <li><a href="#" className="hover:text-white transition-colors">Productos</a></li> */}
              <li><Link to="/cart" className="hover:text-white transition-colors">Mi Carrito</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Ayuda</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Contacto</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-blue-500" /> info@techstore.com
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-blue-500" /> +54 (11) 1234-5678
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-blue-500" /> Buenos Aires, Argentina
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs uppercase tracking-widest font-bold">
          <p>© 2026 TechStore</p>
{/*           <div className="flex gap-8">
            <span className="text-slate-600">Secure Payments</span>
            <span className="text-slate-600">Global Shipping</span>
          </div> */}
        </div>
      </div>
    </footer>
  );
};