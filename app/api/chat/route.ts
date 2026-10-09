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
import { SYSTEM_PROMPT } from '@/lib/rag';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-5',
    system: SYSTEM_PROMPT,
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