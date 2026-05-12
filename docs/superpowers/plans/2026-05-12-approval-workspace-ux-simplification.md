# Approval Workspace UX Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make approval decisions faster by surfacing the next action first and collapsing non-critical details.

**Architecture:** Keep existing data flow and APIs, but improve interaction hierarchy in `InvoiceWorkspace` and resilience messaging in `App`. Add a sticky decision summary, action prioritization, and collapsed passed-checks behavior while preserving current evidence expansion logic.

**Tech Stack:** React, TypeScript, TanStack Query, existing Tailwind utility styles.

---

### Task 1: Improve invoice query error recovery in App shell

**Files:**
- Modify: `apps/web/src/App.tsx`
- Test: manual smoke test via web app startup

- [ ] **Step 1: Add API URL import and richer error fallback UI**

Update imports to include `API_URL`, and replace the current error/empty fallback with a panel that includes retry and diagnostics.

- [ ] **Step 2: Run targeted type check for web app**

Run: `pnpm --filter @agentic-approval/web build`  
Expected: TypeScript and Vite build pass.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/App.tsx
git commit -m "Improve invoice load error recovery UX"
```

### Task 2: Add sticky decision summary card in workspace

**Files:**
- Modify: `apps/web/src/pages/InvoiceWorkspace.tsx`
- Test: manual UI verification in invoice workspace

- [ ] **Step 1: Add derived top blocker data**

Compute top blockers from `actionItems` (`slice(0, 2)`) and include concise fields for summary card rendering.

- [ ] **Step 2: Implement sticky summary panel**

Insert a summary panel under invoice header controls showing:
- Current decision status
- Up to 2 top blockers
- Primary actions (`Approve now`, `Request changes`, `View top blocker evidence`)

- [ ] **Step 3: Wire "View top blocker evidence" interaction**

When clicked, expand the first action item evidence card by setting `expandedFindingKey`.

- [ ] **Step 4: Run targeted type check for web app**

Run: `pnpm --filter @agentic-approval/web build`  
Expected: Build succeeds and summary card renders without type errors.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/pages/InvoiceWorkspace.tsx
git commit -m "Add sticky decision summary to workspace"
```

### Task 3: Prioritize and compress action-required queue

**Files:**
- Modify: `apps/web/src/pages/InvoiceWorkspace.tsx`
- Test: manual UI verification with mixed severity findings

- [ ] **Step 1: Add severity-first sort for action items**

Sort action cards so `red` tone cards appear before `amber`, preserving stable order otherwise.

- [ ] **Step 2: Replace verbose card body with triage text**

Render default compact text in `Issue -> Impact -> Next step` format using existing finding title/text.

- [ ] **Step 3: Keep evidence expansion unchanged**

Preserve existing `FindingEvidence` behavior and document preview links for expanded cards.

- [ ] **Step 4: Run targeted type check for web app**

Run: `pnpm --filter @agentic-approval/web build`  
Expected: Build succeeds; action cards remain interactive.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/pages/InvoiceWorkspace.tsx
git commit -m "Prioritize and compress action-required cards"
```

### Task 4: Collapse passed checks by default

**Files:**
- Modify: `apps/web/src/pages/InvoiceWorkspace.tsx`
- Test: manual UI verification for expand/collapse behavior

- [ ] **Step 1: Add local expand/collapse state**

Introduce `isChecksExpanded` state defaulting to `false` on invoice load/reset.

- [ ] **Step 2: Add checks header toggle with count**

Display a compact header like `Verifications Passed (N)` and a `Show/Hide checks` button.

- [ ] **Step 3: Gate checks list rendering by toggle state**

Hide detailed passed checks when collapsed; show current check list UI when expanded.

- [ ] **Step 4: Run targeted type check for web app**

Run: `pnpm --filter @agentic-approval/web build`  
Expected: Build succeeds; checks section collapses/expands correctly.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/pages/InvoiceWorkspace.tsx
git commit -m "Collapse passed checks by default in workspace"
```

### Task 5: Final verification and single push-ready commit cleanup

**Files:**
- Modify: `apps/web/src/App.tsx`, `apps/web/src/pages/InvoiceWorkspace.tsx` (if polishing needed)
- Verify: full workspace build

- [ ] **Step 1: Run final build verification**

Run: `pnpm build`  
Expected: Full workspace build passes.

- [ ] **Step 2: Validate UX acceptance criteria manually**

Confirm:
- Primary decision action visible in first viewport
- Summary shows blocker(s) when present
- Passed checks collapsed by default
- Error state includes retry and API URL

- [ ] **Step 3: Prepare final commit**

```bash
git add apps/web/src/App.tsx apps/web/src/pages/InvoiceWorkspace.tsx
git commit -m "Simplify approval workspace decision flow UX"
```
