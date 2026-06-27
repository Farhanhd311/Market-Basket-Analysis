import type { Basket, AssociationRule } from "@/types";

// Helper: Memeriksa apakah subset berada di dalam himpunan barang di keranjang
function isSubset(itemset: string[], basketItems: Set<string>): boolean {
  for (const item of itemset) {
    if (!basketItems.has(item)) return false;
  }
  return true;
}

// Helper: Menghasilkan kombinasi subset berukuran n-1
function getSubsetsOfSize(arr: string[], size: number): string[][] {
  const result: string[][] = [];
  const combine = (current: string[], start: number) => {
    if (current.length === size) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      current.push(arr[i]);
      combine(current, i + 1);
      current.pop();
    }
  };
  combine([], 0);
  return result;
}

// ─── 1. findFrequentItemsets ───────────────────────────────────────────────
export function findFrequentItemsets(
  baskets: Basket[],
  minSupport: number,
  maxLen: number = 3
): Map<string, number> {
  const totalBaskets = baskets.length;
  const minCount = Math.ceil(minSupport * totalBaskets);
  
  // Map untuk menyimpan semua frequent itemsets dan support count mereka
  // Key: string terurut yang digabung dengan koma (contoh: "Apple,Bread")
  // Value: support count (kemunculan absolut)
  const frequentItemsets = new Map<string, number>();

  if (totalBaskets === 0) return frequentItemsets;

  // Siapkan basketItems sebagai Set untuk pencarian cepat O(1)
  const basketSets = baskets.map(b => new Set(b.items));

  // --- Level 1: Frequent 1-itemsets (L1) ---
  const itemCounts = new Map<string, number>();
  for (const basket of baskets) {
    for (const item of basket.items) {
      itemCounts.set(item, (itemCounts.get(item) ?? 0) + 1);
    }
  }

  // Filter L1 berdasarkan support minimum
  const l1: string[][] = [];
  for (const [item, count] of itemCounts.entries()) {
    if (count >= minCount) {
      l1.push([item]);
      frequentItemsets.set(item, count);
    }
  }

  // Urutkan L1 secara alfabetis
  l1.sort((a, b) => a[0].localeCompare(b[0]));

  let currentL = l1;
  let k = 2;

  while (currentL.length > 0 && k <= maxLen) {
    const candidates: string[][] = [];

    // --- Join Step ---
    for (let i = 0; i < currentL.length; i++) {
      for (let j = i + 1; j < currentL.length; j++) {
        const itemsetA = currentL[i];
        const itemsetB = currentL[j];

        // Gabungkan jika elemen pertama k-2 bernilai sama
        let canJoin = true;
        for (let p = 0; p < k - 2; p++) {
          if (itemsetA[p] !== itemsetB[p]) {
            canJoin = false;
            break;
          }
        }

        if (canJoin) {
          // Buat candidate baru dengan menggabungkan elemen terakhir
          const candidate = [...itemsetA, itemsetB[k - 2]];
          candidate.sort(); // Pastikan selalu terurut alfabetis
          candidates.push(candidate);
        }
      }
    }

    // --- Prune Step ---
    // Pastikan semua subset berukuran k-1 dari kandidat juga merupakan frequent itemset
    const prunedCandidates: string[][] = [];
    for (const candidate of candidates) {
      let isCandidateFrequent = true;
      const subItemsets = getSubsetsOfSize(candidate, k - 1);
      
      for (const sub of subItemsets) {
        const key = sub.join(",");
        if (!frequentItemsets.has(key)) {
          isCandidateFrequent = false;
          break;
        }
      }
      
      if (isCandidateFrequent) {
        prunedCandidates.push(candidate);
      }
    }

    // --- Count Support ---
    const candidateCounts = new Map<string, number>();
    for (const candidate of prunedCandidates) {
      const key = candidate.join(",");
      let count = 0;
      for (const bSet of basketSets) {
        if (isSubset(candidate, bSet)) {
          count++;
        }
      }
      if (count >= minCount) {
        candidateCounts.set(key, count);
      }
    }

    // --- Filter Lk ---
    const nextL: string[][] = [];
    for (const [key, count] of candidateCounts.entries()) {
      nextL.push(key.split(","));
      frequentItemsets.set(key, count);
    }

    currentL = nextL;
    k++;
  }

  return frequentItemsets;
}

// ─── 2. generateRules ──────────────────────────────────────────────────────
export function generateRules(
  frequentItemsets: Map<string, number>,
  baskets: Basket[],
  minConfidence: number
): AssociationRule[] {
  const totalBaskets = baskets.length;
  const rules: AssociationRule[] = [];

  if (totalBaskets === 0) return rules;

  // Iterasi semua frequent itemsets yang berukuran >= 2
  for (const [key, itemsetCount] of frequentItemsets.entries()) {
    const itemset = key.split(",");
    if (itemset.length < 2) continue;

    const supportXY = itemsetCount / totalBaskets;

    // Hasilkan semua kemungkinan subset non-kosong untuk sisi kiri (antecedent / X)
    for (let size = 1; size < itemset.length; size++) {
      const subsets = getSubsetsOfSize(itemset, size);

      for (const antecedent of subsets) {
        const antecedentKey = antecedent.join(",");
        const antecedentCount = frequentItemsets.get(antecedentKey);

        if (!antecedentCount) continue;

        // Hitung confidence: support(X U Y) / support(X)
        const confidence = itemsetCount / antecedentCount;

        if (confidence >= minConfidence) {
          // Consequent (Y) adalah sisa item di itemset yang tidak ada di antecedent (X)
          const consequent = itemset.filter(item => !antecedent.includes(item));
          
          // Hitung support untuk consequent (Y) secara independen
          const consequentKey = consequent.join(",");
          const consequentCount = frequentItemsets.get(consequentKey);
          
          if (!consequentCount) continue;

          const supportY = consequentCount / totalBaskets;

          // Hitung lift: confidence(X -> Y) / support(Y)
          const lift = confidence / supportY;

          rules.push({
            antecedent,
            consequent,
            support: supportXY,
            confidence,
            lift,
          });
        }
      }
    }
  }

  return rules;
}

// ─── 3. runApriori ─────────────────────────────────────────────────────────
export function runApriori(
  baskets: Basket[],
  config: {
    minSupport: number;
    minConfidence: number;
    maxLen?: number;
  }
): {
  itemsets: Array<{ items: string[]; support: number }>;
  rules: AssociationRule[];
} {
  const { minSupport, minConfidence, maxLen = 3 } = config;
  const totalBaskets = baskets.length;

  // 1. Cari frequent itemsets
  const frequentItemsetsMap = findFrequentItemsets(baskets, minSupport, maxLen);

  // Ubah hasil frequent itemsets map menjadi array terformat
  const itemsets = Array.from(frequentItemsetsMap.entries()).map(([key, count]) => ({
    items: key.split(","),
    support: count / totalBaskets,
  }));

  // 2. Hasilkan aturan asosiasi
  const rawRules = generateRules(frequentItemsetsMap, baskets, minConfidence);

  // 3. Urutkan aturan asosiasi berdasarkan nilai Lift tertinggi (descending)
  const rules = rawRules.sort((a, b) => b.lift - a.lift);

  return { itemsets, rules };
}
