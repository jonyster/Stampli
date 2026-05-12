---
name: stampli-feature-development
description: >-
  Plans and implements new Stampli product features in AP automation contexts:
  invoices, approvals, payments, PO matching, multi-entity flows, and ERP
  integrations. Use when the user mentions Stampli, AP automation, invoice
  processing, Billy/AI-assisted workflows, vendor bills, or building features
  for the Stampli platform.
disable-model-invocation: true
---

# Stampli feature development

## Discovery and assumptions (mandatory)

1. **Guided questions first.** Before coding or a detailed implementation plan, ask **numbered, grouped** questions until scope, acceptance criteria, environments, feature flags, and affected surfaces are confirmed **or** explicitly waived. Offer **multiple-choice** when helpful. Do **not** assume repo layout, API contracts, or product rules not present in the ticket/repo.
2. **No silent defaults.** List **Proposed assumptions** in chat and get explicit approval before relying on them in code or plans.
3. If the user pastes a ticket, **extract** ambiguities and ask about them rather than guessing.

## Council review gate (mandatory)

Follow [`.cursor/skills/llm-council/SKILL.md`](../llm-council/SKILL.md) (project copy; ignore Temp/zip paths).

**After** you have a substantive **implementation plan**, **design summary**, or **PR / change description** (not for trivial one-line typo fixes unless the user asks):

1. Frame a council question with the plan/summary and stakes (risk, ERP edge cases, security).
2. Run the full council workflow from that skill (five advisors → peer review → chairman verdict).
3. Present the **Council Verdict** in chat after the plan or append **Council review** to the written summary; apply material feedback to the plan/code and note **Changes after council**.
4. If the user says **skip council for this run**, add `Council review waived by user` and skip.

## When this skill applies

Use this skill for net-new product work on Stampli (or Stampli-like AP stacks): UI flows, APIs, integrations, automation rules, and AI-assisted invoice tasks. Treat finance-adjacent data as sensitive unless the codebase shows otherwise.

## Product context (public)

Stampli centers on accounts payable automation: capture and process invoices, route for approval, support matching to purchase orders, and connect to many ERPs without forcing customers to replace core finance workflows. AI-assisted capabilities (e.g. invoice understanding and routing) sit alongside traditional controls.

Do not assume proprietary architecture, service names, or internal runbooks. **Discover** those from the repo, docs links the user provides, and existing patterns.

## Strategy and operating context (repo)

When present, read [stampli-strategy-operating-context.md](../../../stampli-strategy-operating-context.md) for ICP, pillars, differentiation, ERP priorities, Billy HITL boundaries, SoD, compliance, and DoD expectations before designing approval, payment, or ERP-touching behavior.

## Workflow for a new feature

1. **Clarify scope**  
   Capture user stories, acceptance criteria, affected personas (AP clerk, approver, admin), entities (vendor, invoice, PO, payment, company), and ERP touchpoints if any.

2. **Map the codebase**  
   Find similar features: routing, permissions, audit trails, idempotency, webhooks, and integration adapters. Reuse naming, layers (API vs domain vs UI), and error shapes.

3. **Design minimally**  
   Prefer the smallest change that meets criteria. Call out migration needs, feature flags, and backward compatibility for integrations.

4. **Implement**  
   Match local conventions. Add or extend tests at the same layers the team already tests. For money and invoice identifiers, avoid logging secrets or full PAN/bank payloads.

5. **Verify**  
   Run the project’s standard lint/test commands. Manually exercise critical paths when automated coverage is thin.

6. **Ship checklist**  
   See [reference.md](reference.md) for AP-specific review items.

## Agent behavior

- Prefer **focused diffs**; no unrelated refactors.  
- **Ask** using guided questions whenever product rules, compliance, or repo context are unclear—**do not assume**; skip redundant questions only when the ticket or files already state the fact verbatim.  
- Follow **Discovery and assumptions** and **Council review gate** above for non-trivial work.  
- If the repo has `CONTRIBUTING`, architecture docs, or ADRs, follow them over generic advice.  
- For UI work, align typography, spacing, and components with existing screens.

## Progressive disclosure

- AP, security, and integration review bullets: [reference.md](reference.md)
- Public capability and documentation map (product pages + help URLs): [stampli-context-capabilities.md](../../../stampli-context-capabilities.md) (repo root)
- Strategy, ICP, ERP model, Billy/SoD, DoD: [stampli-strategy-operating-context.md](../../../stampli-strategy-operating-context.md) (repo root)
- LLM Council (mandatory review methodology for non-trivial outputs): [llm-council/SKILL.md](../llm-council/SKILL.md)
