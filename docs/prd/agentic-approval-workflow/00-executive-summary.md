# Executive summary — Agentic Approval Workflow

| Initiative | Agentic Approval Workflow (Council of Agents) |
|------------|-----------------------------------------------|
| **Audience** | Exec / hiring review / GTM (short read) |
| **Status** | Draft |
| **Last updated** | 2026-05-12 |
| **Full PRD** | [`PRD.md`](./PRD.md) (build basis) · [`01-narrative.md`](./01-narrative.md) (story + screens) |

---

## Problem

In complex AP and P2P (especially **construction**, our first vertical because available benchmark data shows unusually long approval durations), approvers spend time hunting facts across policy, contracts, PO/receipt match, duplicates, vendor integrity, and cash context. That slows decisions, creates inconsistent compliance, and drives ERP rework.

## Recommendation (what we build)

Ship an **evidence-first approval package** inside the invoice workspace: a **Council of Agents** runs specialized checks in parallel and returns one surface — **Risk Badge** + **Audit Note** + **evidence drill-down** with citations and provenance. **V1:** humans always **approve or decline**; no autonomous posting or paying. **Model stance:** RAG + tools for facts; fine-tuning only for DS-gated sub-tasks ([`PRD.md`](./PRD.md) FR-031).

## Why this matters for Stampli

- **Differentiation:** Makes the invoice thread the system where audit-grade evidence lives, not a generic “AI side panel.”
- **ERP-native fit:** Agents read and explain ERP truth; they do not replace the system of record.
- **P2P breadth:** Pulls contract, match, budget, and treasury context into one decision without re-platforming the customer.
- **Competitive clarity:** Major peers also market accounting/ERP integrations; the wedge is **agent-packaged approval evidence** on the invoice surface, not connectors alone ([`appendix-competitive.md`](./appendix-competitive.md)).

## ~90-day path (aligned to rollout in `PRD.md` §18)

| Window | Focus | Outcome |
|--------|--------|--------|
| **~Month 1** | **Phase 0 — prototype** | Clickable approver UX + Wizard-of-Oz evidence; validate trust and “one surface” value ([`PRD.md`](./PRD.md) §11 invalidation criteria). |
| **~Month 2** | **Pilot readiness** | Core v1 scope wired: **Data Integrity + Operational + minimum policy gates**; analytics baselines; feature flags; LCPO sign-offs started ([`PRD.md`](./PRD.md) §19). |
| **~Month 3** | **Private pilot** | **3–5 construction customers** ([`PRD.md`](./PRD.md) §20.4); weekly reviews vs **§9.1** gates; calibration; **go / pause / narrow scope** before Phase 2 (budget/contract/treasury depth). |

## Success metrics & pilot gate

**Primary:** median **time to approve/decline**; **agent-aided one-tap decision rate** (decision without back-and-forth).

**Pre-committed pilot thresholds ([`PRD.md`](./PRD.md) §9.1):** (A) ≥**60%** faster median time vs baseline; (B) ≥**20%** improvement in one-tap rate; (C) duplicate/mismatch false-positive rate ≤**15%** after tuning; (D) override rate for P0 checks below agreed ceiling (`TBD-with-PM/Compliance`). **If two or more fail** after the calibration window → **pause rollout** and cut scope to core checks until recovered.

## Top risks (headlines)

Trust vs autonomy (keep humans on the decision); false-positive fatigue on duplicates/variance; **contract source-of-truth** ambiguity; **ERP variability** on budget/dimensions; **audit/evidence logging** and redaction for sensitive fields.

## Where to go next

- **Screens & UX narrative:** [`01-narrative.md`](./01-narrative.md) §8–9 · baseline product shots: [`baseline-screens/README.md`](./baseline-screens/README.md)  
- **Requirements & AC:** [`PRD.md`](./PRD.md) §13–14 · [`02-requirements.md`](./02-requirements.md)  
- **Market / competitors / council process:** [`appendix-competitive.md`](./appendix-competitive.md) (PRD Appendix A) · [`appendix-synthetic-user-research.md`](./appendix-synthetic-user-research.md) (PRD Appendix B) · [`appendix-council.md`](./appendix-council.md)
