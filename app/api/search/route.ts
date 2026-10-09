import { embed, generateText, Output } from "ai";
import { sql } from "@/lib/db";
import { z } from "zod";
import { searchDocuments } from "@/lib/search";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const results = await searchDocuments(query);

    const resultSchema = z.object({
      source: z.string(),
      content: z.string(),
      similarity: z.number(),
    });
    const validatedResults = resultSchema.array().parse(results);
    
    const response = {
      success: true,
      code: 200,
      data: { results: validatedResults },
      error: null,
    };
    // 3. Return them
    return Response.json(response);
  } catch (error) {
    console.error("Search error:", error);
    return Response.json(
      {
        data: null,
        error: { errorEnglish: "Search failed", errorArabic: "فشل البحث" },
        code: 500,
        success: false,
      },
      { status: 500 },
    );
  }
}
