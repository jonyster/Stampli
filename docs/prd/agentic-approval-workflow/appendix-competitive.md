# Competitive analysis: Agentic Approval Workflow (Council of Agents)

**PRD placement:** Appendix A in [`PRD.md`](./PRD.md) §22.

## Executive summary

- The competitive “AI agent” narrative is moving from **suggestions** to **completion**, but most products keep **human final control** for approvals/posting; this aligns with our **v1 human-approval** approach.
- Differentiation opportunity for Stampli is to make approvals feel **audit-grade by default**: concurrent agent checks + explicit evidence packaged into the invoice workspace.
- **BILL and Tipalti (and peers) also market ERP connectivity**—pre-built connectors, sync, and system-of-record alignment are table stakes in mid-market AP; differentiation for this initiative is not “has ERP” alone, but **audit-grade agent evidence** packaged into the approval workspace.
- Competitors commonly talk about routing, matching, and coding; fewer make **contract-as-source-of-truth** and **multi-entity duplicate detection** first-class approval artifacts.
- For construction-heavy, multi-entity customers, the win is reduced “approval chasing” and fewer downstream ERP corrections by surfacing policy/contract/budget exceptions earlier and consistently.

## Scope recap

- **Initiative**: Council of Agents that performs specialized audits and produces “risk badges” and audit notes to accelerate human approvals and strengthen compliance.
- **Primary buyer/user**: Stampli customers (AP org + approvers); initial vertical focus: construction with complex workflows.
- **Geography/segment**: TBD; assume mid-market to lower-enterprise, multi-entity.

## Comparison dimensions (approved)

- Approval workflow flexibility (sequential/parallel rules, policies)
- Where AI fits (suggest vs complete; evidence surfaced to approver)
- Matching & exception handling (3-way match, variance workflows)
- Policy / SoD controls (roles, dual control, audit trails)
- ERP alignment / multi-entity support (system-of-record posture)

## Comparison matrix (public-info, high-level)

Legend: **Supported / Partial / Unknown** (Unknown means “not confidently supported by public sources used here”).

| Product | Approvals workflow | Where AI fits | Matching & exceptions | Policy/SoD & audit | ERP alignment / multi-entity |
|---|---|---|---|---|---|
| **Stampli** | Supported (predefined approval workflows; workflow builder) | Supported (Billy positioned as AI employee; routing/coding assistance) | Supported (2/3-way PO match; exception surfacing) | Supported (audit trail, controls themes) | Supported (ERP-native alignment across many ERPs) |
| **Tipalti** | Supported (invoice approval workflow + routing narrative) | Partial (AI discussed; “agents” positioning varies by page) | Supported (3-way matching described) | Partial (controls described, specifics vary) | Supported (pre-built ERP/AP integrations—e.g. NetSuite, Sage Intacct—plus APIs); Partial (multi-entity/construction-specific “audit artifact” posture vs depth of public messaging) |
| **BILL** | Supported (approval workflows + approval policies) | Supported (Invoice Coding Agent; “AI completes work” narrative) | Partial (varies by product; approvals focus is clear) | Supported (controls + audit trail positioning) | Supported (broad accounting/ERP integrations—e.g. NetSuite, Intacct, QuickBooks, Xero, Sage—with sync/posting narratives); Partial (how “council-of-agents”-style concurrent audit evidence shows up in approval UX is less explicit in sources used here) |
| **AvidXchange** | Supported (invoice approval workflow positioning) | Supported/Partial (announced AI agents; approval agent focuses on likelihood insights) | Supported/Partial (PO matching agent described) | Partial (human oversight emphasized; audit specifics unclear) | Partial (ERP integration improvements announced) |

## Deep dives (what matters for this PRD)

### Stampli (baseline)

