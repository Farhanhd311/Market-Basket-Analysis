"use client";

import React, { useMemo, useState } from "react";
import { Award, ArrowRight, BarChart3, Share2 } from "lucide-react";
import { PageHeader, Card, EmptyState, Button } from "@/components/ui";
import { useAnalysis } from "@/context/AnalysisContext";
import NetworkGraph from "@/components/NetworkGraph";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

export default function RulesPage() {
  const { rules, isMined, summary } = useAnalysis();
  const [strictCategory, setStrictCategory] = useState<boolean>(true);

  // Helper untuk mengecek apakah semua item berada dalam kategori yang sama
  const isSameCategory = (items: string[]) => {
    if (!strictCategory || !summary?.categoryMap) return true;
    if (items.length <= 1) return true;
    const firstCat = summary.categoryMap[items[0]];
    return items.every(item => summary.categoryMap![item] === firstCat);
  };

  const filteredRules = useMemo(() => {
    return rules.filter((r) => isSameCategory([...r.antecedent, ...r.consequent]));
  }, [rules, strictCategory, summary?.categoryMap]);

  // 10 Aturan dengan Lift Tertinggi
  const chartData = useMemo(() => {
    if (filteredRules.length === 0) return [];
    return [...filteredRules]
      .sort((a, b) => b.lift - a.lift)
      .slice(0, 10)
      .map((r, idx) => {
        const sourceStr = r.antecedent.join(",");
        const targetStr = r.consequent.join(",");
        // Label singkat untuk chart agar muat di sumbu X
        const shortSource = sourceStr.length > 10 ? `${sourceStr.slice(0, 8)}..` : sourceStr;
        const shortTarget = targetStr.length > 10 ? `${targetStr.slice(0, 8)}..` : targetStr;
        return {
          fullName: `${sourceStr} → ${targetStr}`,
          shortName: `${shortSource} → ${shortTarget}`,
          lift: Number(r.lift.toFixed(3)),
          supportPct: Number((r.support * 100).toFixed(2)),
          confidencePct: Number((r.confidence * 100).toFixed(1)),
        };
      });
  }, [filteredRules]);

  // Jika belum dijalankan apriori
  if (!isMined || rules.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Hasil & Aturan Asosiasi"
          desc="Tampilkan visualisasi graf jaringan ko-pembelian dan peringkat aturan asosiasi dari hasil mining terakhir."
          icon={Award}
        />
        <EmptyState
          title="Hasil Analisis Kosong"
          desc="Anda belum menjalankan Algoritma Apriori atau tidak ada aturan yang memenuhi batas parameter."
          icon={Award}
          action={
            <Link href="/analysis">
              <Button variant="primary">
                <ArrowRight className="h-4 w-4 mr-2" />
                Buka Analisis
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Hasil & Aturan Asosiasi"
        desc="Visualisasi hubungan keterkaitan produk berdasarkan model graf jaringan ko-pembelian dan bagan urutan lift kekuatan aturan."
        icon={Award}
        actions={
          <label className="flex items-center gap-2 bg-white px-3 py-2 border border-gray-100 rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={strictCategory}
              onChange={(e) => setStrictCategory(e.target.checked)}
              className="w-4 h-4 text-brand-teal accent-brand-teal rounded border-gray-300 focus:ring-brand-teal"
            />
            <span className="text-xs font-semibold text-gray-700">Grup Kategori Sama</span>
          </label>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bagan Recharts: Top 10 Lift */}
        <Card className="flex flex-col">
          <div className="border-b pb-3 mb-5 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-brand-teal" />
            <div>
              <h3 className="font-bold text-base text-gray-900">Top 10 Aturan (Lift Terkuat)</h3>
              <p className="text-xs text-gray-400">Aturan asosiasi dengan kekuatan keterikatan (Lift Ratio) tertinggi.</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full mt-4 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -25, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="shortName" 
                  tick={{ fill: '#64748B', fontSize: 10, fontWeight: 'bold' }} 
                  axisLine={false}
                  tickLine={false}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  tick={{ fill: '#64748B', fontSize: 10, fontWeight: 'medium' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: '#0E5C57', opacity: 0.04 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3.5 border border-gray-100 rounded-xl shadow-lg text-xs space-y-1">
                          <p className="font-bold text-brand-teal mb-1 border-b pb-1.5">{data.fullName}</p>
                          <p><span className="text-gray-400 font-medium">Lift Ratio:</span> <strong className="text-brand-amber font-extrabold">{data.lift}</strong></p>
                          <p><span className="text-gray-400 font-medium">Support:</span> <strong className="text-gray-700">{data.supportPct}%</strong></p>
                          <p><span className="text-gray-400 font-medium">Confidence:</span> <strong className="text-gray-700">{data.confidencePct}%</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="lift" 
                  fill="#0E5C57" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Graf Jaringan SVG */}
        <NetworkGraph rules={filteredRules} />
      </div>
    </div>
  );
}
