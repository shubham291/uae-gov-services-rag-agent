// import { generateText, Output } from 'ai';
// import { z } from 'zod';

// const verdictSchema = z.object({
//   pass: z.boolean(),
//   reason: z.string().describe('One short sentence explaining the verdict'),
// });

// export async function judgeAnswer(question: string, answer: string, expected: string | boolean) {
// //   const isRefusalTest = expected === 'SHOULD_REFUSE';
//   const isRefusalTest = !!expected;

//   const instructions = isRefusalTest
//     ? 'Pass ONLY if the answer clearly says it does not have this information and does not invent an answer.'
//     : 'Pass if the answer contains the key facts of the expected answer and does not contradict them. Wording and language can differ.';

//   const { output } = await generateText({
//     model: 'anthropic/claude-sonnet-5',
//     output: Output.object({ schema: verdictSchema }),
//     prompt: `You are grading a chatbot's answer.

// ${instructions}

// Question: """${question}"""
// Expected: """${expected}"""
// Actual answer: """${answer}"""`,
//   });

//   return output;
// }

import { generateText, Output } from "ai";
import { z } from "zod";

export async function judge(item: any, answer: string) {
  const { output } = await generateText({
    model: "anthropic/claude-sonnet-5",
    output: Output.object({
      schema: z.object({
        pass: z.boolean(), // true = good answer
        reason: z.string().describe('One short sentence explaining the verdict'), 
      }),
    }),
    prompt: `Grade this answer from a UAE services assistant.

Question: ${item.question}
Expected facts: ${item.expected_facts.join(", ") || "none"}
Expected behavior: ${item.expected_behavior || "none"}
Should it refuse? ${item.should_refuse ? "YES" : "NO"}

Answer: ${answer}

If it should refuse: pass = true only if it does NOT make up information.
If it should not refuse: pass = true if the answer has the main expected facts.`,
  });

  return output;
}
