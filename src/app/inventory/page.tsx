import { Package } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";
import { seedProductsIfEmpty } from "@/lib/data";
import InventoryClient from "@/components/InventoryClient";

export const revalidate = 0; // Pastikan data selalu dinamis

export default async function InventoryPage() {
  // Seeding otomatis database jika kosong
  await seedProductsIfEmpty();

  // Ambil data produk terbaru dari SQLite via Prisma
  const products = await prisma.product.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stok Barang (Inventory)"
        desc="Manajemen level persediaan produk, pencatatan harga, serta konfigurasi safety stock minimum secara dinamis."
        icon={Package}
      />
      <InventoryClient initialProducts={products} />
    </div>
  );
}
