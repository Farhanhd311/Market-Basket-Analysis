import { Package, AlertTriangle, CheckCircle2, Box } from "lucide-react";
import { PageHeader, StatCard } from "@/components/ui";
import { prisma } from "@/lib/db";
import { seedStockIfEmpty } from "@/lib/data";
import InventoryClient from "@/components/InventoryClient";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  // Seed jika tabel kosong
  await seedStockIfEmpty();

  const stocks = await prisma.stock.findMany({ orderBy: { productName: "asc" } });

  const total = stocks.length;
  const critical = stocks.filter((s) => s.currentStock <= s.minThreshold).length;
  const safe = total - critical;
  const avgStock =
    total > 0
      ? Math.round(stocks.reduce((acc, s) => acc + s.currentStock, 0) / total)
      : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        icon={<Package className="w-6 h-6" />}
        title="Manajemen Stok"
        description={`${total} produk terdaftar — edit stok dan ambang minimum secara langsung`}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Produk"
          value={total}
          icon={<Box className="w-5 h-5" />}
          color="teal"
        />
        <StatCard
          title="Stok Kritis"
          value={critical}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="amber"
          description="Stok ≤ ambang minimum"
        />
        <StatCard
          title="Stok Aman"
          value={safe}
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="teal"
        />
        <StatCard
          title="Rata-rata Stok"
          value={avgStock}
          icon={<Package className="w-5 h-5" />}
          color="teal"
          description="unit per produk"
        />
      </div>

      {/* Tabel Interaktif */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <InventoryClient items={stocks} />
      </div>
    </div>
  );
}
