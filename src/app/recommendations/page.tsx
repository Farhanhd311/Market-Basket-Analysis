"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, ArrowRight, Download, PackageOpen, Shuffle, HelpCircle, Layers, Kanban } from "lucide-react";
import { PageHeader, Card, Button, EmptyState, Badge } from "@/components/ui";
import { useAnalysis } from "@/context/AnalysisContext";
import Link from "next/link";

interface BundlingRec {
  items: string[];
  support: number;
  lift: number;
}

interface CrossSellRec {
  antecedent: string[];
  consequent: string[];
  confidence: number;
  lift: number;
  support: number;
}

interface PlacementRec {
  itemA: string;
  itemB: string;
  lift: number;
  support: number;
}

export default function RecommendationsPage() {
  const { rules, isMined } = useAnalysis();
  const [minLiftFilter, setMinLiftFilter] = useState<number>(1.2);
  const [activeTab, setActiveTab] = useState<"all" | "bundling" | "cross-sell" | "placement">("all");

  // 1. Dapatkan Paket Bundling (Itemset unik size >= 2 dengan support tinggi)
  const bundlingRecs = useMemo((): BundlingRec[] => {
    const seen = new Set<string>();
    const recs: BundlingRec[] = [];

    rules.forEach((rule) => {
      const combined = [...rule.antecedent, ...rule.consequent].sort();
      const key = combined.join(",");
      if (!seen.has(key)) {
        seen.add(key);
        recs.push({
          items: combined,
          support: rule.support,
          lift: rule.lift,
        });
      }
    });

    return recs.filter((r) => r.lift >= minLiftFilter).sort((a, b) => b.support - a.support);
  }, [rules, minLiftFilter]);

  // 2. Dapatkan Cross-sell (Aturan dengan confidence & lift tinggi)
  const crossSellRecs = useMemo((): CrossSellRec[] => {
    return rules
      .filter((r) => r.lift >= minLiftFilter)
      .map((r) => ({
        antecedent: r.antecedent,
        consequent: r.consequent,
        confidence: r.confidence,
        lift: r.lift,
        support: r.support,
      }))
      .sort((a, b) => b.lift - a.lift);
  }, [rules, minLiftFilter]);

  // 3. Dapatkan Penataan Rak (Pasangan produk dengan lift tertinggi untuk didekatkan)
  const placementRecs = useMemo((): PlacementRec[] => {
    const seen = new Set<string>();
    const recs: PlacementRec[] = [];

    rules.forEach((rule) => {
      // Ambil hanya hubungan 1-ke-1 untuk penataan rak agar tak membingungkan
      if (rule.antecedent.length === 1 && rule.consequent.length === 1) {
        const itemA = rule.antecedent[0];
        const itemB = rule.consequent[0];
        const key = [itemA, itemB].sort().join(" <-> ");

        if (!seen.has(key)) {
          seen.add(key);
          recs.push({
            itemA,
            itemB,
            lift: rule.lift,
            support: rule.support,
          });
        }
      }
    });

    return recs.filter((r) => r.lift >= minLiftFilter).sort((a, b) => b.lift - a.lift);
  }, [rules, minLiftFilter]);

  const handleExportCSV = () => {
    if (rules.length === 0) return;

    let csvContent = "\uFEFF";
    const headers = ["Tipe Rekomendasi", "Detail Rekomendasi", "Support (%)", "Confidence / Nilai Hubungan", "Lift Ratio"];
    const rows: string[][] = [];

    // Tambah Bundling
    bundlingRecs.forEach((r) => {
      rows.push([
        "Product Bundling",
        `"Paket: ${r.items.join(" + ")}"`,
        (r.support * 100).toFixed(4),
        "-",
        r.lift.toFixed(4),
      ]);
    });

    // Tambah Cross-sell
    crossSellRecs.forEach((r) => {
      rows.push([
        "Cross-selling",
        `"Jika beli [${r.antecedent.join(", ")}] tawarkan [${r.consequent.join(", ")}]"`,
        (r.support * 100).toFixed(4),
        r.confidence.toFixed(4),
        r.lift.toFixed(4),
      ]);
    });

    // Tambah Penataan Rak
    placementRecs.forEach((r) => {
      rows.push([
        "Shelf Placement",
        `"Dekatkan rak [${r.itemA}] dengan [${r.itemB}]"`,
        (r.support * 100).toFixed(4),
        "-",
        r.lift.toFixed(4),
      ]);
    });

    csvContent += [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `strategi_rekomendasi_lift_${minLiftFilter}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isMined || rules.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Rekomendasi Ritel & Bundling"
          desc="Tampilkan strategi bundling produk, cross-selling, dan penataan rak barang toko ritel berbasis data."
          icon={Sparkles}
        />
        <EmptyState
          title="Rekomendasi Belum Tersedia"
          desc="Silakan jalankan Analisis Apriori terlebih dahulu untuk menghasilkan rekomendasi bundling ritel dan strategi cross-sell."
          icon={Sparkles}
          action={
            <Link href="/analysis">
              <Button variant="primary">
                <ArrowRight className="h-4 w-4 mr-2" />
                Buka Analisis
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Rekomendasi Ritel & Bundling"
        desc="Strategi pemasaran dan penataan persediaan ritel yang disimpulkan dari kekuatan aturan asosiasi belanja pelanggan."
        icon={Sparkles}
        actions={
          <Button variant="secondary" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4" />
            Ekspor Rekomendasi
          </Button>
        }
      />

      {/* Filter & Kategori Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "all"
                ? "bg-brand-teal text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            Semua Strategi
          </button>
          <button
            onClick={() => setActiveTab("bundling")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "bundling"
                ? "bg-brand-teal text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <PackageOpen className="h-3.5 w-3.5" />
            Product Bundling
          </button>
          <button
            onClick={() => setActiveTab("cross-sell")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "cross-sell"
                ? "bg-brand-teal text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <Shuffle className="h-3.5 w-3.5" />
            Cross-selling
          </button>
          <button
            onClick={() => setActiveTab("placement")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "placement"
                ? "bg-brand-teal text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Penataan Rak
          </button>
        </div>

        {/* Lift Filter */}
        <div className="flex items-center gap-3 self-end md:self-auto bg-gray-50 px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold">
          <span className="text-gray-500">Ambang Batas Lift &ge;</span>
          <input
            type="number"
            min="0.5"
            max="10"
            step="0.1"
            value={minLiftFilter}
            onChange={(e) => setMinLiftFilter(Number(e.target.value))}
            className="w-12 text-center font-bold text-brand-teal bg-white border border-gray-200 rounded py-0.5"
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="space-y-8">
        {/* SECTION 1: BUNDLING */}
        {(activeTab === "all" || activeTab === "bundling") && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-lg text-gray-900 tracking-tight flex items-center gap-2">
              <PackageOpen className="h-5 w-5 text-brand-teal" />
              Paket Bundling Produk (Promosi)
              <span className="text-xs font-normal text-gray-400">
                ({bundlingRecs.length} bundling ditemukan)
              </span>
            </h3>
            {bundlingRecs.length === 0 ? (
              <p className="text-sm text-gray-400 italic bg-white p-6 rounded-xl border border-gray-50">
                Tidak ada paket bundling yang memenuhi kriteria Lift filter.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bundlingRecs.map((rec, idx) => (
                  <Card
                    key={idx}
                    className="border-t-4 border-t-brand-teal hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <Badge variant="info" className="mb-3 text-[9px] font-extrabold">
                        Hemat Ritel
                      </Badge>
                      <h4 className="font-bold text-gray-800 text-sm leading-relaxed mb-2">
                        {rec.items.join(" + ")}
                      </h4>
                      <p className="text-xs text-gray-500 leading-normal">
                        Rekomendasi paket bundling. Jual produk-produk ini dalam satu paket harga khusus.
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-gray-50 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-gray-400 font-medium block">Support (Kekerapan)</span>
                        <strong className="text-gray-700 font-bold">{(rec.support * 100).toFixed(2)}%</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 font-medium block">Lift Ratio</span>
                        <strong className="text-brand-amber font-extrabold">{rec.lift.toFixed(3)}</strong>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: CROSS-SELL */}
        {(activeTab === "all" || activeTab === "cross-sell") && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-lg text-gray-900 tracking-tight flex items-center gap-2">
              <Shuffle className="h-5 w-5 text-brand-teal" />
              Rekomendasi Cross-selling Kasir
              <span className="text-xs font-normal text-gray-400">
                ({crossSellRecs.length} aturan ditemukan)
              </span>
            </h3>
            {crossSellRecs.length === 0 ? (
              <p className="text-sm text-gray-400 italic bg-white p-6 rounded-xl border border-gray-50">
                Tidak ada rekomendasi cross-selling yang memenuhi kriteria Lift filter.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crossSellRecs.map((rec, idx) => (
                  <Card
                    key={idx}
                    className="border-t-4 border-t-brand-amber hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <Badge variant="warning" className="mb-3 text-[9px] font-extrabold">
                        Saran Penjualan
                      </Badge>
                      <div className="space-y-2 mb-3">
                        <div className="text-xs">
                          <span className="text-gray-400 font-medium block uppercase tracking-wider text-[9px] mb-0.5">Jika Pelanggan Membeli:</span>
                          <strong className="text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded text-[11px] inline-block">
                            {rec.antecedent.join(", ")}
                          </strong>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-400 font-medium block uppercase tracking-wider text-[9px] mb-0.5">Tawarkan Produk Tambahan:</span>
                          <strong className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded text-[11px] inline-block border border-amber-100">
                            {rec.consequent.join(", ")}
                          </strong>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-gray-400 font-medium block">Confidence (Kepercayaan)</span>
                        <strong className="text-gray-750 font-bold">{(rec.confidence * 100).toFixed(1)}%</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 font-medium block">Lift Ratio</span>
                        <strong className="text-brand-amber font-extrabold">{rec.lift.toFixed(3)}</strong>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: PLACEMENT */}
        {(activeTab === "all" || activeTab === "placement") && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-lg text-gray-900 tracking-tight flex items-center gap-2">
              <Layers className="h-5 w-5 text-brand-teal" />
              Tata Letak Rak Pajangan (Store Layout)
              <span className="text-xs font-normal text-gray-400">
                ({placementRecs.length} penataan disarankan)
              </span>
            </h3>
            {placementRecs.length === 0 ? (
              <p className="text-sm text-gray-400 italic bg-white p-6 rounded-xl border border-gray-50">
                Tidak ada penataan rak yang memenuhi kriteria Lift filter.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {placementRecs.map((rec, idx) => (
                  <Card
                    key={idx}
                    className="border-t-4 border-t-gray-400 hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <Badge variant="neutral" className="mb-3 text-[9px] font-extrabold">
                        Rencana Rak
                      </Badge>
                      <h4 className="font-bold text-gray-800 text-sm leading-relaxed mb-2">
                        Dekatkan Pajangan: <span className="text-brand-teal font-extrabold">{rec.itemA}</span> dengan <span className="text-brand-teal font-extrabold">{rec.itemB}</span>
                      </h4>
                      <p className="text-xs text-gray-500 leading-normal">
                        Kedua produk memiliki keterkaitan erat. Meletakkannya berdampingan atau berhadapan akan merangsang impuls belanja.
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-gray-50 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-gray-400 font-medium block">Support Hubungan</span>
                        <strong className="text-gray-700 font-bold">{(rec.support * 100).toFixed(2)}%</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 font-medium block">Lift Ratio</span>
                        <strong className="text-brand-amber font-extrabold">{rec.lift.toFixed(3)}</strong>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
