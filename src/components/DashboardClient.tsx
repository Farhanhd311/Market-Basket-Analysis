"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Database,
  Package,
  Tags,
  Award,
  ArrowRight,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  Download,
  CheckCircle,
  Clock,
  HelpCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAnalysis } from "@/context/AnalysisContext";
import { computeRestockPriority, type StockRow } from "@/lib/stockPriority";
import type { SummaryStats, AssociationRule } from "@/types";

interface DashboardClientProps {
  initialStats: SummaryStats;
  stocks: StockRow[];
}

export default function DashboardClient({
  initialStats,
  stocks,
}: DashboardClientProps) {
  const { rules, isMined, summary } = useAnalysis();

  // Hitung jumlah aturan signifikan dengan lift >= 1.5
  const significantRulesCount = useMemo(() => {
    return rules.filter((r) => r.lift >= 1.5).length;
  }, [rules]);

  // Hitung daftar prioritas restock dari rules terakhir
  const restockPriorities = useMemo(() => {
    if (!isMined || rules.length === 0) return [];
    return computeRestockPriority(rules, stocks);
  }, [rules, stocks, isMined]);

  // Data 5 aturan teratas berdasarkan lift untuk mini bar chart
  const chartData = useMemo(() => {
    if (!isMined || rules.length === 0) return [];

    // Deduplicate rules by item sets to avoid showing both A -> B and B -> A
    const seen = new Set<string>();
    const uniqueRules: AssociationRule[] = [];
    for (const r of rules) {
      const key = [...r.antecedent, ...r.consequent].sort().join(",");
      if (!seen.has(key)) {
        seen.add(key);
        uniqueRules.push(r);
      }
    }

    return uniqueRules
      .slice(0, 5)
      .map((r, idx) => ({
        name: `R${idx + 1}`,
        fullName: `${r.antecedent.join(", ")} → ${r.consequent.join(", ")}`,
        lift: Number(r.lift.toFixed(3)),
        support: Number((r.support * 100).toFixed(2)),
        confidence: Number((r.confidence * 100).toFixed(1)),
      }));
  }, [rules, isMined]);

  // Handler ekspor CSV ringkasan eksekutif komprehensif
  function handleExportExecutiveSummary() {
    let csvContent = "\ufeff"; // BOM UTF-8

    // 1. RINGKASAN DATASET
    csvContent += "=== RINGKASAN DATASET ===\n";
    csvContent += `Total Transaksi,${initialStats.totalTransactions}\n`;
    csvContent += `Total Produk Terdaftar,${initialStats.totalProducts}\n`;
    csvContent += `Total Kategori Produk,${initialStats.totalCategories}\n`;
    csvContent += `Rata-rata Item per Keranjang,${initialStats.avgItemsPerBasket}\n`;
    csvContent += `Rentang Waktu Data,${initialStats.dateRange.from} s/d ${initialStats.dateRange.to}\n\n`;

    // 2. RINGKASAN APRIORI RUN TERAKHIR
    csvContent += "=== RINGKASAN ANALISIS APRIORI ===\n";
    if (isMined && summary) {
      csvContent += `Waktu Eksekusi (ms),${summary.executionTimeMs}\n`;
      csvContent += `Total Itemset Terbentuk,${summary.totalItemsets}\n`;
      csvContent += `Total Aturan Terbentuk,${summary.totalRules}\n`;
      csvContent += `Aturan Signifikan (Lift >= 1.5),${significantRulesCount}\n\n`;

      // 3. DAFTAR ATURAN ASOSIASI TERATAS
      csvContent += "=== 10 ATURAN ASOSIASI TERKUAT (LIFT TERTINGGI) ===\n";
      csvContent += "Peringkat,Antecedent,Consequent,Support (%),Confidence (%),Lift Ratio\n";
      rules.slice(0, 10).forEach((r, idx) => {
        csvContent += `${idx + 1},"${r.antecedent.join(" & ")}","${r.consequent.join(" & ")}",${(r.support * 100).toFixed(3)},${(r.confidence * 100).toFixed(2)},${r.lift.toFixed(4)}\n`;
      });
      csvContent += "\n";

      // 4. DAFTAR REKOMENDASI BUNDLING & CROSS-SELL
      csvContent += "=== STRATEGI REKOMENDASI CROSS-SELL ===\n";
      csvContent += "No,Produk Utama (Antecedent),Rekomendasi Tawarkan (Consequent),Tingkat Kepercayaan (Confidence %)\n";
      rules.slice(0, 10).forEach((r, idx) => {
        csvContent += `${idx + 1},"${r.antecedent.join(" + ")}","${r.consequent.join(" + ")}",${(r.confidence * 100).toFixed(1)}%\n`;
      });
      csvContent += "\n";
    } else {
      csvContent += "Status,Belum ada hasil run Apriori terakhir.\n\n";
    }

    // 5. PRIORITAS RESTOCK
    csvContent += "=== PRIORITAS RESTOCK BARANG (BERDASARKAN HUBUNGAN SILANG ATURAN LIFT TINGGI & STOK KRITIS) ===\n";
    csvContent += "Peringkat,Nama Produk,Kategori,Stok Saat Ini,Batas Aman,Kekuatan Hubungan (Lift),Skor Prioritas,Alasan\n";
    if (isMined && restockPriorities.length > 0) {
      restockPriorities.forEach((p, idx) => {
        csvContent += `${idx + 1},"${p.productName}","${p.category}",${p.currentStock},${p.minThreshold},${p.maxLift.toFixed(3)},${p.score.toFixed(4)},"${p.reason.replace(/"/g, '""')}"\n`;
      });
    } else if (!isMined) {
      csvContent += "Status,Jalankan analisis Apriori terlebih dahulu untuk menghitung keterkaitan produk.\n";
    } else {
      csvContent += "Status,Seluruh stok produk aman di atas batas aman.\n";
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "ringkasan-eksekutif-ritel.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const statCards = [
    {
      title: "Total Transaksi",
      value: initialStats.totalTransactions.toLocaleString("id-ID"),
      desc: `${initialStats.dateRange.from} – ${initialStats.dateRange.to}`,
      icon: Database,
      variant: "teal" as const,
    },
    {
      title: "Total Produk",
      value: initialStats.totalProducts.toLocaleString("id-ID"),
      desc: "Produk unik dalam dataset ritel",
      icon: Package,
      variant: "teal" as const,
    },
    {
      title: "Kategori Produk",
      value: initialStats.totalCategories.toLocaleString("id-ID"),
      desc: "Kategori terdaftar ritel",
      icon: Tags,
      variant: "gray" as const,
    },
    {
      title: "Koneksi Produk Erat",
      value: isMined ? significantRulesCount.toLocaleString("id-ID") : "0",
      desc: isMined
        ? `Menemukan ${rules.length} pola perilaku belanja`
        : "Jalankan analisis pola belanja",
      icon: Award,
      variant: "amber" as const,
    },
  ];

  const quickActions = [
    {
      title: "Analisis Pola Belanja",
      desc: "Cari tahu pola barang yang sering dibeli bersamaan dari data transaksi kasir.",
      icon: TrendingUp,
      href: "/analysis",
      color: "bg-teal-50 text-brand-teal border-teal-100",
      cta: "Mulai Analisis",
    },
    {
      title: "Rekomendasi Bundling",
      desc: "Gunakan rekomendasi paket bundling produk ritel untuk meningkatkan omzet penjualan.",
      icon: Sparkles,
      href: "/recommendations",
      color: "bg-amber-50 text-brand-amber border-amber-100",
      cta: "Lihat Rekomendasi",
    },
    {
      title: "Prioritas Pengisian Stok",
      desc: "Rencanakan pengisian stok produk berdasarkan tingkat kelangkaan barang dan pola belanja konsumen.",
      icon: AlertTriangle,
      href: "/restock",
      color: "bg-teal-50 text-brand-teal border-teal-100",
      cta: "Cek Stok Kritis",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="absolute right-0 top-0 w-64 h-64 bg-teal-50/50 rounded-full blur-3xl -z-10" />
        <div className="space-y-2 max-w-3xl">
          <h1 className="text-3xl font-extrabold text-brand-teal tracking-tight">
            Dashboard Market Basket Analysis
          </h1>
          <p className="text-gray-600 leading-relaxed text-sm">
            Solusi integrasi data logistik Supply Chain Management ritel. Sistem ini menganalisis
            kebiasaan belanja pelanggan untuk membuat rekomendasi paket bundling produk terlaris,
            serta merekomendasikan prioritas pengisian stok barang berdasarkan keterkaitan penjualan.
          </p>
        </div>
        <div className="shrink-0">
          <Button
            onClick={handleExportExecutiveSummary}
            className="bg-[#0E5C57] hover:bg-[#13837A] text-white font-medium flex items-center gap-2 px-5 py-3 rounded-xl shadow-sm transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Ekspor Ringkasan (CSV)
          </Button>
        </div>
      </div>

      {/* StatCard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, idx) => (
          <StatCard
            key={idx}
            title={s.title}
            value={s.value}
            desc={s.desc}
            icon={s.icon}
            variant={s.variant}
          />
        ))}
      </div>

      {/* Analisis Visualisasi Bar Chart & Produk Terlaris */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aturan Asosiasi Teratas (Mini Bar Chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col min-h-[380px]">
          <div className="border-b pb-3 mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight">
                Top 5 Hubungan Produk Tererat
              </h2>
              <p className="text-xs text-gray-400">
                Peringkat pasangan barang yang paling sering dibeli secara bersamaan
              </p>
            </div>
            {isMined && (
              <Badge variant="info">
                <Clock className="w-3.5 h-3.5 mr-1 inline" />
                {summary?.executionTimeMs} ms
              </Badge>
            )}
          </div>

          {!isMined || chartData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <span className="text-3xl mb-2">📊</span>
              <h4 className="text-sm font-semibold text-gray-700">Belum Ada Pola Belanja Teranalisis</h4>
              <p className="text-xs text-gray-400 max-w-[280px] mt-1">
                Jalankan modul analisis di halaman Analisis Pola Belanja untuk melihat representasi grafis di sini.
              </p>
            </div>
          ) : (
            <div className="flex-1 w-full h-[260px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-md text-xs space-y-1">
                            <p className="font-bold text-[#1C2B2A] mb-1.5 border-b pb-1 border-gray-150">{data.fullName}</p>
                            <p className="text-[#0E5C57]">Kekuatan Keterkaitan: <strong>{data.lift}x lebih erat</strong></p>
                            <p className="text-gray-500">Kekerapan Kombinasi: <strong>{data.support}% dari total belanja</strong></p>
                            <p className="text-gray-500">Tingkat Keyakinan: <strong>{data.confidence}% kemungkinan beli bersama</strong></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="lift" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#E8A13A" : "#0E5C57"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 text-[10px] text-gray-400 font-medium mt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-[#E8A13A] rounded" /> Hubungan Terkuat (Peringkat 1)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-[#0E5C57] rounded" /> Hubungan Erat Lainnya
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Daftar 7 Produk Tersering Dibeli */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col min-h-[380px]">
          <h2 className="text-base font-bold text-gray-900 tracking-tight border-b pb-3 mb-4">
            Top 7 Produk Terlaris
          </h2>
          <ol className="space-y-3.5 flex-1">
            {initialStats.topProducts.map((p, idx) => {
              const maxCount = initialStats.topProducts[0].count;
              const pct = Math.round((p.count / maxCount) * 100);
              return (
                <li key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-700 truncate max-w-[70%]">{p.name}</span>
                    <span className="text-[#0E5C57]">{p.count} kali dibeli</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-[#0E5C57] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Aksi Cepat & Tautan */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Navigasi Terintegrasi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Card
                key={idx}
                className="flex flex-col justify-between hover:border-teal-300 hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${action.color} mb-4`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">{action.title}</h3>
                  <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">{action.desc}</p>
                </div>
                <div className="mt-6">
                  <Link href={action.href} className="w-full">
                    <Button variant="ghost" size="sm" className="w-full justify-between group px-2 text-xs">
                      <span>{action.cta}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
