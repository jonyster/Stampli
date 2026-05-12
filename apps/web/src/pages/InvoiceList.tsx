import type { Invoice } from "../api/types";

export function InvoiceList({
  invoices,
  selectedId,
  onSelect,
}: {
  invoices: Invoice[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white">
      <div className="border-b border-gray-100 p-4">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Approval Workflow</h2>
      </div>
      <div className="overflow-y-auto py-2">
        {invoices.map((invoice, index) => (
          <button
            key={invoice.id}
            className={`w-full border-b border-gray-50 p-4 text-left transition-all hover:bg-gray-50 ${selectedId === invoice.id ? "step-active" : "opacity-70"}`}
            onClick={() => onSelect(invoice.id)}
            type="button"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase ${selectedId === invoice.id ? "text-pink-600" : "text-gray-400"}`}>
                Step {index + 1}
              </span>
              <span className="rounded px-1.5 py-0.5 text-[10px] font-medium italic bg-amber-100 text-amber-700">
                {invoice.decision?.decision ?? "Pending"}
              </span>
            </div>
            <p className="text-sm font-bold text-gray-800">{invoice.vendorName}</p>
            <p className="text-[11px] text-gray-500">{invoice.invoiceNumber}</p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
              <span>{invoice.entity}</span>
              <span>${invoice.amount.toLocaleString()}</span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
