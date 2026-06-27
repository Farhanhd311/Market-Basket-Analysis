import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MBA Ritel — Apriori",
  description: "Market Basket Analysis Ritel untuk Manajemen Rantai Pasok",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <body className={`${inter.className} h-full bg-brand-bg text-brand-text flex overflow-hidden`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Topbar */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
            <h2 className="text-xl font-bold text-brand-teal tracking-tight">
              MBA Ritel — Apriori
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-teal-50 text-brand-teal border border-brand-teal/20">
                SCM Course Project
              </span>
            </div>
          </header>
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
