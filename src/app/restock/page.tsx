import { AlertTriangle } from "lucide-react";

export default function RestockPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-brand-teal" />
            Prioritas Restock Barang
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Daftar stok barang kritis yang perlu diisi ulang secara prioritas berdasarkan tren penjualan dan aturan asosiasi.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
            Stok Kritis
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm overflow-hidden">
        <div className="text-center py-12 text-gray-500">
          <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-600">Belum ada prioritas restock</p>
          <p className="text-sm mt-1">Daftar prioritas restock diurutkan berdasarkan item yang stoknya di bawah minimum dan sering dibeli bersamaan.</p>
        </div>
      </div>
    </div>
  );
}
