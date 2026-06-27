// === Tipe baris mentah CSV ===
export interface TransactionRow {
  order_id: string;
  user_id: string;
  order_date: string;      // format dd/mm/yyyy
  time: string;
  order_hour_of_day: number;
  product_name: string;
  quantity: number;
  price: number;
  category: string;
  product_id: string;
}

// === Keranjang (Basket): satu order_id → daftar produk unik ===
export interface Basket {
  order_id: string;
  user_id: string;
  order_date: string;
  items: string[];         // product_name unik per keranjang
  item_count: number;
}

// === Statistik ringkasan dataset ===
export interface CategoryStat {
  category: string;
  count: number;           // jumlah kemunculan dalam baris transaksi
}

export interface SummaryStats {
  totalTransactions: number;    // jumlah order_id unik
  totalProducts: number;        // jumlah product_name unik
  totalCategories: number;
  avgItemsPerBasket: number;    // rata-rata item unik per keranjang
  dateRange: { from: string; to: string };
  topCategories: CategoryStat[];
  topProduct: { name: string; count: number } | null;
}

// === Aturan Asosiasi ===
export interface AssociationRule {
  antecedent: string[];
  consequent: string[];
  support: number;
  confidence: number;
  lift: number;
}

// === Stok Produk ===
export interface ProductStock {
  id: string;
  product_id: string;
  product_name: string;
  category: string;
  stock: number;
  min_stock: number;
  price: number;
  last_updated: string;
}
