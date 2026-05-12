import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { API_URL, getInvoiceBundle, saveDecision, suggestRejectNote } from "../api/client";
import type { AgentName, AgentResult, ApprovalPackage, Decision, RiskStatus } from "../api/types";
import { AuditNote } from "../components/AuditNote";
import { RiskBadge } from "../components/RiskBadge";

type Persona = {
  id: "pm" | "dept" | "finance";
  name: string;
  role: string;
  initials: string;
  stepLabel: string;
};

type PersonaCheckItem = {
  title: string;
  text: string;
  sourceIds: string[];
};

type PersonaActionItem = {
  agent: string;
  title: string;
  text: string;
  sourceIds: string[];
  tone: "amber" | "red";
};

const personaAgentMap: Record<Persona["id"], AgentName[]> = {
  pm: ["dataIntegrity", "operational"],
  dept: ["operational", "budgetPolicy"],
  finance: ["dataIntegrity", "budgetPolicy", "treasury"],
};
const personaOrder: Persona["id"][] = ["pm", "dept", "finance"];
const agentChecklistCatalog: Record<Exclude<AgentName, "critique">, Array<{ title: string; sourceIds: string[] }>> = {
  dataIntegrity: [
    { title: "OCR / extraction confidence check", sourceIds: ["invoice"] },
    { title: "Duplicate detection across entities", sourceIds: ["invoice"] },
    { title: "Vendor remit-to and W-9 validation", sourceIds: ["vendor"] },
  ],
  operational: [
    { title: "3-way match against PO and receipt", sourceIds: ["invoice"] },
    { title: "Contract rate alignment", sourceIds: ["contract"] },
    { title: "Variance classification and route", sourceIds: ["invoice"] },
  ],
  budgetPolicy: [
    { title: "Budget burn-down threshold check", sourceIds: ["budget"] },
    { title: "Required dimensions enforcement", sourceIds: ["policy"] },
    { title: "SoD requester/approver/payer check", sourceIds: ["policy"] },
  ],
  treasury: [
    { title: "Payment rail recommendation", sourceIds: ["policy"] },
    { title: "Early discount/ROI opportunity", sourceIds: ["policy"] },
    { title: "Payment timing risk check", sourceIds: ["policy"] },
  ],
};

function deriveRiskFromActions(actionItems: PersonaActionItem[]): { status: RiskStatus; topDrivers: string[] } {
  if (actionItems.length === 0) {
    return {
      status: "approve",
      topDrivers: ["No action required for this persona", "All visible checks are clear"],
    };
  }

  const hasBlocker = actionItems.some((item) => item.tone === "red");
  return {
    status: hasBlocker ? "block" : "needs_review",
    topDrivers: actionItems.slice(0, 3).map((item) => item.title),
  };
}

function deriveAuditNote(
  personaId: Persona["id"],
  actionItems: PersonaActionItem[],
  checkItems: PersonaCheckItem[],
  decisionStatusLabel: string | null,
) {
  if (decisionStatusLabel === "Approved") {
    return ["Final decision recorded as Approved.", "No additional action is required for this persona."];
  }
  if (decisionStatusLabel === "Rejected") {
    return ["Final decision recorded as Rejected.", "Initiator must address highlighted issues before resubmission."];
  }

  const personaLabel = personaId === "pm" ? "Project Manager" : personaId === "dept" ? "Department Head" : "Finance";
  const note: string[] = [`${personaLabel} review summary:`];
  if (actionItems.length === 0) {
    note.push("No action-required findings are currently open.");
  } else {
    note.push(...actionItems.slice(0, 2).map((item) => `${item.title}: ${item.text}`));
  }
  note.push(...checkItems.slice(0, 2).map((item) => `Check passed: ${item.title}.`));
  return note.slice(0, 4);
}