- Predefined approval workflows emphasize configurable routing based on invoice fields. Source: `https://www.stampli.com/predefined-approval-workflows/`
- Stampli messaging (Billy / P2P AI employee) positions AI as assisting with routing/coding and reducing manual work. Source: `https://www.stampli.com/p2p-ai-employee/`
- Stampli explicitly argues “touchless AP” is often unrealistic in complex environments; this supports a **human-approval v1** with strong evidence packaging. Source: `https://www.stampli.com/blog/accounts-payable/touchless-ap-myth/`

### Tipalti (workflow framing + ERP)

- Public content describes invoice approval workflow steps including verification, 3-way matching, exception handling, and routing to approvers. Source: `https://tipalti.com/resources/learn/invoice-approval-workflow/`
- Tipalti publicly positions **pre-built ERP and accounting integrations** (including NetSuite and Sage Intacct) as part of AP automation, not only payments. Sources: `https://tipalti.com/product/integrations/erp/` · `https://tipalti.com/product/integrations/netsuite/`

### BILL (AI completes work + approval policy surface + ERP)

- BILL emphasizes reducing workflow friction and shipped an “Invoice Coding Agent” in early 2026; approval policies and workflows are also documented. Source: `https://www.bill.com/blog/new-at-bill-january-march-2026`
- BILL maintains a **broad integrations catalog** for accounting/ERP systems (e.g. NetSuite, Intacct, QuickBooks, Xero, Sage) with AP sync and matching narratives tied to the system of record. Sources: `https://www.bill.com/integrations` · `https://www.bill.com/integrations/netsuite`

### AvidXchange (agent language in AP)

- AvidXchange publicly discussed launching AI agents for AP processes (including approval/PO matching). Source: `https://www.avidxchange.com/press-releases/avidxchange-unveils-new-ai-agents-to-elevate-accounts-payable-processes/`

## Differentiation opportunities (for Stampli)

1. **Council-of-agents as an approval artifact, not a back-office feature**  
   Turn “checks” (duplicate/vendor/budget/contract) into an explicit, approver-readable **Risk Badge** and **Audit Notes** on the invoice workspace.

2. **Contract Anchor as a first-class constraint**  
   Make contract cap, service period, and renewal signals part of approval evidence. Many competitors emphasize workflow steps but not contract-as-source-of-truth as strongly.

3. **Construction-grade multi-entity audit**  
   Multi-entity duplicate detection and project/budget enforcement fit complex construction approvals and reduce cross-entity leakage.

4. **Human-control-first posture**  
   Position v1 as “agentic evidence + one-tap human decision,” which aligns with compliance expectations and reduces overpromising.

## Risks and blind spots

- Public sources often blur “AI marketing” vs product reality; PRD must label **Unknown** rather than assume competitor capabilities.
- Competitive claims should not rely on a single blog post; for launch readiness, expand with additional sources (docs, release notes).
- “Autonomy” terminology can trigger compliance concerns; using “agentic audits” + “human decision” may avoid misinterpretation.

## Sources (primary URLs used)

- Stampli predefined approval workflows: `https://www.stampli.com/predefined-approval-workflows/`
- Stampli Billy / AI employee: `https://www.stampli.com/p2p-ai-employee/`
- Stampli “touchless AP myth” (agentic framing): `https://www.stampli.com/blog/accounts-payable/touchless-ap-myth/`
- Tipalti invoice approval workflow: `https://tipalti.com/resources/learn/invoice-approval-workflow/`
- Tipalti ERP integrations hub: `https://tipalti.com/product/integrations/erp/`
- Tipalti NetSuite integration: `https://tipalti.com/product/integrations/netsuite/`
- BILL releases (Jan–Mar 2026): `https://www.bill.com/blog/new-at-bill-january-march-2026`
- BILL accounting/ERP integrations: `https://www.bill.com/integrations`
- BILL NetSuite integration: `https://www.bill.com/integrations/netsuite`
- AvidXchange AI agents press release: `https://www.avidxchange.com/press-releases/avidxchange-unveils-new-ai-agents-to-elevate-accounts-payable-processes/`

## Appendix: Council review

Council review to be run on this appendix during PRD council pass; see `appendix-council.md` for the full-PRD verdict and changes.

