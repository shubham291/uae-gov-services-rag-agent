import { generateText, tool, isStepCount } from 'ai';
import { z } from 'zod';
import { searchDocuments, SearchResult } from './search';

export const SYSTEM_PROMPT = `You are an assistant for UAE government services.

Always use the searchDocs tool before answering questions about UAE services.
Write a clear, specific search query, using earlier conversation context for follow-up questions.
Answer ONLY from the search results and cite sources by their "source" name in brackets, like [emirates-id-renewal].
If the results don't contain the answer, say you don't have that information. Never guess.
Reply in the same language the user writes in.`;

export async function answerQuestion(question: string) {
  const retrieved: SearchResult[] = [];
  const start = Date.now();

  const result = await generateText({
    model: 'anthropic/claude-sonnet-5',
    system: SYSTEM_PROMPT,
    prompt: question,
    stopWhen: isStepCount(5),
    tools: {
      searchDocs: tool({
        description: 'Search the UAE government services knowledge base',
        inputSchema: z.object({
          query: z.string().describe('A specific, standalone search query'),
        }),
        execute: async ({ query }) => {
          const results = await searchDocuments(query);
          retrieved.push(...results); // remember what was found, for evaluation
          return results;
        },
      }),
    },
  });

  return {
    answer: result.text,
    sources: retrieved.map(r => r.source),
    latencyMs: Date.now() - start,
  };
}