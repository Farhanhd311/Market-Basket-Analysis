import { Package, Plus } from "lucide-react";
import { PageHeader, EmptyState, Button } from "@/components/ui";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Stok Barang (Inventory)"
        desc="Manajemen stok produk ritel, batas minimum stok (safety stock), dan pencatatan data barang."
        icon={Package}
        actions={
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Button>
        }
      />
      <EmptyState
        title="Belum Ada Data Stok Produk"
        desc="Data stok akan diinisialisasi dari database SQLite via Prisma. Tambahkan produk secara manual atau sinkronkan dari data transaksi."
        icon={Package}
        action={
          <Button variant="primary">
            <Plus className="h-4 w-4" />
            Tambah Produk Baru
          </Button>
        }
      />
    </div>
  );
}
