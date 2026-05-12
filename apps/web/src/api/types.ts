export type AgentName = "dataIntegrity" | "operational" | "budgetPolicy" | "treasury" | "critique";
export type AgentStatus = "pass" | "warn" | "fail" | "unknown";
export type RiskStatus = "approve" | "needs_review" | "block" | "unknown";

export type Invoice = {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  amount: number;
  date: string;
  dueDate: string;
  entity: string;
  department: string;
  project: string;
  extractionConfidence: number;
  decision?: Decision | null;
};

export type EvidenceBundle = {
  invoice: Invoice & {
    remitTo: string;
    poId?: string;
    contractId?: string;
    lines: Array<{ id: string; description: string; quantity: number; unitPrice: number }>;
  };
  vendor?: Record<string, unknown>;
  purchaseOrder?: Record<string, unknown>;
  receipt?: Record<string, unknown>;
  contract?: Record<string, unknown>;
  budget?: Record<string, unknown>;
  duplicateCandidates: Invoice[];
  tenantPolicy: Record<string, unknown>;
};

export type AgentFinding = {
  title: string;
  detail: string;
  severity: "info" | "warning" | "critical";
  sourceIds: string[];
};

export type AgentResult = {
  agent: AgentName;
  status: AgentStatus;
  confidence: number;
  summary: string;
  findings: AgentFinding[];
  citations: Array<{ id: string; label: string; sourceType: string }>;
  interruptRequired: boolean;
};

export type ApprovalPackage = {
  invoiceId: string;
  riskBadge: {
    status: RiskStatus;
    confidence: number;
    topDrivers: string[];
  };
  auditNote: string[];
  agentResults: AgentResult[];
  conflict: null | {
    hasConflict: boolean;
    description: string;
    resolutionPath: string;
  };
  interruptRequired: boolean;
  createdAt: string;
};

export type Decision = {
  invoiceId: string;
  decision: "approve" | "decline" | "request_changes";
  reason?: string;
  decidedAt: string;
};

export type GeneratedDraft = {
  type: "credit_memo_request" | "vendor_confirmation" | "receipt_request";
  subject: string;
  body: string;
  createdAt: string;
};

export type RejectNoteSuggestion = {
  suggestedNote: string;
};
