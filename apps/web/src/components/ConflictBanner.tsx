import type { ApprovalPackage } from "../api/types";

export function ConflictBanner({ approvalPackage }: { approvalPackage?: ApprovalPackage }) {
  if (!approvalPackage?.conflict?.hasConflict) return null;

  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900">
      <div className="font-semibold">Critique Agent conflict</div>
      <p className="mt-1 text-sm">{approvalPackage.conflict.description}</p>
      <p className="mt-2 text-sm font-medium">Resolution: {approvalPackage.conflict.resolutionPath}</p>
    </div>
  );
}
