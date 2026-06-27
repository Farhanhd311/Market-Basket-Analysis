import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, currentStock, minThreshold } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing stock item id" }, { status: 400 });
    }

    const updated = await prisma.stock.update({
      where: { id },
      data: {
        currentStock: typeof currentStock === "number" ? currentStock : undefined,
        minThreshold: typeof minThreshold === "number" ? minThreshold : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal memperbarui stok" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, productName, category, currentStock, minThreshold } = body;

    if (!productId || !productName || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const created = await prisma.stock.create({
      data: {
        productId,
        productName,
        category,
        currentStock: currentStock || 0,
        minThreshold: minThreshold || 15,
      },
    });

    return NextResponse.json(created);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal menambahkan stok" }, { status: 500 });
  }
}
