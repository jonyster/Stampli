import type { ApprovalPackage } from "../api/types";

const labels = {
  approve: "Approve",
  needs_review: "Needs review",
  block: "Block",
  unknown: "Unknown",
};

const classByStatus = {
  approve: "risk-badge-safe",
  needs_review: "risk-badge-alert",
  block: "risk-badge-danger",
  unknown: "risk-badge-alert",
};

export function RiskBadge({ approvalPackage }: { approvalPackage?: ApprovalPackage }) {
  if (!approvalPackage) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Risk Badge</div>
        <div className="mt-2 text-sm text-gray-500">Council is running automatically...</div>
      </div>
    );
  }

  const status = approvalPackage.riskBadge.status;

  return (
    <div className={`${classByStatus[status]} rounded-md px-3 py-2 shadow-sm`}>
      <div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wide opacity-80">Risk Badge</div>
          <div className="text-xs font-bold uppercase tracking-wide">{labels[status]}</div>
        </div>
      </div>
      <ul className="mt-2 space-y-0.5 text-[11px]">
        {approvalPackage.riskBadge.topDrivers.map((driver) => (
          <li key={driver}>- {driver}</li>
        ))}
      </ul>
    </div>
  );
}
