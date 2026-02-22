export let MOCK_CASH_REGISTERS: any[] = [
  {
    id: 1,
    user_id: 1,
    user_name: "Admin TechStore",
    status: "open",
    initial_amount: 500.00,
    current_amount: 650.00,
    opened_at: new Date().toISOString(),
    notes: "Turno mañana"
  }
];

export let MOCK_CASH_MOVEMENTS: any[] = [
  { id: 1, cash_register_id: 1, type: "in", amount: 150.00, description: "Venta #201", created_at: new Date().toISOString() }
];