function buildPersonaFindings(personaId: Persona["id"], agentResults: AgentResult[]) {
  // Assign each finding to exactly one persona per invoice (owner),
  // then dedupe so no repeated issue appears across persona views.
  const rawActionItems: PersonaActionItem[] = [];
  const rawCheckItems: PersonaCheckItem[] = [];
  const visibleAgents = new Set(personaAgentMap[personaId]);
  const resultByAgent = new Map(agentResults.map((result) => [result.agent, result]));
  const ownerByAgent = new Map<AgentName, Persona["id"]>();
  (Object.keys(personaAgentMap) as Persona["id"][]).forEach((pid) => {
    for (const agent of personaAgentMap[pid]) {
      if (!ownerByAgent.has(agent)) ownerByAgent.set(agent, pid);
    }
  });

  // PRD-aligned checklist: show multiple checks per relevant agent.
  for (const agent of personaAgentMap[personaId]) {
    if (agent === "critique") continue;
    const owner = ownerByAgent.get(agent);
    if (owner !== personaId) continue; // single-owner per invoice/persona
    const result = resultByAgent.get(agent);
    const statusLabel = result ? result.status.toUpperCase() : "PENDING";
    for (const item of agentChecklistCatalog[agent]) {
      rawCheckItems.push({
        title: `${agent}: ${item.title}`,
        text: `${statusLabel} - ${result?.summary ?? "Check not completed yet."}`,
        sourceIds: item.sourceIds,
      });
    }
  }

  for (const result of agentResults) {
    const owners = personaOrder.filter((id) => personaAgentMap[id].includes(result.agent));
    const owner = owners[0];
    if (owner !== personaId) continue; // single-owner per invoice/persona

    for (const finding of result.findings) {
      if (finding.severity === "info") {
        // Keep additional result-level verification checks for owner persona only.
        if (!visibleAgents.has(result.agent)) continue;
        rawCheckItems.push({
          title: `${result.agent}: ${finding.title}`,
          text: finding.detail,
          sourceIds: finding.sourceIds,
        });
      } else {
        // Action-required issues stay single-owner per invoice to avoid repetition.
        if (owner !== personaId) continue;
        rawActionItems.push({
          agent: result.agent,
          title: finding.title,
          text: finding.detail,
          sourceIds: finding.sourceIds,
          tone: finding.severity === "critical" ? "red" : "amber",
        });
      }
    }
  }

  const actionSeen = new Set<string>();
  const actionItems = rawActionItems.filter((item) => {
    const key = `${item.title.toLowerCase().trim()}|${item.text.toLowerCase().trim()}`;
    if (actionSeen.has(key)) return false;
    actionSeen.add(key);
    return true;
  });

  const checkSeen = new Set<string>();
  const checkItems = rawCheckItems.filter((item) => {
    const key = `${item.title.toLowerCase().trim()}|${item.text.toLowerCase().trim()}`;
    if (checkSeen.has(key)) return false;
    checkSeen.add(key);
    return true;
  });

  return { actionItems, checkItems };
}

