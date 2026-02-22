import type { SaleActorType } from "../../api/types/sales.types";
import type { Sale } from "../../features/sales/store/useSalesStore";

export const MOCK_SALES: Sale[] = [
  {
    id: 1,
    actorType: "customer" as SaleActorType,
    actorId: "client-001",
    actorName: "Juan Pérez",
    createdAt: "2026-02-16T10:15:00.000Z",
    status: "cargando",
    assignedToEmployeeId: null,
    items: [
      {
        id: "1",
        name: "MacBook Pro M3",
        price: 2500000,
        quantity: 1,
        images: [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
        ],
      },
      {
        id: "7",
        name: "Logitech MX Master 3S",
        price: 130000,
        quantity: 1,
        images: [
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop",
        ],
      },
    ],
    total: 2630000,
  },

  {
    id: 2,
    actorType: "customer" as SaleActorType,
    actorId: "client-002",
    actorName: "María García",
    createdAt: "2026-02-15T18:30:00.000Z",
    status: "finalizar_en_local",
    assignedToEmployeeId: "emp-001",
    items: [
      {
        id: "2",
        name: "iPhone 15 Pro",
        price: 1800000,
        quantity: 1,
        images: [
          "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1000&auto=format&fit=crop",
        ],
      },
    ],
    total: 1800000,
  },

  {
    id: 3,
    actorType: "customer" as SaleActorType,
    actorId: "client-003",
    actorName: "Carlos López",
    createdAt: "2026-02-14T14:45:00.000Z",
    status: "completada",
    assignedToEmployeeId: "emp-002",
    paidAt: "2026-02-14T15:10:00.000Z",
    completedBy: {
      actorType: "employee" as SaleActorType,
      actorId: "emp-002",
      actorName: "Ana Rodríguez",
      actorEmail: ""
    },
    items: [
      {
        id: "4",
        name: "Sony WH-1000XM5",
        price: 450000,
        quantity: 2,
        images: [
          "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop",
        ],
      },
    ],
    total: 900000,
  },
];
