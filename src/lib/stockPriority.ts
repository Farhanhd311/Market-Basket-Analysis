import type { AssociationRule } from "@/types";

export interface StockRow {
  id: string;
  productId: string;
  productName: string;
  category: string;
  currentStock: number;
  minThreshold: number;
}

export interface RestockPriority {
  productName: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  deficiency: number;
  maxLift: number;
  score: number; // lift × kelangkaan
  reason: string;
}

/**
 * Silangkan aturan asosiasi (dari run Apriori terakhir) dengan data stok.
 * Produk yang menjadi CONSEQUENT dari aturan ber-lift tinggi dan stoknya ≤ minThreshold
 * masuk dalam daftar prioritas restock dengan alasan yang jelas.
 *
 * Formula skor: lift × scarcity
 * di mana scarcity = max(0, (minThreshold - currentStock) / minThreshold)
 */
export function computeRestockPriority(
  rules: AssociationRule[],
  stocks: StockRow[]
): RestockPriority[] {
  if (rules.length === 0 || stocks.length === 0) return [];

  // Buat lookup stok berdasarkan productName (lowercase untuk toleransi case)
  const stockMap = new Map<string, StockRow>();
  for (const s of stocks) {
    stockMap.set(s.productName.toLowerCase(), s);
  }

  // Kumpulkan best rule per produk consequent
  // Key = productName consequent, Value = aturan terkuat
  const bestRuleMap = new Map<string, AssociationRule>();

  for (const rule of rules) {
    for (const cons of rule.consequent) {
      const key = cons.toLowerCase();
      const existing = bestRuleMap.get(key);
      if (!existing || rule.lift > existing.lift) {
        bestRuleMap.set(key, rule);
      }
    }
  }

  const priorities: RestockPriority[] = [];

  for (const [consKey, rule] of bestRuleMap.entries()) {
    const stock = stockMap.get(consKey);
    if (!stock) continue; // Produk tidak ada di DB stok

    // Hanya masukkan jika stok ≤ minThreshold
    if (stock.currentStock > stock.minThreshold) continue;

    const deficiency = stock.minThreshold - stock.currentStock;
    const scarcity =
      stock.minThreshold > 0 ? deficiency / stock.minThreshold : 0;
    const score = Number((rule.lift * scarcity).toFixed(4));

    // Bangun alasan yang informatif
    const antecedentStr = rule.antecedent.join(", ");
    const reason =
      `Terkait produk laris [${antecedentStr}] via aturan [${antecedentStr} → ${rule.consequent.join(", ")}], ` +
      `lift=${rule.lift.toFixed(3)} (conf=${(rule.confidence * 100).toFixed(1)}%); ` +
      `stok ${stock.productName} = ${stock.currentStock} ≤ ambang ${stock.minThreshold}`;

    priorities.push({
      productName: stock.productName,
      category: stock.category,
      currentStock: stock.currentStock,
      minThreshold: stock.minThreshold,
      deficiency,
      maxLift: rule.lift,
      score,
      reason,
    });
  }

  // Urutkan berdasarkan skor tertinggi (lift × kelangkaan)
  return priorities.sort((a, b) => b.score - a.score);
}
