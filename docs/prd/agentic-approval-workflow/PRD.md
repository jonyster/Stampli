# PRD: Agentic Approval Workflow

> **Short read:** For a one-page executive summary (problem, recommendation, ~90-day slice, metrics, risks), see [`00-executive-summary.md`](./00-executive-summary.md). This file is the full development PRD. **Appendices:** §22 competitive (`appendix-competitive.md`), §23 council verdict (`appendix-council.md`), §24 synthetic research (`appendix-synthetic-user-research.md`).

## Executive summary (inlined)

| Initiative | Agentic Approval Workflow (Council of Agents) |
|------------|-----------------------------------------------|
| **Audience** | Exec / hiring review / GTM (short read) |
| **Status** | Draft |
| **Last updated** | 2026-05-12 |
| **Full PRD** | This document (`PRD.md`) · [`01-narrative.md`](./01-narrative.md) (story + screens) |

### Problem

In complex AP and P2P (especially **construction**, our first vertical because available benchmark data shows unusually long approval durations), approvers spend time hunting facts across policy, contracts, PO/receipt match, duplicates, vendor integrity, and cash context. That slows decisions, creates inconsistent compliance, and drives ERP rework.

### Recommendation (what we build)

Ship an evidence-first **Agentic Approval Workflow** inside the invoice workspace: a deterministic approval process coordinates a Council of Agents, runs specialized checks, and returns one surface - Risk Badge + Audit Note + evidence drill-down with citations and provenance. **V1:** humans always approve or decline; no autonomous posting or paying. **Model stance:** RAG + tools for facts; fine-tuning only for DS-gated sub-tasks (FR-031).

### Why this matters for Stampli

- **Differentiation:** Makes the invoice thread the system where audit-grade evidence lives, not a generic AI side panel.
- **ERP-native fit:** Agents read and explain ERP truth; they do not replace the system of record.
- **P2P breadth:** Pulls contract, match, budget, and treasury context into one decision without re-platforming the customer.
- **Competitive clarity:** Major peers also market accounting/ERP integrations; the wedge is **agent-packaged approval evidence** on the invoice surface, not connectors alone (see **Appendix A**).

### ~90-day path (aligned to rollout in section 18)

| Window | Focus | Outcome |
|--------|--------|--------|
| **~Month 1** | **Phase 0 - prototype** | Clickable approver UX + Wizard-of-Oz evidence; validate trust and one-surface value (see section 11 invalidation criteria). |
| **~Month 2** | **Pilot readiness** | Core v1 scope wired: **Data Integrity + Operational + minimum policy gates**; analytics baselines; feature flags; LCPO sign-offs started (section 19). |
| **~Month 3** | **Private pilot** | **3-5 construction customers** (section 20.4); weekly reviews vs section 9.1 gates; calibration; go / pause / narrow scope before Phase 2 (budget/contract/treasury depth). |

### Success metrics and pilot gate

**Primary:** median **time to approve/decline**; **agent-aided one-tap decision rate** (decision without back-and-forth).

**Pre-committed pilot thresholds (section 9.1):** (A) >=**60%** faster median time vs baseline; (B) >=**20%** improvement in one-tap rate; (C) duplicate/mismatch false-positive rate <=**15%** after tuning; (D) override rate for P0 checks below agreed ceiling (`TBD-with-PM/Compliance`). **If two or more fail** after the calibration window, pause rollout and cut scope to core checks until recovered.

### Top risks (headlines)

Trust vs autonomy (keep humans on the decision); false-positive fatigue on duplicates/variance; **contract source-of-truth** ambiguity; **ERP variability** on budget/dimensions; **audit/evidence logging** and redaction for sensitive fields.

## TL;DR

- This PRD introduces an evidence-first approval workflow for complex AP/P2P invoices.
- The system runs specialized checks and produces one decision package: Risk Badge + Audit Note + evidence drill-down.
- **V1 boundary:** humans always approve/decline; no autonomous posting or paying.
- Initial v1 scope prioritizes Data Integrity + Operational checks to reduce approval friction safely.
- Success is measured by faster time-to-decision, higher one-tap decision rate, and controlled false positives.
- If pilot quality/ROI thresholds are not met, scope is reduced or paused before broader rollout.
- **Model stance:** RAG + tools first for facts; fine-tuning only for DS-gated, scoped sub-tasks (see FR-031).

## 1. Metadata

- **Owner**: `TBD`  
- **Status**: Draft  
- **Last updated**: 2026-05-12  
- **Links**: `TBD` (Jira / Figma / Slack)

## 1.1 Glossary

| Term | Meaning |
|---|---|
| AP | Accounts Payable |
| P2P | Procure-to-Pay |
| ERP | Enterprise Resource Planning system (system of record) |
| SoD | Segregation of Duties (role separation controls) |
| TCV | Total Contract Value cap |
| Risk Badge | Compact decision summary: Approve / Needs review / Block / Unknown |
| Audit Note | Human-readable evidence summary attached to invoice decision |
| RAG | Retrieval-augmented generation: model answers grounded in retrieved documents and system facts |
| Agentic Workflow | Governed business process that coordinates AI agents through deterministic checkpoints, typed outputs, human review, and safe fallback paths |
| Council of Agents | Specialized agent roles that run checks inside the Agentic Workflow; the Council is the worker pattern, not the governance boundary |
| Critique Agent | Cross-checking agent that reviews the combined package for conflicts, missing evidence, and misalignment with user intent or tenant policy |
| Appendix A | Competitive analysis (`appendix-competitive.md`) |
| Appendix B | Synthetic user research (`appendix-synthetic-user-research.md`) |

## 2. The opportunity

### Problem statement

**Today, approvers and AP teams cannot decide from one trustworthy surface.** Evidence for a single invoice is scattered across the ERP, PO/receipt workflows, contracts, budgets, vendor master, email, and attachments. Each party manually reconciles “the same truth” with incomplete context, so people work as **investigators** instead of **decision-makers**.

That fragmentation drives:

- **Slow cycle times** — chasing facts and owners before approve/decline.
- **Inconsistent controls** — policy and SoD checks depend on who remembers what to open.
- **Rework and ERP cleanup** — corrections after approval when mismatches or caps surface late.
- **Weak audit posture** — decisions are hard to reconstruct without a single, cited evidence package tied to the invoice.

**Initial wedge:** complex, multi-entity **construction** AP/P2P (heavy PO/receipt and contract context). We choose construction first because directional benchmark data shows long manual approval cycle times in this vertical, making it a strong place to prove a measurable reduction in approval duration; the problem generalizes to other industries with the same pattern.

