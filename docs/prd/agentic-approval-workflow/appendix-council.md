# Appendix: Council review — Agentic Approval Workflow PRD

**PRD placement:** See [`PRD.md`](./PRD.md) §23.

## Run metadata

- **Council run date**: 2026-05-11
- **Artifact reviewed**: `docs/prd/agentic-approval-workflow/PRD.md`
- **Question**: Is this PRD correctly scoped for a human-in-the-loop v1, and what should be changed before pilot?

---

## Advisor outputs (condensed)

### Contrarian

- Biggest risks: compliance theater (controls still open), false-positive overload, and ERP/contract data fragility causing too many Unknown states.
- Overpromised areas: “one-tap decisioning” without hard quality thresholds and provenance enforcement.
- Proposed cut for v1: postpone Treasury + advanced Contract Anchor if source-of-truth is not production-grade.

### First Principles Thinker

- Reframed problem: not “many checks,” but “approver cannot reach calibrated confidence fast.”
- Minimum viable solution: deterministic checks + single decision surface + immutable attributable record.
- Structural improvement: add pre-committed kill metric to avoid sunk-cost continuation.

### Expansionist

- Upside: establish a durable “decision velocity + defensible control” position.
- Platform adjacency: reusable evidence graph and policy center across approvals, payments, procurement.
- Strategic investment now: provenance layer, policy configurability, and strong pilot telemetry.

### Outsider

- Clarity issues: acronym density and jargon can hide autonomy boundary.
- Misread risk: “agentic” may be interpreted as autonomous without explicit upfront human-control statement.
- Simplification ask: add glossary/TL;DR and stronger plain-language framing.

### Executor

- Practical v1: evidence package + two agents (Data Integrity + Operational) first.
- Blockers: contract source-of-truth, ERP variability, policy/legal defaults, audit-log architecture.
- 30-60-90 plan: build core, run pilot with 3-5 customers, tune thresholds weekly, then expand.

---

## COUNCIL VERDICT

### 1) Where the council agrees

- Keep v1 **human-decision-first**; do not imply autonomous posting/paying.
- Optimize for one clear decision surface with explainable evidence.
- Treat provenance, auditability, and false-positive calibration as first-order requirements.
- Use phased rollout with hard pilot metrics from day one.

### 2) Where the council clashes

- **Scope breadth**: expansion upside vs narrow execution-first v1.
- **Timing of Contract/Treasury**: include early for differentiation vs defer until data quality is proven.

### 3) Blind spots identified

- Need explicit quantitative quality gates (e.g., false-positive ceiling).
- Need a formal “when unsure” policy by check type.
- Need explicit glossary and plain-language layer for non-finance approvers.

### 4) Recommendation

Proceed, but gate v1 on:

1. **Single decision UX** (Risk Badge + Audit Note + drill-down provenance).  
2. **Narrow agent scope first** (duplicate + 3-way mismatch + policy/SoD essentials).  
3. **Hard quality and ROI criteria** agreed before pilot expansion.  
4. **Explicit audit architecture decision** (immutable storage approach, retention, access controls).

### 5) The one thing to do first

Run a Wizard-of-Oz pilot with 5-8 target users and pre-committed success/fail thresholds (decision-time reduction and trust/override outcomes) before adding additional agent domains.

---

## Changes after council (latest run)

- Keep `13.0` parented by domain with one table structure and user-story/XD/Eng linkage.
- Preserve human-control language and avoid “autonomous” ambiguity in v1 copy.
- Maintain phased rollout emphasis and metric-driven pilot gating in roadmap sections.

