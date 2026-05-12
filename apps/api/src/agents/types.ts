import { z } from "zod";

export const agentNames = ["dataIntegrity", "operational", "budgetPolicy", "treasury", "critique"] as const;
export type AgentName = (typeof agentNames)[number];

export const agentFindingSchema = z.object({
  title: z.string(),
  detail: z.string(),
  severity: z.enum(["info", "warning", "critical"]),
  sourceIds: z.array(z.string()),
});

export const agentResultSchema = z.object({
  agent: z.enum(agentNames),
  status: z.enum(["pass", "warn", "fail", "unknown"]),
  confidence: z.number().min(0).max(1),
  summary: z.string(),
  findings: z.array(agentFindingSchema),
  citations: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      sourceType: z.enum(["invoice", "po", "receipt", "contract", "budget", "vendor", "policy", "duplicate"]),
    }),
  ),
  interruptRequired: z.boolean().default(false),
});

export type AgentResult = z.infer<typeof agentResultSchema>;

export const riskBadgeSchema = z.object({
  status: z.enum(["approve", "needs_review", "block", "unknown"]),
  confidence: z.number().min(0).max(1),
  topDrivers: z.array(z.string()),
});

export const approvalPackageSchema = z.object({
  invoiceId: z.string(),
  riskBadge: riskBadgeSchema,
  auditNote: z.array(z.string()).max(8),
  agentResults: z.array(agentResultSchema),
  conflict: z
    .object({
      hasConflict: z.boolean(),
      description: z.string(),
      resolutionPath: z.string(),
    })
    .nullable(),
  interruptRequired: z.boolean(),
  createdAt: z.string(),
});

export type ApprovalPackage = z.infer<typeof approvalPackageSchema>;

export type StreamEvent =
  | { type: "agent_started"; agent: AgentName; invoiceId: string }
  | { type: "agent_result"; result: AgentResult }
  | { type: "plan"; package: ApprovalPackage }
  | { type: "error"; message: string; recoverable: boolean };

export type DraftType = "credit_memo_request" | "vendor_confirmation" | "receipt_request";

export type GeneratedDraft = {
  type: DraftType;
  subject: string;
  body: string;
  createdAt: string;
};
