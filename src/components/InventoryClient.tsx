"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit2, Check, X, Package, Trash } from "lucide-react";
import { DataTable, Column, Badge, Button, Card } from "@/components/ui";
import { useRouter } from "next/navigation";

interface ProductData {
  id: string;
  productId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
}

export default function InventoryClient({ initialProducts }: { initialProducts: ProductData[] }) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductData[]>(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [editMinStock, setEditMinStock] = useState<number>(0);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Add Product Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProductId, setNewProductId] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPrice, setNewPrice] = useState<number>(100);
  const [newStock, setNewStock] = useState<number>(20);
  const [newMinStock, setNewMinStock] = useState<number>(15);
  const [submitting, setSubmitting] = useState(false);

  const startEditing = (p: ProductData) => {
    setEditingId(p.id);
    setEditStock(p.stock);
    setEditMinStock(p.minStock);
  };

  const handleSave = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await fetch("/api/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, stock: editStock, minStock: editMinStock }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data.");
      
      const updated = await res.json();
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: updated.stock, minStock: updated.minStock } : p));
      setEditingId(null);
      router.refresh(); // Refresh Next.js server components cache
    } catch (e) {
      alert("Error: Gagal memperbarui stok.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: newProductId,
          name: newName,
          category: newCategory,
          price: Number(newPrice),
          stock: Number(newStock),
          minStock: Number(newMinStock),
        }),
      });

      if (!res.ok) throw new Error("Gagal menambah produk");

      const created = await res.json();
      setProducts(prev => [created, ...prev]);
      setShowAddForm(false);
      
      // Reset Form
      setNewProductId("");
      setNewName("");
      setNewCategory("");
      setNewPrice(100);
      setNewStock(20);
      setNewMinStock(15);
      router.refresh();
    } catch (error) {
      alert("Error: Gagal menambahkan produk baru.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<ProductData>[] = [
    {
      header: "Kode Produk",
      accessorKey: "productId",
      sortable: true,
      cell: (p) => <span className="font-mono text-xs font-bold text-gray-500">#{p.productId}</span>,
    },
    {
      header: "Nama Produk",
      accessorKey: "name",
      sortable: true,
    },
    {
      header: "Kategori",
      accessorKey: "category",
      sortable: true,
      cell: (p) => <Badge variant="neutral">{p.category}</Badge>,
    },
    {
      header: "Harga",
      accessorKey: "price",
      sortable: true,
      cell: (p) => (
        <span className="font-mono text-xs text-gray-700 font-bold">
          Rp {p.price.toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      header: "Stok Aktif",
      accessorKey: "stock",
      sortable: true,
      cell: (p) => {
        if (editingId === p.id) {
          return (
            <input
              type="number"
              value={editStock}
              onChange={(e) => setEditStock(Number(e.target.value))}
              className="w-16 px-1.5 py-1 border border-gray-300 rounded text-center font-mono font-bold focus:outline-none focus:border-brand-teal text-sm bg-white"
            />
          );
        }
        return <span className="font-mono text-sm font-extrabold">{p.stock}</span>;
      },
    },
    {
      header: "Safety Stock (Min)",
      accessorKey: "minStock",
      sortable: true,
      cell: (p) => {
        if (editingId === p.id) {
          return (
            <input
              type="number"
              value={editMinStock}
              onChange={(e) => setEditMinStock(Number(e.target.value))}
              className="w-16 px-1.5 py-1 border border-gray-300 rounded text-center font-mono font-bold focus:outline-none focus:border-brand-teal text-sm bg-white"
            />
          );
        }
        return <span className="font-mono text-sm text-gray-400 font-semibold">{p.minStock}</span>;
      },
    },
    {
      header: "Status",
      accessorKey: "stock",
      cell: (p) => {
        const isCritical = p.stock <= p.minStock;
        return (
          <Badge variant={isCritical ? "danger" : "success"}>
            {isCritical ? "Perlu Restock" : "Aman"}
          </Badge>
        );
      },
    },
    {
      header: "Aksi",
      accessorKey: "id",
      cell: (p) => {
        if (loadingId === p.id) {
          return <span className="text-xs text-gray-400 font-medium animate-pulse">Menyimpan...</span>;
        }

        if (editingId === p.id) {
          return (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSave(p.id)}
                className="p-1.5 bg-teal-50 text-brand-teal hover:bg-brand-teal hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Simpan"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="p-1.5 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                title="Batal"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        }

        return (
          <button
            onClick={() => startEditing(p)}
            className="p-1.5 text-gray-400 hover:text-brand-teal hover:bg-teal-50 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 text-xs font-semibold"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tombol Tambah & Dialog Form */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Daftar Stok Produk</h2>
        <Button variant="primary" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-1.5" />
          {showAddForm ? "Tutup Form" : "Tambah Produk"}
        </Button>
      </div>

      {showAddForm && (
        <Card className="max-w-2xl border border-brand-teal/10 shadow-sm animate-fade-in bg-teal-50/5">
          <h3 className="font-bold text-base text-gray-900 mb-4 pb-2 border-b">Tambah Produk Baru</h3>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kode Produk</label>
              <input
                type="text"
                required
                placeholder="misal: 457"
                value={newProductId}
                onChange={(e) => setNewProductId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nama Produk</label>
              <input
                type="text"
                required
                placeholder="misal: Wheat Flour"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kategori</label>
              <input
                type="text"
                required
                placeholder="misal: Grains & Staples"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Harga (Rp)</label>
              <input
                type="number"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Stok Awal</label>
              <input
                type="number"
                required
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Safety Stock (Min)</label>
              <input
                type="number"
                required
                value={newMinStock}
                onChange={(e) => setNewMinStock(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end gap-2 pt-2 border-t mt-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setShowAddForm(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={submitting}>
                {submitting ? "Menyimpan..." : "Simpan Produk"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {products.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
          <Package className="h-12 w-12 text-gray-200 mb-3" />
          <p className="font-bold text-gray-700">Belum ada produk terdaftar</p>
          <p className="text-sm mt-1 text-gray-400">Gunakan form di atas untuk menambahkan produk ritel.</p>
        </Card>
      ) : (
        <DataTable
          data={products}
          columns={columns}
          searchPlaceholder="Cari nama produk atau kategori..."
          searchKey="name"
          pageSize={10}
        />
      )}
    </div>
  );
}
