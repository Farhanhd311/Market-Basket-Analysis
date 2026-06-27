import fs from "fs";
import path from "path";
import Papa from "papaparse";
import type { TransactionRow, Basket, SummaryStats } from "@/types";
import { prisma } from "./db";


// ─── Path CSV ──────────────────────────────────────────────────────────────
const CSV_PATH = path.join(process.cwd(), "data", "transactions.csv");

// ─── Module-level memoization (persist across requests dalam satu proses) ──
let _rows: TransactionRow[] | null = null;
let _baskets: Basket[] | null = null;
let _stats: SummaryStats | null = null;

// ─── Helper: parse tanggal dd/mm/yyyy → Date ───────────────────────────────
function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

// ─── 1. parseTransactions() ────────────────────────────────────────────────
export function parseTransactions(): TransactionRow[] {
  if (_rows) return _rows;

  if (!fs.existsSync(CSV_PATH)) {
    console.warn("[data] transactions.csv tidak ditemukan — mengembalikan array kosong.");
    _rows = [];
    return _rows;
  }

  const raw = fs.readFileSync(CSV_PATH, "utf-8");

  const result = Papa.parse<Record<string, string>>(raw, {
    header: true,
    delimiter: ";",
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  _rows = result.data.map((r): TransactionRow => ({
    order_id:           String(r.order_id ?? "").trim(),
    user_id:            String(r.user_id ?? "").trim(),
    order_date:         String(r.order_date ?? "").trim(),
    time:               String(r.time ?? "").trim(),
    order_hour_of_day:  Number(r.order_hour_of_day) || 0,
    product_name:       String(r.product_name ?? "").trim(),
    quantity:           Number(r.quantity) || 1,
    price:              Number(r.price) || 0,
    category:           String(r.category ?? "").trim(),
    product_id:         String(r.product_id ?? "").trim(),
  })).filter((r) => r.order_id && r.product_name);

  return _rows;
}

// ─── 2. buildBaskets() ─────────────────────────────────────────────────────
export function buildBaskets(): Basket[] {
  if (_baskets) return _baskets;

  const rows = parseTransactions();

  // Group baris berdasarkan order_id
  const map = new Map<string, { user_id: string; order_date: string; products: Set<string> }>();

  for (const row of rows) {
    if (!map.has(row.order_id)) {
      map.set(row.order_id, {
        user_id:    row.user_id,
        order_date: row.order_date,
        products:   new Set(),
      });
    }
    map.get(row.order_id)!.products.add(row.product_name);
  }

  _baskets = Array.from(map.entries()).map(([order_id, data]) => {
    const items = Array.from(data.products).sort();
    return {
      order_id,
      user_id:    data.user_id,
      order_date: data.order_date,
      items,
      item_count: items.length,
    };
  });

  return _baskets;
}

// ─── 3. getSummaryStats() ──────────────────────────────────────────────────
export function getSummaryStats(): SummaryStats {
  if (_stats) return _stats;

  const rows = parseTransactions();
  const baskets = buildBaskets();

  if (rows.length === 0) {
    _stats = {
      totalTransactions: 0,
      totalProducts: 0,
      totalCategories: 0,
      avgItemsPerBasket: 0,
      dateRange: { from: "-", to: "-" },
      topCategories: [],
      topProduct: null,
    };
    return _stats;
  }

  // Hitung produk & kategori unik
  const productSet = new Set<string>();
  const categorySet = new Set<string>();
  const categoryCount = new Map<string, number>();
  const productCount  = new Map<string, number>();

  for (const row of rows) {
    productSet.add(row.product_name);
    categorySet.add(row.category);

    categoryCount.set(row.category, (categoryCount.get(row.category) ?? 0) + 1);
    productCount.set(row.product_name, (productCount.get(row.product_name) ?? 0) + 1);
  }

  // Rentang tanggal
  const dates = rows.map((r) => parseDate(r.order_date)).filter((d) => !isNaN(d.getTime()));
  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

  // Top 7 kategori berdasarkan jumlah baris transaksi
  const topCategories = Array.from(categoryCount.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  // Top produk
  const topProductEntry = Array.from(productCount.entries()).sort((a, b) => b[1] - a[1])[0];
  const topProduct = topProductEntry
    ? { name: topProductEntry[0], count: topProductEntry[1] }
    : null;

  // Rata-rata item per keranjang
  const totalItems = baskets.reduce((s, b) => s + b.item_count, 0);
  const avgItemsPerBasket = baskets.length > 0
    ? Math.round((totalItems / baskets.length) * 100) / 100
    : 0;

  _stats = {
    totalTransactions: baskets.length,
    totalProducts:     productSet.size,
    totalCategories:   categorySet.size,
    avgItemsPerBasket,
    dateRange: {
      from: dates.length ? fmt(minDate) : "-",
      to:   dates.length ? fmt(maxDate) : "-",
    },
    topCategories,
    topProduct,
  };

  return _stats;
}

// ─── Reset cache (berguna untuk hot reload / testing) ─────────────────────
export function resetCache(): void {
  _rows = null;
  _baskets = null;
  _stats = null;
}

// ─── 4. seedStockIfEmpty() ─────────────────────────────────────────────────
export async function seedStockIfEmpty() {
  try {
    const count = await prisma.stock.count();
    if (count > 0) return; // Sudah ada data, skip

    const rows = parseTransactions();
    if (rows.length === 0) return;

    // Group by product_name → 68 produk unik
    const productMap = new Map<string, { category: string }>();
    for (const r of rows) {
      if (!productMap.has(r.product_name)) {
        productMap.set(r.product_name, { category: r.category });
      }
    }

    let idx = 0;
    for (const [name, info] of productMap.entries()) {
      const productId = String(idx + 1).padStart(3, "0");
      // Stok acak 0–80, seed deterministik berdasarkan idx
      const currentStock = (idx * 37 + 13) % 81; // 0–80, deterministik
      await prisma.stock.upsert({
        where: { productId },
        update: {},
        create: {
          productId,
          productName: name,
          category: info.category,
          currentStock,
          minThreshold: 15,
        },
      });
      idx++;
    }
    console.log(`[data] Seeded ${idx} unique stocks into SQLite.`);
  } catch (error) {
    console.error("[data] Error seeding stocks:", error);
  }
}

// Alias untuk backward compat (dipakai di halaman lama)
export const seedProductsIfEmpty = seedStockIfEmpty;
