"use client";

import React, { useState, useMemo } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  pageSize?: number;
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = "Cari data...",
  searchKey,
  pageSize = 10,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Filter data berdasarkan query pencarian
  const filteredData = useMemo(() => {
    if (!searchQuery || !searchKey) return data;
    
    return data.filter((item) => {
      const val = item[searchKey];
      if (val === undefined || val === null) return false;
      return String(val).toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [data, searchQuery, searchKey]);

  // 2. Sortir data
  const sortedData = useMemo(() => {
    const sortableData = [...filteredData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const key = sortConfig.key as keyof T;
        const aValue = a[key];
        const bValue = b[key];

        if (aValue === undefined || bValue === undefined) return 0;

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  // 3. Paginasikan data
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Kolom Pencarian */}
      {searchKey && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-all duration-200"
          />
        </div>
      )}

      {/* Tabel */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-6 py-4">
                    {col.sortable ? (
                      <button
                        onClick={() => handleSort(col.accessorKey as string)}
                        className="flex items-center gap-1.5 hover:text-brand-teal font-bold transition-colors cursor-pointer"
                      >
                        {col.header}
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-teal-50/10 transition-colors">
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-6 py-4 text-gray-800">
                        {col.cell ? col.cell(row) : String(row[col.accessorKey as keyof T] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400">
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginasi */}
        {totalPages > 1 && (
          <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-xs text-gray-400 font-medium">
              Menampilkan {Math.min(sortedData.length, (currentPage - 1) * pageSize + 1)} sampai{" "}
              {Math.min(sortedData.length, currentPage * pageSize)} dari {sortedData.length} data
            </div>
            
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <span className="text-xs font-bold text-gray-700">
                Halaman {currentPage} dari {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