The opportunity is to shift approvers from “investigator” to “decision-maker” by introducing an **Agentic Workflow**: a deterministic approval process with explicit checkpoints, human review boundaries, and a **Council of Agents** that performs specialized audits inside those guardrails. This framing matters for finance because the workflow, not free-form agent autonomy, makes AI assistance governable and auditable.

### 2.1 Business opportunity estimate (range + assumptions)

This section estimates the opportunity from a **bottom-up value model** for target construction customers. Values below are **directional** and should be validated with Finance and customer discovery.

**Customer value model (construction wedge):**

Assumptions (explicit / editable):

- **A1 (invoice volume)**: Pilot customers process ~**500 invoices/month** (typical mid-market construction operator; adjust per discovery).
- **A2 (approval cycle baseline)**: Manual invoice handling can take **~8.6 days per invoice** in construction contexts (third-party blog citing benchmarks; treat as directional). Source: `https://dancumberlandlabs.com/blog/ap-automation-construction/`
- **A3 (time-to-decision impact)**: This feature primarily reduces **approval decision time** and exception back-and-forth; it may not eliminate upstream capture/coding costs.
- **A4 (value capture)**: We measure value in (a) labor time reduction, (b) fewer exceptions/rework, (c) improved compliance outcomes, and (d) improved payment timing (discount capture / fewer late fees) where applicable.

Directional value range per customer-year (model):

- **Labor time saved on approvals/chasing**:  
  If Agentic Approval Workflow saves even **2–6 minutes per invoice** across AP + approvers, at 500 invoices/month that is **200–600 hours/year**. At a blended fully-loaded cost of **$50–$100/hour** (assumption), that is **$10k–$60k/year**.
- **Exception handling savings** (duplicates/mismatches/contract cap):  
  Even 1–2 avoided high-friction exceptions per week can save meaningful time and reduce ERP rework. Quantification is **TBD** until we measure baseline exception rates in pilot.
- **Compliance/audit value**:  
  Harder to monetize; measurable via reduced SoD violations and fewer audit findings (leading indicator).
- **Payment-timing value (optional)**:  
  When evidence accelerates approvals, customers can capture more early-payment discounts and reduce late fees; needs pilot measurement.

**Implication for packaging/ARR (hypothesis):**

- If pilot customers can credibly realize **$10k–$60k/year** in time savings (plus compliance), the feature can support (a) increased win rate vs “AI assistants,” (b) expansion pricing in higher tiers, and/or (c) improved retention in complex customers. Exact pricing impact is **TBD-with-GTM**.

## 3. Relevant market & competitive context

Across the market, vendors increasingly market AI moving from “suggest” to “complete work,” but approvals/posting typically maintain **human control** for trust and compliance. Examples:

- BILL: 2026 narrative around AI completing invoice coding work. Source: `https://www.bill.com/blog/new-at-bill-january-march-2026`
- Tipalti: invoice approval workflow emphasizes 3-way matching, exception handling, and routing to approvers. Source: `https://tipalti.com/resources/learn/invoice-approval-workflow/`
- AvidXchange: public “AI agents” messaging in AP workflow. Source: `https://www.avidxchange.com/press-releases/avidxchange-unveils-new-ai-agents-to-elevate-accounts-payable-processes/`

Major peers (including **BILL** and **Tipalti**) also publicly market **accounting/ERP integrations** and sync to the system of record—so “has ERP integration” is not, by itself, a unique wedge; see Appendix A for sources and how we still differentiate on **agent-packaged approval evidence**.

Stampli’s public posture also stresses that “touchless AP” is often impractical in real-world complexity, reinforcing an evidence-first approach where humans still approve. Source: `https://www.stampli.com/blog/accounts-payable/touchless-ap-myth/`

See **Appendix A** for the structured competitive analysis.

## 4. Why this is strategically valuable for Stampli

- **Deepens invoice-centric workspace differentiation**: make the invoice thread the place where audit-grade evidence is assembled and decisions are made.
- **Strengthens ERP-native alignment**: treat the ERP as system of record and constrain agent actions to ERP-valid entities/dimensions.
- **Accelerates P2P breadth**: pull contract, PO/receipt, budget, and payment considerations into one approval experience without forcing customers to re-platform.
- **Raises trust/control**: consistent policy and SoD checks reduce “approval variability” across a large approver base.

## 5. Personas (synthetic unless noted)

Primary personas selected for this PRD (synthetic; see **Appendix B**):

- **AP Specialist / Clerk** (primary operator)
- **Project / Department Budget Owner (Approver)** (primary approver, construction context)
- **Treasury** (secondary; cash/rail/discount implications)

## 6. The proposed solution

Introduce an **Agentic Approval Workflow** that runs a **Council of Agents** on each invoice. The Council is the worker pattern; the product is the governed workflow that decides when agents retrieve evidence, when humans review, and when the system must stop or degrade.

- A **Risk Badge** (summary: approve/needs review/block) with confidence and top drivers
- An **Audit Note** (concise, approver-readable evidence)
- Drill-down **Evidence Panels** (links to PO/receipt, contract clauses/TCV, budget state, duplicate candidates, vendor history)

### 6.0 Architecture principle: workflow before autonomy

AI agents are specialized reasoning and tool-using components. An **Agentic Workflow** is the controlled business process that coordinates those components through deterministic stages: evidence collection, policy checks, synthesis, human review, and final authorization. For compliance-heavy AP/P2P, this workflow-first architecture is the practical “sweet spot”: agents can accelerate investigation, while checkpoints, typed outputs, and explicit human control keep the approval decision governed.

### 6.0.1 Five-layer architecture for Agentic BPM

| Layer | Role in this PRD | Example responsibilities |
|---|---|---|
| **Data layer** | Provides trusted invoice, ERP, PO, receipt, contract, budget, vendor, and payment facts. | Tenant-scoped retrieval, source freshness, provenance, access controls. |
| **Process Intelligence layer** | Interprets business context and detects exceptions. | Duplicate risk, 3-way match variance, contract-cap breach, budget state, SoD rules. |
| **Action layer** | Produces bounded next steps without taking irreversible actions. | Draft vendor/procurement messages, suggest variance routes, recommend payment rails. |
| **Orchestration layer** | Coordinates agents, retries, error classes, checkpoints, and human interrupts. | Parallel Council runs, Critique Agent synthesis, manual-review degradation, approval gates. |
| **Conversational layer** | Makes the reasoning visible in the invoice workspace. | Risk Badge, Audit Note, evidence panels, “ask a question” interaction, override explanations. |

### 6.1 Council of Agents (role definitions)

