import { Award } from "lucide-react";

export default function RulesPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Award className="h-6 w-6 text-brand-teal" />
          Hasil & Aturan Asosiasi (Rules)
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Aturan asosiasi yang dihasilkan dari algoritma Apriori, diurutkan berdasarkan kekuatan aturan asosiasi (Lift).
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm overflow-hidden">
        <div className="text-center py-12 text-gray-500">
          <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-600">Belum ada aturan asosiasi terbentuk</p>
          <p className="text-sm mt-1">Jalankan Analisis Apriori terlebih dahulu untuk melihat hasil aturan asosiasi di sini.</p>
        </div>
      </div>
    </div>
  );
}
