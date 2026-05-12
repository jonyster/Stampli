import type { AgentResult } from "./types.js";
import { runWorkerAgent } from "./runAgent.js";

export function runOperationalAgent(invoiceId: string, evidence: unknown): Promise<AgentResult> {
  return runWorkerAgent({
    agent: "operational",
    invoiceId,
    task: "Perform 3-way matching against PO and receipt data, classify quantity, price, or missing-receipt variances, and identify contract-rate issues where visible.",
    evidence,
  });
}
