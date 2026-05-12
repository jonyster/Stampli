import { describe, expect, it } from "vitest";
import { analyzeInvoice } from "../orchestrator.js";

describe("analyzeInvoice", () => {
  it("streams worker results and a final plan for a clean invoice", async () => {
    process.env.DEMO_MODE = "true";
    const events: string[] = [];
    const result = await analyzeInvoice("INV-001", (event) => events.push(event.type));

    expect(events.filter((event) => event === "agent_result")).toHaveLength(4);
    expect(events).toContain("plan");
    expect(result.riskBadge.status).toBe("approve");
  });

  it("surfaces conflicts for a mismatch invoice", async () => {
    process.env.DEMO_MODE = "true";
    const result = await analyzeInvoice("INV-002", () => undefined);

    expect(result.riskBadge.status).toBe("needs_review");
    expect(result.conflict?.hasConflict).toBe(true);
  });

  it("marks duplicate/remit-to risk as interrupt required", async () => {
    process.env.DEMO_MODE = "true";
    const result = await analyzeInvoice("INV-003", () => undefined);

    expect(result.riskBadge.status).toBe("block");
    expect(result.interruptRequired).toBe(true);
  });
});
