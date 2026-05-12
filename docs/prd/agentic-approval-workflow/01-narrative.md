# Agentic Approval Workflow — PRD narrative

## 1. Metadata

- **Owner**: `TBD`  
- **Status**: Draft  
- **Last updated**: 2026-05-12  
- **Links**: `TBD` (Jira / Figma / Slack)

## 2. The opportunity

Approvals in complex AP/P2P environments (starting with **construction**, selected first because available benchmark data shows long approval durations) require humans to manually validate many “boxes” across **policy, contract, matching, duplicates, vendor integrity, and cash implications**. This creates delays, inconsistent compliance, and downstream ERP cleanup.

The opportunity is to shift approvers from “investigator” to “decision-maker” by introducing an **Agentic Workflow**: a deterministic approval process with explicit checkpoints, human review boundaries, and a **Council of Agents** that performs specialized audits inside those guardrails. This framing matters for finance because the workflow, not free-form agent autonomy, makes AI assistance governable and auditable.

## 3. Relevant market & competitive context

Across the market, vendors increasingly market AI moving from “suggest” to “complete work,” but approvals/posting typically maintain **human control** for trust and compliance. Examples:

- BILL: 2026 narrative around AI completing invoice coding work. Source: `https://www.bill.com/blog/new-at-bill-january-march-2026`
- Tipalti: invoice approval workflow emphasizes 3-way matching, exception handling, and routing to approvers. Source: `https://tipalti.com/resources/learn/invoice-approval-workflow/`
- AvidXchange: public “AI agents” messaging in AP workflow. Source: `https://www.avidxchange.com/press-releases/avidxchange-unveils-new-ai-agents-to-elevate-accounts-payable-processes/`

Major peers (including **BILL** and **Tipalti**) also publicly market **accounting/ERP integrations** and sync to the system of record—so “has ERP integration” is not, by itself, a unique wedge; see `appendix-competitive.md` for sources and how we still differentiate on **agent-packaged approval evidence**.

Stampli’s public posture also stresses that “touchless AP” is often impractical in real-world complexity, reinforcing an evidence-first approach where humans still approve. Source: `https://www.stampli.com/blog/accounts-payable/touchless-ap-myth/`

See `appendix-competitive.md` for the structured comparison.

## 4. Why this is strategically valuable for Stampli

- **Deepens the invoice-centric workspace differentiation**: make the invoice thread the place where audit-grade evidence is assembled and decisions are made.
- **Strengthens ERP-native alignment**: treat the ERP as system of record and constrain agent actions to ERP-valid entities/dimensions.
- **Accelerates P2P breadth**: pull contract, PO/receipt, budget, and payment considerations into one approval experience without forcing customers to re-platform.
- **Raises trust/control**: consistent policy and SoD checks reduce “approval variability” across a large approver base.

## 5. Personas (synthetic unless noted)

Primary personas selected for this PRD (synthetic; see **Appendix B** in [`PRD.md`](./PRD.md) §24 / `appendix-synthetic-user-research.md`):

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

## 7. What should be automated vs human-controlled

| Capability | Automated (system/agent) | Human-controlled |
|---|---|---|
| Evidence gathering | Pull ERP facts, compare to policy/contract, compute deltas | Confirm ambiguous data sources; override with reason |
| Risk badge + audit note | Generate summary, confidence, and drivers | Final approve/decline |
| Exception handling drafts | Draft messages (vendor/procurement), propose next steps | Send messages; approve exceptions; decide whether to proceed |
| Posting/paying | **Not autonomous in v1** | Posting and payment remain explicitly authorized human actions |

## 8. Examples of user-facing screens (ASCII / spec)

### Screen 1: Invoice Approval (Approver Simplified View)

Purpose: enable one-tap approve/decline with audit-grade evidence.

Layout:

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

Initial metrics (approved):

- **Median time to approve/decline** (overall and by exception type)
- **Agent-aided one-tap decision rate** (approver decides without back-and-forth)

Suggested additional metrics (proposed assumptions; can be revised):

- Exception resolution time (3-way mismatch, contract cap, duplicates)
- Duplicate payments prevented / duplicate flags confirmed
- SoD violations prevented / overridden

## 10. Key tradeoffs & risks

- **Trust vs autonomy**: pushing too far toward autonomous posting risks compliance and customer trust; v1 keeps humans in control.
- **False positives**: aggressive duplicate/variance checks can create more work than they save; requires calibration and clear overrides.
- **Contract source of truth**: “contract anchor” requires clarity on where contracts live and who maintains them.
- **ERP variability**: budget and dimension availability differ by ERP and customer configuration; must degrade gracefully.
- **Audit logging**: reasoning logs must be tamper-evident and readable; avoid leaking sensitive data.

## 11. Prototype

Prototype goal: prove that evidence packaging reduces decision time and increases trust.

- **What to prototype**:
  - Risk Badge + Audit Note generation
  - Evidence panel drill-down with per-agent traceability
  - Exception workflow drafts (credit memo request, receipt request)
- **Fidelity**: clickable mock for approver view + Wizard-of-Oz for evidence generation.
- **Timeline sketch**: 1–2 weeks for clickable UX + 1 week for scripted evidence generation demo.
- **Invalidation criteria**:
  - Approvers still open multiple systems or ask for the same information
  - Users distrust badge/evidence and revert to manual investigation
  - False positives overwhelm AP clerks

