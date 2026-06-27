import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Terjadi Kesalahan",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="bg-rose-50/50 rounded-2xl p-8 border border-red-100 shadow-sm flex flex-col items-center justify-center text-center min-h-[300px]">
      <div className="bg-rose-100 text-rose-600 p-4 rounded-full mb-4">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h3 className="font-extrabold text-lg text-rose-900 tracking-tight">{title}</h3>
      <p className="text-sm text-rose-700/80 mt-1.5 mb-6 max-w-sm leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry} className="bg-rose-600 hover:bg-rose-750">
          Coba Lagi
        </Button>
      )}
    </div>
  );
}
