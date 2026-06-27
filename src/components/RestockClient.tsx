"use client";

import React, { useState, useMemo } from "react";
import { AlertTriangle, Download, ArrowRight, CheckCircle2, ShoppingCart, HelpCircle } from "lucide-react";
import { DataTable, Column, Badge, Button, Card } from "@/components/ui";
import { useAnalysis } from "@/context/AnalysisContext";
import Link from "next/link";

interface ProductWithSupport {
  id: string;
  productId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  support: number;
  salesCount: number;
}

interface RestockPriorityRow extends ProductWithSupport {
  deficiency: number;
  maxLift: number;
  associatedProduct: string | null;
  priorityScore: number;
  priorityLevel: "Kritis" | "Sedang" | "Rendah";
}

export default function RestockClient({ products }: { products: ProductWithSupport[] }) {
  const { rules, isMined } = useAnalysis();
  const [activeFilter, setActiveFilter] = useState<"all" | "critical">("critical");

  // Hitung Prioritas Restock Berdasarkan Formula SCM & Aturan Asosiasi
  const restockList: RestockPriorityRow[] = useMemo(() => {
    return products.map((p) => {
      const deficiency = Math.max(0, p.minStock - p.stock);
      
      // Cari hubungan asosiasi terkuat (Max Lift) di mana produk ini berada di antecedent atau consequent
      let maxLift = 0;
      let associatedProduct: string | null = null;

      if (isMined && rules.length > 0) {
        rules.forEach((rule) => {
          const isAntecedent = rule.antecedent.includes(p.name);
          const isConsequent = rule.consequent.includes(p.name);

          if ((isAntecedent || isConsequent) && rule.lift > maxLift) {
            maxLift = rule.lift;
            // Dapatkan produk pasangan
            const peers = isAntecedent ? rule.consequent : rule.antecedent;
            associatedProduct = peers.join(", ");
          }
        });
      }

      // Formula Prioritas SCM:
      // Priority Score = Deficiency * Support * (1 + Max Lift)
      // Jika produk tidak berkekurangan stok (deficiency = 0), skor dasar = 0
      const ruleMultiplier = maxLift > 0 ? (1 + maxLift) : 1;
      const priorityScore = deficiency * p.support * ruleMultiplier * 100; // Dikali 100 agar angkanya mudah dibaca

      let priorityLevel: "Kritis" | "Sedang" | "Rendah" = "Rendah";
      if (deficiency > 0) {
        if (priorityScore >= 15) {
          priorityLevel = "Kritis";
        } else if (priorityScore >= 5) {
          priorityLevel = "Sedang";
        }
      }

      return {
        ...p,
        deficiency,
        maxLift,
        associatedProduct,
        priorityScore: Number(priorityScore.toFixed(2)),
        priorityLevel,
      };
    });
  }, [products, rules, isMined]);

  // Filter data berdasarkan pilihan tab (Semua Produk vs. Hanya yang Perlu Restock)
  const filteredList = useMemo(() => {
    if (activeFilter === "critical") {
      return restockList.filter((r) => r.deficiency > 0).sort((a, b) => b.priorityScore - a.priorityScore);
    }
    return restockList.sort((a, b) => b.priorityScore - a.priorityScore);
  }, [restockList, activeFilter]);

  const handleExportCSV = () => {
    const headers = [
      "Kode Produk",
      "Nama Produk",
      "Kategori",
      "Stok Aktif",
      "Safety Stock (Min)",
      "Kekurangan",
      "Support Produk (%)",
      "Hubungan Asosiasi Terkuat (Max Lift)",
      "Produk Terkait",
      "Skor Prioritas Restock",
      "Level Prioritas",
    ];

    const rows = filteredList.map((r) => [
      `"#${r.productId}"`,
      `"${r.name}"`,
      `"${r.category}"`,
      r.stock.toString(),
      r.minStock.toString(),
      r.deficiency.toString(),
      (r.support * 100).toFixed(2),
      r.maxLift.toFixed(3),
      r.associatedProduct ? `"${r.associatedProduct}"` : '"-"',
      r.priorityScore.toString(),
      r.priorityLevel,
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `daftar_prioritas_restock_${activeFilter}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: Column<RestockPriorityRow>[] = [
    {
      header: "Produk",
      accessorKey: "name",
      sortable: true,
      cell: (r) => (
        <div>
          <span className="font-bold text-gray-800 block text-xs">{r.name}</span>
          <span className="text-[10px] text-gray-400 font-mono">#{r.productId}</span>
        </div>
      ),
    },
    {
      header: "Stok / Min",
      accessorKey: "stock",
      cell: (r) => (
        <span className="font-mono text-xs font-bold text-gray-700">
          {r.stock} / <span className="text-gray-400 font-normal">{r.minStock}</span>
        </span>
      ),
    },
    {
      header: "Kekurangan",
      accessorKey: "deficiency",
      sortable: true,
      cell: (r) => (
        <span className={`font-mono text-xs font-extrabold ${r.deficiency > 0 ? "text-rose-600" : "text-gray-400"}`}>
          {r.deficiency > 0 ? `-${r.deficiency}` : "0"}
        </span>
      ),
    },
    {
      header: "Sup. Produk",
      accessorKey: "support",
      sortable: true,
      cell: (r) => (
        <span className="font-mono text-xs text-gray-600 font-medium">
          {(r.support * 100).toFixed(1)}%
        </span>
      ),
    },
    {
      header: "Max Lift",
      accessorKey: "maxLift",
      sortable: true,
      cell: (r) => (
        <span className="font-mono text-xs font-semibold text-gray-600">
          {r.maxLift > 0 ? r.maxLift.toFixed(2) : "-"}
        </span>
      ),
    },
    {
      header: "Skor Prioritas",
      accessorKey: "priorityScore",
      sortable: true,
      cell: (r) => (
        <span className={`font-mono text-sm font-extrabold ${r.priorityScore >= 15 ? "text-rose-600 text-base" : r.priorityScore > 0 ? "text-amber-600" : "text-gray-400"}`}>
          {r.priorityScore}
        </span>
      ),
    },
    {
      header: "Prioritas",
      accessorKey: "priorityLevel",
      cell: (r) => {
        if (r.deficiency === 0) {
          return <Badge variant="success">Aman</Badge>;
        }
        return (
          <Badge variant={r.priorityLevel === "Kritis" ? "danger" : "warning"}>
            {r.priorityLevel}
          </Badge>
        );
      },
    },
    {
      header: "Saran SCM",
      accessorKey: "id",
      cell: (r) => {
        if (r.deficiency === 0) {
          return <span className="text-[10px] text-gray-400 font-medium">Stok mencukupi</span>;
        }
        if (r.maxLift > 0 && r.associatedProduct) {
          return (
            <span className="text-[10px] text-brand-teal font-semibold leading-tight block max-w-xs">
              Mempengaruhi penjualan <strong className="font-extrabold text-brand-amber">{r.associatedProduct}</strong> (Lift: {r.maxLift.toFixed(2)})
            </span>
          );
        }
        return <span className="text-[10px] text-gray-500">Restock normal (stok di bawah minimum)</span>;
      },
    },
  ];

  const criticalCount = restockList.filter((r) => r.deficiency > 0).length;

  return (
    <div className="space-y-6">
      {/* Menu Filter & Aksi */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter("critical")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === "critical"
                ? "bg-brand-teal text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            Perlu Restock
            <Badge variant="danger" className="text-[9px] py-0 px-1 ml-1 font-extrabold">
              {criticalCount}
            </Badge>
          </button>
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === "all"
                ? "bg-brand-teal text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            Semua Produk
          </button>
        </div>

        <Button variant="secondary" size="sm" onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-1.5" />
          Ekspor CSV
        </Button>
      </div>

      {/* Catatan Formula */}
      <Card className="bg-amber-50/20 border-brand-amber/10 flex gap-4 p-4">
        <div className="p-2.5 bg-amber-50 text-brand-amber rounded-xl h-fit border border-amber-100">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-bold text-xs text-gray-800">Formula Prioritas Rantai Pasok (SCM)</h4>
          <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
            Skor Prioritas dihitung dengan formula:{" "}
            <code className="bg-white border border-gray-150 px-1.5 py-0.5 rounded text-brand-teal font-mono font-bold">
              Skor = Kekurangan Stok &times; Support Produk &times; (1 + Max Lift Asosiasi) &times; 100
            </code>
            . Produk yang stoknya kritis, sering dicari pelanggan (Support tinggi), dan memiliki efek silang yang kuat dengan produk lain (Lift tinggi) akan otomatis berada di prioritas teratas.
          </p>
        </div>
      </Card>

      {/* Info Status Run Terakhir */}
      {!isMined && (
        <Card className="bg-teal-55/5 border-brand-teal/10 flex items-center justify-between p-4 text-xs font-semibold">
          <span className="text-gray-500">
            💡 Aturan Asosiasi belum dijalankan. Prioritas restock saat ini dihitung tanpa efek silang asosiasi (Lift = 0).
          </span>
          <Link href="/analysis">
            <Button variant="ghost" size="sm" className="text-[10px] font-bold py-1">
              Buka Analisis &rarr;
            </Button>
          </Link>
        </Card>
      )}

      {/* DataTable */}
      {filteredList.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center text-gray-400 border-dashed border-2">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-3" />
          <p className="font-bold text-gray-800">Semu Stok Aman</p>
          <p className="text-sm mt-1 text-gray-400">Tidak ada produk ritel dengan persediaan di bawah safety stock minimum saat ini.</p>
        </Card>
      ) : (
        <DataTable
          data={filteredList}
          columns={columns}
          searchPlaceholder="Cari produk yang perlu di-restock..."
          searchKey="name"
          pageSize={10}
        />
      )}
    </div>
  );
}
