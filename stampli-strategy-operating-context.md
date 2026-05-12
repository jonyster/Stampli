# Stampli — strategy, architecture, and operating context (early 2026)

**Purpose:** PM/engineering context for Cursor skills, PRDs, and feature work.  
**Source:** Synthesized from product positioning, technical architecture, and market strategy as provided by the team (not an official Stampli publication). Reconcile with internal wikis when in doubt.

**Public capability map (separate):** [stampli-context-capabilities.md](stampli-context-capabilities.md)

**Autonomous AI Orchestration (PRD input):** [stampli-autonomous-ai-orchestration-framework.md](stampli-autonomous-ai-orchestration-framework.md) — Council of Agents, Contract Anchor, touchless thresholds, audit protocols. Working PRD folder: [docs/prd/autonomous-ai-orchestration/](docs/prd/autonomous-ai-orchestration/).

---

## Strategy and product

| Topic | Direction |
|-------|-----------|
| **12–24 month shift** | From **AP depth** (invoice processing) toward **full P2P breadth**. |
| **Strategic pillars** | **Procurement** (upstream control), **AP automation** (core logic), **Payments / corporate cards** (execution). |
| **ICP** | Mid-market to lower-enterprise (**~200–2,000 employees**), **complex routing**, **multi-entity**. |
| **Anti-ICP** | Micro-businesses (simple flows → BILL/Melio); massive conglomerates needing **heavy global mass-pay / multi-currency tax withholding** (e.g. Tipalti-class positioning cited as loss driver). |
| **Differentiation (3)** | (1) **Invoice-centric workspace** — chat, documents, decisions on the invoice. (2) **Billy** — AI as co-worker (**~86%+** coding/routing), not OCR-only. (3) **ERP-native alignment** — mirror ERP logic (e.g. NetSuite, Sage Intacct) without forcing ERP setup change. |
| **Roadmap slice (near term)** | **Employee purchasing portal** (natural language requests); **Stampli Cards** deeper in approval flow. |

---

## Customers and GTM

| Topic | Notes |
|-------|--------|
| **Verticals / personas** | **Healthcare (HIPAA):** PHI-sensitive invoices, strict **3-way match** for supplies. **Construction / real estate:** **Trays** for project-based approvals across entities. |
| **Win themes** | Ease of use for **non-finance approvers**; **implementation speed** (weeks not months). |
| **Loss themes** | **Global mass-pay** / **multi-currency tax withholding** gaps vs some competitors. |
| **Pricing / packaging** | Subscription; **approver-only discounts** to drive org-wide adoption. |

---

## Product and UX

| Term / pattern | Meaning |
|----------------|--------|
| **Simplified View** | For casual approvers: strip GL complexity; show **invoice image**, **Billy confidence flags**, **chat history**, minimum needed to verify spend. |
| **Trays** | Team-based **work queues** for incoming invoices. |
| **Entity** | Business unit / subsidiary (critical for **NetSuite** users). |
| **Posting** | Final push of approved data to the **ERP** (after approval; see integration model). |
| **SoD** | Strict **segregation of duties**; **Payer** must not be sole **Approver** (typical pattern). |

---

## Technical and integrations

| Topic | Model |
|-------|--------|
| **ERP priority (Tier 1)** | **Oracle NetSuite**, **Sage Intacct**, **Microsoft Dynamics (365 BC / GP)**. |
| **Source of truth** | **ERP as system of record**; CoA and dimensions pulled **in real time**. |
| **Sync timing** | Generally **post-approval**, **pre-payment**, so financial record is correct before money moves. |
| **Internal SoT labels** | **Bridge** docs — on-prem ERPs; **API / cloud-to-cloud** — NetSuite, Intacct, etc. |
| **AI / Billy boundaries** | **HITL is mandatory.** Billy may **predict** and **suggest**; **cannot Post or Pay** without explicit authorized human action. |

---

## Compliance and risk

| Area | Notes |
|------|--------|
| **Attestations** | **SOC 2 Type II**, **PCI-DSS** (cards), **HIPAA + BAA** (healthcare; cited as 2026 differentiator). |
| **Data / audit** | PII and financial fields treated for **audit readiness**; field changes **timestamped** with **user or AI** identity. |

---

## How you ship

| Topic | Definition of done |
|-------|---------------------|
| **Engineering** | **ERP validation** — e.g. inactive GL in NetSuite → **block save** in Stampli. |
| **Design** | **“No training needed”** — non-finance approver can approve an invoice in **under ~30 seconds** (design test). |

---

## Approval logic (open product question)

The following was flagged as an **open design area** for deeper PRD/engineering work:

- **Sequential vs parallel approvals** — routing semantics when multiple approvers are in play.
- **Escalation / threshold rules** — high-value invoices, timeouts, delegations.

Treat routing requirements as **ICP-sensitive** (complex rules, multi-entity) and **SoD-sensitive** (payer vs approver, segregation).
