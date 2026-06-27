"use client";

import { useEffect, useState } from "react";
import { computeRestockPriority, type StockRow, type RestockPriority } from "@/lib/stockPriority";
import type { AssociationRule } from "@/types";
import RestockPriorityClient from "./RestockPriorityClient";

const LS_KEY_RULES = "mba_rules";
const LS_KEY_SUMMARY = "mba_summary";

export default function RestockPageClient({ stocks }: { stocks: StockRow[] }) {
  const [priorities, setPriorities] = useState<RestockPriority[]>([]);
  const [hasRules, setHasRules] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY_RULES);
      const rawSummary = localStorage.getItem(LS_KEY_SUMMARY);

      if (raw) {
        const rules: AssociationRule[] = JSON.parse(raw);
        // Ambil categoryMap dari summary (tersimpan saat mining dijalankan)
        const categoryMap: Record<string, string> | undefined =
          rawSummary ? JSON.parse(rawSummary)?.categoryMap : undefined;

        setHasRules(rules.length > 0);
        setPriorities(computeRestockPriority(rules, stocks, categoryMap));
      }
    } catch {
      // localStorage tidak tersedia atau data rusak
    } finally {
      setLoading(false);
    }
  }, [stocks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-teal-200 border-t-[#0E5C57] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <RestockPriorityClient priorities={priorities} hasRules={hasRules} />
  );
}
