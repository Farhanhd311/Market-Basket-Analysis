import { Database, ShoppingCart, BarChart3, CalendarRange, Star } from "lucide-react";
import { PageHeader, StatCard, Card } from "@/components/ui";
import { buildBaskets, getSummaryStats } from "@/lib/data";
import BasketTable from "@/components/BasketTable";

export default function TransactionsPage() {
  const baskets = buildBaskets();
  const stats = getSummaryStats();

  const miniStats = [
    {
      title: "Total Keranjang",
      value: stats.totalTransactions.toLocaleString("id-ID"),
      desc: "Transaksi unik (order_id)",
      icon: ShoppingCart,
      variant: "teal" as const,
    },
    {
      title: "Rentang Tanggal",
      value: stats.totalTransactions > 0 ? stats.dateRange.from.split("/")[2] : "-",
      desc: `${stats.dateRange.from} s.d. ${stats.dateRange.to}`,
      icon: CalendarRange,
      variant: "gray" as const,
    },
    {
      title: "Rata-rata Item",
      value: stats.avgItemsPerBasket.toLocaleString("id-ID"),
      desc: "Item unik per keranjang",
      icon: BarChart3,
      variant: "teal" as const,
    },
    {
      title: "Produk Terlaris",
      value: stats.topProduct?.name ?? "-",
      desc: stats.topProduct
        ? `Muncul ${stats.topProduct.count.toLocaleString("id-ID")} kali`
        : "Belum ada data",
      icon: Star,
      variant: "amber" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Transaksi Ritel"
        desc="Ringkasan dataset transaksi penjualan ritel yang telah diproses menjadi keranjang belanja (basket) berdasarkan order_id."
        icon={Database}
      />

      {/* Mini Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {miniStats.map((s, idx) => (
          <StatCard key={idx} {...s} />
        ))}
      </div>

      {/* Top Kategori */}
      {stats.topCategories.length > 0 && (
        <Card>
          <h3 className="text-base font-bold text-gray-900 mb-5">Distribusi Kategori (Top 7)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {stats.topCategories.map((cat) => {
              const maxCount = stats.topCategories[0].count;
              const pct = Math.round((cat.count / maxCount) * 100);
              return (
                <div key={cat.category} className="flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-brand-teal"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight">
                    {cat.category}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {cat.count}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* DataTable Keranjang */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">
          Daftar Keranjang Transaksi
          <span className="ml-2 text-sm font-medium text-gray-400">
            ({baskets.length.toLocaleString("id-ID")} keranjang)
          </span>
        </h2>
        <BasketTable baskets={baskets} />
      </div>
    </div>
  );
}
