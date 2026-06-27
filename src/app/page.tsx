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
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getSummaryStats } from "@/lib/data";

export default function Home() {
  const stats = getSummaryStats();

  const statCards = [
    {
      title: "Total Transaksi",
      value: stats.totalTransactions.toLocaleString("id-ID"),
      desc: `${stats.dateRange.from} – ${stats.dateRange.to}`,
      icon: Database,
      variant: "teal" as const,
    },
    {
      title: "Total Produk",
      value: stats.totalProducts.toLocaleString("id-ID"),
      desc: "Produk unik dalam dataset",
      icon: Package,
      variant: "teal" as const,
    },
    {
      title: "Kategori Produk",
      value: stats.totalCategories.toLocaleString("id-ID"),
      desc: "Kategori produk terdaftar",
      icon: Tags,
      variant: "gray" as const,
    },
    {
      title: "Rata-rata Item",
      value: stats.avgItemsPerBasket.toLocaleString("id-ID"),
      desc: "Item unik per keranjang belanja",
      icon: Award,
      variant: "amber" as const,
      trend: stats.topProduct
        ? { value: stats.topProduct.name, label: `${stats.topProduct.count}×`, positive: true }
        : undefined,
    },
  ];

  const quickActions = [
    {
      title: "Analisis Apriori",
      desc: "Konfigurasi parameter minimum support dan confidence untuk memproses dataset transaksi ritel.",
      icon: TrendingUp,
      href: "/analysis",
      color: "bg-teal-50 text-brand-teal border-teal-100",
      cta: "Mulai Analisis",
    },
    {
      title: "Rekomendasi Bundling",
      desc: "Terapkan strategi cross-selling menggunakan paket bundling produk ritel dengan nilai Lift terkuat.",
      icon: Sparkles,
      href: "/recommendations",
      color: "bg-amber-50 text-brand-amber border-amber-100",
      cta: "Lihat Bundling",
    },
    {
      title: "Prioritas Restock",
      desc: "Tentukan prioritas pengisian stok ulang produk ritel berdasarkan tingkat kritis persediaan.",
      icon: AlertTriangle,
      href: "/restock",
      color: "bg-teal-50 text-brand-teal border-teal-100",
      cta: "Cek Stok Kritis",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-teal-50/50 rounded-full blur-3xl -z-10" />
        <h1 className="text-3xl font-extrabold text-brand-teal tracking-tight">
          Dashboard Market Basket Analysis
        </h1>
        <p className="mt-2 text-gray-600 max-w-2xl leading-relaxed text-sm">
          Solusi optimasi Supply Chain Management ritel berbasis data transaksi. Algoritma Apriori
          memetakan keterkaitan produk untuk meningkatkan penjualan silang (cross-selling) dan mengatur
          prioritas restock stok kritis secara otomatis.
        </p>
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
            trend={s.trend}
          />
        ))}
      </div>

      {/* Baris bawah */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Aksi Cepat MBA</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Card
                  key={idx}
                  className="flex flex-col justify-between hover:border-brand-teal-light/20 hover:shadow-md transition-all duration-300"
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

        {/* Top Kategori */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight border-b pb-3 mb-4">
            Top 7 Kategori Terlaris
          </h2>
          {stats.topCategories.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Belum ada data.</p>
          ) : (
            <ol className="space-y-3 flex-1">
              {stats.topCategories.map((cat, idx) => {
                const maxCount = stats.topCategories[0].count;
                const pct = Math.round((cat.count / maxCount) * 100);
                return (
                  <li key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-gray-700 truncate max-w-[70%]">{cat.category}</span>
                      <span className="text-gray-400">{cat.count.toLocaleString("id-ID")} baris</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-brand-teal transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
          <div className="mt-6 pt-4 border-t border-gray-50 text-[11px] text-gray-400 font-medium text-center">
            Berdasarkan jumlah baris dalam dataset CSV
          </div>
        </div>
      </div>
    </div>
  );
}
