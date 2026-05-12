# PRD working files: Agentic Approval Workflow

**Initiative slug:** `agentic-approval-workflow`  
**Status:** Draft  
**Last updated:** 2026-05-12  

**Short read:** start with [`00-executive-summary.md`](./00-executive-summary.md); use [`PRD.md`](./PRD.md) for full build detail.

## How to read this bundle

| File | Contents |
|------|----------|
| `demo/index.html` | **Clickable HTML prototype** (approver + AP clerk surfaces, states, evidence tabs) — open in a browser |
| `00-executive-summary.md` | **One-page** exec read: problem, recommendation, why Stampli, ~90-day slice, pilot metrics/gate, top risks, pointers to full docs |
| `01-narrative.md` | Opportunity, market/strategy, personas, proposed solution, automation vs human, screen examples, impact/metrics, risks, prototype |
| `02-requirements.md` | User stories, functional requirements, acceptance criteria, analytics, NFRs, rollout, open questions |
| `appendix-competitive.md` | **PRD Appendix A** — competitive analysis (includes its own council review when run) |
| `appendix-synthetic-user-research.md` | **PRD Appendix B** — synthetic personas + simulated sessions + themes (includes its own council review when run) |
| `appendix-council.md` | Council verdict on the full PRD and resulting changes (see PRD §23) |

## Initiative summary

The **Agentic Approval Workflow** introduces a “Council of Agents” that performs **concurrent, specialized audits** on an invoice (data integrity, operational matching, budget/policy, treasury) and packages the results into a **single, high-signal approval experience** (**Risk Badge** + **Audit Note** / evidence drill-down) to reduce manual box-checking while strengthening ERP integrity and compliance.

## Inputs and assumptions

- **Product / platform**: Stampli **AP + P2P** surfaces (invoice approval + PO/contract context).
- **Target segment**: Industries with complex, multi-entity approval chains (starting with **construction** because directional benchmark data shows longer approval durations there).
- **Autonomy policy (v1)**: **Human approves**; system provides evidence and recommended action. No autonomous posting/paying in v1.
- **Initial success metrics**:
  - **Median time to approve/decline** (and by exception type)
  - **Agent-aided “one-tap decision” rate** (decision without back-and-forth)

## AI usage (this PRD)

- Ran prerequisite passes (competitive analysis and synthetic research) and persisted them as appendices.
- Ran the PRD council review and persisted the verdict in `appendix-council.md`.
- **Limits**: Claims about Stampli internals and ERP APIs are avoided; any implementation-level details are marked `TBD-with-Eng`. Synthetic research is explicitly not empirical.

