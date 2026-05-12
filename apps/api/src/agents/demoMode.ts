import type { AgentName, AgentResult, ApprovalPackage, DraftType, GeneratedDraft } from "./types.js";

const baseCitations = {
  invoice: { id: "invoice", label: "Invoice record", sourceType: "invoice" as const },
  policy: { id: "policy", label: "Tenant policy", sourceType: "policy" as const },
};
const randomScenarioInvoiceIds = new Set(["INV-008", "INV-009", "INV-010"]);

export function isDemoMode() {
  return process.env.DEMO_MODE !== "false";
}

export function getDemoAgentResult(invoiceId: string, agent: Exclude<AgentName, "critique">): AgentResult {
  if (randomScenarioInvoiceIds.has(invoiceId)) {
    return buildRandomAgentResult(agent);
  }

  const table: Record<string, Record<Exclude<AgentName, "critique">, AgentResult>> = {
    "INV-001": {
      dataIntegrity: {
        agent,
        status: "pass",
        confidence: 0.98,
        summary: "Extraction confidence is high, remit-to is unchanged, and no duplicate candidate was found.",
        findings: [{ title: "Data verified", detail: "OCR confidence 0.98 and vendor remit-to matches history.", severity: "info", sourceIds: ["invoice", "vendor"] }],
        citations: [baseCitations.invoice, { id: "VEN-ACME", label: "ACME vendor master", sourceType: "vendor" }],
        interruptRequired: false,
      },
      operational: {
        agent,
        status: "pass",
        confidence: 0.97,
        summary: "PO quantities, receipt quantities, and invoice prices match.",
        findings: [{ title: "3-way match passed", detail: "Invoice lines match PO-1001 and RCPT-1001.", severity: "info", sourceIds: ["PO-1001", "RCPT-1001"] }],
        citations: [{ id: "PO-1001", label: "Purchase order PO-1001", sourceType: "po" }, { id: "RCPT-1001", label: "Receipt RCPT-1001", sourceType: "receipt" }],
        interruptRequired: false,
      },
      budgetPolicy: {
        agent,
        status: "pass",
        confidence: 0.95,
        summary: "Required dimensions are present, budget remains available, and SoD roles are separated.",
        findings: [{ title: "Policy checks passed", detail: "Department, project, and entity are present; requester, approver, and payer differ.", severity: "info", sourceIds: ["policy"] }],
        citations: [baseCitations.policy, { id: "budget-field-ops", label: "Field Operations budget", sourceType: "budget" }],
        interruptRequired: false,
      },
      treasury: {
        agent,
        status: "pass",
        confidence: 0.9,
        summary: "ACH is available and aligned to policy. No urgent discount window is detected.",
        findings: [{ title: "ACH recommended", detail: "Vendor supports ACH and policy prefers ACH for this transaction.", severity: "info", sourceIds: ["VEN-ACME", "policy"] }],
        citations: [baseCitations.policy, { id: "VEN-ACME", label: "ACME vendor master", sourceType: "vendor" }],
        interruptRequired: false,
      },
    },
    "INV-002": {
      dataIntegrity: {
        agent,
        status: "warn",
        confidence: 0.9,
        summary: "Extraction confidence is acceptable, but duplicate/date proximity needs manual confirmation.",
        findings: [{ title: "Potential duplicate proximity", detail: "Recent invoice timing for this vendor is close enough to require a quick manual check.", severity: "warning", sourceIds: ["invoice", "VEN-BOLT"] }],
        citations: [baseCitations.invoice, { id: "VEN-BOLT", label: "Bolt vendor master", sourceType: "vendor" }],
        interruptRequired: false,
      },
      operational: {
        agent,
        status: "warn",
        confidence: 0.92,
        summary: "3-way match found price variances above the 2% policy threshold.",
        findings: [
          { title: "Labor rate variance", detail: "Electrical labor is billed at $188 vs PO rate $180 (+4.4%).", severity: "warning", sourceIds: ["PO-2002"] },
          { title: "Materials variance", detail: "Panel materials are billed at $4,764 vs PO rate $4,100 (+16.2%).", severity: "warning", sourceIds: ["PO-2002"] },
        ],
        citations: [{ id: "PO-2002", label: "Purchase order PO-2002", sourceType: "po" }, { id: "RCPT-2002", label: "Receipt RCPT-2002", sourceType: "receipt" }, baseCitations.policy],
        interruptRequired: false,
      },
      budgetPolicy: {
        agent,
        status: "warn",
        confidence: 0.9,
        summary: "Budget will be nearly exhausted after this invoice, while required dimensions and SoD pass.",
        findings: [{ title: "Budget at risk", detail: "Electrical project budget has $6,600 remaining before a $10,780 invoice.", severity: "warning", sourceIds: ["budget-electrical"] }],
        citations: [{ id: "budget-electrical", label: "Electrical budget", sourceType: "budget" }, baseCitations.policy],
        interruptRequired: false,
      },
      treasury: {
        agent,
        status: "warn",
        confidence: 0.84,
        summary: "Due date is soon, but payment should wait until variance is resolved.",
        findings: [{ title: "Payment hold recommended", detail: "Do not optimize for speed until Operational and Budget/Policy warnings are resolved.", severity: "warning", sourceIds: ["policy"] }],
        citations: [baseCitations.policy, { id: "VEN-BOLT", label: "Bolt vendor master", sourceType: "vendor" }],
        interruptRequired: false,
      },
    },
    "INV-003": {
      dataIntegrity: {
        agent,
        status: "fail",
        confidence: 0.93,
        summary: "Duplicate candidate and remit-to change require manual review.",
        findings: [
          { title: "Duplicate candidate", detail: "NOVA-2026-019 exists for the same vendor and amount in another entity.", severity: "critical", sourceIds: ["INV-HIST-003-A"] },
          { title: "Remit-to changed", detail: "ACH-NOVA-999 is not in the vendor remit-to history.", severity: "critical", sourceIds: ["VEN-NOVA"] },
          { title: "Low extraction confidence", detail: "OCR confidence 0.94 is below the 0.95 threshold.", severity: "warning", sourceIds: ["invoice"] },
        ],
        citations: [baseCitations.invoice, { id: "INV-HIST-003-A", label: "Duplicate candidate", sourceType: "duplicate" }, { id: "VEN-NOVA", label: "Nova vendor master", sourceType: "vendor" }],
        interruptRequired: true,
      },
      operational: {
        agent,
        status: "fail",
        confidence: 0.8,
        summary: "3-way match failed due to quantity mismatch and missing receipt confidence.",
        findings: [{ title: "3-way match failure", detail: "Operational check failed and requires AP correction before approval.", severity: "critical", sourceIds: ["PO-3003", "RCPT-3003"] }],
        citations: [{ id: "PO-3003", label: "Purchase order PO-3003", sourceType: "po" }, { id: "RCPT-3003", label: "Receipt RCPT-3003", sourceType: "receipt" }],
        interruptRequired: true,
      },
      budgetPolicy: {
        agent,
        status: "fail",
        confidence: 0.78,
        summary: "Policy controls failed due to SoD and budget rule violations.",
        findings: [{ title: "Policy control failure", detail: "Requester/approver separation and budget threshold checks failed.", severity: "critical", sourceIds: ["budget-safety", "policy"] }],
        citations: [{ id: "budget-safety", label: "Safety budget", sourceType: "budget" }, baseCitations.policy],
        interruptRequired: true,
      },
      treasury: {
        agent,
        status: "fail",
        confidence: 0.77,
        summary: "Treasury blocks payment due to unresolved integrity and policy failures.",
        findings: [{ title: "Treasury block", detail: "Payment is blocked until all critical risks are resolved.", severity: "critical", sourceIds: ["VEN-NOVA", "policy"] }],
        citations: [baseCitations.policy, { id: "VEN-NOVA", label: "Nova vendor master", sourceType: "vendor" }],
        interruptRequired: true,
      },
    },
    "INV-004": {
      dataIntegrity: {
        agent,
        status: "pass",
        confidence: 0.99,
        summary: "Extraction quality is high and no duplicate candidate was found.",
        findings: [{ title: "Data verified", detail: "OCR confidence 0.99 and remit-to unchanged.", severity: "info", sourceIds: ["invoice", "vendor"] }],
        citations: [baseCitations.invoice, { id: "VEN-ACME", label: "ACME vendor master", sourceType: "vendor" }],
        interruptRequired: false,
      },
      operational: {
        agent,
        status: "pass",
        confidence: 0.96,
        summary: "PO and receipt match with no actionable variance.",
        findings: [{ title: "3-way match passed", detail: "Invoice aligns with PO-4004 and RCPT-4004.", severity: "info", sourceIds: ["PO-4004", "RCPT-4004"] }],
        citations: [{ id: "PO-4004", label: "Purchase order PO-4004", sourceType: "po" }, { id: "RCPT-4004", label: "Receipt RCPT-4004", sourceType: "receipt" }],
        interruptRequired: false,
      },
      budgetPolicy: {
        agent,
        status: "warn",
        confidence: 0.88,
        summary: "Budget is still valid but now in caution range.",
        findings: [{ title: "Budget caution", detail: "Budget remains available but now needs monitoring after this invoice.", severity: "warning", sourceIds: ["budget"] }],
        citations: [{ id: "budget", label: "Field Operations budget", sourceType: "budget" }, baseCitations.policy],
        interruptRequired: false,
      },
      treasury: {
        agent,
        status: "fail",
        confidence: 0.79,
        summary: "Treasury blocks release until budget caution is acknowledged.",
        findings: [{ title: "Treasury block", detail: "Payment is blocked pending finance acknowledgment of budget caution.", severity: "critical", sourceIds: ["policy", "budget"] }],
        citations: [baseCitations.policy, { id: "VEN-ACME", label: "ACME vendor master", sourceType: "vendor" }],
        interruptRequired: true,
      },
    },
    "INV-005": {
      dataIntegrity: {
        agent,
        status: "pass",
        confidence: 0.96,
        summary: "Extraction confidence and remit-to validation pass.",
        findings: [{ title: "Data verified", detail: "No duplicate or remit-to anomaly found.", severity: "info", sourceIds: ["invoice", "vendor"] }],
        citations: [baseCitations.invoice, { id: "VEN-BOLT", label: "Bolt vendor master", sourceType: "vendor" }],
        interruptRequired: false,
      },
      operational: {
        agent,
        status: "warn",
        confidence: 0.88,
        summary: "Materials line exceeds PO pricing threshold.",
        findings: [{ title: "Materials variance", detail: "Switchgear materials billed at $5,330 vs PO price $5,100 (+4.5%).", severity: "warning", sourceIds: ["PO-5005"] }],
        citations: [{ id: "PO-5005", label: "Purchase order PO-5005", sourceType: "po" }, baseCitations.policy],
        interruptRequired: false,
      },
      budgetPolicy: {
        agent,
        status: "warn",
        confidence: 0.89,
        summary: "Budget remains available but invoice pushes project near threshold.",
        findings: [{ title: "Budget near threshold", detail: "Electrical budget leaves limited headroom after this invoice.", severity: "warning", sourceIds: ["budget"] }],
        citations: [{ id: "budget", label: "Electrical budget", sourceType: "budget" }, baseCitations.policy],
        interruptRequired: false,
      },
      treasury: {
        agent,
        status: "fail",
        confidence: 0.78,
        summary: "Treasury blocks payment until operational variance is resolved.",
        findings: [{ title: "Payment blocked", detail: "Treasury hard-block due to unresolved operational and budget warnings.", severity: "critical", sourceIds: ["policy"] }],
        citations: [baseCitations.policy, { id: "VEN-BOLT", label: "Bolt vendor master", sourceType: "vendor" }],
        interruptRequired: true,
      },
    },
    "INV-006": {
      dataIntegrity: {
        agent,
        status: "pass",
        confidence: 0.99,
        summary: "Invoice data is clean with no duplicate candidate and known remit-to.",
        findings: [{ title: "Data verified", detail: "OCR confidence 0.99 and remit-to ACH-NOVA-777 matches vendor history.", severity: "info", sourceIds: ["invoice", "VEN-NOVA"] }],
        citations: [baseCitations.invoice, { id: "VEN-NOVA", label: "Nova vendor master", sourceType: "vendor" }],
        interruptRequired: false,
      },
      operational: {
        agent,
        status: "warn",
        confidence: 0.88,
        summary: "Operational check shows minor mismatch needing manager review.",
        findings: [{ title: "Operational caution", detail: "Minor delivery timing mismatch requires reviewer acknowledgment.", severity: "warning", sourceIds: ["PO-6006", "RCPT-6006"] }],
        citations: [{ id: "PO-6006", label: "Purchase order PO-6006", sourceType: "po" }, { id: "RCPT-6006", label: "Receipt RCPT-6006", sourceType: "receipt" }],
        interruptRequired: false,
      },
      budgetPolicy: {
        agent,
        status: "fail",
        confidence: 0.8,
        summary: "Budget policy failed due to threshold breach.",
        findings: [{ title: "Budget threshold exceeded", detail: "Policy marks this invoice as over threshold and requires escalation.", severity: "critical", sourceIds: ["budget", "policy"] }],
        citations: [{ id: "budget", label: "Safety budget", sourceType: "budget" }, baseCitations.policy],
        interruptRequired: true,
      },
      treasury: {
        agent,
        status: "pass",
        confidence: 0.9,
        summary: "ACH route is available and policy-aligned.",
        findings: [{ title: "ACH recommended", detail: "No payment hold signal is present for this invoice.", severity: "info", sourceIds: ["policy"] }],
        citations: [baseCitations.policy, { id: "VEN-NOVA", label: "Nova vendor master", sourceType: "vendor" }],
        interruptRequired: false,
      },
    },
    "INV-007": {
      dataIntegrity: {
        agent,
        status: "fail",
        confidence: 0.8,
        summary: "Data integrity failed due to duplicate risk signal.",
        findings: [{ title: "Duplicate risk detected", detail: "Potential duplicate pattern requires AP confirmation before payment.", severity: "critical", sourceIds: ["invoice", "vendor"] }],
        citations: [baseCitations.invoice, { id: "VEN-ACME", label: "ACME vendor master", sourceType: "vendor" }],
        interruptRequired: true,
      },
      operational: {
        agent,
        status: "pass",
        confidence: 0.94,
        summary: "PO-7007 and RCPT-7007 match invoice lines.",
        findings: [{ title: "3-way match passed", detail: "Retaining wall labor and equipment values align with PO.", severity: "info", sourceIds: ["PO-7007", "RCPT-7007"] }],
        citations: [{ id: "PO-7007", label: "Purchase order PO-7007", sourceType: "po" }, { id: "RCPT-7007", label: "Receipt RCPT-7007", sourceType: "receipt" }],
        interruptRequired: false,
      },
      budgetPolicy: {
        agent,
        status: "warn",
        confidence: 0.88,
        summary: "Invoice keeps project in budget but near consumption threshold.",
        findings: [{ title: "Budget near threshold", detail: "Field Operations budget headroom is now limited for this project.", severity: "warning", sourceIds: ["budget"] }],
        citations: [{ id: "budget", label: "Field Operations budget", sourceType: "budget" }, baseCitations.policy],
        interruptRequired: false,
      },
      treasury: {
        agent,
        status: "warn",
        confidence: 0.84,
        summary: "Cash timing should remain controlled due to budget pressure.",
        findings: [{ title: "Staged payment suggested", detail: "Treasury recommends payment timing review before release.", severity: "warning", sourceIds: ["policy"] }],
        citations: [baseCitations.policy, { id: "VEN-ACME", label: "ACME vendor master", sourceType: "vendor" }],
        interruptRequired: false,
      },
    },
    "INV-008": {
      dataIntegrity: {
        agent,
        status: "fail",
        confidence: 0.91,
        summary: "Vendor remit-to does not match known history for Bolt Electrical.",
        findings: [{ title: "Remit-to mismatch", detail: "ACH-BOLT-ALT is not in approved remit-to history for this vendor.", severity: "critical", sourceIds: ["VEN-BOLT"] }],
        citations: [baseCitations.invoice, { id: "VEN-BOLT", label: "Bolt vendor master", sourceType: "vendor" }],
        interruptRequired: true,
      },
      operational: {
        agent,
        status: "pass",
        confidence: 0.92,
        summary: "PO and receipt values align for labor and materials.",
        findings: [{ title: "3-way match passed", detail: "Invoice lines align with PO-8008 and RCPT-8008.", severity: "info", sourceIds: ["PO-8008", "RCPT-8008"] }],
        citations: [{ id: "PO-8008", label: "Purchase order PO-8008", sourceType: "po" }, { id: "RCPT-8008", label: "Receipt RCPT-8008", sourceType: "receipt" }],
        interruptRequired: false,
      },
      budgetPolicy: {
        agent,
        status: "pass",
        confidence: 0.9,
        summary: "Policy dimensions and budget checks pass.",
        findings: [{ title: "Policy checks passed", detail: "Dimensions, SoD, and budget checks pass for this invoice.", severity: "info", sourceIds: ["policy"] }],
        citations: [baseCitations.policy, { id: "budget", label: "Electrical budget", sourceType: "budget" }],
        interruptRequired: false,
      },
      treasury: {
        agent,
        status: "warn",
        confidence: 0.82,
        summary: "Payment should be blocked until remit-to mismatch is resolved.",
        findings: [{ title: "Payment blocked", detail: "Treasury recommends hold due to critical remit-to anomaly.", severity: "critical", sourceIds: ["VEN-BOLT"] }],
        citations: [baseCitations.policy, { id: "VEN-BOLT", label: "Bolt vendor master", sourceType: "vendor" }],
        interruptRequired: false,
      },
    },
    "INV-009": {
      dataIntegrity: {
        agent,
        status: "pass",
        confidence: 0.97,
        summary: "High-confidence extraction and known vendor remit-to.",
        findings: [{ title: "Data verified", detail: "No duplicate or remit-to issue found.", severity: "info", sourceIds: ["invoice", "vendor"] }],
        citations: [baseCitations.invoice, { id: "VEN-NOVA", label: "Nova vendor master", sourceType: "vendor" }],
        interruptRequired: false,
      },
      operational: {
        agent,
        status: "pass",
        confidence: 0.95,
        summary: "3-way match passed for fall protection kit order.",
        findings: [{ title: "3-way match passed", detail: "Quantity and rate match PO-9009 and RCPT-9009.", severity: "info", sourceIds: ["PO-9009", "RCPT-9009"] }],
        citations: [{ id: "PO-9009", label: "Purchase order PO-9009", sourceType: "po" }, { id: "RCPT-9009", label: "Receipt RCPT-9009", sourceType: "receipt" }],
        interruptRequired: false,
      },
      budgetPolicy: {
        agent,
        status: "pass",
        confidence: 0.92,
        summary: "Budget and policy controls pass.",
        findings: [{ title: "Budget available", detail: "North Yard safety budget has healthy remaining capacity.", severity: "info", sourceIds: ["budget"] }],
        citations: [{ id: "budget", label: "Safety budget", sourceType: "budget" }, baseCitations.policy],
        interruptRequired: false,
      },
      treasury: {
        agent,
        status: "pass",
        confidence: 0.9,
        summary: "Standard ACH payment can proceed.",
        findings: [{ title: "Payment timing clear", detail: "No treasury constraint detected for this invoice.", severity: "info", sourceIds: ["policy"] }],
        citations: [baseCitations.policy, { id: "VEN-NOVA", label: "Nova vendor master", sourceType: "vendor" }],
        interruptRequired: false,
      },
    },
    "INV-010": {
      dataIntegrity: {
        agent,
        status: "pass",
        confidence: 0.98,
        summary: "Invoice data quality and remit-to checks pass.",
        findings: [{ title: "Data verified", detail: "Extraction confidence 0.98 and vendor remit-to matches history.", severity: "info", sourceIds: ["invoice", "vendor"] }],
        citations: [baseCitations.invoice, { id: "VEN-ACME", label: "ACME vendor master", sourceType: "vendor" }],
        interruptRequired: false,
      },
      operational: {
        agent,
        status: "warn",
        confidence: 0.87,
        summary: "Equipment rental line is above contract/PO threshold.",
        findings: [{ title: "Rental variance", detail: "Finishing machine rental billed at $1,450 needs manager confirmation before release.", severity: "warning", sourceIds: ["PO-1010"] }],
        citations: [{ id: "PO-1010", label: "Purchase order PO-1010", sourceType: "po" }, { id: "RCPT-1010", label: "Receipt RCPT-1010", sourceType: "receipt" }],
        interruptRequired: false,
      },
      budgetPolicy: {
        agent,
        status: "warn",
        confidence: 0.86,
        summary: "Budget remains positive but this invoice narrows remaining margin.",
        findings: [{ title: "Budget caution", detail: "Field Operations budget enters caution zone after this invoice.", severity: "warning", sourceIds: ["budget"] }],
        citations: [{ id: "budget", label: "Field Operations budget", sourceType: "budget" }, baseCitations.policy],
        interruptRequired: false,
      },
      treasury: {
        agent,
        status: "warn",
        confidence: 0.82,
        summary: "Treasury recommends hold until variance is acknowledged.",
        findings: [{ title: "Conditional hold", detail: "Release payment only after variance note is documented.", severity: "warning", sourceIds: ["policy"] }],
        citations: [baseCitations.policy, { id: "VEN-ACME", label: "ACME vendor master", sourceType: "vendor" }],
        interruptRequired: false,
      },
    },
  };

  return table[invoiceId]?.[agent] ?? {
    agent,
    status: "unknown",
    confidence: 0.5,
    summary: "No demo response configured for this invoice.",
    findings: [{ title: "Unknown invoice", detail: "The demo response table does not include this scenario.", severity: "warning", sourceIds: ["invoice"] }],
    citations: [baseCitations.invoice],
    interruptRequired: true,
  };
}

