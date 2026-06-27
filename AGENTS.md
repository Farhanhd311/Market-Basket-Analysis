# Project Rules & Specification: Market Basket Analysis

## TUJUAN
Aplikasi Web Market Basket Analysis Ritel untuk tugas kuliah Supply Chain Management. 
Menggunakan algoritma Apriori (association rule mining) untuk menghasilkan:
1. Rekomendasi bundling / cross-sell produk.
2. Daftar prioritas restock barang berdasarkan analisis penjualan dan aturan asosiasi.

## TECH STACK
- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma + SQLite (untuk manajemen stok & inventory)
- **CSV Parser**: PapaParse
- **Visualisasi**: Recharts
- **Apriori Algorithm**: Implementasi TypeScript murni (pure TS) dalam satu proyek monolitik (tanpa backend terpisah).

## DESAIN & TEMA WARNA
- **Teal**: `#0E5C57` (Warna utama)
- **Teal Terang**: `#13837A` (Hover/Sekunder)
- **Amber (Aksen)**: `#E8A13A` (Aksen perhatian/menonjol)
- **Latar Belakang**: `#F4F8F7` (Halaman bersih/modern)
- **Teks**: `#1C2B2A` (Kontras tinggi, mudah dibaca)

## SPESIFIKASI DATASET
- **Path**: `/data/transactions.csv`
- **Delimiter**: `;`
- **Format Tanggal**: `dd/mm/yyyy`
- **Kolom**: `order_id;user_id;order_date;time;order_hour_of_day;product_name;quantity;price;category;product_id`
- **Definisi Keranjang**: Baris dengan `order_id` yang sama dikelompokkan menjadi satu keranjang transaksi.
- **Skala Data**: ~1.991 transaksi, 68 produk, 17 kategori.

## METRIK & ASOSIASI
- **Support(X)** = `transaksi memuat X` / `total transaksi`
- **Confidence(X -> Y)** = `support(X ∪ Y)` / `support(X)`
- **Lift(X -> Y)** = `support(X ∪ Y)` / `(support(X) * support(Y))`
- **Peringkat Utama**: Diurutkan berdasarkan nilai **Lift** tertinggi.

## ATURAN KERJA AGENT (WAJIB & KETAT)
1. **Langsung Eksekusi**: Kerjakan tugas secara langsung tanpa membuat file Implementation Plan terpisah dan tanpa menunggu persetujuan rencana.
2. **Ringkas & Padat**: Penjelasan, balasan chat, dan laporan sesingkat mungkin. Jangan mencetak diff yang sangat panjang di dalam chat.
3. **Fokus & Efisien**: Hanya baca dan modifikasi file yang relevan. Hindari membaca ulang seluruh codebase di setiap langkah.
4. **Tanpa Visual Berlebih**: Jangan mengambil screenshot atau membuat visualisasi tambahan kecuali diminta oleh user.
5. **Tepat Sasaran**: Berhenti bekerja segera setelah kriteria tugas yang diminta tercapai.
