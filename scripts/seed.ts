/**
 * Seed script — bisa diulang tanpa duplikasi (upsert).
 * Jalankan: npx tsx scripts/seed.ts
 */
import path from "path";
import fs from "fs";
import Papa from "papaparse";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const CSV_PATH = path.join(process.cwd(), "data", "transactions.csv");

async function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error("transactions.csv tidak ditemukan di", CSV_PATH);
    process.exit(1);
  }

  console.log("Membersihkan tabel Stock...");
  await prisma.stock.deleteMany();

  const raw = fs.readFileSync(CSV_PATH, "utf-8");
  const result = Papa.parse<Record<string, string>>(raw, {
    header: true,
    delimiter: ";",
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  // Kumpulkan produk unik berdasarkan product_name (bukan product_id)
  const productMap = new Map<string, { category: string }>();
  for (const r of result.data) {
    const name = String(r.product_name ?? "").trim();
    const category = String(r.category ?? "").trim();
    if (name && !productMap.has(name)) {
      productMap.set(name, { category });
    }
  }

  const products = Array.from(productMap.entries());
  console.log(`Ditemukan ${products.length} produk unik. Menyemai...`);

  let seeded = 0;
  let skipped = 0;

  for (let idx = 0; idx < products.length; idx++) {
    const [name, info] = products[idx];
    const productId = String(idx + 1).padStart(3, "0");

    // Cek apakah sudah ada berdasarkan productName (bukan productId) agar seed benar-benar idempotent
    const existing = await prisma.stock.findFirst({ where: { productName: name } });

    if (existing) {
      skipped++;
      continue;
    }

    // Stok acak 0–80, minThreshold = 15
    const currentStock = Math.floor(Math.random() * 81); // 0 s.d. 80

    await prisma.stock.upsert({
      where: { productId },
      update: {}, // Tidak overwrite stok yang sudah diubah manual
      create: {
        productId,
        productName: name,
        category: info.category,
        currentStock,
        minThreshold: 15,
      },
    });
    seeded++;
  }

  console.log(`✓ Selesai: ${seeded} produk baru ditambahkan, ${skipped} produk sudah ada (dilewati).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