function buildRandomAgentResult(agent: Exclude<AgentName, "critique">): AgentResult {
  const roll = Math.random();
  const status: AgentResult["status"] = roll < 0.34 ? "pass" : roll < 0.67 ? "warn" : "fail";
  const confidence = status === "pass" ? 0.95 : status === "warn" ? 0.86 : 0.78;
  const severity = status === "pass" ? "info" : status === "warn" ? "warning" : "critical";
  const summaryByStatus = {
    pass: `${agent} checks are green for this run.`,
    warn: `${agent} checks are yellow and need reviewer attention.`,
    fail: `${agent} checks are red and block normal approval flow.`,
  };

  return {
    agent,
    status,
    confidence,
    summary: summaryByStatus[status],
    findings: [
      {
        title: `${agent} ${status === "pass" ? "clear" : status === "warn" ? "warning" : "failure"}`,
        detail:
          status === "pass"
            ? "No action required for this agent."
            : status === "warn"
              ? "Reviewer should validate this area before final approval."
              : "Critical issue detected and escalation is required.",
        severity,
        sourceIds: ["invoice", "policy"],
      },
    ],
    citations: [baseCitations.invoice, baseCitations.policy],
    interruptRequired: status === "fail",
  };
}

export function getDemoApprovalPackage(invoiceId: string, agentResults: AgentResult[]): ApprovalPackage {
  const hasFail = agentResults.some((result) => result.status === "fail");
  const hasWarn = agentResults.some((result) => result.status === "warn");
  const interruptRequired = agentResults.some((result) => result.interruptRequired);
  const isInvoice002 = invoiceId === "INV-002";

  return {
    invoiceId,
    riskBadge: {
      status: hasFail ? "block" : hasWarn ? "needs_review" : "approve",
      confidence: hasFail ? 0.91 : hasWarn ? 0.88 : 0.96,
      topDrivers: agentResults.flatMap((result) => result.findings.slice(0, 1).map((finding) => finding.title)).slice(0, 3),
    },
    auditNote: randomScenarioInvoiceIds.has(invoiceId) ? buildDynamicAuditNote(agentResults) : buildAuditNote(invoiceId),
    agentResults,
    conflict: isInvoice002
      ? {
          hasConflict: true,
          description: "Treasury wants to preserve payment timing, but Operational and Budget/Policy checks require variance review first.",
          resolutionPath: "Approve plan only after AP sends a credit memo request or a variance override is reason-coded.",
        }
      : null,
    interruptRequired,
    createdAt: new Date().toISOString(),
  };
}

