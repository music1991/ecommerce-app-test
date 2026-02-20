import type { Sale } from "../features/sales/store/useSalesStore";
import { MOCK_SALES } from "../shared/mocks/sales.mock";

const KEY = "sales-db";

type SalesDB = {
  lastId: number;
  rows: Sale[];
};

const sleep = (ms = 250) => new Promise((r) => setTimeout(r, ms));

const readDB = (): SalesDB => {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const lastId = MOCK_SALES.length ? Math.max(...MOCK_SALES.map((s) => s.id)) : 0;
    const seed: SalesDB = { lastId, rows: MOCK_SALES };
    localStorage.setItem(KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw) as SalesDB;
};

const writeDB = (db: SalesDB) => {
  localStorage.setItem(KEY, JSON.stringify(db));
};


export const salesDB = {
  async list(): Promise<Sale[]> {
    await sleep();
    return readDB().rows;
  },

  async get(id: number): Promise<Sale | undefined> {
    await sleep();
    return readDB().rows.find((s) => s.id === id);
  },

  async create(data: Omit<Sale, "id">): Promise<Sale> {
    await sleep();
    const db = readDB();
    const nextId = db.lastId + 1;
    const row: Sale = { id: nextId, ...data };
    db.lastId = nextId;
    db.rows = [row, ...db.rows];
    writeDB(db);
    return row;
  },

  async update(id: number, patch: Partial<Omit<Sale, "id">>): Promise<Sale | undefined> {
    await sleep();
    const db = readDB();
    const idx = db.rows.findIndex((s) => s.id === id);
    if (idx === -1) return undefined;

    db.rows[idx] = { ...db.rows[idx], ...patch };
    writeDB(db);
    return db.rows[idx];
  },

  async remove(id: number): Promise<void> {
    await sleep();
    const db = readDB();
    db.rows = db.rows.filter((s) => s.id !== id);
    writeDB(db);
  },

  async resetToSeed(): Promise<void> {
    await sleep();
    localStorage.removeItem(KEY);
    readDB();
  },
};
