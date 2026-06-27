import { NextResponse } from "next/server";
import { buildBaskets, getProductCategoryMap } from "@/lib/data";
import { runApriori } from "@/lib/apriori";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    
    const minSupport = typeof body.minSupport === "number" ? body.minSupport : 0.02;
    const minConfidence = typeof body.minConfidence === "number" ? body.minConfidence : 0.3;
    const maxLen = typeof body.maxLen === "number" ? body.maxLen : 3;

    const baskets = buildBaskets();
    const categoryMap = getProductCategoryMap();
    
    const startTime = performance.now();
    const { itemsets, rules } = runApriori(baskets, {
      minSupport,
      minConfidence,
      maxLen,
    });
    const endTime = performance.now();
    const executionTimeMs = Math.round(endTime - startTime);

    return NextResponse.json({
      rules,
      summary: {
        totalItemsets: itemsets.length,
        totalRules: rules.length,
        executionTimeMs,
        minSupport,
        minConfidence,
        maxLen,
        categoryMap,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Terjadi kesalahan server internal" },
      { status: 500 }
    );
  }
}
