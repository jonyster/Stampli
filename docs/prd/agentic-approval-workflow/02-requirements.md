# Agentic Approval Workflow — requirements

> **Scope:** Companion checklist for user stories and **FR-001–FR-018** / **AC-001–AC-010**. **Canonical** requirements (including FR-019+, model/RAG FR-023–FR-031, full acceptance criteria, LCPO, and gates) live in [`PRD.md`](./PRD.md) §12–14, §9, §18–19.

## 12. User stories & flows

### User stories

- **US-001 (Approver)**: As a budget owner, I want a single approval screen with a risk badge and evidence so that I can approve/decline quickly without manually verifying every box.
- **US-002 (AP Clerk)**: As an AP specialist, I want exceptions (duplicate, mismatch, contract cap) triaged with suggested next steps and drafts so that I can resolve issues without chasing context.
- **US-003 (Treasury)**: As treasury, I want approvals to surface payment rail and discount implications so that we capture savings without increasing risk.

### Core flow (happy path)

1. Invoice arrives → extraction + enrichment runs.
2. Council of Agents runs in parallel, using two-stage retrieval where evidence is not already deterministic.
3. Critique Agent checks the combined package for conflicts and missing intent before presentation.
4. Approver sees Risk Badge + Audit Note → approves/declines in one step.
5. Posting/payment remain human-authorized; system packages the final audit note.

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

### Council orchestration

- **FR-001 (P0)**: The system MUST execute the Council of Agents checks concurrently for an invoice and produce a unified “approval package” (Risk Badge + Audit Note + drill-down evidence).
- **FR-002 (P0)**: Each agent MUST produce a machine-readable result including: status (pass/warn/fail/unknown), confidence (0–1), evidence references, and timestamps.
- **FR-003 (P0)**: If any required agent check fails to run, the Risk Badge MUST degrade to “manual review required” and list which evidence is missing.
- **FR-003A (P0)**: Evidence-gathering agents MUST use a two-stage retrieval process for ambiguous documents or records: a deterministic/tool retriever returns candidate invoices, POs, receipts, contracts, or vendor facts; a re-ranker then orders candidates by semantic relevance to the specific invoice context before any LLM synthesis.
- **FR-003B (P0)**: The Council MUST include a Critique Agent that evaluates the global approval package for cross-agent conflicts, missing evidence, and misalignment with user intent or tenant policy before the package is shown as ready.
- **FR-003C (P0)**: Council orchestration MUST classify failures using a LangGraph-style error taxonomy and route each class safely:
  - **Transient errors** (network/API/rate-limit issues): automatic retry with bounded backoff and idempotent agent state.
  - **LLM-recoverable errors** (schema parsing, invalid tool call, citation mismatch): loop back to the responsible agent with corrective context.
  - **User-fixable errors** (missing PO, absent receipt, unclear contract source): trigger a human `interrupt()` / manual-input step and mark the package incomplete until resolved.

### Data Integrity Agent

- **FR-004 (P0)**: The system MUST flag invoices with extraction confidence below a configurable threshold (default 0.95) as requiring manual review.
- **FR-005 (P0)**: The system MUST detect suspected duplicates across entities using at least: exact Invoice ID match and a heuristic match (vendor + amount + date) and provide links to candidate invoices.
- **FR-006 (P1)**: The system SHOULD detect vendor remit-to changes relative to historical ERP/vendor data and flag as a potential fraud risk.

### Operational Agent

- **FR-007 (P0)**: The system MUST perform 3-way match when PO and receipt/receiver data are available and classify mismatches (price/qty/receipt missing).
- **FR-008 (P1)**: The system SHOULD generate a draft “credit memo request” message when a price variance is detected beyond policy threshold.

### Budget & Policy Agent

- **FR-009 (P0)**: The system MUST block approval completion when mandatory dimensions (e.g., department/location/class) are missing, unless a privileged override is used with a reason.
- **FR-010 (P0)**: The system MUST enforce segregation-of-duties rules so configured roles (requester/approver/payer) are distinct for a transaction.
- **FR-011 (P1)**: The system SHOULD compute real-time budget burn-down from ERP data where budgets are supported and expose a “budget confirmed / at risk / unknown” status.

### Treasury Agent

- **FR-012 (P1)**: The system SHOULD recommend a payment rail based on policy and merchant context (e.g., card vs ACH) and include rationale in evidence.
- **FR-013 (P1)**: The system SHOULD detect early payment discount terms and compute an ROI estimate based on configured cost-of-capital inputs.

### Contract Anchor

- **FR-014 (P0)**: The system MUST validate service period dates against contract validity dates when contract data exists; otherwise mark as Unknown (do not guess).
- **FR-015 (P0)**: The system MUST track cumulative spend vs contract cap (TCV) and flag breaches with computed delta and evidence sources.

### Audit & permissions

- **FR-016 (P0)**: The system MUST write an immutable, human-readable audit note into the invoice thread capturing: key checks, outcomes, and confidence.
- **FR-017 (P0)**: The system MUST NOT create net-new ERP master data (vendors, GL codes, dimensions) and MUST label any such needs as `TBD-with-Eng`.
- **FR-018 (P1)**: The system SHOULD support reason-coded overrides and log overrides with actor identity and timestamp.

## 14. Acceptance criteria (P0 mapping)

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
- **AC-011 (FR-003A)**: Given multiple plausible evidence candidates exist, when an agent cites one, then the selected record has passed retriever + re-ranker selection and the candidate rationale is available for audit.
- **AC-012 (FR-003B)**: Given Treasury and Budget/Policy recommendations conflict, when the package is synthesized, then the Critique Agent flags the conflict and the Risk Badge cannot show “Approve” until the conflict is resolved or overridden.
- **AC-013 (FR-003C)**: Given a user-fixable missing-data error occurs, when orchestration handles it, then the workflow pauses for human input rather than silently completing with a misleading package.

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

## 17. Non-functional requirements

- **Security & privacy**: Treat financial/PII fields as sensitive; avoid leaking full bank/payment details into audit notes.
- **Reliability**: Partial failures must degrade safely using the error taxonomy in FR-003C; never “hide” missing evidence.
- **Performance**: Approval package should render within a target SLA (`TBD-with-Eng`), with progressive disclosure while checks run.
- **Auditability**: Logs must be tamper-evident and attributable (human vs agent identity).

## 18. Rollout & operations

- **Phase 0 (prototype)**: Wizard-of-Oz evidence generation, validate UX + trust.
- **Phase 1 (pilot)**: Construction customers, human-approval only, limited agent set (Data Integrity + Operational).
- **Phase 2**: Expand to Budget/Policy depth and Contract/Treasury evidence (only if pilot quality thresholds and data-source reliability are met); add admin configurability. (Aligned to [`PRD.md`](./PRD.md) §18.)
- **Feature flags**: Per-tenant enablement; per-agent enablement; per-threshold configuration.

## 19. Open questions

1. Where is the contract source-of-truth for initial customers (procurement suite vs ERP attachments vs document store)?
2. Which ERP-specific budget objects should be supported first (NetSuite vs Intacct), and what are the fallbacks?
3. What is the acceptable false-positive rate for duplicate and mismatch flags?
4. Where should “immutable reasoning logs” live (invoice comments vs dedicated audit panel) to satisfy auditors?
5. What SoD rules are required per compliance regime (SOC2 vs HIPAA) and how tenant-configurable should they be?

