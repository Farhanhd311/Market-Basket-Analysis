import { TrendingUp, Play } from "lucide-react";
import { PageHeader, Card, Button } from "@/components/ui";

export default function AnalysisPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analisis Apriori"
        desc="Jalankan pemrosesan algoritma Apriori dengan mengatur nilai Support minimum dan Confidence minimum pada dataset transaksi."
        icon={TrendingUp}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 space-y-6">
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
              <span className="text-[10px] text-gray-400 mt-1 block">Persentase minimum kemunculan item.</span>
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
              <span className="text-[10px] text-gray-400 mt-1 block">Tingkat kepastian hubungan antar item.</span>
            </div>
          </div>

          <Button className="w-full" size="lg">
            <Play className="h-4 w-4 fill-current" />
            Mulai Analisis
          </Button>
        </Card>

        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center text-gray-500 min-h-[350px]">
          <TrendingUp className="h-12 w-12 text-gray-300 mb-3" />
          <p className="font-bold text-gray-600">Analisis Belum Dijalankan</p>
          <p className="text-sm mt-1 max-w-xs text-gray-400">Tentukan parameter dan tekan &quot;Mulai Analisis&quot; untuk menjalankan kalkulasi aturan asosiasi Apriori.</p>
        </div>
      </div>
    </div>
  );
}
