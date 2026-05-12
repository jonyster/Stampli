---
name: pm-synthetic-user-research
description: >-
  Generates synthetic personas, structured research scripts, and simulated
  user feedback for B2B PM discovery on Stampli-style AP, P2P, payments, or
  vendor workflows. Use when the user wants persona-based critique, interview
  guides, or feedback synthesis before a PRD— not a substitute for real user
  interviews.
disable-model-invocation: true
---

# PM skill: synthetic user research and feedback

## Discovery and assumptions (mandatory)

1. **Guided questions first.** Ask **numbered, grouped** questions until every required **Input** field is confirmed **or** the user explicitly authorizes gaps to be filled. Offer **multiple-choice** where helpful. Do **not** invent personas, scenarios, or company facts.
2. **No silent defaults.** List **Proposed assumptions** in chat and get explicit approval before any assumption appears in the artifact (only under **Assumptions (user-approved)**).
3. **Forbidden shortcut:** Do not “propose personas and proceed” without the user confirming persona set and scenarios unless they explicitly opt in.

## Council review gate (mandatory)

Follow [`.cursor/skills/llm-council/SKILL.md`](../llm-council/SKILL.md) (project copy; ignore Temp/zip paths).

**After** the synthetic research draft is complete:

1. Frame a council question including the draft and stakes (e.g. bias, missing edge cases, wrong buyer).
2. Run the full council workflow (five advisors → peer review → chairman verdict headings from that skill).
3. Append **Appendix: Council review** with the verdict; revise the draft if needed and note **Changes after council**.
4. If the user says **skip council for this run**, add `Council review waived by user` and skip.

## Input (required)

| Input | Description |
|-------|-------------|
| **Research objective** | What decision this research informs (e.g. “prioritize MVP scope for X”). |
| **Feature or problem statement** | What the user would see or do; include constraints (ERP, policy, volume). |
| **Persona set** | Either (a) named roles with one-line context each, or (b) ask the agent to propose **3 synthetic personas** aligned to the problem for approval. |
| **Scenarios** | 1–3 concrete situations (e.g. “month-end,” “new vendor,” “exception on PO match”). |
| **Feedback lens** | What to stress-test: usability, trust/control, compliance, speed, change management, etc. |
| **Evidence to ground simulation** | Optional: competitive analysis excerpt, support themes, analytics—paste or file path. |

**Optional:** tone (formal/casual), locale, accessibility needs.

## Output (required deliverable)

Produce a single markdown artifact titled **Synthetic user research: \<short initiative name\>** containing:

1. **Research plan recap** — Objective, personas, scenarios (from input).
2. **Persona cards** — For each persona: **Name & role**, **Goals**, **Pains**, **Success metrics**, **ERP/finance literacy**, **Quote** (one invented but realistic line, labeled *synthetic*).
3. **Session guide** — Moderator outline: intro, tasks or story walkthrough per scenario, follow-up probes, 10–15 questions total.
4. **Simulated sessions** — For each persona × primary scenario: **Summary reaction** (2 short paragraphs), **What works**, **What breaks or worries me**, **Desired outcome / workaround**, each labeled as *synthetic simulation, not empirical data*.
5. **Synthesized themes** — Table: Theme | Evidence (which persona/scenario) | Severity (H/M/L) | Suggested product response (hypothesis).
6. **Questions for real research** — Numbered list of **non-synthetic** follow-ups to run with actual users; include suggested recruit criteria.
7. **Limitations** — Explicit paragraph on bias, lack of statistical validity, and when to run real interviews.
8. **Appendix: Council review** — Full verdict per `llm-council` (omit only if user waived council).

**Output format rules**

- Banner the doc: **Synthetic / not validated with live users.**
- No fabricated “study n=” claims or fake company names as if they were clients unless the user supplied them as fictional examples.

## Agent instructions

1. Follow **Discovery and assumptions** before drafting; follow **Council review gate** before finalizing.
2. Ground behaviors in plausible AP/P2P practice; use Stampli public context from the repo when available.
3. Stress-test edge cases (exceptions, SoD, multi-entity) where relevant.
4. If personas are unspecified, propose options in chat and **wait for explicit selection** before simulating.
5. Deliver as chat markdown unless the user requests a file path (e.g. `docs/research-synthetic-<slug>.md`).

## Related skills

- Competitive analysis: `pm-competitive-analysis` (optional input to section “Evidence to ground simulation”)
- PRD authoring: `pm-prd-authoring`
- Council methodology: `llm-council` — [SKILL.md](../llm-council/SKILL.md)
