"use client";

import { useEffect, useState } from "react";
import { computeRestockPriority, type StockRow, type RestockPriority } from "@/lib/stockPriority";
import type { AssociationRule } from "@/types";
import RestockPriorityClient from "./RestockPriorityClient";

const LS_KEY = "mba_rules";

export default function RestockPageClient({ stocks }: { stocks: StockRow[] }) {
  const [priorities, setPriorities] = useState<RestockPriority[]>([]);
  const [hasRules, setHasRules] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const rules: AssociationRule[] = JSON.parse(raw);
        setHasRules(rules.length > 0);
        setPriorities(computeRestockPriority(rules, stocks));
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
