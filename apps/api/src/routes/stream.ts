import { Router } from "express";
import { analyzeInvoice } from "../orchestrator.js";

export const streamRouter = Router();

streamRouter.get("/invoices/:id/analyze/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const send = (eventName: string, data: unknown) => {
    res.write(`event: ${eventName}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 15000);

  req.on("close", () => {
    clearInterval(heartbeat);
  });

  try {
    await analyzeInvoice(req.params.id, (event) => send(event.type, event));
    send("done", { ok: true });
  } catch (error) {
    send("error", { message: (error as Error).message, recoverable: false });
  } finally {
    clearInterval(heartbeat);
    res.end();
  }
});
