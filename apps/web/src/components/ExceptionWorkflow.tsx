import { useMutation } from "@tanstack/react-query";
import { generateDraft } from "../api/client";
import type { GeneratedDraft } from "../api/types";

export function ExceptionWorkflow({
  invoiceId,
  executionUnlocked,
}: {
  invoiceId: string;
  executionUnlocked: boolean;
}) {
  const mutation = useMutation({
    mutationFn: (type: GeneratedDraft["type"]) => generateDraft(invoiceId, type),
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-gray-900">Suggested Drafts</h2>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${executionUnlocked ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {executionUnlocked ? "Unlocked" : "Plan approval required"}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white disabled:bg-gray-300" disabled={!executionUnlocked} onClick={() => mutation.mutate("credit_memo_request")} type="button">
          Credit memo draft
        </button>
        <button className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white disabled:bg-gray-300" disabled={!executionUnlocked} onClick={() => mutation.mutate("vendor_confirmation")} type="button">
          Vendor confirmation
        </button>
        <button className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white disabled:bg-gray-300" disabled={!executionUnlocked} onClick={() => mutation.mutate("receipt_request")} type="button">
          Receipt request
        </button>
      </div>
      {mutation.data && (
        <div className="mt-4 rounded-lg bg-gray-50 p-3">
          <div className="text-sm font-semibold text-gray-900">{mutation.data.subject}</div>
          <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{mutation.data.body}</pre>
        </div>
      )}
    </div>
  );
}