function buildDynamicAuditNote(agentResults: AgentResult[]) {
  const statusLine = (result: AgentResult) =>
    `${result.agent}: ${result.status === "pass" ? "green" : result.status === "warn" ? "yellow" : result.status === "fail" ? "red" : "unknown"} - ${result.summary}`;
  const notes = agentResults.map(statusLine).slice(0, 4);
  return notes.length ? notes : ["No agent notes were generated for this run."];
}

function buildAuditNote(invoiceId: string) {
  if (invoiceId === "INV-001") {
    return [
      "Vendor verified; remit-to unchanged.",
      "3-way match passed against PO-1001 and RCPT-1001.",
      "Budget, dimensions, and SoD checks passed.",
      "Recommendation: approve.",
    ];
  }

  if (invoiceId === "INV-002") {
    return [
      "3-way match variance exceeds 2% policy threshold on labor and materials.",
      "Electrical budget is at risk after this invoice.",
      "Treasury should hold payment timing until variance is resolved.",
      "Recommendation: needs review; generate credit memo request or approve with reason-coded variance.",
    ];
  }

  if (invoiceId === "INV-004") {
    return [
      "Vendor verification passed; remit-to unchanged.",
      "3-way match passed against PO-4004 and RCPT-4004.",
      "Budget and policy checks passed.",
      "Recommendation: approve.",
    ];
  }

  if (invoiceId === "INV-005") {
    return [
      "Materials line exceeds PO pricing threshold (+4.5%).",
      "Project budget remains available but nearing threshold.",
      "Payment should wait until variance review is approved.",
      "Recommendation: needs review before approval.",
    ];
  }

  if (invoiceId === "INV-006") {
    return [
      "Vendor and remit-to checks passed with high-confidence extraction.",
      "3-way match passed against PO-6006 and RCPT-6006.",
      "Budget and policy checks are within safe operating thresholds.",
      "Recommendation: approve.",
    ];
  }

  if (invoiceId === "INV-007") {
    return [
      "Invoice matches PO and receipt evidence for retaining wall work.",
      "Budget headroom is narrowing and should be monitored.",
      "Treasury recommends cautious payment timing due to budget pressure.",
      "Recommendation: needs review before final payment release.",
    ];
  }

  if (invoiceId === "INV-008") {
    return [
      "Remit-to account does not match approved vendor history.",
      "Operational matching is clean, but data-integrity risk remains critical.",
      "Treasury requires payment hold until remit-to is verified.",
      "Recommendation: block approval pending vendor confirmation.",
    ];
  }

  if (invoiceId === "INV-009") {
    return [
      "Data integrity checks passed with no duplicate/remit anomalies.",
      "3-way match passed against PO-9009 and RCPT-9009.",
      "Budget and policy controls are healthy.",
      "Recommendation: approve.",
    ];
  }

  if (invoiceId === "INV-010") {
    return [
      "Data checks passed; vendor and remit-to are valid.",
      "Operational and budget checks raised moderate variance cautions.",
      "Treasury advises conditional hold until variance acknowledgment.",
      "Recommendation: needs review before approval.",
    ];
  }

  return [
    "Duplicate risk detected for NOVA-2026-019 across another entity.",
    "Vendor remit-to changed from known ACH-NOVA-777 to ACH-NOVA-999.",
    "Extraction confidence is below policy threshold.",
    "Recommendation: block approval until AP resolves duplicate and remit-to review.",
  ];
}

