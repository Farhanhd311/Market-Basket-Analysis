import { Database, UploadCloud } from "lucide-react";
import { PageHeader, EmptyState, Button } from "@/components/ui";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Transaksi Ritel"
        desc="Unggah dataset transaksi penjualan ritel dalam format CSV dan telusuri setiap catatan transaksi."
        icon={Database}
        actions={
          <Button variant="primary" size="sm">
            <UploadCloud className="h-4 w-4" />
            Unggah CSV
          </Button>
        }
      />
      <EmptyState
        title="Belum Ada Data Transaksi"
        desc="Unggah file transactions.csv dengan delimiter titik koma (;) untuk mulai menganalisis keranjang belanja pelanggan."
        icon={UploadCloud}
        action={
          <Button variant="primary">
            <UploadCloud className="h-4 w-4" />
            Pilih File CSV
          </Button>
        }
      />
    </div>
  );
}
