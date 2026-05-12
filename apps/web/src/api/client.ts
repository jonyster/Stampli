import type { ApprovalPackage, Decision, EvidenceBundle, GeneratedDraft, Invoice, RejectNoteSuggestion } from "./types";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json() as Promise<T>;
}

export function listInvoices() {
  return request<Invoice[]>("/api/invoices");
}

export function getInvoiceBundle(id: string) {
  return request<EvidenceBundle>(`/api/invoices/${id}`);
}

export function saveDecision(id: string, decision: Decision["decision"], reason?: string) {
  return request<Decision>(`/api/invoices/${id}/decision`, {
    method: "POST",
    body: JSON.stringify({ decision, reason }),
  });
}

export function generateDraft(id: string, type: GeneratedDraft["type"]) {
  return request<GeneratedDraft>(`/api/invoices/${id}/generate-draft`, {
    method: "POST",
    body: JSON.stringify({ type }),
  });
}

export function suggestRejectNote(id: string, approvalPackage?: ApprovalPackage) {
  return request<RejectNoteSuggestion>(`/api/invoices/${id}/suggest-reject-note`, {
    method: "POST",
    body: JSON.stringify({ approvalPackage }),
  });
}
