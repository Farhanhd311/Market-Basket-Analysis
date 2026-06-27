"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
      <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center border-4 border-rose-100">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Terjadi Kesalahan</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Maaf, terjadi masalah saat memuat halaman ini. Silakan coba muat ulang halaman atau kembali ke beranda.
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
      >
        <RefreshCcw className="w-4 h-4" />
        Coba Lagi
      </button>
    </div>
  );
}
