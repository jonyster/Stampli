import type { AgentName, AgentResult, ApprovalPackage, StreamEvent } from "./agents/types.js";
import { runBudgetPolicyAgent } from "./agents/budgetPolicy.js";
import { runCritiqueAgent } from "./agents/critique.js";
import { runDataIntegrityAgent } from "./agents/dataIntegrity.js";
import { runOperationalAgent } from "./agents/operational.js";
import { runTreasuryAgent } from "./agents/treasury.js";
import { AgentExecutionError } from "./openai.js";
import { getEvidenceBundle } from "./seed.js";

type Emit = (event: StreamEvent) => void;
type WorkerAgentName = Exclude<AgentName, "critique">;

const agentRunners: Record<WorkerAgentName, (invoiceId: string, evidence: unknown) => Promise<AgentResult>> = {
  dataIntegrity: runDataIntegrityAgent,
  operational: runOperationalAgent,
  budgetPolicy: runBudgetPolicyAgent,
  treasury: runTreasuryAgent,
};

export async function analyzeInvoice(invoiceId: string, emit: Emit): Promise<ApprovalPackage> {
  const evidence = getEvidenceBundle(invoiceId);
  if (!evidence) {
    throw new AgentExecutionError(`Invoice ${invoiceId} was not found`, "user_fixable");
  }

  const workerNames = Object.keys(agentRunners) as WorkerAgentName[];
  const workerPromises = workerNames.map(async (agent) => {
    emit({ type: "agent_started", agent, invoiceId });
    const result = await runAgentSafely(agent, invoiceId, evidence);
    emit({ type: "agent_result", result });
    return result;
  });

  const agentResults = await Promise.all(workerPromises);
  emit({ type: "agent_started", agent: "critique", invoiceId });
  const approvalPackage = await runCritiqueAgent(invoiceId, agentResults);
  emit({ type: "plan", package: approvalPackage });
  return approvalPackage;
}

async function runAgentSafely(agent: WorkerAgentName, invoiceId: string, evidence: unknown): Promise<AgentResult> {
  try {
    return await agentRunners[agent](invoiceId, evidence);
  } catch (error) {
    if (error instanceof AgentExecutionError && error.kind === "user_fixable") {
      return unknownResult(agent, error.message, true);
    }

    if (error instanceof AgentExecutionError && error.kind === "llm_recoverable") {
      return unknownResult(agent, error.message, false);
    }

    return unknownResult(agent, (error as Error).message, false);
  }
}

function unknownResult(agent: WorkerAgentName, message: string, interruptRequired: boolean): AgentResult {
  return {
    agent,
    status: "unknown",
    confidence: 0,
    summary: message,
    findings: [
      {
        title: "Agent could not complete",
        detail: message,
        severity: interruptRequired ? "warning" : "critical",
        sourceIds: ["system"],
      },
    ],
    citations: [{ id: "system", label: "Agent orchestration", sourceType: "policy" }],
    interruptRequired,
  };
}
