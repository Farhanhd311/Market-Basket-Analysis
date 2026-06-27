import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";
import { seedProductsIfEmpty, buildBaskets } from "@/lib/data";
import RestockClient from "@/components/RestockClient";

export const revalidate = 0; // Pastikan data dinamis

export default async function RestockPage() {
  // Seeding otomatis database jika kosong
  await seedProductsIfEmpty();

  // Ambal data produk dari database SQLite via Prisma
  const dbProducts = await prisma.product.findMany();

  // Hitung jumlah transaksi per produk untuk menghitung support individual
  const baskets = buildBaskets();
  const totalBaskets = Math.max(1, baskets.length);
  const productSalesMap = new Map<string, number>();

  baskets.forEach((b) => {
    b.items.forEach((item) => {
      productSalesMap.set(item, (productSalesMap.get(item) ?? 0) + 1);
    });
  });

  // Gabungkan info database dengan support penjualan riil dari CSV
  const productsWithSupport = dbProducts.map((p) => {
    const salesCount = productSalesMap.get(p.name) ?? 0;
    const support = salesCount / totalBaskets;

    return {
      id: p.id,
      productId: p.productId,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      minStock: p.minStock,
      support,
      salesCount,
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prioritas Restock Barang"
        desc="Daftar restock persediaan kritis ritel yang diurutkan secara cerdas berdasarkan tingkat kekurangan stok, popularitas (Support), dan pengaruh silang aturan asosiasi (Lift)."
        icon={AlertTriangle}
      />
      <RestockClient products={productsWithSupport} />
    </div>
  );
}