Each agent is a specialized auditor with an explicit checklist and limited permissions (no creation of net-new ERP master data).

1. **Data Integrity Agent (technical auditor)**  
   - OCR / extraction confidence checks (e.g., flag below 95% for manual review — threshold is configurable)  
   - Duplicate detection across entities (Invoice ID and vendor+amount+date heuristics)  
   - Vendor health / fraud checks (e.g., remit-to change vs history; W-9 status where available)

2. **Operational Agent (value & context auditor)**  
   - 3-way match against PO and receipts/receivers  
   - Contract alignment (MSA/SOW rates) when contract is available  
   - Variance handling: propose action and generate drafts (e.g. credit memo request via chat) — human sends/approves

3. **Budget & Policy Agent (governance auditor)**  
   - Budget burn-down checks (ERP budget / project budget where supported)  
   - Dimension enforcement (department/location/class etc.)  
   - SoD enforcement: ensure requester/approver/payer separation (policy-configurable)

4. **Treasury Agent (strategic cash auditor)**  
   - Payment rail recommendation (e.g., card vs ACH) per policy  
   - Discount capture detection and ROI framing (early payment terms)

5. **Critique Agent (global consistency auditor)**  
   - Reviews the combined approval package for cross-agent conflicts (e.g., Treasury recommends speed while Budget/Policy requires hold)  
   - Checks whether the recommendation aligns with user intent, tenant policy, and cited evidence  
   - Blocks “Approve” presentation when unresolved conflicts or material evidence gaps remain

## 7. What should be automated vs human-controlled

| Capability | Automated (system/agent) | Human-controlled |
|---|---|---|
| Evidence gathering | Pull ERP facts, compare to policy/contract, compute deltas | Confirm ambiguous data sources; override with reason |
| Risk badge + audit note | Generate summary, confidence, and drivers | Final approve/decline |
| Exception handling drafts | Draft messages (vendor/procurement), propose next steps | Send messages; approve exceptions; decide whether to proceed |
| Posting/paying | **Not autonomous in v1** | Posting and payment remain explicitly authorized human actions |

### 7.0 Human-AI interaction patterns

The workflow uses two explicit interaction patterns so autonomy boundaries are easy to explain and audit:

- **Human-Assisted Agent**: agents perform bounded evidence gathering, matching, synthesis, and draft generation; the human provides final oversight and explicit authorization.
- **Verification Pattern**: where a human supplies or corrects an input (for example, selecting the correct contract source), the agent verifies consistency against ERP/policy evidence before the package can proceed.

### 7.0.1 Transparency of the interaction medium

The agent’s reasoning must be integrated directly into the approval interaction rather than hidden in a separate “AI thoughts” panel. The Audit Note is the primary reasoning surface: it should show the recommendation, cited drivers, uncertainty, and required human action in the same flow where the approver decides. This supports fast trust calibration because users can review the evidence and act without switching context.

### 7.1 When unsure policy (explicit)

| Check area | If evidence is incomplete/uncertain | Default action | Owner |
|---|---|---|---|
| Data extraction confidence | Confidence below threshold or unreadable critical fields | Route to manual review | AP Clerk |
| Duplicate detection | Conflicting candidate signals | Hold for duplicate adjudication | AP Clerk |
| 3-way matching | Missing PO/receipt or unresolved mismatch | Route to exception workflow | AP Clerk + Approver |
| Dimensions/SoD | Required policy data missing or role conflict | Block approval until resolved/overridden | Approver / Policy admin |
| Contract checks | Contract missing or low-confidence link | Mark Unknown and require manual decision | Approver |
| Budget status | Budget object unavailable or stale | Mark Unknown and require manual decision | Approver / Finance owner |

## 8. Examples of user-facing screens

### Screen 1: Invoice Approval (Approver Simplified View)

Purpose: enable one-tap approve/decline with audit-grade evidence.

```text
Invoice #INV-12345   Vendor: ACME Concrete   Amount: $18,450   Entity: West Ops

[ RISK BADGE: NEEDS REVIEW ]  Confidence: 0.93
Top drivers:
 - 3-way match variance: +3.1% vs PO line 4
 - Contract cap breach: +$2,100 above TCV
 - Duplicate risk: none detected

Audit note (copy-pastable to comments):
✅ Vendor verified; remit-to unchanged
⚠ PO variance exceeds 2% threshold on line 4 (+$560)
⚠ Contract #882 cap exceeded by $2,100 (YTD spend + current bill)

Actions: [Approve] [Decline] [Request changes] [Ask a question]
```

States:

- **Empty**: show “Evidence pending” while agents run.
- **Loading**: show which agents are running and expected time.
- **Error**: show per-agent failure with “retry” and safe fallback (“manual review required”).

### Screen 2: Evidence Panel (Drill-down)

Purpose: provide auditor-grade traceability without cluttering the main approval view.

- Tabs: **Matching**, **Contract**, **Budget/Policy**, **Vendor/Fraud**, **Treasury**
- Each tab includes: **source**, **timestamp**, **confidence**, **what changed**, **links**

### Screen 3: Exception Workflow (AP Clerk)

Purpose: resolve mismatch/duplicate/contract issues with templated actions.

- Exception type selector (auto-detected): Duplicate / 3-way mismatch / Contract cap / Budget / Vendor change
- Suggested next steps (ranked): “request receipt,” “request vendor revision,” “escalate for overage approval,” “approve with variance reason”
- Draft message templates (chat/email) + required attachments

## 9. Business impact & success metrics

### 9.0 KPI framework

**North Star:** approvers decide **faster** with **equal or better control quality**—not “more AI usage.” Read **success metrics (§9.0.1)** together with **guardrail metrics (§9.0.2)**; pilot go/no-go gates in §9.1 map to subsets of both.

**Instrumentation:** §16 events (`time_to_decision_ms`, `one_tap_decision`, `exception_opened`, `override_used`, etc.) are the **system of record** for numerators/denominators; baselines are captured per tenant before comparing to §9.1.

**Anti-KPIs for v1 (do not optimize blindly):** raw LLM token volume; “touchless” approve count without human explicit action; badge clicks without decision-quality context; agent run volume uncorrected for false positives.

### 9.0.1 Success metrics (top 7)

