import { Award } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/ui";

export default function RulesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Hasil & Aturan Asosiasi"
        desc="Aturan asosiasi yang dihasilkan dari algoritma Apriori, diurutkan berdasarkan nilai Lift tertinggi (aturan terkuat)."
        icon={Award}
      />
      <EmptyState
        title="Belum Ada Aturan Asosiasi"
        desc="Jalankan Analisis Apriori terlebih dahulu untuk melihat hasil aturan asosiasi yang diurutkan berdasarkan nilai Lift di sini."
        icon={Award}
      />
    </div>
  );
}
