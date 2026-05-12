# Stampli — public context: capabilities and documentation map

**Purpose:** Single reference for what Stampli’s public materials describe across procure-to-pay (P2P), so agents and humans can align feature work with marketed capabilities and find primary URLs.

**Related (strategy / ICP / ERP / HITL):** [stampli-strategy-operating-context.md](stampli-strategy-operating-context.md) — team-synthesized operating context for PRDs and implementation (not public marketing).

**Last synthesized:** 2026-05-11 (from live `stampli.com` pages and search-indexed help URLs).

**Disclaimer:** This is **not** an official Stampli document. Capabilities come from **public marketing and blog content** only. Internal behavior, exact UI labels, APIs, and configuration names may differ. Prefer your tenant, specs, and internal docs for implementation truth.

---

## 1. Documentation sources

### 1.1 Stampli Help Center (end-user / admin help)

| Resource | URL | Notes |
|----------|-----|--------|
| Help Center (English) | https://help.stampli.com/en/ | Hosted on **Intercom**. Automated retrieval from this environment returned **HTTP 401** for collection and article URLs during synthesis, so **article bodies were not bulk-imported** here. Use a browser while logged in (if required) or Intercom export/support for a full offline index. |

**Search-indexed examples** (use browser; URLs may change):

| Type | Example URL |
|------|-------------|
| Collection | https://help.stampli.com/en/collections/1700135-vendors |
| Article | https://help.stampli.com/en/articles/10297970-webinar-december-2024-stampli-amped-live |

**Typical Help Center themes** (from titles/snippets, not full text): vendor management, Vendor Portal, payment terms, release notes / webinars.

### 1.2 Stampli marketing & product (primary source for this file)

| Area | Hub URL |
|------|---------|
| Home / P2P positioning | https://www.stampli.com/ |
| Procure-to-pay | https://www.stampli.com/procure-to-pay/ |
| AP automation (overview) | https://www.stampli.com/ap-automation/ |
| AP platform (detailed) | https://www.stampli.com/ap-automation-platform |
| Procurement | https://www.stampli.com/procurement |
| Vendor management | https://www.stampli.com/vendor-management |
| Payments (Direct Pay) | https://www.stampli.com/payments |
| International payments | https://www.stampli.com/international-payments/ |
| Stampli Card | https://www.stampli.com/card |
| Insights (analytics) | https://www.stampli.com/insights/ |
| Advanced Search | https://www.stampli.com/advanced-search/ |
| ERP directory | https://www.stampli.com/accounting-systems-erps/ or https://www.stampli.com/erp/ |
| Policy Center (site policy hub) | https://www.stampli.com/policy-center |
| Customer support (hours, positioning) | https://www.stampli.com/customer-support |

### 1.3 Resources / blog (deep dives)

Examples useful for **invoice coding**, **approval workflows**, and AP concepts:

- https://www.stampli.com/resources/invoice-coding-and-fields-in-accounts-payable/
- https://www.stampli.com/predefined-approval-workflows/

Additional topics appear linked from AP and P2P pages (PO matching, recurring invoices, alerts, etc.)—see section 4.

---

## 2. High-level platform map

Stampli describes a **modular** stack: deployments are **centered on core AP**; procurement, payments, cards, and vendor management can be added.

```text
                    ┌─────────────────────────────────────┐
                    │     Stampli AI (“Billy”)            │
                    │  extraction, coding, routing,       │
                    │  matching, duplicate/fraud signals  │
                    └─────────────────────────────────────┘
                                        │
    ┌───────────────┬──────────────┬──────┴──────┬───────────────┬───────────────┐
    │ Procurement   │ Vendor Mgmt  │ Accounts   │ Payments       │ Stampli Card  │
    │ (requests,    │ (onboarding, │ Payable    │ (ACH, check,   │ (AP + expense │
    │  budgets, PO,  │  portal,     │ (invoice   │  vCard, intl,  │  cards in P2P)│
    │  cards, tickets)│ compliance) │ workspace) │  FX, controls) │               │
    └───────────────┴──────────────┴────────────┴───────────────┴───────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    │  ERP / accounting (system of record) │
                    │  70+ named integrations, field-level  │
                    │  alignment, bi-directional sync          │
                    └───────────────────────────────────────┘
```

**Cross-cutting themes** repeated across pages: **ERP-aligned** master data and dimensions, **controls before spend**, **immutable audit trail**, **segregation of duties**, **multi-entity**, **mobile** approvals where noted.

---

## 3. Capability catalog by product

### 3.1 Accounts Payable (core)

