import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, stock, minStock } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        stock: typeof stock === "number" ? stock : undefined,
        minStock: typeof minStock === "number" ? minStock : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal memperbarui produk" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, name, category, price, stock, minStock } = body;

    if (!productId || !name || !category || typeof price !== "number") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const created = await prisma.product.create({
      data: {
        productId,
        name,
        category,
        price,
        stock: stock || 0,
        minStock: minStock || 15,
      },
    });

    return NextResponse.json(created);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal menambahkan produk" }, { status: 500 });
  }
}
