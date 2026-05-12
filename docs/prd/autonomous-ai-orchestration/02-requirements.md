# 02 — Requirements: Autonomous AI Orchestration

**Status:** Planning draft — discovery open

---

## 12. User stories & flows (*draft*)

1. **As an** AP operator, **I want** all policy and integrity checks to run in one council view on the invoice **so that** I do not chase tabs, email, and ERP separately.  
2. **As a** casual approver, **I want** to be interrupted only when something fails policy **so that** I can stay under the 30-second approval target when the invoice is clean.  
3. **As a** controller, **I want** SoD and budget violations blocked with a clear narrative **so that** audits and quarter-close are defensible.  
4. **As** treasury, **I want** payment-rail and early-pay recommendations on eligible invoices **so that** I can choose execution with full invoice context.  
5. **As an** auditor, **I want** every agent reasoning step on the invoice thread **so that** I can reconstruct decisions for SOC 2 / HIPAA.

**Flow (high level)**

1. Invoice enters workspace → Council **scheduled** (concurrent agents).  
2. Agents read ERP/portal/contract sources per permissions.  
3. Engine aggregates: **All pass** → touchless-eligible path (*policy: post vs prepare — TBD*).  
4. Any **Red Flag** → HITL panel with suggested resolution; no silent block without explanation.  
5. Pre-post **ERP validation** (inactive vendor/GL → block).  
6. Optional: Slack/Teams ping for intangible service confirmation before pay path.

---

## 13. Functional requirements (*draft IDs*)

| ID | Priority | Requirement |
|----|----------|-------------|
| FR-001 | P0 | System runs **Data Integrity**, **Operational**, **Budget & Policy**, and **Treasury** agent evaluations for each invoice in scope (define scope: new ingest only vs all open). |
| FR-002 | P0 | Duplicate detection evaluates **cross-entity** history using invoice ID and **[Vendor + Amount + Date]** composite per framework. |
| FR-003 | P0 | Billy confidence for GL and Entity: if **&lt; 0.95**, route to **manual review** state and surface on council strip. |
| FR-004 | P0 | Vendor health pulls **W-9** and **Remit To** freshness from Vendor Portal; expired/missing blocks per existing vendor policy (*align with vendor management product*). |
| FR-005 | P0 | Operational Agent performs **3-way match** against ERP PO and receipt/receiver data when present. |
| FR-006 | P1 | Contract alignment compares line pricing and **service periods** to CLM or ERP contract metadata when Contract Anchor is configured. |
| FR-007 | P0 | Price variance **&gt; 2%** triggers secondary review / Red Flag (not silent). |
| FR-008 | P1 | Budget Agent queries **real-time** ERP budget consumption; flags when bill pushes department/project over **quarterly** budget (*define fiscal calendar TBD*). |
| FR-009 | P0 | Dimension validation enforces mandatory ERP dimensions and consistency rules with vendor type (*rule table TBD with Eng*). |
| FR-010 | P0 | SoD: requester, approver, and payer must be **distinct** personas per configured role model. |
| FR-011 | P1 | Treasury Agent outputs **payment rail recommendation** and rationale (non-binding until human executes payment). |
| FR-012 | P1 | Treasury Agent surfaces **early pay** discount terms and ROI vs cost of capital (*data inputs TBD*). |
| FR-013 | P0 | Contract Anchor: if **(Current Bill + YTD Spend) &gt; TCV**, initiate **Budget Variance** workflow (not standard approval only). |
| FR-014 | P1 | Contract Anchor: validate invoice **service period** within contract **valid dates**. |
| FR-015 | P1 | When rate &gt; contracted rate, system **drafts** Stampli Chat message to vendor requesting credit memo; **human send vs auto-send** — `TBD-with-Legal`. |
| FR-016 | P0 | Touchless eligibility: only when confidence **≥ 0.95**, variance **≤ 0.02**, budget **OK** — all must be true (*posting semantics: TBD*). |
| FR-017 | P0 | Red Flag UX: always show **Anomaly + Suggested Resolution** actions. |
| FR-018 | P0 | Append **immutable** agent reasoning log entries to invoice Chat with **user vs agent** attribution and timestamp. |
| FR-019 | P0 | Before post: **real-time** ERP check that vendor and GL are **active**; block with council-visible reason if not. |
| FR-020 | P2 | For configured intangible categories, ping **Slack/Teams** service recipient; block pay path until confirmation or timeout policy (*TBD*). |

---

## 14. Acceptance criteria (*P0 sample*)

- **FR-002:** Given two invoices with same vendor+amount+date across different entities, When integrity agent runs, Then both appear linked in Red Flag or duplicate workflow with cross-reference UI.  
- **FR-003:** Given Billy GL confidence 0.94, When council completes, Then invoice cannot enter touchless-eligible state and manual review reason shows **confidence**.  
- **FR-010:** Given same user holds payer and sole approver role, When SoD check runs, Then post/pay path is blocked with explicit SoD message.  
- **FR-019:** Given GL deactivated in ERP after invoice coded, When user attempts post, Then save/post is blocked and ERP error is visible on invoice.

---

## 15. Experience & content

- Terminology: **Council**, **Agent**, **Red Flag**, **Touchless-eligible** (not "auto-approved" until policy clear).  
- Empty states: first-time user sees **what agents do** in one tooltip tour.  
- Error copy must never imply Billy **posted** without human if policy is one-click post.

---

## 16. Analytics & instrumentation (*draft*)

- Events: `council_started`, `agent_completed` (agent_type, duration_ms, outcome), `red_flag_raised` (reason_code), `suggested_resolution_clicked`, `touchless_eligible_reached`, `post_blocked_erp_validation`, `credit_memo_draft_created`.  
- Properties: `entity_id`, `invoice_id`, `confidence_scores` (aggregated, not sensitive payload in logs per privacy review).

---

## 17. Non-functional requirements

- **Security / privacy:** Agent logs must respect field-level redaction for HIPAA tenants; treasury recommendations must not leak unrelated vendor data.  
- **Performance:** Define p95 council completion SLA *TBD*; degrade gracefully if CLM timeout.  
- **Reliability:** Partial agent failure must not deadlock invoice—surface **degraded council** state.  
- **Accessibility:** Council strip and Red Flag panel WCAG target *TBD* with Design.

---

## 18. Rollout & operations

- Feature flag per agent class + global kill switch.  
- Pilot: **NetSuite** customers with contract metadata available *TBD count*.  
- Support runbook: how to interpret agent codes and override paths (*TBD*).

---

## 19. Open questions (*owners TBD*)

1. **Autonomous Posting vs HITL:** Final policy on whether any invoice can **post** without a human confirmation step.  
2. **Credit memo Chat:** Draft-only vs automated send; vendor consent and email domain policies.  
3. **TCV and YTD source:** Which ERP objects and for which editions (NetSuite first).  
4. **Concurrent vs sequential approvers:** Does Council **replace** linear approvers or **gate before** the human chain?  
5. **CLM scope:** Which integrations v1 (or contract-in-ERP only).  
6. **Threshold configurability:** Per entity, per vendor class, or global only?  
7. **Slack/Teams:** Which OAuth tenant model and opt-in UX.
