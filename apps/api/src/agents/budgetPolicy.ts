import type { AgentResult } from "./types.js";
import { runWorkerAgent } from "./runAgent.js";

export function runBudgetPolicyAgent(invoiceId: string, evidence: unknown): Promise<AgentResult> {
  return runWorkerAgent({
    agent: "budgetPolicy",
    invoiceId,
    task: "Check required dimensions, segregation of duties, budget burn-down, and policy thresholds.",
    evidence,
  });
}
