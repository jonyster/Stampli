import type { ApprovalPackage } from "../api/types";

export function AuditNote({ approvalPackage }: { approvalPackage?: ApprovalPackage }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Agentic Audit Note</h2>
        <span className="text-xs text-gray-500">Primary reasoning surface</span>
      </div>
      {approvalPackage ? (
        <div className="space-y-2 text-sm text-gray-700">
          {approvalPackage.auditNote.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">The Critique Agent will synthesize the note after worker agents finish.</p>
      )}
    </div>
  );
}
