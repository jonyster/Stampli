import type { AgentResult } from "./types.js";
import { runWorkerAgent } from "./runAgent.js";

export function runDataIntegrityAgent(invoiceId: string, evidence: unknown): Promise<AgentResult> {
  return runWorkerAgent({
    agent: "dataIntegrity",
    invoiceId,
    task: "Check OCR/extraction confidence, duplicate candidates, vendor W-9 status, and remit-to anomalies.",
    evidence,
  });
}
