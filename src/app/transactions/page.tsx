import { Database, UploadCloud } from "lucide-react";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Database className="h-6 w-6 text-brand-teal" />
          Data Transaksi Ritel
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Halaman ini digunakan untuk mengunggah dataset transaksi penjualan ritel dalam format CSV dan melihat data transaksi.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm border-dashed border-2 border-brand-teal/20 flex flex-col items-center justify-center min-h-[300px]">
        <div className="bg-teal-50 text-brand-teal p-4 rounded-full mb-4">
          <UploadCloud className="h-10 w-10" />
        </div>
        <h3 className="font-bold text-lg text-gray-800">Unggah File Transaksi</h3>
        <p className="text-sm text-gray-500 mt-1 mb-6 text-center max-w-sm">
          Pilih file CSV transaksi ritel Anda. Pastikan pembatas (delimiter) menggunakan tanda titik koma (;) sesuai spesifikasi.
        </p>
        <button className="px-6 py-2.5 bg-brand-teal hover:bg-brand-teal-light text-white font-semibold rounded-xl text-sm shadow-md transition-colors">
          Pilih File CSV
        </button>
      </div>
    </div>
  );
}