| # | Metric | Definition (directional) | Primary cut / segment | Owner |
|---:|---|---|---|---|
| 1 | **Median time to approve/decline** | Median time from **approval package ready** (or user open, `TBD-with-Eng`) to approve/decline | By exception type, approver role | Product |
| 2 | **One-tap decision rate** | Share of decisions **without** clarifying back-and-forth after the package is shown | Pilot cohort; construction wedge | Product |
| 3 | **Exception time-to-clear** | Median time from exception **opened** to **resolved** | Duplicate / mismatch / contract cap / budget | Product / CS |
| 4 | **Evidence engagement rate** | Share of approval sessions where the user opens any evidence drill-down | By persona (`TBD-with-Eng` RBAC) | Product |
| 5 | **Council package latency (p95)** | p95 time from trigger to full package **or** explicit degraded / partial state | Overall and per agent | Eng |
| 6 | **Outcome signal rate** | Count or rate of **high-signal outcomes**: e.g. duplicate payments prevented, duplicate flags confirmed actionable, SoD/policy blocks with clear reason **(numerator definitions `TBD-with-PM`)** | Per tenant / month | Product + Compliance |
| 7 | **Governance maturity vs. risk severity** | Ratio of implemented governance controls to measured severity of agentic risks; severity should decrease over time for categories such as **Misalignment**, **Emergent Capability**, evidence gaps, and unsafe autonomy pressure. | Quarterly governance review; by risk category and tenant cohort | Product + Compliance + DS |

### 9.0.2 Guardrail metrics (bounds; do not trade off without review)

| # | Guardrail | Definition (directional) | Bound / gate | Owner |
|---:|---|---|---|---|
| G1 | **Duplicate / mismatch flag false-positive rate** | Flags that create needless work, are overturned, or dismissed without valid action **`TBD` numerator** | Pilot: §9.1 C (≤**15%** after tuning) | DS + Product |
| G2 | **P0 override rate** | Overrides applied on checks classified **P0** for policy | Pilot: §9.1 D (ceiling `TBD-with-PM/Compliance`) | PM + Compliance |
| G3 | **Citation coverage (AI claims)** | Share of **material** claims with ≥1 source reference (FR-023) | Release / DS gate; target `TBD-with-DS` | DS |
| G4 | **Model quality by check type** | Precision / recall / FP where labeled data exists (FR-027) | Drift / expansion gate (FR-029); thresholds `TBD-with-DS` | DS |
| G5 | **Post-approval rework** | ERP reversals, voids, or material corrections tied to post-approval invoices | Must **not worsen** vs pre-feature baseline (`TBD` window) | Finance partner / CS |
| G6 | **Unsafe silent success rate** | Approvals where required evidence was **missing** or agents **failed** without routing to manual review / Unknown | Target ~**0**; alert if >`TBD` | Eng + Compliance |
| G7 | **Adaptive governance coverage** | Share of enabled agent capabilities with assigned oversight level, test coverage, rollback path, and review cadence. | Required before enabling new or materially changed capabilities | Compliance + Eng |

### 9.1 Pilot success and kill criteria (pre-committed)

Pilot gate is measured over the private pilot cohort before broader expansion. **Mapping:** thresholds **A** and **B** below track **§9.0.1 metrics 1 and 2**; thresholds **C** and **D** track **§9.0.2 guardrails G1 and G2**.

- **Success threshold A (speed):** median `time_to_decision_ms` improves by at least **60%** vs baseline.
- **Success threshold B (usability):** `one_tap_decision` rate improves by at least **20%** vs baseline.
- **Safety threshold C (quality):** false-positive rate for duplicate/mismatch flags stays at or below **15%** after tuning window.
- **Trust threshold D (override health):** override rate for P0 checks remains below agreed ceiling (`TBD-with-PM/Compliance`).

If two or more thresholds fail after the agreed calibration window, rollout is paused and scope is reduced to core checks until thresholds are met.

## 10. Key tradeoffs & risks

- **Trust vs autonomy**: pushing too far toward autonomous posting risks compliance and customer trust; v1 keeps humans in control.
- **False positives**: aggressive duplicate/variance checks can create more work than they save; requires calibration and clear overrides.
- **Contract source of truth**: “contract anchor” requires clarity on where contracts live and who maintains them.
- **ERP variability**: budget and dimension availability differ by ERP and customer configuration; must degrade gracefully.
- **Audit logging**: reasoning logs must be tamper-evident and readable; avoid leaking sensitive data.
- **Misalignment / emergent capability risk**: as agents gain new tools or autonomy, existing controls may become insufficient; require adaptive governance before expanding capability.

## 11. Prototype

Prototype goal: prove that evidence packaging reduces decision time and increases trust.

- **What to prototype**:
  - Risk Badge + Audit Note generation
  - Evidence panel drill-down with per-agent traceability
  - Exception workflow drafts (credit memo request, receipt request)
- **Fidelity**: clickable mock for approver view + Wizard-of-Oz for evidence generation.
- **HTML demo (static)**: [`demo/index.html`](./demo/index.html) — approver + AP clerk surfaces, demo states (empty / loading / ready / error), evidence tabs; open locally in a browser (no server required).
- **Timeline sketch**: 1–2 weeks for clickable UX + 1 week for scripted evidence generation demo.
- **Invalidation criteria**:
  - Approvers still open multiple systems or ask for the same information
  - Users distrust badge/evidence and revert to manual investigation
  - False positives overwhelm AP clerks

---

## 12. User stories & flows

### User stories

- **US-001 (Approver)**: As a budget owner, I want a single approval screen with a risk badge and evidence so that I can approve/decline quickly without manually verifying every box.
- **US-002 (AP Clerk)**: As an AP specialist, I want exceptions (duplicate, mismatch, contract cap) triaged with suggested next steps and drafts so that I can resolve issues without chasing context.
- **US-003 (Treasury)**: As treasury, I want approvals to surface payment rail and discount implications so that we capture savings without increasing risk.

### Core flow (happy path): CORE workflow pattern

The happy path follows a **CORE workflow**: **Task → Plan Review → Approve → PR**. In this PRD, “PR” means the approval package is promoted from proposed plan to reviewed approval record, not autonomous posting or payment.

1. **Task**: Invoice arrives → extraction + enrichment runs; the workflow identifies the approval task and required checks.
2. **Planning Session**: Council of Agents gathers evidence, drafts the proposed **Audit Note** and **Risk Badge**, and stops at a plan-review checkpoint. No exception drafts, posting, payment, or externally visible workflow action occurs at this stage.
3. **Plan Review**: Human reviews the proposed package, asks follow-up questions if needed, and approves or rejects the plan intent.
4. **Execution Session**: Only after plan approval, the workflow produces any approved exception drafts, finalizes the evidence package, and enables the human approve/decline action.
5. **Promote reviewed record**: Posting/payment remain human-authorized; system packages the final audit note and stores the reviewed evidence trail.

### Exception flow: 3-way mismatch

