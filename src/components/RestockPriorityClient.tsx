"use client";

import { useState } from "react";
import type { RestockPriority } from "@/lib/stockPriority";
import { Badge } from "@/components/ui";

function exportCsv(data: RestockPriority[]) {
  const header = "Produk,Kategori,Stok Saat Ini,Batas Aman,Kekurangan Stok,Kekuatan Hubungan (Lift),Prioritas Restok,Alasan\n";
  const rows = data
    .map(
      (p) =>
        `"${p.productName}","${p.category}",${p.currentStock},${p.minThreshold},${p.deficiency},${p.maxLift.toFixed(3)},${p.score.toFixed(4)},"${p.reason.replace(/"/g, '""')}"`
    )
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "prioritas-restock.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function ScoreBadge({ score }: { score: number }) {
  if (score >= 2) return <Badge variant="danger">Sangat Mendesak</Badge>;
  if (score >= 1) return <Badge variant="warning">Mendesak</Badge>;
  return <Badge variant="neutral">Perlu Perhatian</Badge>;
}

export default function RestockPriorityClient({
  priorities,
  hasRules,
}: {
  priorities: RestockPriority[];
  hasRules: boolean;
}) {
  const [minLiftFilter, setMinLiftFilter] = useState(0);

  const filtered = priorities.filter((p) => p.maxLift >= minLiftFilter);

  if (!hasRules) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">⚡</span>
        </div>
        <h3 className="text-lg font-semibold text-[#1C2B2A] mb-2">
          Belum Ada Hasil Analisis
        </h3>
        <p className="text-gray-500 text-sm max-w-sm">
          Jalankan analisis Apriori di halaman <strong>Analisis</strong> terlebih dahulu,
          lalu kembali ke sini untuk melihat prioritas restock.
        </p>
        <a
          href="/analysis"
          className="mt-4 inline-block bg-[#0E5C57] hover:bg-[#13837A] text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Ke Halaman Analisis →
        </a>
      </div>
    );
  }

  if (priorities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h3 className="text-lg font-semibold text-[#1C2B2A] mb-2">
          Semua Stok Prioritas Aman
        </h3>
        <p className="text-gray-500 text-sm max-w-sm">
          Tidak ada produk yang sering dibeli bersamaan yang stoknya di bawah batas aman.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          Filter lift ≥
          <input
            type="number"
            min={0}
            step={0.1}
            value={minLiftFilter}
            onChange={(e) => setMinLiftFilter(Number(e.target.value))}
            className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <span className="text-xs text-gray-400">({filtered.length}/{priorities.length} produk)</span>
        </label>
        <button
          onClick={() => exportCsv(filtered)}
          className="flex items-center gap-2 bg-[#0E5C57] hover:bg-[#13837A] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          ⬇ Ekspor CSV
        </button>
      </div>

      {/* List kartu prioritas */}
      <div className="space-y-3">
        {filtered.map((p, i) => (
          <div
            key={p.productName}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {/* Peringkat */}
                <div className="flex-shrink-0 w-8 h-8 bg-[#0E5C57] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-[#1C2B2A]">
                      {p.productName}
                    </span>
                    <Badge variant="info">{p.category}</Badge>
                    <ScoreBadge score={p.score} />
                  </div>

                  {/* Metrik baris */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
                    <span>
                      Stok Saat Ini:{" "}
                      <strong className="text-red-600">{p.currentStock}</strong>{" "}
                      / Batas Aman: <strong>{p.minThreshold}</strong>
                    </span>
                    <span>
                      Jumlah Kurang: <strong>{p.deficiency}</strong> unit
                    </span>
                    <span>
                      Kekuatan Hubungan (Lift): <strong>{p.maxLift.toFixed(2)}x</strong>
                    </span>
                    <span>
                      Prioritas Restok: <strong>{p.score.toFixed(2)}</strong>
                    </span>
                  </div>

                  {/* Alasan */}
                  <p className="text-xs text-gray-600 bg-gray-50 rounded-md px-3 py-2 border border-gray-100 leading-relaxed">
                    💡 {p.reason}
                  </p>
                </div>
              </div>

              {/* Mini stok bar */}
              <div className="flex-shrink-0 w-28 text-right">
                <div className="text-xs text-gray-400 mb-1">
                  {p.currentStock}/{p.minThreshold}
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-red-400 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((p.currentStock / Math.max(p.minThreshold, 1)) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
