"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function updateStock(
  id: string,
  currentStock: number,
  minThreshold: number
) {
  await prisma.stock.update({
    where: { id },
    data: { currentStock, minThreshold },
  });
  revalidatePath("/inventory");
}
