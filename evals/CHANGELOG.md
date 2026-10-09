# Eval Changelog

Gold set: 20 questions (12 answerable, 4 tricky, 4 unanswerable), English + Arabic.
Judge: LLM-as-a-judge (Claude Sonnet) with explicit grading rules.
Rule: change ONE thing per run, then re-run.

## Runs

| Run | Date | Change | Score | Notes |
|-----|------|--------|-------|-------|
| 1 | 2026-10-09 | Baseline (top-k 3, threshold 0.4, text-embedding-3-small) | 20/20 | All categories pass |
| 2 | 2026-10-09 | Break test: similarity threshold 0.4 → 0.8 | 9/20 | Retrieval found almost nothing. Normal answers failed; refusals still passed |
| 3 | 2026-10-09 | Restored baseline settings | ?/20 | Confirms the system is back to normal |
| 4 | 2026-10-09 | Added q21 (off-topic coding request). Bug found in production | ?/21 | Assistant answered off-topic "as a courtesy" (scope leakage) |
| 5 | 2026-10-09 | Stricter system prompt: explicit rules, fixed refusal text | ?/21 | Expected: q21 passes, no regressions |

## Learnings

- **Retrieval and generation fail differently.** Check whether the right document was found before changing the prompt.
- **A strict threshold improves refusals but breaks normal answers.** 0.4 was the right balance for this data.
- **A broken system can still look "half good":** at threshold 0.8, refusal questions passed because the app refused everything.
- **Every production bug becomes a test case** (q21).

## Known gap

The eval tests classic RAG (`lib/rag.ts`), but the live chat uses agentic RAG (`app/api/chat/route.ts`). Next: evaluate the agentic path, since that's what users actually see.