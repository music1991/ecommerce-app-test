import type { Product } from "../../../core/entities/Product";

export interface ProductWithDetails extends Product {
  longDescription?: string;
  specs?: Record<string, string>;
}

export const MOCK_PRODUCTS: ProductWithDetails[] = [
  {
    id: "1",
    name: "MacBook Pro M3",
    description: "La laptop más potente para profesionales.",
    longDescription: "La MacBook Pro de 14 pulgadas vuela con el chip M3, un chip increíblemente avanzado que ofrece una velocidad y capacidad excepcionales. Con una duración de batería líder en su clase de hasta 22 horas y una hermosa pantalla Liquid Retina XDR, es una laptop pro sin igual.",
    price: 2500000,
    category: "cat-1", // Laptops
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop"],
    stock: 10,
    isNew: true,
    specs: {
      "Procesador": "Apple M3 Max (14 núcleos CPU)",
      "GPU": "30 núcleos (Trazado de rayos)",
      "RAM": "36GB Memoria Unificada",
      "Pantalla": "14.2\" Liquid Retina XDR",
      "Puertos": "SDXC, HDMI, MagSafe 3"
    }
  },
  {
    id: "2",
    name: "iPhone 15 Pro",
    description: "Cámara de titanio y chip A17 Pro.",
    longDescription: "Forjado en titanio y con el innovador chip A17 Pro, el iPhone 15 Pro es el iPhone más potente hasta la fecha. Con un sistema de cámaras Pro que equivale a tener siete lentes profesionales en el bolsillo.",
    price: 1800000,
    category: "cat-2", // Smartphones
    images: ["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1000&auto=format&fit=crop"],
    stock: 15,
    specs: {
      "Material": "Titanio aeroespacial",
      "Chip": "A17 Pro (Arquitectura 3nm)",
      "Cámara": "48MP Principal",
      "Conector": "USB-C (Velocidad USB 3)"
    }
  },
  {
    id: "3",
    name: "Razer Blade 16",
    description: "Gaming extremo con RTX 4090.",
    longDescription: "Experimente un rendimiento de nivel de escritorio con la Razer Blade 16. Equipada con el procesador Intel Core i9-13950X de 24 núcleos y la GPU NVIDIA GeForce RTX 4090.",
    price: 3200000,
    category: "cat-1", // Laptops
    images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000&auto=format&fit=crop"],
    stock: 4,
    specs: {
      "Procesador": "Intel Core i9-13950HX",
      "Gráficos": "NVIDIA RTX 4090 (16GB VRAM)",
      "Pantalla": "Mini-LED Dual Mode",
      "Refrigeración": "Cámara de vapor"
    }
  },
  {
    id: "4",
    name: "Sony WH-1000XM5",
    description: "Líder en cancelación de ruido.",
    longDescription: "Con dos procesadores que controlan ocho micrófonos, estos auriculares ofrecen una cancelación de ruido sin precedentes y una calidad de llamada excepcional.",
    price: 450000,
    category: "cat-3", // Componentes (u Otros)
    images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop"],
    stock: 20,
    specs: {
      "Autonomía": "Hasta 30 horas",
      "Carga": "3 min para 3 horas de uso",
      "Drivers": "30mm fibra de carbono",
      "Bluetooth": "Versión 5.2"
    }
  },
  {
    id: "5",
    name: "Samsung Odyssey Neo G9",
    description: "Monitor curvo 49' Dual Quad HD.",
    longDescription: "Sumérgete en la acción como nunca antes. Con su pantalla curva de 1000R y tecnología Quantum Mini-LED, el Odyssey Neo G9 ofrece una profundidad y detalle de color que redefine el gaming envolvente.",
    price: 1500000,
    category: "cat-3", // Componentes (u Otros)
    images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop"],
    stock: 3,
    isNew: true,
    specs: {
      "Resolución": "5120 x 1440 (DQHD)",
      "Tasa Refresco": "240Hz",
      "Tiempo Respuesta": "1ms (GtG)",
      "Curvatura": "1000R"
    }
  },
  {
    id: "6",
    name: "Keychron Q6 Pro",
    description: "Teclado mecánico custom inalámbrico.",
    longDescription: "Un teclado mecánico inalámbrico QMK/VIA con cuerpo de aluminio completo, diseño de montaje en junta y teclas PBT de doble disparo.",
    price: 280000,
    category: "cat-3", // Componentes (u Otros)
    images: ["https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop"],
    stock: 8,
    specs: {
      "Material": "Aluminio CNC",
      "Switches": "Keychron K Pro Red",
      "Conectividad": "Bluetooth 5.1 / USB-C",
      "Compatibilidad": "Windows, macOS, Linux"
    }
  },
  {
    id: "7",
    name: "Logitech MX Master 3S",
    description: "El mouse definitivo para productividad.",
    longDescription: "Un ícono remasterizado. Siente cada momento de tu flujo de trabajo con aún más precisión, tactilidad y rendimiento gracias a los clics discretos y un sensor de 8.000 DPI.",
    price: 130000,
    category: "cat-3", // Componentes (u Otros)
    images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop"],
    stock: 25,
    specs: {
      "Sensor": "8K DPI Darkfield",
      "Botones": "7 botones personalizables",
      "Scroll": "MagSpeed electromagnético",
      "Multidispositivo": "Hasta 3 equipos"
    }
  },
  {
    id: "8",
    name: "NVIDIA RTX 4080 Super",
    description: "Domina el trazado de rayos con DLSS 3.5.",
    longDescription: "La NVIDIA GeForce RTX 4080 Super ofrece el rendimiento y las funciones que los jugadores y creadores entusiastas exigen.",
    price: 1400000,
    category: "cat-3", // Componentes
    images: ["https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1000&auto=format&fit=crop"],
    stock: 2,
    isNew: true,
    specs: {
      "Arquitectura": "Ada Lovelace",
      "Núcleos CUDA": "10240",
      "Memoria": "16GB GDDR6X",
      "Consumo": "320W TGP"
    }
  },
  {
    id: "9",
    name: "iPad Pro M4",
    description: "Lo más delgado de Apple hasta hoy.",
    longDescription: "Con la pantalla Ultra Retina XDR más avanzada del mundo y el rendimiento escandaloso del chip M4.",
    price: 1600000,
    category: "cat-2", // Smartphones (Tablets)
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop"],
    stock: 12,
    isNew: true,
    specs: {
      "Chip": "Apple M4",
      "Pantalla": "Tandem OLED",
      "Grosor": "5.1 mm",
      "Cámara": "12MP con Escáner LiDAR"
    }
  },
  {
    id: "10",
    name: "ASUS ROG Swift OLED",
    description: "Velocidad OLED inigualable.",
    longDescription: "Monitor gaming OLED de 27 pulgadas con resolución 1440p y una asombrosa tasa de refresco de 240Hz.",
    price: 1100000,
    category: "cat-3", // Componentes (u Otros)
    images: ["https://images.unsplash.com/photo-1547115941-954500b6ed8a?q=80&w=1000&auto=format&fit=crop"],
    stock: 5,
    specs: {
      "Panel": "OLED",
      "Refresco": "240Hz",
      "Tiempo": "0.03ms (GtG)",
      "G-Sync": "Compatible"
    }
  },
  {
    id: "11",
    name: "Samsung 990 Pro 2TB",
    description: "El SSD NVMe más rápido del mercado.",
    longDescription: "Alcanza velocidades de lectura y escritura secuenciales de hasta 7450/6900 MB/s.",
    price: 250000,
    category: "cat-3", // Componentes
    images: ["https://images.unsplash.com/photo-1597872200370-493dea939c67?q=80&w=1000&auto=format&fit=crop"],
    stock: 30,
    specs: {
      "Capacidad": "2TB",
      "Interfaz": "PCIe Gen 4.0 x4",
      "Lectura": "7450 MB/s",
      "Escritura": "6900 MB/s"
    }
  },
  {
    id: "12",
    name: "Elgato Wave:3",
    description: "Micrófono premium para streaming.",
    longDescription: "Micrófono de condensador premium y solución de mezcla digital que combina la comodidad de conectar y usar con circuitos de grado profesional.",
    price: 190000,
    category: "cat-3", // Componentes (u Otros)
    images: ["https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop"],
    stock: 10,
    specs: {
      "Tipo": "Condensador electret",
      "Patrón": "Cardioide",
      "Resolución": "24-bit / 96kHz",
      "Clipguard": "Tecnología antidistorsión"
    }
  }
];


export const getProducts = async (): Promise<ProductWithDetails[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PRODUCTS), 800);
  });
};