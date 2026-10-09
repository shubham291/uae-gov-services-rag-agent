import { embedMany, embed, cosineSimilarity } from 'ai';

// 1. Our "knowledge base": 5 short documents
const documents = [
  'To renew your Emirates ID, apply through the ICP app or website and pay the renewal fee.',
  'Residence visas in the UAE must be renewed before they expire to avoid fines.',
  'You can pay your DEWA electricity bill online or through the DEWA app.',
  'Dubai Metro operates on the Red and Green lines across the city.',
  'Golden visas offer long-term residency for investors and skilled professionals.',
];

// 2. The question we want to search with
// const question = 'كيف أجدد الهوية الإماراتية؟'; // "How do I renew my Emirates ID?"
const question = 'best pizza in Dubai'; // "How do I renew my Emirates ID?"
const questions = [
  'best pizza in Dubai',
  'how to renew Emirates ID',
  'how to pay DEWA bill',
  'Dubai Metro timings',
  'Golden visa eligibility',
]


async function main() {
  // 3. Turn every document into an embedding (a list of numbers)
  const { embeddings } = await embedMany({
    model: 'openai/text-embedding-3-small',
    values: documents,
  });

  // 4. Turn the question into an embedding too
  // const { embedding: questionEmbedding } = await embed({
  //   model: 'openai/text-embedding-3-small',
  //   value: question,
  // });

    const { embeddings: questionEmbedding } = await embedMany({
    model: 'openai/text-embedding-3-small',
    values: questions,
  });

  // 5. Compare the question with each document and sort by closeness
  const ranked = documents
    .map((doc, i) => ({
      doc,
      score: cosineSimilarity(questionEmbedding[i], embeddings[i]),
    }))
    .sort((a, b) => b.score - a.score);

  // 6. Print the results
  console.log(`Question: ${question}\n`);
  
  const table = ranked.map((r,i) => ({ Question: questions[i], Document: r.doc.slice(0, 10), Score: r.score.toFixed(3), relevant: r.score > 0.75 ? 'Relevant' : 'Not Relevant' }));
  console.log('Ranked Results:');
  console.table(table);
  // ranked.forEach(r => console.log(r.score.toFixed(3), '→', r.doc));

  // Bonus: see what an embedding actually looks like
  console.log(`\nEach embedding has ${questionEmbedding.length} numbers.`);
  console.log('First 5:', questionEmbedding.slice(0, 5));
}

main();