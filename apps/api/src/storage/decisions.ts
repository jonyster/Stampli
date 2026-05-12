import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type Decision = {
  invoiceId: string;
  decision: "approve" | "decline" | "request_changes";
  reason?: string;
  decidedAt: string;
};

function dataFilePath() {
  if (process.env.DECISIONS_FILE) return process.env.DECISIONS_FILE;
  const cwd = process.cwd();
  return cwd.endsWith(path.join("apps", "api"))
    ? path.join(cwd, "data", "decisions.json")
    : path.join(cwd, "apps", "api", "data", "decisions.json");
}

export async function listDecisions(): Promise<Decision[]> {
  const filePath = dataFilePath();
  if (!existsSync(filePath)) return [];

  const raw = await readFile(filePath, "utf8");
  if (!raw.trim()) return [];
  return JSON.parse(raw) as Decision[];
}

export async function saveDecision(input: Omit<Decision, "decidedAt">): Promise<Decision> {
  const filePath = dataFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });

  const decisions = await listDecisions();
  const decision: Decision = { ...input, decidedAt: new Date().toISOString() };
  const next = decisions.filter((item) => item.invoiceId !== input.invoiceId);
  next.push(decision);

  await writeFile(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return decision;
}
