export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-teal-100 border-t-brand-teal rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium animate-pulse">Memuat data...</p>
    </div>
  );
}
