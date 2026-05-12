import { Router } from "express";
import { z } from "zod";
import { getDemoDraft, getDemoRejectNote, isDemoMode } from "../agents/demoMode.js";
import type { DraftType } from "../agents/types.js";
import { runStructuredPrompt } from "../openai.js";
import { getEvidenceBundle, getInvoiceById, invoices, visibleInvoiceIds } from "../seed.js";
import { listDecisions, saveDecision } from "../storage/decisions.js";

export const invoiceRouter = Router();

invoiceRouter.get("/invoices", async (_req, res) => {
  const decisions = await listDecisions();
  const visibleInvoices = invoices
    .filter((invoice) => visibleInvoiceIds.includes(invoice.id))
    .map((invoice) => ({
      ...invoice,
      decision: decisions.find((decision) => decision.invoiceId === invoice.id) ?? null,
    }));

  res.json(visibleInvoices);
});

invoiceRouter.get("/invoices/:id", (req, res) => {
  const bundle = getEvidenceBundle(req.params.id);
  if (!bundle) {
    res.status(404).json({ error: "Invoice not found" });
    return;
  }

  res.json(bundle);
});

const draftRequestSchema = z.object({
  type: z.enum(["credit_memo_request", "vendor_confirmation", "receipt_request"]),
});

invoiceRouter.post("/invoices/:id/generate-draft", (req, res) => {
  const invoice = getInvoiceById(req.params.id);
  if (!invoice) {
    res.status(404).json({ error: "Invoice not found" });
    return;
  }

  const parsed = draftRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  res.json(getDemoDraft(invoice.id, parsed.data.type as DraftType));
});

const rejectSuggestionSchema = z.object({
  suggestedNote: z.string(),
});

const rejectSuggestionRequestSchema = z.object({
  approvalPackage: z
    .object({
      riskBadge: z
        .object({
          status: z.string(),
          topDrivers: z.array(z.string()).optional(),
        })
        .optional(),
      auditNote: z.array(z.string()).optional(),
    })
    .optional(),
});

invoiceRouter.post("/invoices/:id/suggest-reject-note", async (req, res, next) => {
  try {
    const invoice = getInvoiceById(req.params.id);
    if (!invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    const bundle = getEvidenceBundle(invoice.id);
    if (!bundle) {
      res.status(404).json({ error: "Evidence bundle not found" });
      return;
    }

    if (isDemoMode()) {
      res.json({ suggestedNote: getDemoRejectNote(invoice.id) });
      return;
    }

    const parsedBody = rejectSuggestionRequestSchema.safeParse(req.body ?? {});
    if (!parsedBody.success) {
      res.status(400).json({ error: parsedBody.error.message });
      return;
    }

    const result = await runStructuredPrompt({
      model: "gpt-4o-mini",
      system:
        "You generate short, professional rejection notes for invoice initiators. Return JSON: {\"suggestedNote\":\"...\"}. " +
        "The note must mention the key issue(s), required fix, and resubmission expectation in 1-3 sentences.",
      user: {
        invoice: {
          invoiceNumber: bundle.invoice.invoiceNumber,
          vendorName: bundle.invoice.vendorName,
          amount: bundle.invoice.amount,
          entity: bundle.invoice.entity,
          project: bundle.invoice.project,
        },
        approvalPackage: parsedBody.data.approvalPackage ?? null,
        highSeverityFindings: (parsedBody.data.approvalPackage?.auditNote ?? []).slice(0, 4),
      },
      schema: rejectSuggestionSchema,
      repairLabel: "reject-note-suggestion",
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

const decisionSchema = z.object({
  decision: z.enum(["approve", "decline", "request_changes"]),
  reason: z.string().optional(),
});

invoiceRouter.post("/invoices/:id/decision", async (req, res, next) => {
  try {
    const invoice = getInvoiceById(req.params.id);
    if (!invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    const parsed = decisionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const decision = await saveDecision({
      invoiceId: invoice.id,
      decision: parsed.data.decision,
      reason: parsed.data.reason,
    });
    res.status(201).json(decision);
  } catch (error) {
    next(error);
  }
});
