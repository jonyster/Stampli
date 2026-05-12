import type { AgentName, AgentResult } from "./types.js";
import { agentResultSchema } from "./types.js";
import { getDemoAgentResult, isDemoMode } from "./demoMode.js";
import { runStructuredPrompt } from "../openai.js";

const workerAgentPrompt = `You are a finance approval audit agent.
Return only JSON matching this shape:
{
  "agent": "dataIntegrity|operational|budgetPolicy|treasury",
  "status": "pass|warn|fail|unknown",
  "confidence": 0.0,
  "summary": "one sentence",
  "findings": [{"title":"", "detail":"", "severity":"info|warning|critical", "sourceIds":[""]}],
  "citations": [{"id":"", "label":"", "sourceType":"invoice|po|receipt|contract|budget|vendor|policy|duplicate"}],
  "interruptRequired": false
}
Use only the supplied data. If required evidence is missing, return unknown and interruptRequired=true.`;

export async function runWorkerAgent(options: {
  agent: Exclude<AgentName, "critique">;
  invoiceId: string;
  task: string;
  evidence: unknown;
}): Promise<AgentResult> {
  if (isDemoMode()) {
    return getDemoAgentResult(options.invoiceId, options.agent);
  }

  return runStructuredPrompt({
    model: "gpt-4o-mini",
    system: `${workerAgentPrompt}\n\nAgent name: ${options.agent}\nTask: ${options.task}`,
    user: options.evidence,
    schema: agentResultSchema,
    repairLabel: options.agent,
  });
}
