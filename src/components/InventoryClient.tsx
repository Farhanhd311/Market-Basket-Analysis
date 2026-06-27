"use client";

import { useState, useTransition } from "react";
import { updateStock } from "@/app/inventory/actions";
import { DataTable, Column, Badge } from "@/components/ui";

interface StockItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  currentStock: number;
  minThreshold: number;
}

interface EditState {
  currentStock: number;
  minThreshold: number;
}

function EditRow({
  item,
  onClose,
}: {
  item: StockItem;
  onClose: () => void;
}) {
  const [vals, setVals] = useState<EditState>({
    currentStock: item.currentStock,
    minThreshold: item.minThreshold,
  });
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await updateStock(item.id, vals.currentStock, vals.minThreshold);
      onClose();
    });
  }

  return (
    <tr className="bg-teal-50 border-t border-teal-200">
      <td colSpan={7} className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-medium text-[#1C2B2A] text-sm">
            Edit: <strong>{item.productName}</strong>
          </span>
          <label className="flex items-center gap-2 text-sm text-[#1C2B2A]">
            Stok saat ini:
            <input
              type="number"
              min={0}
              value={vals.currentStock}
              onChange={(e) =>
                setVals((v) => ({
                  ...v,
                  currentStock: Math.max(0, Number(e.target.value)),
                }))
              }
              className="w-24 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-[#1C2B2A]">
            Batas aman:
            <input
              type="number"
              min={0}
              value={vals.minThreshold}
              onChange={(e) =>
                setVals((v) => ({
                  ...v,
                  minThreshold: Math.max(0, Number(e.target.value)),
                }))
              }
              className="w-24 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </label>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="bg-[#0E5C57] hover:bg-[#13837A] text-white text-sm font-medium px-4 py-1.5 rounded-md disabled:opacity-60 transition-colors"
          >
            {isPending ? "Menyimpan…" : "Simpan"}
          </button>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-md border border-gray-200 hover:border-gray-400 transition-colors"
          >
            Batal
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function InventoryClient({ items }: { items: StockItem[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const isCritical = (item: StockItem) =>
    item.currentStock <= item.minThreshold;

  const columns: Column<StockItem>[] = [
    {
      header: "ID",
      accessorKey: "productId",
      sortable: true,
      cell: (item) => (
        <span className="font-mono text-xs text-gray-500">{item.productId}</span>
      ),
    },
    {
      header: "Produk",
      accessorKey: "productName",
      sortable: true,
      cell: (item) => (
        <span
          className={`font-medium ${isCritical(item) ? "text-red-700" : "text-[#1C2B2A]"}`}
        >
          {item.productName}
        </span>
      ),
    },
    {
      header: "Kategori",
      accessorKey: "category",
      sortable: true,
      cell: (item) => <Badge variant="info">{item.category}</Badge>,
    },
    {
      header: "Stok Saat Ini",
      accessorKey: "currentStock",
      sortable: true,
      cell: (item) => {
        const critical = isCritical(item);
        return (
          <span
            className={`font-bold text-sm ${critical ? "text-red-600" : "text-[#0E5C57]"}`}
          >
            {item.currentStock}
          </span>
        );
      },
    },
    {
      header: "Batas Aman",
      accessorKey: "minThreshold",
      sortable: true,
      cell: (item) => (
        <span className="text-sm text-gray-600">{item.minThreshold}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "currentStock",
      cell: (item) => {
        return isCritical(item) ? (
          <Badge variant="danger">⚠ Kritis</Badge>
        ) : (
          <Badge variant="success">Aman</Badge>
        );
      },
    },
    {
      header: "Aksi",
      accessorKey: "id",
      cell: (item) => {
        return (
          <button
            onClick={() =>
              setEditingId(editingId === item.id ? null : item.id)
            }
            className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${
              editingId === item.id
                ? "bg-gray-100 text-gray-700"
                : "bg-teal-50 text-[#0E5C57] hover:bg-teal-100"
            }`}
          >
            {editingId === item.id ? "Tutup" : "Edit"}
          </button>
        );
      },
    },
  ];

  // Custom render to inject edit row after the active row
  // We'll use a simpler approach: wrap DataTable and append edit rows below
  return (
    <div className="space-y-4">
      {/* Edit panel (muncul di atas tabel ketika ada yang di-edit) */}
      {editingId && (() => {
        const item = items.find((i) => i.id === editingId);
        if (!item) return null;
        return (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex flex-wrap items-center gap-4">
            <span className="font-medium text-[#1C2B2A] text-sm">
              Edit: <strong>{item.productName}</strong>
            </span>
            <EditRowPanel item={item} onClose={() => setEditingId(null)} />
          </div>
        );
      })()}
      <DataTable
        data={items}
        columns={columns}
        searchKey="productName"
        searchPlaceholder="Cari produk…"
      />
    </div>
  );
}

function EditRowPanel({
  item,
  onClose,
}: {
  item: StockItem;
  onClose: () => void;
}) {
  const [vals, setVals] = useState<EditState>({
    currentStock: item.currentStock,
    minThreshold: item.minThreshold,
  });
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await updateStock(item.id, vals.currentStock, vals.minThreshold);
      onClose();
    });
  }

  return (
    <>
      <label className="flex items-center gap-2 text-sm text-[#1C2B2A]">
        Stok saat ini:
        <input
          type="number"
          min={0}
          value={vals.currentStock}
          onChange={(e) =>
            setVals((v) => ({
              ...v,
              currentStock: Math.max(0, Number(e.target.value)),
            }))
          }
          className="w-24 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-[#1C2B2A]">
        Batas aman:
        <input
          type="number"
          min={0}
          value={vals.minThreshold}
          onChange={(e) =>
            setVals((v) => ({
              ...v,
              minThreshold: Math.max(0, Number(e.target.value)),
            }))
          }
          className="w-24 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </label>
      <button
        onClick={handleSave}
        disabled={isPending}
        className="bg-[#0E5C57] hover:bg-[#13837A] text-white text-sm font-medium px-4 py-1.5 rounded-md disabled:opacity-60 transition-colors"
      >
        {isPending ? "Menyimpan…" : "Simpan"}
      </button>
      <button
        onClick={onClose}
        className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-md border border-gray-200 hover:border-gray-400 transition-colors"
      >
        Batal
      </button>
    </>
  );
}
