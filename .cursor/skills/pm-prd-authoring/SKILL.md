---

name: pm-prd-authoring

description: >-

  Writes a Stampli-ready PRD set: strategic narrative (opportunity, market,

  differentiation, personas, solution, automation vs human, screens, metrics,

  risks, prototype), plus markdown working files for engineering. Use when

  the user asks for a PRD, product brief, or feature spec with competitive

  context and AI-native workflow artifacts. Before drafting, follow

  pm-competitive-analysis, stampli-feature-development, and

  pm-synthetic-user-research (see skill body).

disable-model-invocation: true

---



# PM skill: PRD authoring



## Discovery and assumptions (mandatory)



1. **Guided questions first.** Ask **numbered, grouped** questions until every required **Input** field (see **Input (required)** below) is confirmed **or** the user explicitly authorizes gaps. Use **multiple-choice** when helpful. Do **not** invent metrics, scope, legal/compliance requirements, or engineering contracts.

2. **No silent defaults.** Any gap must become **Proposed assumptions** in chat with **per-item or batch approval** before appearing in the PRD under **Assumptions (user-approved)** only.

3. **Prior artifacts:** If competitive or research docs are implied but missing, ask for links/paste—do not fabricate.



## Input (required)



| Input | Description |

|-------|-------------|

| **Product / platform** | e.g. Stampli AP, Procurement, Direct Pay. |

| **One-line title** | Name of the feature or initiative. |

| **Problem statement** | Who suffers, what breaks today, cost of delay (qualitative OK). |

| **Goals and non-goals** | Bullets: in scope / explicitly out of scope. |

| **Target customers / segments** | ICP, geography, ERP if relevant. |

| **Success metrics** | 2–5 measurable outcomes (leading/lagging); OK if some are TBD with rationale. |

| **Dependencies** | Legal, ERP, data, infra, other teams—list or “none known.” |

| **Prior artifacts** | Optional paths or paste: competitive analysis, synthetic research, designs, RFCs. |



**Optional:** launch type (pilot/GA), flag strategy, compliance notes, glossary, Figma links, prototype constraints.



### Before prerequisite skills (execution gate)



Do **not** start **Prerequisite skills** until **Input** is satisfied per **Discovery and assumptions** (every row answered, waived with user-approved assumptions, or explicitly delegated to a prerequisite with a note of **which skill fills which gap**).



**Dedupe across skills:** Overlapping fields that **`pm-competitive-analysis`** or **`pm-synthetic-user-research`** also ask for (e.g. feature/initiative, buyer vs user, segment, scenarios) should be **asked once** here and **reused** there—do not re-run identical clarification rounds unless the user revises an answer.



## Prerequisite skills (mandatory before drafting)



Before you write the PRD narrative, working files, or substantive competitive sections, **read and follow** these project skills as described per item (full workflows where noted; **PRD-scoped** use of `stampli-feature-development` as in item 2):



1. **[`pm-competitive-analysis`](../pm-competitive-analysis/SKILL.md)** — Run its discovery, analysis workflow, and outputs so market/competitive content in the PRD is consistent with that skill (not a parallel ad-hoc pass).

2. **[`stampli-feature-development`](../stampli-feature-development/SKILL.md)** — For **PRD-only** work, apply its **Discovery and assumptions** norms, **product context**, and **Strategy and operating context** / repo reads (`stampli-strategy-operating-context.md`, `stampli-context-capabilities.md`, AP and HITL framing). **Do not** require that skill’s **implementation-plan** path or its **council gate on an implementation plan** unless the user also asks for engineering delivery in the same run.

3. **[`pm-synthetic-user-research`](../pm-synthetic-user-research/SKILL.md)** — Run its discovery, artifact, and council gate so **personas (section 5)**, **user stories / flows (section 12)**, and experience tradeoffs are grounded in structured synthetic research (labeled as synthetic, not live data). Prefer completing **(1)** first so competitive output can feed that skill’s **Evidence to ground simulation** input when relevant.



**Suggested order when inputs overlap:** Reuse answered fields from **Discovery and assumptions** / **Input** so you do not re-ask the same facts; run **(1) → (2) → (3)** unless the user approves a different sequence. **Optional early read:** You may skim **`stampli-feature-development`** strategy/repo pointers before **(1)** when differentiation in the competitive pass should cite `stampli-strategy-operating-context.md` / `stampli-context-capabilities.md` precisely—still complete items **(1)–(3)** before drafting the PRD.



