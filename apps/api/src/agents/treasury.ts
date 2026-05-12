import type { AgentResult } from "./types.js";
import { runWorkerAgent } from "./runAgent.js";

export function runTreasuryAgent(invoiceId: string, evidence: unknown): Promise<AgentResult> {
  return runWorkerAgent({
    agent: "treasury",
    invoiceId,
    task: "Evaluate payment rail fit, discount or due-date urgency, and whether payment timing should wait for unresolved approval risk.",
    evidence,
  });
}
