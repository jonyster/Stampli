# Approval Workspace UX Simplification Design

## Goal

Reduce time-to-decision for invoice approvers in the current workspace by decreasing scan load and making the next action obvious within 5 seconds.

## Scope

In scope:
- `apps/web/src/pages/InvoiceWorkspace.tsx`
- `apps/web/src/App.tsx`
- Existing shared components used by the workspace (`RiskBadge`, `AuditNote`)

Out of scope:
- Backend APIs and scoring logic
- New user role model
- Full IA redesign of the product shell

## Success Criteria

- Users can identify the next required action without scrolling.
- First decision action (`Approve`, `Reject`, or `View evidence`) is available in one screen.
- "Verifications Passed" no longer dominates attention during normal approvals.

## UX Principles

- Decision first, evidence second.
- Show only what is needed now; reveal detail on demand.
- Use plain language status labels and consistent severity signaling.
- Keep existing workflow mental model, improve hierarchy and defaults.

## Current Pain Points

- Primary decision context is spread across multiple blocks (risk, actions, activity, details).
- "Action Required" cards are content-heavy before users know priority.
- "Verifications Passed" is visible at full detail even when not needed.
- Error state does not guide recovery enough for deployment/CORS misconfig cases.

## Proposed Design

### 1) Sticky Decision Summary (Top Priority)

Add a sticky summary block at the top of the center pane that includes:
- Current decision status (`Pending`, `Approved`, `Rejected`, `Changes requested`)
- Top blockers (max 2)
- Primary CTA row:
  - `Approve now`
  - `Request changes`
  - `View top blocker evidence`

Behavior:
- Stays visible while scrolling findings.
- Adapts messaging when status is final.

### 2) Prioritized Action Queue

Rework "Action Required" into a queue:
- Sort order: critical first, then warning, then stable order.
- Card default view: one-line pattern `Issue -> Impact -> Next step`.
- Details and evidence remain expandable.

Behavior:
- Keep existing evidence resolver logic.
- Preserve current source links and document preview behavior.

### 3) Collapsed Verifications by Default

Change "Verifications Passed" to:
- Default collapsed with count (example: `12 checks passed`)
- Expand toggle to inspect all checks

Behavior:
- Keep current check data generation.
- Persist expanded/collapsed in local component state only.

### 4) Faster Multi-Invoice Triage in Header/Selection Flow

Improve invoice picker context in `App.tsx`:
- Add lightweight status context in selector labels when available (`Needs action`, `Ready`, `Blocked`)
- Keep current dropdown interaction (no new sidebar required in v1)

Behavior:
- Derive label from already-returned invoice decision + package status when available.
- No API contract changes.

### 5) Actionable Error and Empty States

Replace generic API failure text with:
- "We could not reach the approval API."
- Recovery actions:
  - Retry button
  - Display active API base URL from `VITE_API_URL` for quick diagnostics

Behavior:
- Keep existing `useQuery` error path.
- Add direct retry without full reload.

## Component-Level Change Plan

### `InvoiceWorkspace.tsx`

- Add `DecisionSummaryCard` section directly under invoice header controls.
- Introduce derived `topBlockers` from `actionItems.slice(0, 2)`.
- Convert action card copy to concise triage text.
- Add `isChecksExpanded` state and collapse logic for passed checks.

### `App.tsx`

- Improve error state block with retry + API URL text.
- Keep current data query and selected invoice logic.

### Optional Extraction (if file size grows)

Create small presentational components:
- `DecisionSummaryCard`
- `ActionQueueCard`
- `ChecksAccordionHeader`

## Data Flow

- No new backend fields required.
- Reuse existing computed values:
  - `decisionStatusLabel`
  - `actionItems`
  - `checkItems`
  - `displayApprovalPackage.riskBadge`

## Error Handling

- Maintain existing stream error surface in workspace.
- Improve query error guidance in app shell.
- Ensure failed evidence expansion does not block decision actions.

## Accessibility and Usability

- Preserve button semantics for CTAs and expanders.
- Add clear button labels (`View evidence`, `Show checks`, `Hide checks`).
- Keep color + text pairing for statuses (avoid color-only meaning).

## Testing Strategy

Manual scenarios:
- Pending invoice with critical findings: top blockers + CTA visible without scroll.
- No action required invoice: summary shows clear path to approve.
- Verifications section defaults collapsed and expands correctly.
- API failure: user sees retry and base URL diagnostics.

Automated UI tests (recommended follow-up):
- Summary card renders blocker count and CTA labels.
- Action queue sorts by severity.
- Checks section collapse/expand behavior.

## Rollout Plan

Phase 1 (this pass):
- Implement summary card, action queue compression, checks collapse, and improved error copy.

Phase 2:
- Add keyboard shortcuts and deeper inbox triage states.

## Risks and Mitigations

- Risk: Over-compressing detail can hide context.
  - Mitigation: Preserve expand-on-demand evidence on every actionable item.
- Risk: `InvoiceWorkspace.tsx` grows harder to maintain.
  - Mitigation: Extract presentation-only components after v1 behavior lands.

## Acceptance Criteria

- Users can perform the primary decision action from the first viewport.
- At least one blocker (if present) is visible in the summary card.
- Passed checks are collapsed by default and can be expanded.
- API error state includes retry action and active API base URL text.
