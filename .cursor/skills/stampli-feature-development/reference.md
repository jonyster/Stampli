# Stampli feature reference

Use this file when validating a change that touches money, invoices, or external systems.

## Data and compliance mindset

- Invoice and payment data are high-sensitivity: minimize retention in logs, avoid leaking vendor or employee PII in client-visible errors, and respect retention or anonymization rules defined in the project.
- Prefer explicit authorization checks at the API boundary and again where domain logic enforces invariants.

## AP domain checks

- **State machines**: invoice lifecycle (e.g. draft → submitted → approved → paid) and who may transition which states.
- **Matching**: 2-way vs 3-way match rules, tolerance for amounts or quantities, partial receipts.
- **Multi-entity**: company or subsidiary scoping on every query and mutation.
- **Approvals**: delegation, limits, escalation, and audit trail of decisions.

## Integrations and ERPs

- Version API contracts consumed by connectors; document breaking changes.
- Consider idempotency for webhooks and batch jobs; handle duplicate deliveries.
- Time zones and fiscal periods affect posting dates—confirm with existing ERP posting code.

## Testing suggestions

- Golden-path tests plus edge cases: zero amount lines, credit memos, currency rounding, revoked approvals.
- Contract or integration tests where mock ERP responses exist in the repo.
