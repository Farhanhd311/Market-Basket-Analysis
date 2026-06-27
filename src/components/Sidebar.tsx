"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Package,
  TrendingUp,
  Award,
  Sparkles,
  AlertTriangle
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Data Transaksi", href: "/transactions", icon: Database },
  { name: "Stok", href: "/inventory", icon: Package },
  { name: "Analisis", href: "/analysis", icon: TrendingUp },
  { name: "Hasil & Aturan", href: "/rules", icon: Award },
  { name: "Rekomendasi", href: "/recommendations", icon: Sparkles },
  { name: "Prioritas Stok", href: "/restock", icon: AlertTriangle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-brand-teal text-white flex flex-col h-full border-r border-brand-teal-light shadow-lg">
      <div className="p-6 border-b border-brand-teal-light flex items-center gap-3">
        <div className="bg-brand-amber text-brand-teal font-extrabold rounded-lg p-2 shadow-inner">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-wide">MBA Ritel</h1>
          <p className="text-xs text-teal-100 font-medium">Supply Chain Management</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 group ${
                isActive
                  ? "bg-brand-amber text-brand-teal shadow-md shadow-brand-amber/20 scale-[1.02]"
                  : "text-teal-50 hover:bg-brand-teal-light hover:text-white"
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                isActive ? "text-brand-teal" : "text-teal-200 group-hover:scale-110"
              }`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-brand-teal-light bg-brand-teal/50">
        <div className="text-xs text-teal-200 text-center font-medium">
          SCM Project © 2026
        </div>
      </div>
    </aside>
  );
}