export function InvoiceWorkspace({
  invoiceId,
  personas,
  selectedPersona,
  onSelectPersona,
}: {
  invoiceId: string;
  personas: readonly Persona[];
  selectedPersona: Persona["id"];
  onSelectPersona: (id: Persona["id"]) => void;
}) {
  const [runningAgents, setRunningAgents] = useState<Set<AgentName>>(new Set());
  const [agentResults, setAgentResults] = useState<AgentResult[]>([]);
  const [approvalPackage, setApprovalPackage] = useState<ApprovalPackage>();
  const [streaming, setStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string>();
  const [issueNote, setIssueNote] = useState("");
  const [issueError, setIssueError] = useState<string>();
  const [showRejectNote, setShowRejectNote] = useState(false);
  const [showApproveFeedback, setShowApproveFeedback] = useState(false);
  const [approveFeedback, setApproveFeedback] = useState("");
  const [approveFeedbackError, setApproveFeedbackError] = useState<string>();
  const [showVerifications, setShowVerifications] = useState(false);
  const [personaDecisionMap, setPersonaDecisionMap] = useState<Partial<Record<Persona["id"], Decision["decision"]>>>({});
  const [expandedFindingKey, setExpandedFindingKey] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<{ title: string; url: string } | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const autoStartedInvoiceRef = useRef<string | null>(null);
  const issuesSectionRef = useRef<HTMLElement | null>(null);

  const bundleQuery = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => getInvoiceBundle(invoiceId),
  });

  const decisionMutation = useMutation({
    mutationFn: ({ decision, reason }: { decision: Decision["decision"]; reason?: string }) => saveDecision(invoiceId, decision, reason),
    onSuccess: () => {
      setShowRejectNote(false);
      setShowApproveFeedback(false);
      setIssueError(undefined);
      setApproveFeedbackError(undefined);
    },
  });
  const suggestRejectNoteMutation = useMutation({
    mutationFn: () => suggestRejectNote(invoiceId, approvalPackage),
    onSuccess: (result) => {
      if (!issueNote.trim()) {
        setIssueNote(result.suggestedNote);
      }
    },
  });

  const startAnalysis = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;

    setRunningAgents(new Set());
    setAgentResults([]);
    setApprovalPackage(undefined);
    setStreamError(undefined);
    setStreaming(true);

    const eventSource = new EventSource(`${API_URL}/api/invoices/${invoiceId}/analyze/stream`);
    eventSourceRef.current = eventSource;

    eventSource.addEventListener("agent_started", (event) => {
      const payload = JSON.parse((event as MessageEvent).data) as { agent: AgentName };
      setRunningAgents((current) => new Set(current).add(payload.agent));
    });

    eventSource.addEventListener("agent_result", (event) => {
      const payload = JSON.parse((event as MessageEvent).data) as { result: AgentResult };
      setRunningAgents((current) => {
        const next = new Set(current);
        next.delete(payload.result.agent);
        return next;
      });
      setAgentResults((current) => [...current.filter((item) => item.agent !== payload.result.agent), payload.result]);
    });

    eventSource.addEventListener("plan", (event) => {
      const payload = JSON.parse((event as MessageEvent).data) as { package: ApprovalPackage };
      setApprovalPackage(payload.package);
      setAgentResults(payload.package.agentResults);
      setRunningAgents((current) => {
        const next = new Set(current);
        next.delete("critique");
        return next;
      });
    });

    eventSource.addEventListener("done", () => {
      setStreaming(false);
      eventSource.close();
      eventSourceRef.current = null;
    });

    eventSource.addEventListener("error", (event) => {
      if ((event as MessageEvent).data) {
        const payload = JSON.parse((event as MessageEvent).data) as { message: string };
        setStreamError(payload.message);
      }
      setStreaming(false);
      eventSource.close();
      eventSourceRef.current = null;
    });
  }, [invoiceId]);

  useEffect(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setRunningAgents(new Set());
    setAgentResults([]);
    setApprovalPackage(undefined);
    setStreaming(false);
    setStreamError(undefined);
    setIssueNote("");
    setIssueError(undefined);
    setShowRejectNote(false);
    setShowApproveFeedback(false);
    setApproveFeedback("");
    setApproveFeedbackError(undefined);
    setPersonaDecisionMap({});
    setExpandedFindingKey(null);
    setShowVerifications(false);
    setSelectedDoc(null);
    autoStartedInvoiceRef.current = null;
  }, [invoiceId]);

  useEffect(() => {
    if (bundleQuery.isLoading) return;
    if (autoStartedInvoiceRef.current === invoiceId) return;
    autoStartedInvoiceRef.current = invoiceId;
    startAnalysis();
  }, [bundleQuery.isLoading, invoiceId, startAnalysis]);

  useEffect(
    () => () => {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    },
    [],
  );

  const invoice = bundleQuery.data?.invoice;
  const effectiveDecision = personaDecisionMap[selectedPersona];
  const decisionStatusLabel =
    effectiveDecision === "approve" ? "Approved" : effectiveDecision === "decline" ? "Rejected" : effectiveDecision === "request_changes" ? "Changes requested" : null;
  const hasFinalDecision = Boolean(decisionStatusLabel);
  const findingsByPersona = buildPersonaFindings(selectedPersona, agentResults);
  const actionItems = findingsByPersona.actionItems;
  const checkItems = findingsByPersona.checkItems;
  const sortedActionItems = [...actionItems].sort((a, b) => {
    const aRank = a.tone === "red" ? 0 : 1;
    const bRank = b.tone === "red" ? 0 : 1;
    return aRank - bRank;
  });
  const topBlockers = sortedActionItems.filter((item) => item.tone === "red").slice(0, 2);
  const leadBlocker = topBlockers[0] ?? sortedActionItems[0];
  const leadBlockerIndex = leadBlocker ? sortedActionItems.findIndex((item) => item === leadBlocker) : -1;
  const leadBlockerFindingKey = leadBlockerIndex >= 0 ? `${selectedPersona}-action-${leadBlockerIndex}-${leadBlocker?.title ?? ""}` : null;
  const actionDrivenRisk = deriveRiskFromActions(actionItems);
  const actionDrivenAuditNote = deriveAuditNote(selectedPersona, actionItems, checkItems, decisionStatusLabel);
  const displayApprovalPackage = approvalPackage
    ? {
        ...approvalPackage,
        riskBadge: {
          ...approvalPackage.riskBadge,
          status: effectiveDecision === "approve" ? "approve" : effectiveDecision === "decline" ? "block" : actionDrivenRisk.status,
          topDrivers:
            effectiveDecision === "approve"
              ? ["Final decision recorded as Approved", "No further action is required for this invoice"]
              : effectiveDecision === "decline"
                ? ["Final decision recorded as Rejected", "Initiator must address issues before resubmission"]
                : actionDrivenRisk.topDrivers,
        },
        auditNote: actionDrivenAuditNote,
      }
    : undefined;

  function handleRefresh() {
    // Reset local UI/decision state so refresh is visible and deterministic.
    decisionMutation.reset();
    suggestRejectNoteMutation.reset();
    setShowRejectNote(false);
    setShowApproveFeedback(false);
    setIssueError(undefined);
    setApproveFeedbackError(undefined);
    setIssueNote("");
    setApproveFeedback("");
    setPersonaDecisionMap({});
    setExpandedFindingKey(null);
    setSelectedDoc(null);
    void bundleQuery.refetch();
    startAnalysis();
  }

  function submitApprove() {
    const personaId = selectedPersona;
    setIssueError(undefined);
    setShowRejectNote(false);
    setApproveFeedbackError(undefined);
    if (displayApprovalPackage?.riskBadge.status === "block") {
      setShowApproveFeedback(true);
      return;
    }
    decisionMutation.mutate(
      {
        decision: "approve",
        reason: "Approved in invoice workspace.",
      },
      {
        onSuccess: (result) => {
          setPersonaDecisionMap((current) => ({ ...current, [personaId]: result.decision }));
        },
      },
    );
  }

  function submitApproveWithFeedback() {
    const personaId = selectedPersona;
    const feedback = approveFeedback.trim();
    if (feedback.length < 5) {
      setApproveFeedbackError("Please add a short feedback note before overriding a blocked status.");
      return;
    }

    setApproveFeedbackError(undefined);
    decisionMutation.mutate(
      {
        decision: "approve",
        reason: `Approval override feedback: ${feedback}`,
      },
      {
        onSuccess: (result) => {
          setPersonaDecisionMap((current) => ({ ...current, [personaId]: result.decision }));
        },
      },
    );
    setShowApproveFeedback(false);
  }

  function openRejectComposer() {
    setShowRejectNote(true);
    setIssueError(undefined);
    setShowApproveFeedback(false);
    setApproveFeedbackError(undefined);
    suggestRejectNoteMutation.mutate();
  }

  function submitRejectWithNote() {
    const personaId = selectedPersona;
    const note = issueNote.trim();
    if (note.length < 5) {
      setIssueError("Please add a short note for the initiator before rejecting.");
      return;
    }

    setIssueError(undefined);
    decisionMutation.mutate(
      {
        decision: "decline",
        reason: note,
      },
      {
        onSuccess: (result) => {
          setPersonaDecisionMap((current) => ({ ...current, [personaId]: result.decision }));
        },
      },
    );
  }

  return (
    <main className="flex flex-1 overflow-hidden bg-[#eef1f4]">
      <aside className="w-56 shrink-0 border-r border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-4">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Approval Workflow</h2>
        </div>
        <div className="overflow-y-auto py-2">
          {personas.map((persona) => {
            const isActive = persona.id === selectedPersona;
            const personaDecision = personaDecisionMap[persona.id];
            const statusLabel =
              personaDecision === "approve"
                ? "Approved"
                : personaDecision === "decline"
                  ? "Rejected"
                  : personaDecision === "request_changes"
                    ? "Changes requested"
                    : isActive
                      ? "Active"
                      : "Pending";
            const statusClass =
              statusLabel === "Approved"
                ? "bg-green-100 text-green-700"
                : statusLabel === "Rejected"
                  ? "bg-red-100 text-red-700"
                  : statusLabel === "Changes requested"
                    ? "bg-amber-100 text-amber-700"
                    : isActive
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-500";
            return (
              <button
                key={persona.id}
                className={`w-full border-b border-gray-50 p-4 text-left transition-all hover:bg-gray-50 ${isActive ? "step-active" : "opacity-70"}`}
                onClick={() => onSelectPersona(persona.id)}
                type="button"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase ${isActive ? "text-pink-600" : "text-gray-400"}`}>{persona.stepLabel}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium italic ${statusClass}`}>
                    {statusLabel}
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-800">{persona.name}</p>
                <p className="text-[11px] text-gray-500">{persona.role}</p>
              </button>
            );
          })}
        </div>
      </aside>

      <aside className="flex flex-1 flex-col overflow-hidden border-r border-gray-200 bg-[#f8fafc] lg:max-w-[48%]">
        <div className="shrink-0 border-b border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Invoice</div>
            <button
              className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={streaming || decisionMutation.isPending}
              onClick={handleRefresh}
              type="button"
            >
              {streaming ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="mb-1 text-sm font-semibold text-blue-600">{invoice?.vendorName?.toUpperCase() ?? "VENDOR"}</div>
              <h1 className="text-2xl font-bold text-gray-900">${invoice?.amount?.toLocaleString() ?? "--"} <span className="ml-1 text-sm font-normal uppercase text-gray-500">USD</span></h1>
              <div className="mt-1 text-xs text-gray-500">{invoice?.invoiceNumber} · {invoice?.entity} · {invoice?.project}</div>
              <div className="mt-2 text-[11px] font-medium text-gray-400">Council runs automatically when invoice opens</div>
            </div>
            <div className="w-64">
              <RiskBadge approvalPackage={displayApprovalPackage} />
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Approver Chain</p>
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {personas.map((persona) => {
                const personaDecision = personaDecisionMap[persona.id];
                const isSelected = persona.id === selectedPersona;
                return (
                  <span
                    key={`chip-${persona.id}`}
                    className={`rounded px-2 py-1 text-[11px] font-semibold ${
                      isSelected ? "bg-sky-600 text-white" : "bg-sky-50 text-sky-700"
                    }`}
                  >
                    {persona.name}
                    {personaDecision === "approve" ? " · Approved" : personaDecision === "decline" ? " · Rejected" : ""}
                  </span>
                );
              })}
            </div>
          </div>

        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <section className="sticky top-0 z-10 rounded-lg border border-sky-200 bg-sky-50/95 p-3 shadow-sm backdrop-blur">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-sky-700">Decision Summary</h4>
                <p className="mt-1 text-sm font-semibold text-gray-900">Status: {decisionStatusLabel ?? "Pending decision"}</p>
              </div>
              <span
                className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${
                  decisionStatusLabel === "Approved"
                    ? "bg-green-100 text-green-700"
                    : decisionStatusLabel === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : topBlockers.length
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                }`}
              >
                {decisionStatusLabel ?? (topBlockers.length ? "Blocked" : "Needs review")}
              </span>
            </div>
            <div className="mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Top blockers</p>
              {topBlockers.length ? (
                <ul className="mt-1 space-y-1 text-xs text-gray-700">
                  {topBlockers.map((item) => (
                    <li key={`top-blocker-${item.title}`} className="rounded bg-white/80 px-2 py-1">
                      {item.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-xs text-gray-600">No critical blockers detected for this persona.</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                disabled={!approvalPackage || decisionMutation.isPending || hasFinalDecision}
                onClick={submitApprove}
                type="button"
              >
                Approve now
              </button>
              <button
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
                disabled={!approvalPackage || decisionMutation.isPending || hasFinalDecision}
                onClick={openRejectComposer}
                type="button"
              >
                Request changes
              </button>
              <button
                className="rounded border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 disabled:border-gray-200 disabled:text-gray-400"
                disabled={sortedActionItems.length === 0}
                onClick={() => {
                  issuesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  if (leadBlockerFindingKey) {
                    setExpandedFindingKey(leadBlockerFindingKey);
                  }
                }}
                type="button"
              >
                View issues
              </button>
            </div>
          </section>

          {decisionStatusLabel && (
            <section
              className={`rounded-lg border p-3 text-sm font-semibold ${
                decisionStatusLabel === "Approved"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : decisionStatusLabel === "Rejected"
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              Decision status: {decisionStatusLabel}
            </section>
          )}

          {showApproveFeedback && (
            <section className="rounded-lg border border-amber-200 bg-amber-50/70 p-4">
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-amber-700">Approval override feedback required</h4>
              <p className="mb-2 text-xs text-amber-700">This persona has a blocked badge. Add feedback before approving.</p>
              <textarea
                className="w-full rounded border border-amber-300 bg-white px-3 py-2 text-sm text-gray-700"
                placeholder="Explain why this blocked invoice should still be approved."
                rows={3}
                value={approveFeedback}
                onChange={(event) => setApproveFeedback(event.target.value)}
              />
              {approveFeedbackError && <p className="mt-2 text-xs text-red-600">{approveFeedbackError}</p>}
              <div className="mt-3 flex items-center gap-2">
                <button
                  className="rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                  disabled={decisionMutation.isPending}
                  onClick={submitApproveWithFeedback}
                  type="button"
                >
                  Approve with feedback
                </button>
                <button
                  className="rounded border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700"
                  onClick={() => {
                    setShowApproveFeedback(false);
                    setApproveFeedbackError(undefined);
                  }}
                  type="button"
                >
                  Cancel
                </button>
              </div>
              {decisionStatusLabel && (
                <p className={`mt-2 text-xs font-semibold ${decisionStatusLabel === "Approved" ? "text-green-700" : decisionStatusLabel === "Rejected" ? "text-red-700" : "text-amber-700"}`}>
                  Decision: {decisionStatusLabel}
                </p>
              )}
            </section>
          )}

          {showRejectNote && (
            <section className="rounded-lg border border-gray-200 bg-white p-4">
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Issue note to initiator</h4>
              <p className="mb-2 text-xs text-gray-500">LLM suggested note is prefilled. Edit before sending.</p>
              <textarea
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700"
                placeholder="Explain what needs to be fixed before this invoice can be approved."
                rows={3}
                value={issueNote}
                onChange={(event) => setIssueNote(event.target.value)}
              />
              {suggestRejectNoteMutation.isPending && <p className="mt-2 text-xs text-gray-500">Generating note suggestion...</p>}
              {issueError && <p className="mt-2 text-xs text-red-600">{issueError}</p>}
              <div className="mt-3 flex items-center gap-2">
                <button
                  className="rounded border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700"
                  disabled={suggestRejectNoteMutation.isPending}
                  onClick={() => suggestRejectNoteMutation.mutate()}
                  type="button"
                >
                  Regenerate suggestion
                </button>
                <button className="rounded bg-red-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60" disabled={decisionMutation.isPending} onClick={submitRejectWithNote} type="button">
                  Send rejection to initiator
                </button>
                <button
                  className="rounded border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700"
                  onClick={() => {
                    setShowRejectNote(false);
                    setIssueError(undefined);
                  }}
                  type="button"
                >
                  Cancel
                </button>
              </div>
              {decisionMutation.data && <p className="mt-2 text-xs text-green-700">Decision saved.</p>}
            </section>
          )}

          {streamError && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{streamError}</div>}

          <div className="rounded border border-gray-200 bg-white p-3">
            <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Activity Feed</h4>
            <AuditNote approvalPackage={displayApprovalPackage} />
          </div>

          <section ref={issuesSectionRef}>
            <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Found Issues</h4>
            <div className="grid gap-4">
              {sortedActionItems.length === 0 ? (
                <div className="rounded-lg border border-dashed border-green-200 bg-green-50/50 py-8 text-center">
                  <p className="text-sm font-bold text-green-800">Zero Action Required</p>
                  <p className="text-[11px] text-green-600">Checks for this persona are clear.</p>
                </div>
              ) : (
                sortedActionItems.map((item, findingIndex) => {
                  const findingKey = `${selectedPersona}-action-${findingIndex}-${item.title}`;
                  const isOpen = expandedFindingKey === findingKey;
                  return (
                    <button
                      key={findingKey}
                      className={`agent-card w-full rounded-lg border border-gray-200 border-l-4 ${item.tone === "red" ? "border-l-red-500" : "border-l-amber-500"} bg-white p-4 text-left shadow-sm`}
                      onClick={() => setExpandedFindingKey((current) => (current === findingKey ? null : findingKey))}
                      type="button"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-600">{item.agent}</span>
                        <span className="text-[10px] font-semibold text-gray-400">{isOpen ? "Hide evidence" : "Show evidence"}</span>
                      </div>
                      <h5 className="mb-1 text-sm font-bold text-gray-900">{item.title}</h5>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold text-gray-700">Why:</span> {item.text}
                      </p>
                      <p className="mt-1 text-[11px] text-gray-500">
                        <span className="font-semibold text-gray-600">Evidence sources:</span>{" "}
                        {item.sourceIds.length ? item.sourceIds.join(", ") : "invoice"}
                      </p>
                      {isOpen && (
                        <FindingEvidence
                          bundle={bundleQuery.data}
                          findingSourceIds={item.sourceIds}
                          fallbackSourceIds={["invoice"]}
                          onOpenDocument={setSelectedDoc}
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Verifications Passed</h4>
              <button
                className="rounded border border-gray-300 bg-white px-2 py-1 text-[10px] font-semibold text-gray-600 hover:bg-gray-50"
                onClick={() => setShowVerifications((current) => !current)}
                type="button"
              >
                {showVerifications ? "Hide" : "Show"} ({checkItems.length})
              </button>
            </div>
            {!showVerifications ? (
              <div className="rounded border border-dashed border-gray-200 bg-white p-3 text-[11px] text-gray-500">
                Collapsed by default to prioritize action-required findings.
              </div>
            ) : (
              <div className="space-y-2">
                {checkItems.length === 0 ? (
                  <div className="rounded border border-dashed border-gray-200 bg-white p-3 text-[11px] text-gray-500">
                    No verification checks are available for this persona on this invoice yet.
                  </div>
                ) : (
                  checkItems.map((item, findingIndex) => {
                    const findingKey = `${selectedPersona}-check-${findingIndex}-${item.title}`;
                    const isOpen = expandedFindingKey === findingKey;
                    return (
                      <button
                        key={findingKey}
                        className="animate-item w-full rounded border border-gray-100 bg-white p-2 text-left text-[11px] text-gray-600"
                        onClick={() => setExpandedFindingKey((current) => (current === findingKey ? null : findingKey))}
                        type="button"
                      >
                        {item.title}: {item.text}
                        <span className="ml-2 text-[10px] font-semibold text-gray-400">{isOpen ? "Hide evidence" : "Show evidence"}</span>
                        {isOpen && (
                          <FindingEvidence
                            bundle={bundleQuery.data}
                            findingSourceIds={item.sourceIds}
                            fallbackSourceIds={["invoice"]}
                            onOpenDocument={setSelectedDoc}
                          />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </section>
        </div>
      </aside>

      <main className="relative hidden flex-1 flex-col overflow-hidden border-l border-gray-300 bg-[#dfe3e8] lg:flex">
        <div className="border-b border-gray-300 bg-[#f3f5f7] px-4 py-2">
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="border-b-2 border-sky-500 pb-1 text-sky-700">Invoice</span>
            <span className="text-gray-500">Attachments</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {selectedDoc ? (
            <div className="mx-auto w-full max-w-3xl rounded-lg bg-white p-4 shadow-2xl">
              <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-2">
                <h3 className="text-sm font-semibold text-gray-900">{selectedDoc.title}</h3>
                <button
                  className="rounded border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700"
                  onClick={() => setSelectedDoc(null)}
                  type="button"
                >
                  Back to invoice
                </button>
              </div>
              <iframe className="h-[70vh] w-full rounded border border-gray-200" src={selectedDoc.url} title={selectedDoc.title} />
            </div>
          ) : (
          <div className="pdf-page mx-auto flex w-full max-w-xl flex-col bg-white p-12">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded bg-black text-xs font-bold text-white">
                  {(invoice?.vendorName?.[0] ?? "V").toUpperCase()}
                </div>
                <h2 className="text-lg font-black">{invoice?.vendorName?.toUpperCase() ?? "VENDOR"}</h2>
              </div>
              <div className="text-right">
                <h1 className="text-2xl font-light text-gray-300">INVOICE</h1>
                <p className="mt-2 text-[10px] font-bold">{invoice?.invoiceNumber ?? "INV-XXXX"}</p>
              </div>
            </div>

            <div className="my-4 border-y border-gray-200 py-4">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="text-left uppercase text-gray-400">
                    <th className="pb-2">Description</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoice?.lines?.map((line, idx) => (
                    <tr key={line.id} className={idx === 1 ? "bg-amber-50" : ""}>
                      <td className={`py-2 ${idx === 1 ? "font-bold text-amber-700" : ""}`}>{line.description}</td>
                      <td className={`py-2 text-right ${idx === 1 ? "font-bold text-amber-700" : ""}`}>
                        ${(line.quantity * line.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-auto flex justify-end pt-4">
              <div className="text-right">
                <p className="text-[10px] text-gray-500">Total Amount Due</p>
                <p className="text-xl font-black">${invoice?.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
          )}
          </div>
      </main>
    </main>
  );
}

function FindingEvidence({
  bundle,
  findingSourceIds,
  fallbackSourceIds,
  onOpenDocument,
}: {
  bundle: Awaited<ReturnType<typeof getInvoiceBundle>> | undefined;
  findingSourceIds: string[];
  fallbackSourceIds: string[];
  onOpenDocument: (doc: { title: string; url: string }) => void;
}) {
  const sourceIds = findingSourceIds.length ? findingSourceIds : fallbackSourceIds;
  const entries = resolveEvidenceEntries(bundle, sourceIds);
  const docLinks = resolveDocumentLinks(bundle, sourceIds);
  if (!entries.length) return null;

  return (
    <div className="mt-3 rounded-md border border-gray-100 bg-gray-50 p-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Evidence</p>
      {!!docLinks.length && (
        <div className="mt-2 flex flex-wrap gap-2">
          {docLinks.map((doc) => (
            <button
              key={doc.url}
              className="rounded border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700"
              onClick={(event) => {
                event.stopPropagation();
                onOpenDocument(doc);
              }}
              type="button"
            >
              Open {doc.title}
            </button>
          ))}
        </div>
      )}
      <div className="mt-2 space-y-2">
        {entries.map((entry) => (
          <div key={entry.id} className="rounded border border-gray-200 bg-white p-2">
            <p className="text-[11px] font-semibold text-gray-800">{entry.title}</p>
            <ul className="mt-1 space-y-0.5 text-[11px] text-gray-600">
              {entry.lines.map((line) => (
                <li key={`${entry.id}-${line}`}>- {line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function resolveEvidenceEntries(bundle: Awaited<ReturnType<typeof getInvoiceBundle>> | undefined, sourceIds: string[]) {
  if (!bundle || !sourceIds.length) return [];

  const map = new Map<string, unknown>([
    ["invoice", bundle.invoice],
    ["vendor", bundle.vendor],
    ["policy", bundle.tenantPolicy],
    ["budget", bundle.budget],
    ["contract", bundle.contract],
  ]);

  const po = bundle.purchaseOrder as { id?: string } | undefined;
  if (po?.id) map.set(po.id, po);
  const receipt = bundle.receipt as { id?: string } | undefined;
  if (receipt?.id) map.set(receipt.id, receipt);

  if (Array.isArray(bundle.duplicateCandidates)) {
    for (const candidate of bundle.duplicateCandidates) {
      map.set(candidate.id, candidate);
    }
  }

  return sourceIds.map((id) => humanizeEvidence(id, map.get(id)));
}

function resolveDocumentLinks(bundle: Awaited<ReturnType<typeof getInvoiceBundle>> | undefined, sourceIds: string[]) {
  if (!bundle) return [];
  const links: Array<{ title: string; url: string }> = [];
  const pushOnce = (title: string, url: string) => {
    if (!links.some((item) => item.url === url)) links.push({ title, url });
  };

  const hasVendorSource = sourceIds.some((id) => id === "vendor" || id.startsWith("VEN-"));
  const hasPoSource = sourceIds.some((id) => id.startsWith("PO-")) || !!bundle.invoice.poId;
  const hasContractSource = sourceIds.some((id) => id.startsWith("CON-")) || !!bundle.invoice.contractId;

  if (hasVendorSource) {
    const vendor = bundle.vendor as { name?: string; w9Status?: string } | undefined;
    const w9Url = `/fake-docs/w9-sample.html?vendorName=${encodeURIComponent(vendor?.name ?? bundle.invoice.vendorName)}&w9Status=${encodeURIComponent(
      String(vendor?.w9Status ?? "valid"),
    )}&tin=${encodeURIComponent("XX-XXX4821")}`;
    pushOnce("W-9", w9Url);
  }

  if (hasPoSource) {
    const po = bundle.purchaseOrder as { id?: string; lines?: Array<{ description?: string; unitPrice?: number }> } | undefined;
    const poLines = (po?.lines ?? []).map((poLine) => {
      const invoiceLine = bundle.invoice.lines.find((line) => line.description === poLine.description);
      return {
        description: poLine.description ?? "Line item",
        poUnitPrice: Number(poLine.unitPrice ?? 0),
        invoiceUnitPrice: Number(invoiceLine?.unitPrice ?? 0),
      };
    });
    const poUrl = `/fake-docs/po-sample.html?poId=${encodeURIComponent(po?.id ?? bundle.invoice.poId ?? "PO-XXXX")}&invoiceId=${encodeURIComponent(
      bundle.invoice.invoiceNumber,
    )}&lines=${encodeURIComponent(JSON.stringify(poLines))}`;
    pushOnce(`PO ${bundle.invoice.poId ?? ""}`.trim(), poUrl);
  }

  if (hasContractSource) {
    const contract = bundle.contract as
      | {
          id?: string;
          totalContractValue?: number;
          ytdSpendBeforeCurrentInvoice?: number;
        }
      | undefined;
    const contractUrl =
      `/fake-docs/contract-sample.html?contractId=${encodeURIComponent(contract?.id ?? bundle.invoice.contractId ?? "CON-XXXX")}` +
      `&invoiceId=${encodeURIComponent(bundle.invoice.invoiceNumber)}` +
      `&tcv=${encodeURIComponent(String(contract?.totalContractValue ?? 0))}` +
      `&ytd=${encodeURIComponent(String(contract?.ytdSpendBeforeCurrentInvoice ?? 0))}` +
      `&invoiceAmount=${encodeURIComponent(String(bundle.invoice.amount ?? 0))}`;
    pushOnce(`Contract ${bundle.invoice.contractId ?? ""}`.trim(), contractUrl);
  }

  return links;
}

function humanizeEvidence(id: string, value: unknown) {
  if (!value || typeof value !== "object") {
    return { id, title: `Source ${id}`, lines: ["No structured evidence found"] };
  }

  const obj = value as Record<string, unknown>;
  const title = String(obj.invoiceNumber ?? obj.name ?? obj.id ?? id);
  const lines: string[] = [];

  const interestingKeys = [
    "vendorName",
    "amount",
    "entity",
    "project",
    "status",
    "summary",
    "poId",
    "contractId",
    "allocated",
    "consumedBeforeCurrentInvoice",
    "w9Status",
    "remitTo",
    "totalContractValue",
    "ytdSpendBeforeCurrentInvoice",
    "priceVarianceThresholdPercent",
  ];

  for (const key of interestingKeys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      lines.push(`${key}: ${String(obj[key])}`);
    }
  }

  if (!lines.length) {
    for (const [key, raw] of Object.entries(obj).slice(0, 6)) {
      lines.push(`${key}: ${typeof raw === "object" ? JSON.stringify(raw) : String(raw)}`);
    }
  }

  return { id, title, lines };
}
