import { AlertTriangle } from "lucide-react";
import { PageHeader, StatCard } from "@/components/ui";
import { prisma } from "@/lib/db";
import { seedStockIfEmpty } from "@/lib/data";
import RestockPageClient from "@/components/RestockPageClient";
import { ShieldAlert, TrendingDown, BarChart2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RestockPage() {
  await seedStockIfEmpty();

  const stocks = await prisma.stock.findMany({ orderBy: { productName: "asc" } });

  const total = stocks.length;
  const critical = stocks.filter((s) => s.currentStock <= s.minThreshold).length;

  return (
    <div className="space-y-8">
      <PageHeader
        icon={<AlertTriangle className="w-6 h-6" />}
        title="Prioritas Restock"
        description="Produk yang menjadi consequent aturan asosiasi ber-lift tinggi dan stoknya ≤ ambang minimum — diurutkan berdasarkan lift × kelangkaan."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Produk"
          value={total}
          icon={<BarChart2 className="w-5 h-5" />}
          color="teal"
        />
        <StatCard
          title="Stok Kritis"
          value={critical}
          icon={<ShieldAlert className="w-5 h-5" />}
          color="amber"
          description="Stok ≤ ambang minimum"
        />
        <StatCard
          title="Rasio Kritis"
          value={`${total > 0 ? Math.round((critical / total) * 100) : 0}%`}
          icon={<TrendingDown className="w-5 h-5" />}
          color="amber"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* 
          RestockPageClient adalah client component yang:
          1. Membaca rules dari localStorage (hasil run Apriori terakhir)
          2. Memanggil computeRestockPriority(rules, stocks) dari stockPriority.ts
          3. Menampilkan daftar prioritas dengan alasan + ekspor CSV
        */}
        <RestockPageClient stocks={stocks} />
      </div>
    </div>
  );
}