1. Operational Agent detects mismatch and classifies variance (qty/price/receipt missing).
2. System proposes action(s) and produces draft messages.
3. AP Clerk selects action and sends; approver receives updated evidence when resolved.

### Exception flow: multi-entity duplicate

1. Data Integrity Agent flags suspected duplicates and links candidates.
2. AP Clerk confirms duplicate or marks legitimate; requires reason code.
3. Evidence is logged in the invoice thread.

### Exception flow: contract cap breach

1. Contract Anchor computes YTD spend + current bill vs cap (if contract data available).
2. If breach, route to higher-level variance approval policy.
3. Audit note explains breach delta and evidence source.

## 13. Functional requirements

### 13.0 Functional requirements by domain (parented)

#### Council orchestration
| ID | Requirement | Priority | User story | XD req | Eng req | DS req |
|---|---|---:|---|---|---|---|
| FR-001 | Execute Council of Agents checks concurrently and produce one unified approval package (Risk Badge, Audit Note, drill-down evidence). | P0 | As an Approver, I want one consolidated approval view so that I can decide quickly without opening multiple systems. | Fast decision flow (<30s), plain-language risk drivers, progressive disclosure. | Provenance-backed evidence objects, deterministic orchestration, idempotent execution. | Define confidence schema and decision-threshold calibration approach for package-level scoring. |
| FR-001 | Keep AP-operational detail available without cluttering approver summary. | P0 | As an AP Clerk, I want detailed evidence only when needed so that I can resolve exceptions without slowing standard approvals. | Progressive disclosure, traceable evidence display (source/timestamp/confidence/link). | Retry-safe degradation behavior and stable rendering under partial failures. | Validate that summary/detail presentation preserves decision quality in usability experiments. |
| FR-002 | Emit machine-readable outputs with status, confidence, and evidence references. | P0 | As an Approver/AP Clerk, I want confidence and references visible so that I can trust and audit decisions. | Evidence traceability in-view and drill-down. | Typed output contracts and evidence-reference validation. | Confidence reliability analysis (calibration curves) for each check output. |
| FR-003 | Degrade to manual review when required checks fail or are unavailable; explicitly list missing evidence. | P0 | As an Approver, I want unsafe cases clearly blocked so that I do not approve on missing evidence. | Explicit Unknown/manual-review states with clear next actions. | Retry-safe degradation and fallback routing. | Define uncertainty thresholds that trigger fallback/manual review. |
| FR-032 | Use two-stage retrieval for ambiguous evidence: retriever returns candidate invoices/POs/receipts/contracts/vendor facts, then a semantic re-ranker orders candidates before LLM synthesis or citation. | P0 | As an Approver/AP Clerk, I want cited evidence to be the right evidence so that I do not rely on superficially similar records. | Show selected source plus confidence and “why this source” where useful. | Retriever + re-ranker pipeline, candidate audit trail, tenant-scoped indexes. | Evaluate top-k recall and re-ranker precision by evidence type. |
| FR-033 | Include a Critique Agent that reviews the combined package for cross-agent conflicts, missing evidence, and misalignment with user intent or tenant policy. | P0 | As an Approver, I want conflicting recommendations surfaced before I decide so that the package is globally coherent. | Conflict banner and required resolution path before “Approve” badge state. | Post-synthesis critique step with typed conflict outputs and gating behavior. | Measure critique precision/recall against labeled conflict scenarios. |
| FR-034 | Classify orchestration failures into transient, LLM-recoverable, and user-fixable classes, with safe handling for each class. | P0 | As an AP Clerk, I want failures routed to the right recovery path so that missing data and system errors do not look like valid approvals. | Clear retry/manual-input states and no silent completion. | LangGraph-style retry loops, agent repair loops, and human `interrupt()` for user-fixable missing data. | Track recovery success rate and false manual-interrupt rate. |

#### Data Integrity Agent
| ID | Requirement | Priority | User story | XD req | Eng req | DS req |
|---|---|---:|---|---|---|---|
| FR-004 | Flag low-confidence extraction for manual review (default threshold 0.95, configurable). | P0 | As an AP Clerk, I want low OCR confidence flagged so that I do not propagate bad data to approvals and ERP. | Explicit low-confidence/unknown states with next actions. | Deterministic threshold logic, tenant-configurable thresholds. | Calibrate extraction confidence thresholds by document type/vendor cohort. |
| FR-005 | Detect and link multi-entity duplicate candidates before approval/payment. | P0 | As an AP Clerk, I want duplicate candidates linked so that I can prevent duplicate payments quickly. | Progressive disclosure with linked, traceable evidence. | Provenance-backed evidence and deterministic matching pipeline. | Maintain duplicate precision/recall targets and tune matching features over time. |
| FR-006 | Detect remit-to anomalies against historical ERP/vendor data and flag fraud risk before approval. | P1 | As an AP Clerk, I want remit-to changes highlighted with evidence so that I can catch fraud risk before approval. | Traceable risk evidence and explicit action paths. | Provenance-backed anomaly checks, data-minimized audit outputs. | Build anomaly scoring model and monitor false-positive rate by vendor segment. |

#### Operational Agent
| ID | Requirement | Priority | User story | XD req | Eng req | DS req |
|---|---|---:|---|---|---|---|
| FR-007 | Execute 3-way matching and classify mismatches (price, quantity, missing receipt). | P0 | As an AP Clerk/Approver, I want mismatch types and deltas clearly shown so that I can resolve exceptions faster. | Plain-language mismatch drivers, progressive disclosure, traceable evidence. | Provenance-backed matching evidence and deterministic classification logic. | Monitor mismatch classifier quality by PO category and supplier type. |
| FR-007 | Show mismatch reason codes suitable for downstream reporting. | P0 | As a Controller, I want consistent mismatch categories so that I can analyze recurring failure patterns. | Consistent labels and explainable deltas in UI. | Stable reason-code taxonomy and analytics-ready event payloads. | Validate taxonomy stability and class distribution drift over time. |
| FR-008 | Generate draft credit memo request messages for variance workflows. | P1 | As an AP Clerk, I want editable credit memo drafts so that I reduce back-and-forth in variance cases. | Progressive disclosure from suggestion to editable draft. | Retry-safe draft generation with safe failure handling. | Evaluate draft usefulness/acceptance rate and retrain prompt patterns from feedback. |

