import { describe, it, expect } from "vitest";
import { runApriori } from "./apriori";
import type { Basket } from "@/types";

describe("Algoritma Apriori", () => {
  // Dataset kecil buatan untuk perhitungan manual
  // N = 5 basket
  const sampleBaskets: Basket[] = [
    { order_id: "1", user_id: "u1", order_date: "01/01/2026", items: ["A", "B", "C"], item_count: 3 },
    { order_id: "2", user_id: "u2", order_date: "01/01/2026", items: ["A", "B"], item_count: 2 },
    { order_id: "3", user_id: "u3", order_date: "01/01/2026", items: ["B", "C"], item_count: 2 },
    { order_id: "4", user_id: "u4", order_date: "01/01/2026", items: ["A", "B", "C"], item_count: 3 },
    { order_id: "5", user_id: "u5", order_date: "01/01/2026", items: ["A", "C"], item_count: 2 },
  ];

  it("harus menemukan frequent itemsets yang benar dengan minSupport = 0.5", () => {
    // Dengan minSupport = 0.5 pada 5 basket, kemunculan minimum (minCount) adalah Math.ceil(0.5 * 5) = 3
    // A muncul 4 kali (Support = 0.8) -> Lolos
    // B muncul 4 kali (Support = 0.8) -> Lolos
    // C muncul 4 kali (Support = 0.8) -> Lolos
    // {A, B} muncul 3 kali (Support = 0.6) -> Lolos
    // {A, C} muncul 3 kali (Support = 0.6) -> Lolos
    // {B, C} muncul 3 kali (Support = 0.6) -> Lolos
    // {A, B, C} hanya muncul 2 kali (Support = 0.4) -> Harus tereliminasi (pruned)

    const { itemsets } = runApriori(sampleBaskets, {
      minSupport: 0.5,
      minConfidence: 0.5,
      maxLen: 3,
    });

    const itemsetsKeys = itemsets.map(i => i.items.join(","));
    
    // Harus memuat item tunggal dan kombinasi berdua
    expect(itemsetsKeys).toContain("A");
    expect(itemsetsKeys).toContain("B");
    expect(itemsetsKeys).toContain("C");
    expect(itemsetsKeys).toContain("A,B");
    expect(itemsetsKeys).toContain("A,C");
    expect(itemsetsKeys).toContain("B,C");

    // Kombinasi bertiga tidak boleh lolos karena support count = 2 (< 3)
    expect(itemsetsKeys).not.toContain("A,B,C");
  });

  it("harus menghasilkan aturan asosiasi dengan metrik support, confidence, dan lift yang benar", () => {
    // Mari evaluasi aturan A -> B:
    // Support(A U B) = Support({A, B}) = 3/5 = 0.6
    // Confidence(A -> B) = Support(A U B) / Support(A) = 0.6 / 0.8 = 0.75
    // Lift(A -> B) = Support(A U B) / (Support(A) * Support(B)) = 0.6 / (0.8 * 0.8) = 0.6 / 0.64 = 0.9375

    const { rules } = runApriori(sampleBaskets, {
      minSupport: 0.5,
      minConfidence: 0.7, // A -> B confidence 0.75 harusnya masuk
      maxLen: 2,
    });

    const ruleAB = rules.find(
      r => r.antecedent.join(",") === "A" && r.consequent.join(",") === "B"
    );

    expect(ruleAB).toBeDefined();
    expect(ruleAB!.support).toBeCloseTo(0.6, 2);
    expect(ruleAB!.confidence).toBeCloseTo(0.75, 2);
    expect(ruleAB!.lift).toBeCloseTo(0.9375, 4);
  });
});
