# 01 — Narrative: Autonomous AI Orchestration

**PRD slice:** Product narrative (sections 2–11)  
**Inputs:** [stampli-autonomous-ai-orchestration-framework.md](../../../stampli-autonomous-ai-orchestration-framework.md), [stampli-strategy-operating-context.md](../../../stampli-strategy-operating-context.md)

---

## 2. The opportunity

Finance teams drown in **serial approvals** while risks (duplicates, contract leakage, budget overruns, weak SoD) surface **late**. Stampli already wins on the **invoice-centric workspace** and **Billy** for coding and routing. The opportunity is to **orchestrate policy checks concurrently**—a **Council of Agents**—so humans see **only exceptions** with **actionable resolutions**, not another queue of raw tasks.

**Why now:** Strategic shift toward **full P2P breadth** and pressure to scale **complex routing** and **multi-entity** ICPs without linear headcount growth.

---

## 3. Relevant market & competitive context

**Market evolution**

- Buyers expect AI to **operate** workflows, not only **suggest** fields—especially in mid-market where headcount is flat and audit expectations rise.
- **Contract-to-pay** alignment is becoming a differentiator as CLM and ERP contract data become more structured.

**Competitors / adjacent players** (*hypothesis — validate with `pm-competitive-analysis`*)

- Incumbent AP tools emphasize **workflow** and **payments**; fewer publicly emphasize **concurrent multi-auditor reasoning** with a single invoice narrative.
- **Tipalti-class** players stress **global mass-pay** and tax—Stampli’s anti-ICP for that wedge; this feature should not chase global withholding in v1.

**Where Stampli should differentiate** (*aligns with strategy doc*)

1. **Invoice as workspace** — agent reasoning appended to the same thread as humans (audit story, not a black box).
2. **ERP-native** — agents consume **live CoA/dimensions** and enforce **ERP validation** before persistence (inactive GL/vendor blocks).
3. **Billy as co-worker** — agents **amplify** Billy with explicit confidence and variance gates—not a sidecar OCR tool only.

*TBD:* Named competitor matrix and citations → `appendix-competitive.md`.

---

## 4. Why this is strategically valuable for Stampli

- **Deepens AP moat** on the core ICP (**complex routing, multi-entity**) without abandoning the **invoice-centric** story.
- **Feeds Payments / Cards** via Treasury Agent recommendations (Stampli Card vs ACH), aligned to roadmap emphasis on **cards in approval flow**.
- **Raises switching costs** through **immutable, audit-ready agent narratives** (SOC 2, HIPAA narratives).
- **Positions “orchestration”** as the product story: proactive policy, not only faster typing.

---

## 5. Personas

| Persona | Goal | How they interact with the Council |
|---------|------|--------------------------------------|
| **AP Operator** | Clean month-end, fewer surprises | Sees consolidated **Red Flags** + resolutions; triages exceptions. |
| **Casual approver (Simplified View)** | Approve in &lt;30s when clean | Only interrupted when council **cannot** clear touchless criteria. |
| **Finance / Controller** | SoD, budget, contract compliance | Defines thresholds; receives **Budget Variance** / TCV breaches. |
| **Treasury** | Optimize rails and discount ROI | Consumes Treasury Agent recommendations; confirms execution where required. |
| **Vendor** | Clear asks on credits/rates | Receives **drafted** Stampli Chat credit requests (*human send? TBD*). |

*TBD:* Primary persona for **v1** (pick one slice: integrity-only, operational+contract, or full council).

---

## 6. The proposed solution

**Council of Agents** (concurrent specialists) on each invoice:

1. **Data Integrity Agent** — duplicates (cross-entity), Billy confidence &lt;95% → manual path, vendor portal health (W-9, remit-to).
2. **Operational Agent** — 3-way match, contract/CLM/ERP contract alignment, **&gt;2%** price variance → secondary review.
3. **Budget & Policy Agent** — real-time budget burn-down, mandatory dimensions, **SoD** (requester ≠ approver ≠ payer).
4. **Treasury Agent** — rail recommendation (e.g. Card vs ACH), early-pay ROI vs cost of capital.

**Contract Anchor** — legal SoT: TCV vs (bill + YTD), service window vs contract dates, autonomous **draft** vendor credit memo request via Stampli Chat when rate &gt; contracted.

**Orchestration engine** — runs agents, aggregates outcomes, applies **Touchless** vs **HITL** per section 8.

---

## 7. What should be automated vs human-controlled

