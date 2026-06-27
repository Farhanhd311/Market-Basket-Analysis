import { Sparkles } from "lucide-react";

export default function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-brand-teal" />
          Rekomendasi Bundling / Cross-selling
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Rekomendasi paket bundling produk ritel berbasis aturan asosiasi dengan nilai Lift tinggi untuk menaikkan penjualan.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm overflow-hidden">
        <div className="text-center py-12 text-gray-500">
          <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-600">Belum ada rekomendasi bundling</p>
          <p className="text-sm mt-1">Saran paket bundling akan diturunkan secara otomatis setelah hasil analisis Apriori didapatkan.</p>
        </div>
      </div>
    </div>
  );
}