Merge their outputs into the PRD sections and appendices as those skills specify (competitive → sections 3–4 and `appendix-competitive.md`; synthetic → section 5, section 12, and `appendix-synthetic-user-research.md`). If the user says **skip prerequisite skills for this run**, note `Prerequisite skills waived by user` in `README.md` and chat, and still avoid contradicting any artifacts they did provide.



**Persist into the bundle:** Once **`docs/prd/<slug>/`** exists, **write** the finalized prerequisite artifacts to disk—**`appendix-competitive.md`** and **`appendix-synthetic-user-research.md`**—each including that skill’s **Appendix: Council review** when council ran. Do **not** leave prerequisites only in chat unless the user **forbids writing to disk**.



**Council layering:** In a typical PRD-only run, **`pm-competitive-analysis`** and **`pm-synthetic-user-research`** may each invoke **llm-council** on their draft, and this skill adds **council on the full PRD**—so expect **up to three** council verdicts when waivers were not used (`stampli-feature-development` does **not** add a fourth for PRD-only work per item **2**). **`README.md`** must list **which councils ran** and **which file holds each verdict** (verdict inside `appendix-competitive.md` / `appendix-synthetic-user-research.md` vs `appendix-council.md` for the PRD).



## Council review gate (mandatory)



Follow [`.cursor/skills/llm-council/SKILL.md`](../llm-council/SKILL.md) (project copy; ignore Temp/zip paths).



**After** the PRD draft is complete:



1. Frame a council question including the PRD (or paths) and stakes (scope creep, missing NFRs, wrong user, weak differentiation).

2. Run the full council workflow from that skill (five advisors → peer review → chairman verdict).

3. Append **Appendix: Council review** (file `appendix-council.md` or final section of `PRD.md`); revise PRD if the verdict implies material gaps and note **Changes after council**.

4. If the user says **skip council for this run**, add `Council review waived by user` and skip.



## Research and judgment (mandatory expectations)



External research is allowed; **depth of judgment matters more than breadth**.



In **Market & competitive context** (and supporting appendix if used), include where relevant:



- **How the market is evolving** — trends, buyer expectations, regulation/tech shifts (cite sources or label inference).

- **How competitors or adjacent players** are approaching the space — concrete examples, not name-dropping without a claim.

- **Where Stampli should differentiate** — explicit point of view (positioning, workflow, ERP depth, AI operating model, etc.), tied to Stampli strengths from `stampli-context-capabilities.md` and **`stampli-strategy-operating-context.md`** when the repo includes them.



Distinguish **sourced fact** vs **inference** vs **hypothesis**. Do not pad with generic market reports without implications for the decision.



---



## Output (required deliverable)



### A. PRD narrative — required sections (order)



The PRD must include **all** of the following, in this order (headings may be shortened but meaning preserved):



1. **Metadata** — Owner (placeholder if unknown), last updated, status (Draft/Review), links (Jira, Figma, Slack, etc.).

2. **The opportunity** — Pain, urgency, timing (“why now”), who benefits first.

3. **Relevant market & competitive context** — Landscape for this initiative; include **market evolution**, **competitor/adjacent approaches**, and **differentiation** per Research expectations above.

4. **Why this is strategically valuable for Stampli** — Platform fit, GTM, data/network effects, retention, ERP narrative—specific to Stampli, not generic “efficiency.”

5. **Personas** — Primary and secondary; goals, pains, success signals; label synthetic vs research-backed.

6. **The proposed solution** — Concept, scope, key capabilities, what “done” looks like for the user (before FR numbering).

7. **What should be automated vs human-controlled** — Table or subsections: for each major capability, state **automation** (e.g. AI suggests, system routes) vs **human** (e.g. approver confirms, admin configures); call out **HITL** boundaries and audit/SoD implications.

8. **Examples of user-facing screens** — For each critical flow: screen name, purpose, **key fields/components**, empty/loading/error states, mobile if relevant. Use **ASCII wireframes**, bullet mock layouts, or numbered “screen spec” lists; link Figma if provided. Minimum **3** screen examples for non-trivial features (adjust down only if user confirms smaller scope).

9. **Business impact & success metrics** — Qualitative impact plus **measurable** KPIs (leading/lagging); how you would prove success post-launch.

10. **Key tradeoffs & risks** — Product, technical, compliance, change-management; mitigations.

11. **Prototype** — **A prototype will strengthen your case:** argue what to prototype (questions it answers), suggested fidelity (clickable, Wizard-of-Oz, API spike), timeline sketch, and what would **invalidate** the initiative if the prototype fails.



Then **implementation-oriented** sections:



