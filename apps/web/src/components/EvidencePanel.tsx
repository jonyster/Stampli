import type { EvidenceBundle } from "../api/types";

export function EvidencePanel({
  bundle,
  selectedSourceIds,
  selectedFindingLabel,
}: {
  bundle?: EvidenceBundle;
  selectedSourceIds: string[];
  selectedFindingLabel?: string;
}) {
  const sources = resolveSources(bundle, selectedSourceIds);

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">Evidence source</h3>
        <p className="mt-1 text-xs text-gray-500">
          {selectedFindingLabel
            ? `Showing source for: ${selectedFindingLabel}`
            : "Click an agent finding above to see its source evidence."}
        </p>
        <pre className="mt-3 max-h-80 overflow-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-700">
          {JSON.stringify(sources, null, 2)}
        </pre>
      </div>
    </div>
  );
}

function resolveSources(bundle: EvidenceBundle | undefined, sourceIds: string[]) {
  if (!bundle) return { status: "No invoice evidence loaded yet" };
  if (!sourceIds.length) return { status: "No finding selected" };

  const map = new Map<string, unknown>([
    ["invoice", bundle.invoice],
    ["vendor", bundle.vendor],
    ["policy", bundle.tenantPolicy],
    ["budget", bundle.budget],
    ["contract", bundle.contract],
  ]);

  if (bundle.purchaseOrder && "id" in bundle.purchaseOrder) {
    map.set(String((bundle.purchaseOrder as { id: string }).id), bundle.purchaseOrder);
  }
  if (bundle.receipt && "id" in bundle.receipt) {
    map.set(String((bundle.receipt as { id: string }).id), bundle.receipt);
  }
  if (Array.isArray(bundle.duplicateCandidates)) {
    for (const candidate of bundle.duplicateCandidates) {
      map.set(candidate.id, candidate);
    }
  }

  return sourceIds.reduce<Record<string, unknown>>((acc, sourceId) => {
    acc[sourceId] = map.get(sourceId) ?? { status: "Source not found in loaded bundle" };
    return acc;
  }, {});
}
