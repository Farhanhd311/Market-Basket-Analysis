import { AlertTriangle } from "lucide-react";
import { PageHeader, EmptyState, Badge } from "@/components/ui";

export default function RestockPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Prioritas Restock Barang"
        desc="Daftar stok barang kritis yang perlu diisi ulang secara prioritas berdasarkan tren penjualan dan aturan asosiasi."
        icon={AlertTriangle}
        actions={
          <Badge variant="danger">
            <span className="mr-1.5 inline-block w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            Stok Kritis
          </Badge>
        }
      />
      <EmptyState
        title="Belum Ada Prioritas Restock"
        desc="Daftar prioritas restock diurutkan berdasarkan item yang stoknya di bawah batas minimum dan sering dibeli bersamaan."
        icon={AlertTriangle}
      />
    </div>
  );
}
