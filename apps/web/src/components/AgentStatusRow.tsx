import type { AgentName, AgentResult } from "../api/types";

const names: Record<AgentName, string> = {
  dataIntegrity: "Data Integrity",
  operational: "Operational",
  budgetPolicy: "Budget & Policy",
  treasury: "Treasury",
  critique: "Critique",
};

const statusClass = {
  idle: "bg-gray-100 text-gray-600",
  running: "bg-blue-50 text-blue-700",
  pass: "bg-green-50 text-green-700",
  warn: "bg-amber-50 text-amber-700",
  fail: "bg-red-50 text-red-700",
  unknown: "bg-gray-100 text-gray-700",
};

export function AgentStatusRow({
  agent,
  result,
  running,
}: {
  agent: AgentName;
  result?: AgentResult;
  running: boolean;
}) {
  const state = result?.status ?? (running ? "running" : "idle");

  return (
    <div className="flex items-start justify-between gap-3 border-b border-gray-100 py-3 last:border-0">
      <div>
        <div className="font-medium text-gray-900">{names[agent]}</div>
        <div className="mt-1 text-sm text-gray-500">{result?.summary ?? (running ? "Running..." : "Waiting")}</div>
      </div>
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[state]}`}>
        {state}
      </span>
    </div>
  );
}
