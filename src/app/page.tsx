import { getSummaryStats } from "@/lib/data";
import DashboardClient from "@/components/DashboardClient";

export default function Home() {
  const stats = getSummaryStats();
  return <DashboardClient initialStats={stats} />;
}