#### Budget and Policy Agent
| ID | Requirement | Priority | User story | XD req | Eng req | DS req |
|---|---|---:|---|---|---|---|
| FR-009 | Enforce mandatory dimensions before approval completion, with controlled override policy. | P0 | As an AP Clerk/Approver, I want required dimensions enforced so that bills post cleanly to ERP. | Explicit missing-dimension states, override UX with reason + impact visibility. | Strict authorization boundaries, tenant-configurable policy controls. | Track override patterns to identify recurring taxonomy gaps and policy tuning needs. |
| FR-010 | Enforce segregation-of-duties for requester, approver, and payer roles. | P0 | As an Approver, I want SoD violations blocked with clear reasoning so that we stay compliant. | Plain-language SoD reason display and blocked states. | Authorization boundary enforcement, tenant-configurable SoD policy controls. | Monitor SoD violation trends and false-positive policy triggers by tenant profile. |
| FR-011 | Surface budget status as confirmed, at-risk, or unknown in the approval package. | P1 | As an Approver, I want budget status visible before approving so that I avoid out-of-policy spend. | Plain-language budget drivers, traceable evidence, explicit unknown states. | Provenance-backed budget evidence, tenant-configurable controls. | Calibrate budget risk thresholds and monitor decision impact by segment/project type. |

#### Treasury Agent
| ID | Requirement | Priority | User story | XD req | Eng req | DS req |
|---|---|---:|---|---|---|---|
| FR-012 | Recommend the best-fit payment rail with rationale aligned to policy and context. | P1 | As Treasury, I want rail recommendations with rationale so that we optimize cash and policy. | Plain-language recommendation rationale with progressive detail. | Provenance-backed evidence and deterministic recommendation constraints. | Measure recommendation lift vs baseline and optimize policy-weighted ranking model. |
| FR-013 | Detect early-payment discounts and provide ROI guidance from configurable assumptions. | P1 | As Treasury, I want discount ROI surfaced so that I can choose the economically best payment timing. | Plain-language ROI explanation with traceable source values. | Provenance-backed calculations, configurable financial inputs. | Validate ROI model assumptions and backtest predicted vs realized value. |

#### Contract Anchor
| ID | Requirement | Priority | User story | XD req | Eng req | DS req |
|---|---|---:|---|---|---|---|
| FR-014 | Validate invoice service periods against contract dates, or mark status as unknown if evidence is missing. | P0 | As an Approver, I want period validation shown clearly so that I do not approve out-of-period services. | Traceable contract evidence and explicit unknown/out-of-period states. | Provenance-backed contract data and deterministic validation logic. | Monitor unknown-rate and misclassification rate for contract-link confidence. |
| FR-015 | Calculate contract cap (TCV) deltas and flag breach conditions with escalation guidance. | P0 | As an Approver/AP Clerk, I want cap deltas and escalation context so that overages are handled consistently. | Plain-language breach rationale, traceable evidence, explicit next actions. | Provenance-backed cap calculations and escalation workflow hooks. | Calibrate breach-risk scoring and evaluate precision for escalation triggers. |

#### Audit and permissions
| ID | Requirement | Priority | User story | XD req | Eng req | DS req |
|---|---|---:|---|---|---|---|
| FR-016 | Write immutable, human-readable audit notes for decisions and key checks. | P0 | As an Approver/AP Clerk, I want durable audit notes so that approvals are explainable and audit-ready. | Traceable note content tied to evidence sources. | Provenance-backed logging, data-minimized audit outputs. | Ensure explanation consistency metrics for generated note quality. |
| FR-017 | Block agent creation of net-new ERP master data (vendors, GL codes, dimensions). | P0 | As an AP Clerk, I want agent master-data writes blocked so that ERP integrity is preserved. | Explicit blocked-state messaging with remediation path. | Strict authorization boundaries on all write paths. | N/A (rule-based control, no model behavior expected). |
| FR-018 | Support reason-coded overrides with full audit visibility and policy controls. | P1 | As an Approver/AP Clerk, I want reason-coded overrides so that speed and governance stay balanced. | Override flow requires reason and displays downstream impact. | Provenance-backed override logs, strict authorization boundaries, tenant-configurable policies. | Analyze override reasons to identify model/policy retraining opportunities. |

#### Data aggregation and sync
| ID | Requirement | Priority | User story | XD req | Eng req | DS req |
|---|---|---:|---|---|---|---|
| FR-019 | Ingest and normalize invoice, PO, receipt, vendor, contract, budget, and approval events into a canonical evidence model. | P0 | As a Platform Engineer, I want one canonical model so that all agents evaluate the same facts. | Consistent labels and fields in evidence UI across data sources. | Schema versioning, source adapters, typed canonical contracts. | Define feature contracts consumed by models and validate training/serving parity. |
| FR-020 | Perform incremental sync with watermark/cursor strategy and expose data freshness per source. | P0 | As an Approver, I want freshness visibility so that I know whether decisions rely on current data. | Freshness timestamp shown in drill-down views. | Incremental ETL, watermarking, idempotent replays, late-arrival handling. | Monitor freshness impact on model confidence and prediction quality. |
| FR-021 | Support strict reconciliation and drift alerts between source records and aggregated store. | P1 | As AP Ops, I want drift alerts so that hidden sync errors do not bias approvals. | Clear “data mismatch” state with remediation path. | Reconciliation jobs, drift thresholds, alert routing and runbooks. | Quantify feature drift and trigger retraining/threshold review workflows. |
| FR-022 | Enforce tenant isolation and source-level access controls in all aggregated datasets. | P0 | As Compliance, I want strong isolation so that cross-tenant leakage is impossible. | No cross-tenant visibility in UI or exports. | Row-level security, encryption, scoped credentials, audited access logs. | Ensure training data partitioning and evaluation are tenant-safe by design. |

