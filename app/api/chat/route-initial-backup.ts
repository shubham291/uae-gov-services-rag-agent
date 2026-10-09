import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from "ai";
import { searchDocuments } from "@/lib/search";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // retrieve
  const lastMessage = messages[messages.length - 1];
  const question = lastMessage.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join(" ");

  const results = await searchDocuments(question);

  // aug
  const context = results.length
    ? results
        .map((r, i) => `[${i + 1}] (source: ${r.source})\n${r.content}`)
        .join("\n\n")
    : "No relevant documents found.";

  /// generate

  const result = streamText({
    model: "anthropic/claude-sonnet-5",
    system: `You are an assistant for UAE government services.

Answer ONLY using the sources below. Rules:
- Cite sources inline using their numbers, like [1] or [2].
- If the sources don't contain the answer, say you don't have that information. Never guess.
- Reply in the same language the user writes in.

Sources:
${context}`,
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });

  // initial day logic for generating a response without retrieval
  // const result = streamText({
  //   model: 'anthropic/claude-sonnet-5',
  //   system: 'You are a helpful assistant for people living in the UAE. Answer clearly and briefly.',
  //   messages: await convertToModelMessages(messages),
  // });

  // return createUIMessageStreamResponse({
  //   stream: toUIMessageStream({ stream: result.stream }),
  // });
}