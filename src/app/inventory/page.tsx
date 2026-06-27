import { Package, Plus } from "lucide-react";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="h-6 w-6 text-brand-teal" />
            Stok Barang (Inventory)
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manajemen stok produk ritel, batas minimum stok (safety stock), dan pencatatan data barang.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-teal hover:bg-brand-teal-light text-white font-semibold rounded-xl text-sm transition-colors shadow-sm">
          <Plus className="h-4 w-4" />
          Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm overflow-hidden">
        <div className="text-center py-12 text-gray-500">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-600">Belum ada data stok produk</p>
          <p className="text-sm mt-1">Data stok akan diinisialisasi dari database SQLite via Prisma.</p>
        </div>
      </div>
    </div>
  );
}