#### LLM and reasoning requirements
| ID | Requirement | Priority | User story | XD req | Eng req | DS req |
|---|---|---:|---|---|---|---|
| FR-023 | Restrict LLM outputs to retrieval-grounded evidence; all material claims must cite source references. | P0 | As an Approver, I want cited claims so that I can trust AI-generated recommendations. | Inline source badges for each AI claim. | RAG pipeline with citation enforcement and claim-to-source mapping. | Hallucination-rate evaluation and citation coverage thresholds per release. |
| FR-024 | Route uncertain or low-confidence LLM outcomes to deterministic fallback or manual review. | P0 | As AP Clerk, I want safe fallback behavior so that uncertain AI never silently drives approvals. | Explicit “AI uncertain” state and next best action. | Confidence calibration wiring, policy thresholds, fallback orchestration. | Calibrate uncertainty thresholds and track fallback precision/recall. |
| FR-025 | Block prompt/response leakage of sensitive fields and prohibit unapproved external calls. | P0 | As Security, I want strong guardrails so that regulated finance data is protected. | Redaction indicators where sensitive fields are masked. | PII redaction, prompt filters, allowlisted tools, policy firewall. | Adversarial/red-team test set for leakage risk and policy-violation detection. |
| FR-026 | Version and evaluate prompts/models before production rollout; support instant rollback. | P1 | As Product/Eng, I want controlled changes so that quality regressions are caught early. | Stable user experience across model updates. | Prompt registry, canary deploy, rollback switch. | Offline evaluation suite, champion/challenger analysis, release gating by DS scorecards. |
| FR-031 | Use a **RAG-first** agent architecture: retrieval + tools supply facts; LLM synthesizes with mandatory citations. Allow **fine-tuning or task adapters** only for DS-approved sub-tasks (e.g., phrasing, narrow classifiers), behind flags, with rollback—never as the sole source of tenant policy or ERP truth. | P0 | As Eng/DS leadership, I want a clear default so agents stay grounded and we avoid stale memorized “product knowledge.” | Users always see whether text is evidence-backed vs stylistic model output. | Tenant-scoped retrieval indexes, tool orchestration, adapter registry, feature flags, no production adapter without version + rollback path. | Fine-tune scope charter per task class; offline eval + champion/challenger; forbid replacing RAG for factual/policy claims without retrieved linkage. |
| FR-035 | Keep agent reasoning transparent in the interaction medium: recommendation, cited drivers, uncertainty, and required human action must appear in the Audit Note / approval flow rather than only in a separate reasoning panel. | P0 | As an Approver, I want the reasoning where I decide so that I can calibrate trust quickly. | Audit Note as the primary reasoning surface; separate panels only expand evidence. | Structured explanation payload rendered inline with decision controls. | Evaluate whether inline reasoning improves trust calibration and reduces unnecessary drill-down. |

#### Data science and model quality
| ID | Requirement | Priority | User story | XD req | Eng req | DS req |
|---|---|---:|---|---|---|---|
| FR-027 | Define and track core model metrics (precision, recall, false-positive rate) per check type and segment. | P0 | As PM/DS, I want quality telemetry so that we can tune models without harming trust. | Quality status visible in internal ops dashboards. | Metrics collection infrastructure and dashboard plumbing. | Metric definitions, segmentation logic, threshold ownership, periodic model review cadence. |
| FR-028 | Continuously learn from overrides and outcomes with human-in-the-loop labeling workflow. | P1 | As AP Ops, I want feedback to improve model behavior over time. | Lightweight override reason capture in workflow. | Label capture UX, feedback ingestion pipelines, retraining orchestration hooks. | Label taxonomy governance, active-learning policy, retraining schedule and validation criteria. |
| FR-029 | Detect model/data drift and gate expansion when quality drops below thresholds. | P0 | As Launch Manager, I want objective guardrails so that rollout pauses before customer harm. | Internal “quality gate” status in release checklist. | Drift monitors, alerting, and rollout gate automation. | Drift definitions, statistical tests, intervention playbook, threshold ownership by DS. |
| FR-030 | Maintain explainability artifacts for high-impact decisions (feature contributors, confidence decomposition). | P1 | As Audit/Compliance, I want explainability evidence so that decisions are defensible. | Human-readable explanation cards in drill-down. | Explainability rendering service, storage, and retention linkage. | Model cards, explanation-method selection, fidelity checks, and compliance-facing interpretation guidance. |
| FR-036 | Support adaptive governance: oversight level, release gates, monitoring, and rollback requirements must adjust when agents gain new tools, broader scopes, or emergent capabilities. | P1 | As Compliance/Product leadership, I want governance to scale with capability risk so that controls do not lag behind agent behavior. | Internal capability-risk status surfaced in launch/readiness reviews. | Capability registry, policy-driven gates, rollback controls, and review cadence by risk tier. | Maintain risk taxonomy and severity trend analysis for misalignment and emergent-capability categories. |

## 14. Acceptance criteria

- **AC-001 (FR-001)**: Given an invoice is ingested, when agent checks complete, then the approver sees a Risk Badge, Audit Note, and at least one drill-down evidence panel.
- **AC-002 (FR-003)**: Given an agent check errors, when the approval package is rendered, then the badge states manual review required and names the missing check(s).
- **AC-003 (FR-004)**: Given confidence < 0.95, when rendering the approval package, then the invoice is flagged for manual review and the confidence is displayed.
- **AC-004 (FR-005)**: Given a duplicate candidate exists, when the duplicate panel is opened, then candidate invoices are listed with matching rationale.
- **AC-005 (FR-007)**: Given PO and receipt data exists, when mismatch occurs, then the system classifies mismatch type and shows the delta.
- **AC-006 (FR-009)**: Given required dimensions are missing, when attempting to approve, then approval is blocked with a clear missing-fields list.
- **AC-007 (FR-010)**: Given requester and approver are the same user and SoD is enforced, when attempting to approve, then the system blocks and explains the violated rule.
- **AC-008 (FR-014/015)**: Given contract data exists, when service dates are outside contract or cap is breached, then approval package flags the issue and shows computed values.
- **AC-009 (FR-016)**: Given approval package is generated, when viewing invoice thread history, then an audit note exists with timestamp and key outcomes.
- **AC-010 (FR-017)**: Given an action would require a new vendor/GL/dimension, when evidence is generated, then it is labeled `TBD-with-Eng` and no write occurs.
- **AC-011 (FR-020)**: Given a source system sync delay, when approver opens evidence panel, then freshness timestamp and stale-data warning are shown.
- **AC-012 (FR-023)**: Given an AI-generated recommendation, when user expands reasoning, then each material claim shows at least one source reference.
- **AC-013 (FR-024)**: Given LLM confidence below policy threshold, when recommendation is generated, then workflow routes to deterministic fallback or manual review.
- **AC-014 (FR-027/029)**: Given weekly model-quality evaluation, when false-positive rate exceeds threshold, then rollout status changes to gated/paused until corrected.
- **AC-015 (FR-031)**: Given any user-visible factual or policy claim from an agent, when the claim is asserted, then it is backed by RAG/tool evidence with citations or explicitly labeled as non-sourced inference; and any fine-tuned or adapter-based component is gated by DS release criteria (see FR-026/027) and cannot be the only basis for tenant policy or ERP facts without retrieval linkage.
- **AC-016 (FR-032)**: Given multiple plausible evidence candidates exist, when an agent cites one, then the selected record has passed retriever + re-ranker selection and the candidate rationale is retained for audit.
- **AC-017 (FR-033)**: Given two agent recommendations conflict, when the package is synthesized, then the Critique Agent flags the conflict and the Risk Badge cannot present “Approve” until the conflict is resolved or explicitly overridden.
- **AC-018 (FR-034)**: Given a transient, LLM-recoverable, or user-fixable error occurs, when orchestration handles it, then the workflow follows the matching retry, repair-loop, or human `interrupt()` path and records the outcome.
- **AC-019 (FR-035)**: Given an approver opens the approval package, when reviewing the Audit Note, then recommendation, evidence drivers, uncertainty, and required human action are visible without opening a separate AI reasoning panel.
- **AC-020 (FR-036)**: Given an agent receives a new tool, broader action scope, or materially new capability, when rollout is requested, then adaptive governance assigns an oversight tier and required gates before enablement.