| Capability | Short description | Public reference |
|------------|-------------------|------------------|
| Invoice as workspace | Documents, messages, approvals consolidated per invoice | https://www.stampli.com/ap-automation-platform |
| Omni-channel capture | Email, drag-and-drop, vendor portal, CSV upload | Same |
| Trays + routing | Team-based queues; auto-route by BU, region, dept, vendor, etc. | Same |
| Stampli AI / Billy | Coding suggestions, approver prediction, line-level PO match, exception surfacing | https://www.stampli.com/ap-automation/ , ap-automation-platform |
| 2-way / 3-way PO match | Line-level matching vs PO and receipts; partials, complex charges described in FAQs | ap-automation, cognitive/AI PO matching pages |
| Dynamic approvals | ML-suggested approvers | ap-automation FAQ |
| Predefined approvals | Workflow builder, multi-criteria (e.g. up to 5 field values cited on workflow page) | https://www.stampli.com/predefined-approval-workflows/ |
| Centralized collaboration | Comments/questions; external contacts/vendors limited visibility | ap-automation FAQ |
| Vendor interaction | Invoices into Stampli; optional Vendor Portal; external Q&A on invoice | ap-automation FAQ |
| Duplicate / fraud signals | Duplicate checks at multiple lifecycle points; warnings on invoice | ap-automation FAQ |
| Document retention | Electronic storage cited (e.g. **7 years** in FAQ) | ap-automation FAQ |
| Multi-entity | Process across departments, offices, companies, locations | ap-automation |
| Insights | Productivity and process visibility | ap-automation, insights |
| Audit trail | One-click / full activity history per invoice | ap-automation |
| Integrations | API to ERP; file integration where no API | ap-automation FAQ |
| Add-ons named on AP page | Direct Pay, credit cards, advanced vendor management | ap-automation |

**Additional AP capabilities named on AP platform page**

- Recurring invoices — https://www.stampli.com/recurring-invoices/
- Advanced Search — https://www.stampli.com/advanced-search/
- Cognitive AI PO matching — https://www.stampli.com/cognitive-ai-po-matching/
- GL table templates — https://www.stampli.com/gl-table-templates/
- Unusually high invoice alerts — https://www.stampli.com/unusually-high-invoice-alerts/
- Pure AI OCR (marketing claim)
- Automatic approval reminders
- International taxes (e.g. VAT) mentioned
- ERP migration support, pre-coded email aliases, custom fields

**Invoice coding (resource article)**

- GL coding, multi-dimensional coding (e.g. departments, cost centers), split allocations, tax, amortization, ERP field sync — https://www.stampli.com/resources/invoice-coding-and-fields-in-accounts-payable/

### 3.2 Procurement

| Capability | Description | Public reference |
|------------|-------------|------------------|
| Intake | Team-specific custom forms; templates; AI-guided structuring; natural language → structured (related pages) | https://www.stampli.com/procurement |
| Controls | Budget validation before approval; GL and approval context in request | Same |
| Workflows | Configurable flows, fixed and dynamic, clear ownership | Same |
| Fulfillment paths | ERP PO, Stampli-managed PO, cards, service tickets | procure-to-pay, procurement |
| Receiving / reconciliation | Proactive receiving and PO reconciliation | procurement |
| Visibility | Real-time request status and reporting | procurement |
| Preferred vendors/items | Steer spend to approved catalogs | procurement |
| Integrations | API (cloud) and Bridge (on-prem) to common ERPs named | procurement |

**P2P page — procurement / request outcome links**

- ERP PO: https://www.stampli.com/erp-purchase-orders/
- Stampli PO: https://www.stampli.com/stampli-purchase-orders/
- Procurement cards: https://www.stampli.com/procurement-cards/
- Service tickets: https://www.stampli.com/service-tickets/

### 3.3 Vendor management

| Capability | Description | Public reference |
|------------|-------------|------------------|
| Onboarding | Customizable forms, workflows, secure document collection | https://www.stampli.com/vendor-management |
| Vendor portal | Self-service W-9, banking, insurance, profile updates | Same + vendor-onboarding / vendor-portal pages on P2P |
| Document compliance | Expiration tracking, reminders, block invoices/payments when non-compliant | vendor-management |
| Payable gating | Rules for when a vendor is allowed to be paid | vendor-management |
| Contracts | Terms and expiration alerts | vendor-management |
| Messaging | Communications tied to vendor record / transaction | vendor-management |
| ERP sync | Vendor master aligned; Stampli holds contextual history | vendor-management |

**P2P deep links**

