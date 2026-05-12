---
name: pm-competitive-analysis
description: >-
  Produces a structured competitive analysis for B2B finance and procure-to-pay
  products (e.g. Stampli). Use when a product manager requests competitor
  benchmarking, landscape mapping, differentiation, or vendor comparison before
  a PRD or roadmap decision.
disable-model-invocation: true
---

# PM skill: competitive analysis

## Discovery and assumptions (mandatory)

1. **Guided questions first.** Before the main deliverable, ask **numbered, grouped** questions until every required **Input** field is confirmed **or** the user explicitly authorizes you to fill gaps. Use **multiple-choice** or A/B options when that speeds alignment. Do **not** invent competitors, segments, metrics, or Stampli internals.
2. **No silent defaults.** Do not substitute “sensible defaults” without permission. If something is unknown, list **Proposed assumptions** in chat and obtain **yes/no per item** (or a single “approve all”) before any assumption appears in the artifact—then only under **Assumptions (user-approved)**.
3. **Forbidden shortcut:** Do not use “one clarification round, then assume” unless the user explicitly asks for that in writing.

## Council review gate (mandatory)

Primary source of truth: [`.cursor/skills/llm-council/SKILL.md`](../llm-council/SKILL.md) (project copy). Do not rely on Temp or zip paths.

**After** the competitive analysis draft is complete:

1. Frame a council question that includes the draft (or path) and what is at stake (e.g. overclaims, missing competitors, ERP depth).
2. Run the full **LLM Council** workflow from `llm-council/SKILL.md`: five advisors → anonymized peer review → chairman **Council Verdict** (same section headings as that skill).
3. Append **Appendix: Council review** to the deliverable with the full verdict. If the verdict requires material edits, **revise the draft** and add a short **Changes after council** note under the appendix.
4. If the user says **skip council for this run**, add one line: `Council review waived by user` and do not run the council.

## Input (required)

The user (or chat) must provide the following. Until each item is answered or explicitly waived via **Assumptions (user-approved)**, keep asking guided questions—do not proceed on guesses.

| Input | Description |
|-------|-------------|
| **Feature or initiative** | One sentence: what capability or customer outcome is in scope. |
| **Primary buyer and user** | Who pays vs who uses (e.g. CFO vs AP clerk). |
| **Geography and segment** | e.g. US mid-market, enterprise multi-entity. |
| **Competitor set** | Named products to compare (minimum 2, recommended 3–5), or ask the agent to propose a set for approval. |
| **Comparison dimensions** | Optional list (e.g. pricing model, ERP depth, AI claims, payments, cards). If omitted, **ask** whether to use a standard AP/P2P dimension set; do not apply it without confirmation. |
| **Stampli positioning** | Optional: link or paste to internal positioning; if absent, use only public `stampli.com` / agreed context files in the repo. |

**Optional input:** links to competitor docs, G2 snippets, prior internal battlecards (paste or path).

## Output (required deliverable)

Produce a single markdown artifact titled **Competitive analysis: \<feature name\>** containing exactly these sections:

1. **Executive summary** — 5–8 bullets: who wins where and why it matters for the initiative.
2. **Scope recap** — Restate feature, users, segment (from input).
3. **Comparison matrix** — Table: rows = competitors + Stampli (or “Our solution”); columns = dimensions (from input or default). Cells: **Supported / Partial / Unknown** plus one short clause each; mark **Unknown** instead of guessing.
4. **Deep dives** — For each competitor: capabilities relevant to the feature, onboarding/integration narrative if public, notable gaps vs our initiative.
5. **Differentiation opportunities** — Numbered list tied to customer pains and our strengths (evidence-based).
6. **Risks and blind spots** — Where public info is thin, regulation matters, or incumbents could respond.
7. **Sources** — Bulleted URLs and document names cited; if none, state “No external sources provided; analysis is structural only.”
8. **Appendix: Council review** — Full council verdict per [`.cursor/skills/llm-council/SKILL.md`](../llm-council/SKILL.md) (omit only if user waived council).

**Output format rules**

- Third person, neutral tone; no unsubstantiated superlatives.
- Distinguish **fact** (with source) vs **inference** (label explicitly).
- Keep under ~800 lines; summarize peripheral competitors in one subsection.

## Agent instructions

1. Follow **Discovery and assumptions** before drafting; follow **Council review gate** before calling the work final.
2. Prefer primary sources (vendor sites, docs, release notes) over forums.
3. For Stampli, align capability claims with repo context files (e.g. `stampli-context-capabilities.md`) when present; do not invent product behavior.
4. Deliver the Output as copy-paste-ready markdown in chat unless the user asks to write a file—then write `docs/competitive-analysis-<slug>.md` or the path they specify.

## Related skills

- Synthetic user research: `pm-synthetic-user-research`
- PRD authoring: `pm-prd-authoring` (often consumes this analysis in Background / Competitive context)
- Council methodology: `llm-council` — [SKILL.md](../llm-council/SKILL.md)
