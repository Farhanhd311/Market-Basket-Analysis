"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp, Play, Download, Settings, FileSpreadsheet, Percent, CheckCircle, BarChart, Award, AlertCircle } from "lucide-react";
import { PageHeader, Card, Button, Spinner, ErrorState, DataTable, Badge } from "@/components/ui";
import type { Column } from "@/components/ui/DataTable";
import { useAnalysis } from "@/context/AnalysisContext";
import type { AssociationRule } from "@/types";

interface TableRuleRow extends AssociationRule {
  id: number;
  antecedentStr: string;
  consequentStr: string;
  searchableText: string;
}

export default function AnalysisPage() {
  const { rules, summary, isMined, setAnalysisResults, resetAnalysis } = useAnalysis();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [minSupport, setMinSupport] = useState<number>(0.5); // Persentase (e.g. 0.5%)
  const [minConfidence, setMinConfidence] = useState<number>(10); // Persentase (e.g. 10%)
  const [maxLen, setMaxLen] = useState<number>(3);

  // Filter states
  const [minLiftFilter, setMinLiftFilter] = useState<number>(1.0);
  const [strictCategory, setStrictCategory] = useState<boolean>(true);

  // Helper untuk mengecek apakah semua item berada dalam kategori yang sama
  const isSameCategory = (items: string[]) => {
    if (!strictCategory || !summary?.categoryMap) return true;
    if (items.length <= 1) return true;
    const firstCat = summary.categoryMap[items[0]];
    return items.every(item => summary.categoryMap![item] === firstCat);
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Ubah persentase support/confidence ke fraction (0.01 s.d. 1.0)
      const supportFraction = minSupport / 100;
      const confidenceFraction = minConfidence / 100;

      const res = await fetch("/api/mine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minSupport: supportFraction,
          minConfidence: confidenceFraction,
          maxLen,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal menjalankan analisis.");
      }

      const data = await res.json();
      setAnalysisResults(data.rules, data.summary);
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan koneksi atau server.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (rules.length === 0) return;

    const headers = ["Antecedent (Jika Beli)", "Consequent (Maka Beli)", "Support (%)", "Confidence (Kepercayaan)", "Lift (Kekuatan Hubungan)"];
    const rows = rules.map(r => [
      `"${r.antecedent.join(", ")}"`,
      `"${r.consequent.join(", ")}"`,
      (r.support * 100).toFixed(4),
      r.confidence.toFixed(4),
      r.lift.toFixed(4)
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `aturan_asosiasi_support_${minSupport}%_conf_${minConfidence}%.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Persiapkan data tabel dengan filter dan search key yang optimal
  const processedRules: TableRuleRow[] = useMemo(() => {
    return rules
      .filter((r) => isSameCategory([...r.antecedent, ...r.consequent]))
      .map((r, idx) => ({
        ...r,
        id: idx,
        antecedentStr: r.antecedent.join(", "),
        consequentStr: r.consequent.join(", "),
        searchableText: `${r.antecedent.join(", ")} -> ${r.consequent.join(", ")}`,
      }))
      .filter((r) => r.lift >= minLiftFilter);
  }, [rules, minLiftFilter, strictCategory, summary?.categoryMap]);

  const columns: Column<TableRuleRow>[] = [
    {
      header: "Antecedent (Jika Beli)",
      accessorKey: "antecedentStr",
      cell: (r) => (
        <div className="flex flex-wrap gap-1 font-semibold text-gray-800">
          {r.antecedent.map(item => (
            <span key={item} className="bg-teal-50 text-brand-teal px-2 py-0.5 rounded-md text-xs">
              {item}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Consequent (Maka Beli)",
      accessorKey: "consequentStr",
      cell: (r) => (
        <div className="flex flex-wrap gap-1 font-semibold text-gray-800">
          {r.consequent.map(item => (
            <span key={item} className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-xs border border-amber-100">
              {item}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Support (%)",
      accessorKey: "support",
      sortable: true,
      cell: (r) => (
        <span className="font-mono text-sm text-gray-700 font-bold">
          {(r.support * 100).toFixed(2)}%
        </span>
      ),
    },
    {
      header: "Confidence",
      accessorKey: "confidence",
      sortable: true,
      cell: (r) => (
        <span className="font-mono text-sm text-gray-700 font-bold">
          {r.confidence.toFixed(3)}
        </span>
      ),
    },
    {
      header: "Lift Ratio",
      accessorKey: "lift",
      sortable: true,
      cell: (r) => {
        const isHigh = r.lift >= 1.5;
        return (
          <div className="flex items-center gap-2">
            <span className={`font-mono text-sm font-extrabold ${isHigh ? "text-brand-amber text-base" : "text-gray-700"}`}>
              {r.lift.toFixed(3)}
            </span>
            {isHigh && (
              <Badge variant="warning" className="text-[9px] py-0.5 px-1.5 font-extrabold scale-90">
                Kuat
              </Badge>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Analisis Apriori"
        desc="Jalankan pencarian aturan asosiasi belanja ritel dengan mengatur nilai batas Support, Confidence, dan Panjang Item."
        icon={TrendingUp}
        actions={
          rules.length > 0 && (
            <Button variant="secondary" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4" />
              Ekspor CSV
            </Button>
          )
        }
      />

      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex gap-3 text-sm text-teal-900 shadow-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-teal-600" />
        <div>
          <strong className="font-bold mb-1 block text-teal-950">Apa fungsi halaman ini?</strong>
          <p className="leading-relaxed">
            Halaman <b>Market Basket Analysis</b> ini akan mencari pola tersembunyi dari data keranjang belanja pelanggan menggunakan algoritma Apriori.
            Sebagai contoh, sistem dapat menemukan pola: <i>"Jika pelanggan membeli Kopi, maka mereka kemungkinan besar akan membeli Gula"</i>.
            <br />
            Untuk memulainya, sesuaikan nilai <b>Support</b> dan <b>Confidence</b> pada panel sebelah kiri, lalu klik tombol <b>Mulai Mining</b>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Form Parameter */}
        <Card className="lg:col-span-1 h-fit space-y-5">
          <div className="flex items-center gap-2 border-b pb-3 text-brand-teal">
            <Settings className="h-5 w-5" />
            <h3 className="font-bold text-base text-gray-900">Konfigurasi</h3>
          </div>

          <form onSubmit={handleRunAnalysis} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Min. Support (%)</span>
                <span className="text-brand-teal font-extrabold">{minSupport}%</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={minSupport}
                onChange={(e) => setMinSupport(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-teal"
              />
              <span className="text-[10px] text-gray-400 mt-1 block leading-normal">
                Persentase minimal itemset muncul di total transaksi (e.g. 2% = muncul min. 40× dari 1.991 transaksi).
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Min. Confidence (%)</span>
                <span className="text-brand-teal font-extrabold">{minConfidence}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={minConfidence}
                onChange={(e) => setMinConfidence(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-teal"
              />
              <span className="text-[10px] text-gray-400 mt-1 block leading-normal">
                Tingkat kepastian/kepercayaan aturan (e.g. 30% = minimal 3 dari 10 orang yang beli produk X juga membeli produk Y).
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Maks. Panjang Kombinasi
              </label>
              <select
                value={maxLen}
                onChange={(e) => setMaxLen(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-colors"
              >
                <option value={2}>2 Item (X &rarr; Y)</option>
                <option value={3}>3 Item (X, Y &rarr; Z)</option>
                <option value={4}>4 Item (X, Y, Z &rarr; W)</option>
              </select>
              <span className="text-[10px] text-gray-400 mt-1 block leading-normal">
                Batas maksimal jumlah item yang dihubungkan dalam satu aturan.
              </span>
            </div>

            <Button type="submit" className="w-full py-3" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Memproses Ritel...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current mr-2" />
                  Mulai Mining
                </>
              )}
            </Button>
          </form>

          {isMined && (
            <div className="pt-3 border-t border-gray-100">
              <Button variant="ghost" size="sm" onClick={resetAnalysis} className="w-full text-xs text-red-600 hover:bg-red-50 hover:text-red-700">
                Reset Hasil Run
              </Button>
            </div>
          )}
        </Card>

        {/* Output & Tabel Hasil */}
        <div className="lg:col-span-3 space-y-6">
          {loading && (
            <Card className="flex flex-col items-center justify-center py-20 space-y-4">
              <Spinner size="lg" />
              <div className="text-center">
                <h4 className="font-bold text-gray-800">Menambang Aturan Asosiasi...</h4>
                <p className="text-xs text-gray-400 mt-1">Algoritma Apriori sedang melakukan scanning itemset & level pruning pada 1.991 transaksi.</p>
              </div>
            </Card>
          )}

          {error && <ErrorState message={error} />}

          {!loading && !error && !isMined && (
            <Card className="flex flex-col items-center justify-center text-center text-gray-500 py-24 border-dashed border-2 border-gray-200">
              <TrendingUp className="h-12 w-12 text-gray-300 mb-3" />
              <p className="font-bold text-gray-700">Analisis Belum Dijalankan</p>
              <p className="text-sm mt-1 max-w-xs text-gray-400">Atur parameter di panel samping dan klik tombol &quot;Mulai Mining&quot; untuk memproses aturan.</p>
            </Card>
          )}

          {!loading && !error && isMined && summary && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3.5">
                  <div className="p-2 bg-teal-50 text-brand-teal rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Frequent Itemsets</span>
                    <span className="text-lg font-extrabold text-gray-800">{summary.totalItemsets}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3.5">
                  <div className="p-2 bg-amber-50 text-brand-amber rounded-lg">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Aturan Terbentuk</span>
                    <span className="text-lg font-extrabold text-gray-800">{summary.totalRules}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3.5">
                  <div className="p-2 bg-gray-50 text-gray-650 rounded-lg">
                    <BarChart className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Waktu Eksekusi</span>
                    <span className="text-lg font-extrabold text-gray-800">{summary.executionTimeMs} ms</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3.5">
                  <div className="p-2 bg-teal-50 text-brand-teal rounded-lg">
                    <Percent className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Min. Sup / Conf</span>
                    <span className="text-xs font-extrabold text-gray-800">{minSupport}% / {minConfidence}%</span>
                  </div>
                </div>
              </div>

              {/* Aturan Asosiasi Table */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="font-extrabold text-lg text-gray-900 tracking-tight flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-brand-teal" />
                    Hasil Aturan Asosiasi
                    <span className="text-sm font-normal text-gray-400">({processedRules.length} aturan disaring)</span>
                  </h3>
                  
                  {/* Filters */}
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 bg-white px-3 py-2 border border-gray-100 rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={strictCategory}
                        onChange={(e) => setStrictCategory(e.target.checked)}
                        className="w-4 h-4 text-brand-teal accent-brand-teal rounded border-gray-300 focus:ring-brand-teal"
                      />
                      <span className="text-xs font-semibold text-gray-700">Grup Kategori Sama</span>
                    </label>

                    <div className="flex items-center gap-3 bg-white px-4 py-2 border border-gray-100 rounded-xl shadow-sm text-xs font-semibold">
                      <span className="text-gray-500">Filter Lift &ge;</span>
                      <input
                        type="number"
                        min="0.5"
                        max="10"
                        step="0.1"
                        value={minLiftFilter}
                        onChange={(e) => setMinLiftFilter(Number(e.target.value))}
                        className="w-12 text-center font-bold text-brand-teal bg-gray-50 border border-gray-100 rounded py-0.5"
                      />
                    </div>
                  </div>
                </div>

                <DataTable
                  data={processedRules}
                  columns={columns}
                  searchPlaceholder="Cari produk pada antecedent atau consequent..."
                  searchKey="searchableText"
                  pageSize={10}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
