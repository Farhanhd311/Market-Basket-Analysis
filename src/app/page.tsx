import Link from "next/link";
import { 
  Database, 
  Package, 
  Tags, 
  Award, 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  AlertTriangle 
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const stats = [
    {
      title: "Total Transaksi",
      value: "1.991",
      desc: "Transaksi terdaftar dari penjualan ritel",
      icon: Database,
      variant: "teal" as const,
      trend: { value: "+12.4%", label: "bulan ini", positive: true }
    },
    {
      title: "Total Produk",
      value: "68",
      desc: "Produk ritel aktif di sistem",
      icon: Package,
      variant: "teal" as const,
    },
    {
      title: "Kategori Produk",
      value: "17",
      desc: "Kategori produk terdaftar",
      icon: Tags,
      variant: "gray" as const,
    },
    {
      title: "Aturan Signifikan",
      value: "12",
      desc: "Aturan asosiasi dengan Lift > 1.5",
      icon: Award,
      variant: "amber" as const,
      trend: { value: "100%", label: "validitas", positive: true }
    }
  ];

  const quickActions = [
    {
      title: "Analisis Apriori",
      desc: "Konfigurasi parameter minimum support dan confidence untuk memproses dataset transaksi ritel.",
      icon: TrendingUp,
      href: "/analysis",
      color: "bg-teal-50 text-brand-teal border-teal-100",
      cta: "Mulai Analisis"
    },
    {
      title: "Rekomendasi Bundling",
      desc: "Terapkan strategi cross-selling menggunakan paket bundling produk ritel dengan nilai Lift terkuat.",
      icon: Sparkles,
      href: "/recommendations",
      color: "bg-amber-50 text-brand-amber border-amber-100",
      cta: "Lihat Bundling"
    },
    {
      title: "Prioritas Restock",
      desc: "Tentukan prioritas pengisian stok ulang produk ritel berdasarkan tingkat kritis persediaan.",
      icon: AlertTriangle,
      href: "/restock",
      color: "bg-teal-50 text-brand-teal border-teal-100",
      cta: "Cek Stok Kritis"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-teal-50/50 rounded-full blur-3xl -z-10" />
        <h1 className="text-3xl font-extrabold text-brand-teal tracking-tight">
          Dashboard Market Basket Analysis
        </h1>
        <p className="mt-2 text-gray-600 max-w-2xl leading-relaxed text-sm">
          Solusi optimasi Supply Chain Management ritel berbasis data transaksi. 
          Algoritma Apriori memetakan keterkaitan produk untuk meningkatkan penjualan silang (cross-selling) dan mengatur prioritas restock stok kritis secara otomatis.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            desc={stat.desc}
            icon={stat.icon}
            variant={stat.variant}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Aksi Cepat MBA
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={idx} 
                  className="flex flex-col justify-between hover:border-brand-teal-light/20 hover:shadow-md transition-all duration-300"
                >
                  <div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${action.color} mb-4`}>
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

        {/* Info Card */}
        <div className="lg:col-span-1">
          <div className="h-full flex flex-col justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight border-b pb-3 mb-4">
                Metodologi Analisis
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-[10px] font-bold text-brand-teal shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Support (Dukungan)</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">Seberapa sering kombinasi produk muncul dalam seluruh keranjang transaksi ritel.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-[10px] font-bold text-brand-teal shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Confidence (Keyakinan)</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">Kekuatan hubungan searah. Seberapa sering produk B dibeli jika produk A telah dibeli.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[10px] font-bold text-brand-amber shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Lift (Kekuatan Aturan)</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">Metrik utama penentu validitas. Jika Lift &gt; 1, hubungan bersifat positif dan signifikan.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-50 text-[11px] text-gray-400 font-medium text-center">
              Apriori menggunakan ranking Lift tertinggi untuk menyusun rekomendasi bundling produk ritel.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
