# Synthetic user research: Agentic Approval Workflow

**PRD placement:** Appendix B in [`PRD.md`](./PRD.md) §24.

**Banner:** Synthetic simulation — **not** validated with live users.

## Research plan recap

- **Objective**: Refine the problem statement and validate whether “Council of Agents” evidence packaging reduces manual approval effort without reducing trust/control.
- **Feature / problem**: Approvals require manual box-checking across duplicates, PO/receipt alignment, contract constraints, budget/policy, and payment choice. The goal is to surface **audit-grade evidence** and produce a **one-tap decision** for humans.
- **Personas (approved)**:
  - AP Specialist / Clerk
  - Project / Department Budget Owner (Approver)
  - Treasury
- **Scenarios (approved)**:
  - Multi-entity duplicate detected
  - 3-way match mismatch with variance workflow
  - Contract cap (TCV) breach / overage approval
- **Feedback lens (user priority)**: trust/control, compliance, speed

## Persona cards

### 1) “Maya” — AP Specialist / Clerk (synthetic)

- **Goals**: Keep invoices moving; reduce back-and-forth; avoid posting errors; keep vendors paid.
- **Pains**: Chasing approvers; missing PO/receipt docs; unclear exceptions; “who should approve” confusion.
- **Success metrics**: time-to-approval, exception resolution time, fewer re-posts/credit memos.
- **ERP/finance literacy**: high (lives in invoice coding and matching).
- **Quote (synthetic)**: “If I had one place that told me what’s wrong and who can fix it, I’d stop playing email ping-pong.”

### 2) “Jordan” — Project Budget Owner / Approver (construction) (synthetic)

- **Goals**: Approve quickly without risk; ensure spend matches contract/SOW and project budget.
- **Pains**: Doesn’t understand GL; lacks context; fears approving fraud/overages; time pressure.
- **Success metrics**: decision time, fewer surprise overruns, fewer escalations.
- **ERP/finance literacy**: medium (understands budgets/contracts, not accounting details).
- **Quote (synthetic)**: “Tell me if it’s on contract, on budget, and actually delivered—then I’ll approve in 10 seconds.”

### 3) “Avery” — Treasury (synthetic)

- **Goals**: Optimize cash; capture discounts; select payment rails; reduce risk in payables.
- **Pains**: Approvals arrive late; discount windows missed; payment method not aligned to policy.
- **Success metrics**: discount capture rate, cash forecasting accuracy, fewer urgent payments.
- **ERP/finance literacy**: high.
- **Quote (synthetic)**: “I don’t need more dashboards—I need approvals to include the cash implications.”

## Session guide (10–15 questions)

1. Walk me through a “good” approval vs a “risky” approval for your role.
2. What is the most frequent reason you delay approvals?
3. What evidence do you need to approve a services invoice confidently?
4. When a mismatch happens (qty/price/receipt), what do you do today?
5. What’s the worst duplicate/fraud incident you worry about?
6. Would you trust an AI-generated “risk badge”? What would make it credible?
7. Which checks must be non-negotiable for compliance (SoD, dimensions, vendor verification)?
8. How should the system behave when it is unsure? (Escalate? Ask questions? Block?)
9. What “one-tap approve” would require to feel safe?
10. How should evidence be shown (summary vs drill-down)?
11. What notifications are helpful vs noisy?
12. What should be configurable by admins vs fixed by policy?
13. What would make you reject this feature?

## Simulated sessions (synthetic)

### Scenario A: Multi-entity duplicate detected

**AP Clerk — summary reaction**  
Loves the pre-payment duplicate flag but insists the evidence must be concrete (“same vendor + amount + date across entities” with links). Wants a simple disposition: “duplicate confirmed” vs “legitimate recurring invoice.”

**What works**: Links to suspected duplicates; clear confidence; suggested next step (“request vendor confirmation” template).  
**What breaks/worries me**: False positives create extra work; needs quick override with reason code.  
**Desired outcome/workaround**: A “duplicate case” view with side-by-side invoices and an audit note.

**Approver — summary reaction**  
Wants a single sentence: “Duplicate risk detected across entity X and Y; evidence: invoice IDs match.” Won’t chase details.

**Treasury — summary reaction**  
Wants the workflow to ensure duplicates are stopped **before payment scheduling**, not after approval.

### Scenario B: 3-way match mismatch (price variance)

**AP Clerk — summary reaction**  
Needs the system to propose: “send back to procurement,” “draft credit memo request,” or “approve with variance reason.” Prefers structured exception codes.

**Approver — summary reaction**  
Approves if the agent explains whether the variance is within policy threshold and references PO/receipt proof.

**Treasury — summary reaction**  
Not the primary owner, but cares because mismatch delays payment and can affect discount capture windows.

### Scenario C: Contract cap breach (TCV)

**AP Clerk — summary reaction**  
Wants contract data attached to the invoice; otherwise it becomes a new chase. Needs the system to be explicit when contract is unknown.

**Approver — summary reaction**  
Would escalate if the agent clearly states: “Current invoice + YTD spend exceeds contract cap by $X; requires overage approval.” Wants a link to contract/SOW.

**Treasury — summary reaction**  
Wants early warning when caps are close and a view of upcoming liabilities to plan cash.

## Synthesized themes (hypotheses)

- **Theme: Trust requires evidence + transparency**  
  - **Evidence**: All personas ask for drill-down and concrete links.
  - **Severity**: High
  - **Product response**: Risk Badge must include “why” + “source” + “confidence,” not just a score.

- **Theme: Approvers want a single “safe to approve?” answer**  
  - **Severity**: High
  - **Response**: One-tap decision UI with concise audit note + ability to expand.

- **Theme: False positives create more work than the status quo**  
  - **Severity**: High
  - **Response**: Calibrated thresholds, clear “uncertain → ask human” behavior, and reason-coded overrides.

- **Theme: Treasury wants approvals to include cash implications**  
  - **Severity**: Medium
  - **Response**: Payment rail recommendation and discount capture callouts as optional evidence blocks.

## Questions for real research (non-synthetic)

1. For construction customers, which exceptions drive the most approval delay (duplicates, receipts, SOW mismatch, budget, vendor changes)?
2. What evidence is required for SOX/SOC2 audits and who needs to see it (AP vs controller vs approver)?
3. What is the acceptable false-positive rate for duplicate/fraud flags before users disengage?
4. How do customers define “contract source of truth” (DocuSign, SharePoint, ERP vendor record, procurement suite)?
5. Where should agent evidence live (invoice comments vs separate audit panel) to satisfy auditors?

## Limitations

These sessions are synthetic simulations and may reflect bias in assumptions and framing. They do not provide statistical validity, cannot predict adoption, and should not replace interviews with AP clerks, controllers, and budget owners in the target verticals (construction, healthcare, multi-entity orgs).

## Appendix: Council review

Council review to be run on this appendix during PRD council pass; see `appendix-council.md` for the full-PRD verdict and changes.

