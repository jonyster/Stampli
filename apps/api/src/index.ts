import "dotenv/config";
import cors from "cors";
import express from "express";
import { invoiceRouter } from "./routes/invoices.js";
import { streamRouter } from "./routes/stream.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(express.json());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
  }),
);

app.get("/health", (_req, res) => {
  res.json({ ok: true, demoMode: process.env.DEMO_MODE !== "false" });
});

app.use("/api", invoiceRouter);
app.use("/api", streamRouter);

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(500).json({ error: error.message });
});

app.listen(port, () => {
  console.log(`Agentic Approval API listening on http://localhost:${port}`);
});

function isAllowedOrigin(origin: string) {
  const raw = process.env.CORS_ALLOWED_ORIGINS ?? "http://localhost:5173";
  return raw.split(",").some((entry) => {
    const trimmed = entry.trim();
    if (!trimmed) return false;
    if (trimmed === origin) return true;

    try {
      return new RegExp(trimmed).test(origin);
    } catch {
      return false;
    }
  });
}
