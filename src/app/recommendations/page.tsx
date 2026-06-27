import { Sparkles } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/ui";

export default function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Rekomendasi Bundling / Cross-selling"
        desc="Rekomendasi paket bundling produk ritel berbasis aturan asosiasi dengan nilai Lift tinggi untuk meningkatkan penjualan silang."
        icon={Sparkles}
      />
      <EmptyState
        title="Belum Ada Rekomendasi Bundling"
        desc="Saran paket bundling akan diturunkan secara otomatis setelah hasil analisis Apriori didapatkan dan disimpan."
        icon={Sparkles}
      />
    </div>
  );
}
