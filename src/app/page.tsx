import { getSummaryStats, seedStockIfEmpty } from "@/lib/data";
import DashboardClient from "@/components/DashboardClient";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  await seedStockIfEmpty();
  const stats = getSummaryStats();
  const stocks = await prisma.stock.findMany({ orderBy: { productName: "asc" } });

  // Map to StockRow interface compatible shape
  const stockRows = stocks.map((s) => ({
    id: s.id,
    productId: s.productId,
    productName: s.productName,
    category: s.category,
    currentStock: s.currentStock,
    minThreshold: s.minThreshold,
  }));

  return <DashboardClient initialStats={stats} stocks={stockRows} />;
}
