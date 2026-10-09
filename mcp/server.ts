import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';
import { searchDocuments } from '../lib/search';

// 1. Create the server with a name and version
const server = new McpServer({ name: 'uae-services', version: '1.0.0' });

// 2. Register a tool
server.registerTool(
  'search_uae_services',
  {
    description:
      'Search a knowledge base about UAE government services: visas, Emirates ID, DEWA, traffic fines, tenancy. Works with English and Arabic queries.',
    inputSchema: z.object({
      query: z.string().describe('What to search for, e.g. "emirates id renewal"'),
    }),
  },
  async ({ query }) => {
    const results = await searchDocuments(query);

    if (results.length === 0) {
      return { content: [{ type: 'text', text: 'No relevant documents found.' }] };
    }

    const text = results
      .map(r => `[${r.source}] (score ${r.similarity.toFixed(2)})\n${r.content}`)
      .join('\n\n');

    return { content: [{ type: 'text', text }] };
  }
);

// 3. Connect over stdio and start listening
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('UAE services MCP server running'); // stderr, not stdout!
}

main();