12. **User stories & flows** — `As a … I want … so that …` (minimum 3 for non-trivial features); numbered flows or mermaid where helpful.

13. **Functional requirements** — `FR-001` … each testable, prioritized **P0 / P1 / P2**.

14. **Acceptance criteria** — Every **P0** FR maps to at least one criterion (given/when/then OK).

15. **Experience & content** — Notifications, copy tone, edge cases not already in screen examples.

16. **Analytics & instrumentation** — Events/properties or **TBD** with intent.

17. **Non-functional requirements** — Security, privacy, performance, accessibility, reliability, localization as applicable; else “inherit platform defaults.”

18. **Rollout & operations** — Phasing, flags, support/docs, migration.

19. **Open questions** — Numbered, with suggested owner.

20. **Appendix A — Competitive deep dive** — Optional separate file if the narrative is long; else a condensed subsection here. Omit only if user confirms no competitive angle.

21. **Appendix: Council review** — Per `llm-council` (omit only if user waived council).



**Output format rules**



- Requirements use **MUST / SHOULD** inside FR text where appropriate.

- Do not invent Stampli-internal APIs, field IDs, or policies; use placeholders like `TBD-with-Eng`.

- Prefer sharp, decision-ready writing over volume.



### B. Working files (mandatory)



Write markdown **working files** under **`docs/prd/<initiative-slug>/`** (create folders if missing). Use a **kebab-case** slug from the title. Minimum set:



| File | Contents |

|------|----------|

| `README.md` | How to read the bundle, slug, status, links to Jira/Figma, one paragraph on **how AI was used** (prerequisite skills: competitive + synthetic + Stampli context, council, drafts) and **limits** of that input (especially synthetic vs live research). **List each council review** that ran and **which file** holds its verdict (see **Council layering** under Prerequisite skills). |

| `01-narrative.md` | Sections **2–11** from part A (opportunity through prototype). |

| `02-requirements.md` | Sections **12–19** from part A (stories through open questions). |

| `appendix-competitive.md` | Full or expanded competitive context if Appendix A would bloat the narrative; else a pointer “see section 3” in README and omit file only if competitive content lives entirely in `01-narrative.md`. |

| `appendix-synthetic-user-research.md` | Full **Synthetic user research** artifact from `pm-synthetic-user-research` (personas, sessions, themes, limitations); omit only if prerequisite waived and no substitute research artifact exists (then README notes the gap). |

| `appendix-council.md` | Council verdict and optional **Changes after council** log; omit only if council waived (then README notes waiver). |



**Optional:** `03-screen-catalog.md` if screen examples exceed ~400 lines in `01-narrative.md` (then `01-narrative.md` summarizes and links here).



Also paste a **short summary** in chat (TOC + links to the bundle files, including `appendix-synthetic-user-research.md` when present) so the user can navigate immediately.



If the user **forbids writing to disk**, put the same structure in chat as clearly delimited markdown blocks named by virtual path—and state that in README content in chat.



## Agent instructions



1. Follow **Discovery and assumptions**, confirm **Input** (including **Before prerequisite skills**), then **Prerequisite skills** before drafting; follow **Council review gate** after draft, before calling the bundle final.

2. Merge **Prior artifacts** and prerequisite outputs into sections 3–5, `appendix-competitive.md`, and `appendix-synthetic-user-research.md`; do not contradict provided numbers without flagging conflict.

3. Align Stampli differentiation and strategy with `stampli-context-capabilities.md` and `stampli-strategy-operating-context.md` when present; otherwise neutral P2P language—no invented Stampli features.

4. **Always** create the `docs/prd/<slug>/` working files unless the user explicitly opts out.

5. Split content across files for clarity by default. If the user requests a **single** `PRD.md` only, consolidate sections 2–21 into `docs/prd/<slug>/PRD.md` and still keep **`appendix-competitive.md`**, **`appendix-synthetic-user-research.md`**, and **`appendix-council.md`** as separate files when those reviews ran (or embed verdicts only if the user explicitly wants one file total).



## Related skills



- `pm-competitive-analysis` — **mandatory before drafting** (see Prerequisite skills); feeds sections 3–4 and `appendix-competitive.md`

- `stampli-feature-development` — **mandatory before drafting** (see Prerequisite skills); Stampli scope, AP context, and implementation-adjacent alignment

- `pm-synthetic-user-research` — **mandatory before drafting** (see Prerequisite skills); feeds section 5, section 12, and `appendix-synthetic-user-research.md`

- `llm-council` — [SKILL.md](../llm-council/SKILL.md) (mandatory review gate)


