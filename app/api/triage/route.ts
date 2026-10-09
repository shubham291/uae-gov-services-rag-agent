import { generateText, Output } from "ai";
import { z } from "zod";
import { tr } from "zod/locales";

const triageSchema = z.object({
  language: z.enum(["arabic", "english", "mixed"]),
  category: z.enum(["visa", "emirates_id", "billing", "complaint", "general"]),
  urgency: z
    .enum(["low", "medium", "high"])
    .describe("high if the customer is blocked or angry"),
  summary: z.string().describe("One sentence summary in English"),
  customerName: z
    .string()
    .nullable()
    .describe("Only if mentioned, otherwise null"),
  suggestedReply: z
    .string()
    .describe("A short polite reply in the same language as the customer"),
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const { output } = await generateText({
      model: "anthropic/claude-sonnet-5",
      system:
        "You are a customer support triage system for a UAE services company.",
      output: Output.object({ schema: triageSchema }),
      prompt: `Analyze this customer message:\n"""${message}"""`,
    });

    return Response.json(output);
  } catch (error) {
    console.error("Triage error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