- https://www.stampli.com/vendor-onboarding/
- https://www.stampli.com/vendor-portal/
- https://www.stampli.com/vendor-document-compliance/
- https://www.stampli.com/vendor-messaging

### 3.4 Payments (Stampli Direct Pay)

| Capability | Description | Public reference |
|------------|-------------|------------------|
| Methods | ACH, paper check, virtual card, international | https://www.stampli.com/payments |
| Pre-payment validation | ERP checks before funds move | payments |
| SoD | Separation between invoice approval and payment approval | payments |
| Reconciliation | 1:1 payment ↔ bank transaction ↔ ERP record | payments |
| International | Local currency, FX targeting/optimization, compliance screening cited | payments, international-payments |
| Vendor readiness | Block/reroute when data or compliance incomplete | payments |
| Prepayments | Supported in same workflow | payments |
| Domestic detail page (linked from AP platform) | https://www.stampli.com/domestic-payments/ |

### 3.5 Stampli Card

| Capability | Description | Public reference |
|------------|-------------|------------------|
| AP Cards | From approved requests; controls and pre-coded GL | https://www.stampli.com/card , https://www.stampli.com/ap-cards/ |
| Expense Cards | Employee request/reload under guardrails | card, https://www.stampli.com/expense-cards/ |
| Card types | Physical and virtual | card |
| Controls | Limits by cardholder, MCC, vendor | card |
| Operations | Real-time posting, mobile receipt prompts, ERP sync | card |

### 3.6 Insights (included for customers per FAQ)

| Capability | Description | Public reference |
|------------|-------------|------------------|
| Reports | Customizable, pre-built, P2P lifecycle | https://www.stampli.com/insights/ |
| Dashboards | Interactive, KPIs/widgets; see also dashboards page linked from Insights | insights, https://www.stampli.com/stampli-dashboards |
| Advanced Search | Cross-document search (invoices, expenses, payments), export | insights, advanced-search |

### 3.7 Stampli AI (platform narrative)

Public claims include: AI performs a large share of work across **many ERP-aligned fields** (exact percentage varies by page: ~86–87%); **not** positioned as a standalone chat UI but as **embedded** automation (coding, routing, line-level PO match, duplicates/variance). See:

- https://www.stampli.com/procure-to-pay/
- https://www.stampli.com/billy-stampli-ai/ (linked from homepage)

---

## 4. P2P “inside the products” link index (from procure-to-pay page)

Use these for **feature-to-URL** traceability when extending this file.

**Accounts Payable**

- Invoice capture — https://www.stampli.com/fully-automated-invoice-capture/
- Invoice coding / GL — https://www.stampli.com/gl-table-templates/
- PO matching — https://www.stampli.com/ai-line-level-po-matching
- AP assignments / approvals — https://www.stampli.com/ap-assignments/

**Cards and payments**

- Payment approvals (anchor on payments page) — https://www.stampli.com/payments?al=configurable-approvals
- Payment execution / ERP — https://www.stampli.com/payments?al=seamless-ERP-integration
- Physical & virtual cards — https://www.stampli.com/card/
- FX / international — https://www.stampli.com/international-payments/

---

## 5. ERP and accounting integrations (named on homepage / P2P)

Stampli states **70+** ERP/accounting integrations, built in-house. **Examples explicitly listed** on the corporate homepage include:

- Sage: Intacct, 100, Intacct Construction  
- Microsoft: Dynamics GP, Dynamics 365 Business Central, Dynamics 365 Finance  
- Oracle: NetSuite, Fusion  
- QuickBooks: Desktop, Online  
- SAP: ECC, S/4HANA  
- Acumatica  
- Dealertrack DMS  

Full directory: https://www.stampli.com/accounting-systems-erps/ or https://www.stampli.com/erp/

---

## 6. Gaps and how to complete the map

1. **Help Center:** Bulk export is blocked from this environment. To finish a true “all help articles” map: manually or via Stampli export, add a table of **collection → article title → URL** under section 1.1.  
2. **PDFs / gated content:** G2 reports, case studies, and PDFs are not inlined here.  
3. **API docs:** If Stampli exposes public API documentation for partners, add a section with URL when you have it.  
4. **Versioning:** Marketing pages change; re-verify critical claims before legal or customer-facing reuse.

---

## 7. Suggested use in Cursor

- Reference this file when scoping Stampli-shaped features or comparing behavior to public positioning.  
- Pair with `.cursor/skills/stampli-feature-development/SKILL.md` for implementation discipline.  
- When internal Confluence/Jira specs exist, **prefer internal specs** over this file for field names and workflows.
