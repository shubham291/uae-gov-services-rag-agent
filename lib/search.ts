import { embed } from "ai";
import { sql } from './db';

export type SearchResult = {
  source: string;
  content: string;
  similarity: number;
};

const MIN_SIMILARITY = 0.4;

export async function searchDocuments(
  query: string,
  limit = 3,
): Promise<SearchResult[]> {
  const { embedding } = await embed({
    model: "openai/text-embedding-3-small",
    value: query,
  });
  const vector = JSON.stringify(embedding);

  const rows = await sql<SearchResult[]>`
    SELECT source, content, 1 - (embedding <=> ${vector}::vector) AS similarity
    FROM documents
    ORDER BY embedding <=> ${vector}::vector
    LIMIT ${limit}
  `;

  return rows.filter((r) => r.similarity >= MIN_SIMILARITY);
}
