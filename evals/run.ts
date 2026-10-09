import fs from 'node:fs';
import { answerQuestion } from '../lib/rag';
import { judge } from './judge';

// 1. Load your questions
const dataset = JSON.parse(fs.readFileSync('evals/dataset.json', 'utf8'));

async function main() {
  let passed = 0;
  const results = [];

  // 2. Go through each question one by one
  for (const item of dataset) {
    // Ask the RAG app
    const { answer, sources } = await answerQuestion(item.question);

    // Check 1: did search find one of the expected documents?
    const foundSources = sources;
    const foundRightDoc = item.expected_sources.some((src: string) => foundSources.includes(src));

    // Check 2: ask the judge if the answer is good
    const verdict = await judge(item, answer);
    if (verdict.pass) passed++;

    console.log(item.id, verdict.pass ? '✅' : '❌', '| right doc:', foundRightDoc, '|', verdict.reason);
    results.push({ id: item.id, question: item.question, answer, foundSources, ...verdict });
  }

  // 3. Print the final score
  console.log(`\nSCORE: ${passed} / ${dataset.length}`);

  // 4. Save everything so you can read the failures later
  fs.mkdirSync('evals/results', { recursive: true });
  fs.writeFileSync(`evals/results/run-${Date.now()}.json`, JSON.stringify(results, null, 2));
}

main().then(() => process.exit(0));