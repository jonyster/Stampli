import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { listInvoices } from "./api/client";
import { InvoiceWorkspace } from "./pages/InvoiceWorkspace";

const personas = [
  { id: "pm", name: "Alex Rivera", role: "Project Manager (Texas West)", initials: "AR", stepLabel: "Step 1" },
  { id: "dept", name: "Sarah Jenkins", role: "Dept. Head (Operations)", initials: "SJ", stepLabel: "Step 2" },
  { id: "finance", name: "Corporate AP", role: "Finance & Treasury", initials: "AP", stepLabel: "Final" },
] as const;

type PersonaId = (typeof personas)[number]["id"];

export function App() {
  const invoicesQuery = useQuery({ queryKey: ["invoices"], queryFn: listInvoices });
  const [selectedId, setSelectedId] = useState<string>();
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>("pm");

  useEffect(() => {
    if (!selectedId && invoicesQuery.data?.[0]) {
      setSelectedId(invoicesQuery.data[0].id);
    }
  }, [invoicesQuery.data, selectedId]);

  if (invoicesQuery.isLoading) {
    return <div className="grid min-h-screen place-items-center text-gray-500">Loading approval workspace...</div>;
  }

  if (invoicesQuery.isError || !invoicesQuery.data?.length) {
    return <div className="grid min-h-screen place-items-center text-red-600">Could not load invoices. Is the API running?</div>;
  }

  const persona = personas.find((item) => item.id === selectedPersona) ?? personas[0];

  return (
    <div className="h-screen overflow-hidden bg-gray-100">
      <header className="stampli-bg flex h-14 items-center justify-between px-4 text-white shadow-lg">
        <div className="flex items-center gap-8">
          <div className="text-xl font-black italic tracking-tighter">STAMPLI</div>
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            <span className="border-b-2 border-white pb-1 opacity-100">Invoices</span>
            <span className="opacity-70">Vendors</span>
            <span className="opacity-70">Payments</span>
            <span className="opacity-70">Reports</span>
          </nav>
        </div>
        <div className="flex items-center gap-3 border-l border-white/20 pl-4">
          <label className="hidden text-xs font-semibold sm:block" htmlFor="invoice-select">
            Invoice
          </label>
          <select
            id="invoice-select"
            className="rounded bg-white/15 px-2 py-1 text-xs text-white outline-none ring-1 ring-white/30"
            onChange={(event) => setSelectedId(event.target.value)}
            value={selectedId}
          >
            {invoicesQuery.data.map((invoice) => (
              <option key={invoice.id} value={invoice.id} className="text-gray-900">
                {invoice.invoiceNumber} - {invoice.vendorName}
              </option>
            ))}
          </select>
          <div className="hidden text-right sm:block">
            <p className="text-xs font-bold leading-none">{persona.name}</p>
            <p className="text-[10px] opacity-70">{persona.role}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">{persona.initials}</div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
        {selectedId && (
          <InvoiceWorkspace
            key={selectedId}
            invoiceId={selectedId}
            personas={personas}
            selectedPersona={selectedPersona}
            onSelectPersona={setSelectedPersona}
          />
        )}
      </div>
    </div>
  );
}