## 15. Experience & content

- Risk Badge labels: **Approve**, **Needs review**, **Block**, **Unknown** (policy-configurable).
- Audit Note must be concise (<= ~8 lines) and copy-pasteable.
- Provide “Why?” drill-down for each driver with sources and confidence.

## 16. Analytics & instrumentation

- `approval_package_generated` (agent statuses, confidence summary)
- `risk_badge_viewed` (persona role)
- `one_tap_decision` (true/false; reason if false)
- `exception_opened` (type)
- `override_used` (reason code, role)
- `time_to_decision_ms` (approve/decline)
- `evidence_retrieval_reranked` (source type, candidate count, selected candidate confidence)
- `critique_conflict_detected` (agent pair, conflict type, resolution path)
- `agent_error_classified` (transient / LLM-recoverable / user-fixable, retry or interrupt outcome)
- `governance_risk_reviewed` (risk category, severity, maturity score, oversight tier)

## 17. Non-functional requirements

- **Security & privacy**: Treat financial/PII fields as sensitive; avoid leaking full bank/payment details into audit notes.
- **Reliability**: Partial failures must degrade safely using the FR-034 error taxonomy; never “hide” missing evidence.
- **Performance**: Approval package should render within a target SLA (`TBD-with-Eng`), with progressive disclosure while checks run.
- **Auditability**: Logs must be tamper-evident and attributable (human vs agent identity).
- **Adaptive governance**: Oversight must increase when an agent gains broader tools, new action scope, or emergent capability indicators.

## 18. Rollout & operations

- **Phase 0 (prototype)**: Wizard-of-Oz evidence generation, validate UX + trust.
- **Phase 1 (pilot)**: Construction customers, human-approval only, **core v1 checks only** (Data Integrity + Operational + minimum policy gates required for safe approval).
- **Phase 2**: Expand to Budget/Policy depth and Contract/Treasury evidence **only if** pilot quality thresholds in Section 9.1 are met and data-source reliability is verified.
- **Feature flags**: Per-tenant enablement; per-agent enablement; per-threshold configuration.

## 19. LCPO (Legal, Compliance, Privacy, Operations)

### 19.1 Legal & compliance

- **LCPO-L1**: Confirm that “agentic” terminology and UI copy do not imply autonomous posting/paying in v1.
- **LCPO-L2**: Define SoD policy defaults per compliance regime (SOC2 / HIPAA) and what is tenant-configurable.
- **LCPO-L3**: Define audit retention requirements for evidence logs and whether invoice comments satisfy “immutable” needs (or require a dedicated audit log store).
- **LCPO-L4**: Finalize immutable audit-log architecture decision (invoice-thread only vs dedicated immutable log service), including owner and sign-off authority.
- **LCPO-L5**: Define adaptive governance tiers for agent capability expansion, including misalignment and emergent-capability risk reviews before rollout.

### 19.2 Privacy & security

- **LCPO-P1**: Classify data fields used in evidence (PII, bank, tax IDs) and define redaction rules for audit notes.
- **LCPO-P2**: Confirm allowed external checks (e.g., W-9 verification) and required consents / data processing terms if third-party services are used.
- **LCPO-P3**: Define access control: which roles can view evidence panels, use overrides, and view provenance links.
- **LCPO-P4**: Require provenance minimum fields for every evidence item: source system, source record identifier, retrieval timestamp, and confidence.

### 19.3 Operations

- **LCPO-O1**: Support runbooks: incident handling for false positives and agent outages; SLA targets (`TBD-with-Eng`).
- **LCPO-O2**: Customer support enablement: reason codes taxonomy, escalation routes, and “when unsure” guidance.

## 20. GTM (go-to-market)

### 20.1 ICP and positioning

- **Primary wedge**: Construction (complex approvals, multi-entity, PO/receipt and contract context), selected first because benchmark data points to longer approval durations and therefore a clearer measurable opportunity.
- **Positioning**: “Faster approvals with stronger controls” — **human decides**, the Council provides **audit-grade evidence**.
- **Key claims to avoid**: “touchless posting/paying” in v1; use “one-tap decisioning with evidence.”

### 20.2 Packaging hypothesis (TBD-with-GTM)

- Candidate: higher-tier add-on for advanced controls/evidence, or bundle into enterprise/compliance tier.
- Cross-sell tie-ins: payments/cards (Treasury evidence), procurement/contract modules (Contract Anchor).

### 20.3 Sales enablement deliverables

- 1-page exec summary for internal / candidate context: [`00-executive-summary.md`](./00-executive-summary.md); customer-facing 1-pager: problem, before/after workflow, screenshots of Risk Badge + evidence panel (`TBD-with-Design`).
- Competitive battlecard: summarize differences vs Tipalti/BILL/AvidXchange from `appendix-competitive.md`.
- Objection handling: autonomy/trust (“humans approve; evidence is explicit; Unknown is safe”).

### 20.4 Launch plan (phased)

- **Private pilot**: 3–5 construction customers; define baseline metrics and weekly review.
- **Beta**: add configurability (thresholds, reason codes, per-agent flags).
- **GA**: publish case study + enable broader segments (healthcare next).

## 21. Open questions

1. Where is the contract source-of-truth for initial customers (procurement suite vs ERP attachments vs document store)?
2. Which ERP-specific budget objects should be supported first (NetSuite vs Intacct), and what are the fallbacks?
3. What is the acceptable false-positive rate for duplicate and mismatch flags?
4. Where should “immutable reasoning logs” live (invoice comments vs dedicated audit panel) to satisfy auditors?
5. What SoD rules are required per compliance regime (SOC2 vs HIPAA) and how tenant-configurable should they be?

## 22. Appendix A — Competitive deep dive

See `appendix-competitive.md`.

## 23. Appendix: Council review

See `appendix-council.md`.

## 24. Appendix B — Synthetic user research

See `appendix-synthetic-user-research.md` (persona cards, simulated sessions, themes; **not** empirical research).

