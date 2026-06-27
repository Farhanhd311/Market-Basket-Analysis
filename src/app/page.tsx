import Link from "next/link";
import { 
  Database, 
  Package, 
  TrendingUp, 
  Award, 
  Sparkles, 
  AlertTriangle 
} from "lucide-react";

export default function Home() {
  const cards = [
    {
      title: "Data Transaksi",
      desc: "Kelola dan unggah dataset transaksi ritel (.csv).",
      icon: Database,
      href: "/transactions",
      color: "bg-teal-50 text-brand-teal border-teal-100",
      count: "1.991 Transaksi",
    },
    {
      title: "Stok Barang",
      desc: "Manajemen inventory dan level minimum stok.",
      icon: Package,
      href: "/inventory",
      color: "bg-teal-50 text-brand-teal border-teal-100",
      count: "68 Produk",
    },
    {
      title: "Analisis Apriori",
      desc: "Jalankan association rule mining dengan parameter kustom.",
      icon: TrendingUp,
      href: "/analysis",
      color: "bg-amber-50 text-brand-amber border-amber-100",
      count: "Support, Confidence, Lift",
    },
    {
      title: "Hasil & Aturan Asosiasi",
      desc: "Lihat hasil association rules terkuat yang dihasilkan.",
      icon: Award,
      href: "/rules",
      color: "bg-teal-50 text-brand-teal border-teal-100",
      count: "Urutan Berdasarkan Lift",
    },
    {
      title: "Rekomendasi Bundling",
      desc: "Strategi cross-selling / produk bundling ritel.",
      icon: Sparkles,
      href: "/recommendations",
      color: "bg-amber-50 text-brand-amber border-amber-100",
      count: "Cross-selling Strategy",
    },
    {
      title: "Prioritas Restock",
      desc: "Daftar pengisian stok ulang berbasis aturan asosiasi.",
      icon: AlertTriangle,
      href: "/restock",
      color: "bg-teal-50 text-brand-teal border-teal-100",
      count: "Restock Priority List",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-teal-50/50 rounded-full blur-3xl -z-10" />
        <h1 className="text-3xl font-extrabold text-brand-teal tracking-tight">
          Selamat Datang di MBA Ritel
        </h1>
        <p className="mt-2 text-gray-600 max-w-2xl leading-relaxed text-sm">
          Aplikasi Market Basket Analysis ritel untuk menganalisis keterkaitan pembelian produk
          menggunakan algoritma Apriori. Hasil analisis digunakan untuk rekomendasi bundling produk
          serta penentuan prioritas pengisian stok (restock) barang pada Supply Chain Management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-brand-teal-light/30 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${card.color} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-teal transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {card.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 group-hover:text-brand-teal-light transition-colors duration-300">
                  {card.count}
                </span>
                <span className="text-xs font-bold text-brand-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Buka &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