| Area | Automated (agent/system) | Human-controlled |
|------|--------------------------|------------------|
| Duplicate / fuzzy match scan | Run + flag | Resolve duplicate vs not; approve exception |
| Billy confidence &lt;95% | Detect + route | Correct fields or approve low-confidence post |
| Vendor W-9 / remit health | Read portal state + block | Vendor updates docs; AP overrides per policy |
| 3-way match + variance &gt;2% | Compute + flag | Approve variance or reject / rework |
| Contract period / TCV | Compare bill to contract metadata | Legal/Finance on **Budget Variance** path when over TCV |
| Credit memo ask | **Draft** Chat message | **TBD:** Human must send vs auto-send (policy/legal) |
| Budget burn-down / dimensions | Query ERP + validate | Fix coding or approve override |
| SoD | Enforce uniqueness of personas | Admin defines roles; appeals on edge cases |
| Treasury rail / early pay ROI | Recommend | Human confirms payment execution (aligns with **no Pay without human** policy) |
| Agent reasoning | Log every step to invoice thread | Read-only for audit; humans add comments |
| ERP inactive GL/vendor | Block save/post | Fix master data or alternate coding |
| Intangible service delivery | Ping Slack/Teams for confirmation | Recipient confirms receipt |

**Policy conflict to resolve in PRD v0.2**

- Framework defines **Autonomous Posting** when confidence ≥0.95, variance ≤2%, budget OK.  
- Operating context states Billy **cannot Post** without explicit human action.  
- **Resolution options:** (a) rename “touchless” to **auto-prepare for posting** + one-click human **Post**; (b) narrow autonomous posting to a **customer-opt-in** policy with Legal sign-off; (c) autonomous **ERP draft** state vs **posted**. Document decision in `02-requirements.md` Open Questions.

---

## 8. Examples of user-facing screens

### Screen A — Council status strip (invoice workspace)

- Collapsed: “**4 agents cleared** · **1 needs you**” with severity color.  
- Expanded: per-agent row — **Pass / Flag / N/A**, one-line reason, **Open detail** link.  
- Billy confidence chip on GL line when &lt;95%.

### Screen B — Red Flag resolution panel

- Headline: anomaly summary (e.g. “Rate 10% above contract”).  
- **Suggested resolution** buttons: *Request credit memo* (opens drafted Chat), *Approve variance*, *Route to Legal*.  
- Immutable **Agent log** excerpt (read-only) for audit.

### Screen C — Touchless path confirmation (*if human Post retained*)

- “All council checks passed. **Post to NetSuite?**” with summary: confidence, variance %, budget OK, SoD OK.  
- Secondary: “Post later” / “Send to approver anyway” (*TBD policy*).

*TBD:* Figma links; mobile Simplified View variant.

---

## 9. Business impact & success metrics

**Impact hypotheses**

- Lower **cycle time** for clean invoices; fewer **mis-posts** and **duplicate payments**; higher **early-pay discount capture** where Treasury Agent is used.

**Metrics** (*pick owners and baselines in PM review*)

| Metric | Type | Notes |
|--------|------|--------|
| % invoices clearing all agents touchless-eligible | Leading | Define “eligible” cohort |
| Median time from invoice ingest to ERP-ready | Leading | Split by touchless vs HITL |
| Red Flag → resolution time | Leading | |
| Duplicate / fraud near-misses caught pre-pay | Leading | |
| Approver median time (Simplified View) | Leading | Target &lt;30s when no flags |
| Posting error / reversal rate | Lagging | ERP validation correlation |
| Early-pay $ captured / ROI | Lagging | Treasury slice |

---

## 10. Key tradeoffs & risks

| Tradeoff / risk | Mitigation idea |
|-----------------|-----------------|
| **Latency** — concurrent ERP/CLM queries slow UX | Async council with skeleton UI; SLA per agent |
| **False positives** on duplicate / variance | Tunable thresholds per entity; feedback loop to Billy |
| **CLM / contract data quality** | Graceful degrade when Contract Anchor metadata missing |
| **Autonomous posting vs HITL brand promise** | Resolve explicitly; avoid silent drift from compliance messaging |
| **Vendor auto-messages** | Legal/comms review on send vs draft-only |
| **Slack/Teams dependency** | Opt-in integration; fallback to in-app ping |
| **HIPAA / PHI** on agent logs | Redaction rules for Chat-visible logs |

---

## 11. Prototype — why it strengthens the case

A prototype should **de-risk** three unknowns: (1) **latency** and perceived speed with four agent classes hitting ERP/CLM, (2) **Red Flag UX** — do approvers act faster with suggested resolutions, (3) **Contract Anchor** data availability on **Tier-1 ERPs** (NetSuite first).

**Suggested fidelity:** Backend spike + **wizard UI** on one happy path + one Red Flag path (variance &gt;2%), NetSuite sandbox, **no** true auto-post until policy resolved—use **simulated Post** or explicit demo button.

**Invalidation:** If median added latency &gt; **X seconds** (*TBD*) on ingest or approvers ignore suggested resolutions (&lt;**Y%** click-through *TBD*), narrow scope to **Integrity + Policy agents only** for v1.

---

## Assumptions (pending user confirmation)

- v1 ERP focus remains **NetSuite-first** unless you direct otherwise.  
- **Contract Anchor** metadata source is **available** in pilot customers (CLM connector or ERP contract module)—else phase Contract Anchor to v1.1.  
- **95% / 2% / budget OK** thresholds are starting points, not final legal/compliance commitments.
