import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  isStepCount,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from 'ai';
import { z } from 'zod';
import { searchDocuments } from '@/lib/search';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-5',
    system: `You are an assistant for UAE government services.

Always use the searchDocs tool before answering questions about UAE services.
Write a clear, specific search query, using earlier conversation context for follow-up questions.
Answer ONLY from the search results and cite sources by their "source" name in brackets, like [emirates-id-renewal].
If the results don't contain the answer, say you don't have that information. Never guess.
Reply in the same language the user writes in.`,
    messages: await convertToModelMessages(messages),
    stopWhen: isStepCount(5),
    tools: {
      searchDocs: tool({
        description: 'Search the UAE government services knowledge base',
        inputSchema: z.object({
          query: z.string().describe('A specific, standalone search query'),
        }),
        execute: async ({ query }) => searchDocuments(query),
      }),
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}