export function getDemoDraft(invoiceId: string, type: DraftType): GeneratedDraft {
  const draftByType: Record<DraftType, GeneratedDraft> = {
    credit_memo_request: {
      type,
      subject: `Credit memo request for ${invoiceId}`,
      body: "Hi Procurement team,\n\nThe invoice variance exceeds policy threshold against the purchase order. Please confirm whether we should request a corrected invoice or credit memo before approval.\n\nThanks.",
      createdAt: new Date().toISOString(),
    },
    vendor_confirmation: {
      type,
      subject: `Vendor confirmation required for ${invoiceId}`,
      body: "Hi Vendor team,\n\nPlease confirm whether the attached invoice is a duplicate and whether the remit-to account change is authorized. Approval is paused pending confirmation.\n\nThanks.",
      createdAt: new Date().toISOString(),
    },
    receipt_request: {
      type,
      subject: `Receipt evidence request for ${invoiceId}`,
      body: "Hi Field team,\n\nPlease attach receipt or delivery confirmation so AP can complete the approval package.\n\nThanks.",
      createdAt: new Date().toISOString(),
    },
  };

  return draftByType[type];
}

export function getDemoRejectNote(invoiceId: string) {
  const suggestions: Record<string, string> = {
    "INV-001": "Please confirm service completion evidence before resubmitting to keep the audit trail complete.",
    "INV-002":
      "Please resolve the PO variance (labor and materials exceed policy threshold) and attach either a credit memo request or an approved variance justification before resubmitting.",
    "INV-003":
      "Please verify duplicate risk and remit-to account change with vendor confirmation. Also provide corrected invoice extraction details (confidence below threshold) before resubmitting.",
    "INV-004": "Please attach any missing field evidence requested by AP and resubmit for final approval.",
    "INV-005":
      "Please resolve the switchgear materials variance against PO-5005 and add a variance approval note before resubmitting this invoice.",
    "INV-006": "Please attach any requested AP context and resubmit if additional reviewer clarification is needed.",
    "INV-007":
      "Please add a short budget justification note and payment timing confirmation before resubmitting this invoice for approval.",
    "INV-008":
      "Please confirm the remit-to account change with vendor documentation and update vendor master details before resubmitting.",
    "INV-009": "Please provide any missing supporting comments requested by approvers before resubmitting.",
    "INV-010":
      "Please add documented variance acknowledgment for equipment rental and confirm budget exception approval before resubmitting.",
  };

  return (
    suggestions[invoiceId] ??
    "Please resolve the flagged approval issues and provide supporting evidence before resubmitting this invoice."
  );
}
