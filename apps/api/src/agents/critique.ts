import type { AgentResult, ApprovalPackage } from "./types.js";
import { approvalPackageSchema } from "./types.js";
import { getDemoApprovalPackage, isDemoMode } from "./demoMode.js";
import { runStructuredPrompt } from "../openai.js";

const critiquePrompt = `You are the Critique Agent for an audit-grade AP approval workflow.
Review worker-agent outputs for cross-agent conflicts, missing evidence, and alignment with tenant policy.
Return only JSON matching this shape:
{
  "invoiceId": "INV-001",
  "riskBadge": {"status":"approve|needs_review|block|unknown", "confidence":0.0, "topDrivers":[""]},
  "auditNote": ["max 8 concise approver-readable lines"],
  "agentResults": [worker agent results unchanged],
  "conflict": null OR {"hasConflict":true, "description":"", "resolutionPath":""},
  "interruptRequired": false,
  "createdAt": "ISO timestamp"
}
The audit note is the primary reasoning surface. Do not invent facts beyond worker outputs.`;

export async function runCritiqueAgent(invoiceId: string, agentResults: AgentResult[]): Promise<ApprovalPackage> {
  if (isDemoMode()) {
    return getDemoApprovalPackage(invoiceId, agentResults);
  }

  return runStructuredPrompt({
    model: "gpt-4o",
    system: critiquePrompt,
    user: {
      invoiceId,
      createdAt: new Date().toISOString(),
      agentResults,
    },
    schema: approvalPackageSchema,
    repairLabel: "critique",
  });
}
