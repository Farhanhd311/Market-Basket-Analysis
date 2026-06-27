"use client";

import { DataTable, Column, Badge } from "@/components/ui";
import type { Basket } from "@/types";

const columns: Column<Basket>[] = [
  {
    header: "Order ID",
    accessorKey: "order_id",
    sortable: true,
    cell: (b) => (
      <span className="font-mono text-xs font-bold text-brand-teal bg-teal-50 px-2 py-0.5 rounded-md">
        #{b.order_id}
      </span>
    ),
  },
  {
    header: "Tanggal",
    accessorKey: "order_date",
    sortable: true,
  },
  {
    header: "Produk (Keranjang)",
    accessorKey: "items",
    cell: (b) => (
      <div className="flex flex-wrap gap-1 max-w-md">
        {b.items.map((item) => (
          <span
            key={item}
            className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium"
          >
            {item}
          </span>
        ))}
      </div>
    ),
  },
  {
    header: "Jml. Item",
    accessorKey: "item_count",
    sortable: true,
    cell: (b) => (
      <Badge variant={b.item_count >= 5 ? "info" : "neutral"}>
        {b.item_count} item
      </Badge>
    ),
  },
];

export default function BasketTable({ baskets }: { baskets: Basket[] }) {
  return (
    <DataTable
      data={baskets}
      columns={columns}
      searchPlaceholder="Cari order ID atau produk..."
      searchKey="order_id"
      pageSize={15}
    />
  );
}
