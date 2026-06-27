import { TrendingUp, Play } from "lucide-react";

export default function AnalysisPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-brand-teal" />
          Analisis Apriori
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Jalankan pemrosesan algoritma Apriori dengan mengatur nilai Support minimum dan Confidence minimum.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-gray-900 border-b pb-3">Parameter Analisis</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Minimum Support (%)
              </label>
              <input 
                type="number" 
                defaultValue={5} 
                step={0.1}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-colors"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Persentase minimum kemunculan item dalam transaksi.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Minimum Confidence (%)
              </label>
              <input 
                type="number" 
                defaultValue={30} 
                step={1}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-colors"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Tingkat kepastian hubungan antar item (aturan asosiasi).</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-3 bg-brand-teal hover:bg-brand-teal-light text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-brand-teal/10">
            <Play className="h-4 w-4 fill-current" />
            Mulai Analisis
          </button>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center text-gray-500 min-h-[350px]">
          <TrendingUp className="h-12 w-12 text-gray-300 mb-3" />
          <p className="font-semibold text-gray-600">Analisis belum dijalankan</p>
          <p className="text-sm mt-1 max-w-xs">Tentukan parameter dan tekan tombol &quot;Mulai Analisis&quot; untuk menjalankan kalkulasi aturan asosiasi.</p>
        </div>
      </div>
    </div>
  );
}
