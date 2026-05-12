export type RiskStatus = "approve" | "needs_review" | "block" | "unknown";

export type InvoiceLine = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  poLineId?: string;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  date: string;
  dueDate: string;
  entity: string;
  department: string;
  project: string;
  requesterId: string;
  approverId: string;
  payerId: string;
  extractionConfidence: number;
  remitTo: string;
  poId?: string;
  contractId?: string;
  lines: InvoiceLine[];
};

export type PurchaseOrderLine = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type PurchaseOrder = {
  id: string;
  vendorId: string;
  entity: string;
  lines: PurchaseOrderLine[];
};

export type Receipt = {
  id: string;
  poId: string;
  receivedLineQuantities: Record<string, number>;
  receivedAt: string;
};

export type Vendor = {
  id: string;
  name: string;
  w9Status: "valid" | "missing" | "expired";
  remitToHistory: string[];
  paymentRails: Array<"ach" | "card" | "check">;
};

export type Contract = {
  id: string;
  vendorId: string;
  name: string;
  startDate: string;
  endDate: string;
  totalContractValue: number;
  ytdSpendBeforeCurrentInvoice: number;
  allowedRateByDescription: Record<string, number>;
};

export type Budget = {
  department: string;
  project: string;
  allocated: number;
  consumedBeforeCurrentInvoice: number;
};

export type TenantPolicy = {
  extractionConfidenceThreshold: number;
  priceVarianceThresholdPercent: number;
  duplicateDateWindowDays: number;
  requiredDimensions: Array<keyof Pick<Invoice, "department" | "project" | "entity">>;
  requireRequesterApproverPayerSeparation: boolean;
  preferredPaymentRail: "ach" | "card" | "check";
  earlyPaymentDiscountAnnualizedRoiThreshold: number;
};

export const tenantPolicy: TenantPolicy = {
  extractionConfidenceThreshold: 0.95,
  priceVarianceThresholdPercent: 2,
  duplicateDateWindowDays: 14,
  requiredDimensions: ["department", "project", "entity"],
  requireRequesterApproverPayerSeparation: true,
  preferredPaymentRail: "ach",
  earlyPaymentDiscountAnnualizedRoiThreshold: 12,
};

export const vendors: Vendor[] = [
  {
    id: "VEN-ACME",
    name: "ACME Concrete",
    w9Status: "valid",
    remitToHistory: ["ACH-ACME-001"],
    paymentRails: ["ach", "card"],
  },
  {
    id: "VEN-BOLT",
    name: "Bolt Electrical",
    w9Status: "valid",
    remitToHistory: ["ACH-BOLT-200"],
    paymentRails: ["ach"],
  },
  {
    id: "VEN-NOVA",
    name: "Nova Safety Supplies",
    w9Status: "valid",
    remitToHistory: ["ACH-NOVA-777"],
    paymentRails: ["ach", "check"],
  },
];

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-1001",
    vendorId: "VEN-ACME",
    entity: "West Ops",
    lines: [
      { id: "PO-1001-1", description: "Concrete pour labor", quantity: 40, unitPrice: 325 },
      { id: "PO-1001-2", description: "Pump rental", quantity: 1, unitPrice: 1250 },
    ],
  },
  {
    id: "PO-2002",
    vendorId: "VEN-BOLT",
    entity: "West Ops",
    lines: [
      { id: "PO-2002-1", description: "Electrical rough-in labor", quantity: 32, unitPrice: 180 },
      { id: "PO-2002-2", description: "Panel materials", quantity: 1, unitPrice: 4100 },
    ],
  },
  {
    id: "PO-3003",
    vendorId: "VEN-NOVA",
    entity: "Central Ops",
    lines: [{ id: "PO-3003-1", description: "Safety harness kits", quantity: 50, unitPrice: 95 }],
  },
  {
    id: "PO-4004",
    vendorId: "VEN-ACME",
    entity: "South Ops",
    lines: [
      { id: "PO-4004-1", description: "Foundation prep labor", quantity: 20, unitPrice: 360 },
      { id: "PO-4004-2", description: "Site pump rental", quantity: 1, unitPrice: 1600 },
    ],
  },
  {
    id: "PO-5005",
    vendorId: "VEN-BOLT",
    entity: "Central Ops",
    lines: [
      { id: "PO-5005-1", description: "Switchgear install labor", quantity: 16, unitPrice: 220 },
      { id: "PO-5005-2", description: "Switchgear materials", quantity: 1, unitPrice: 5100 },
    ],
  },
  {
    id: "PO-6006",
    vendorId: "VEN-NOVA",
    entity: "Central Ops",
    lines: [
      { id: "PO-6006-1", description: "Site PPE replenishment", quantity: 80, unitPrice: 45 },
      { id: "PO-6006-2", description: "Forklift safety inspection", quantity: 1, unitPrice: 1200 },
    ],
  },
  {
    id: "PO-7007",
    vendorId: "VEN-ACME",
    entity: "West Ops",
    lines: [
      { id: "PO-7007-1", description: "Retaining wall labor", quantity: 18, unitPrice: 410 },
      { id: "PO-7007-2", description: "Shotcrete equipment", quantity: 1, unitPrice: 2200 },
    ],
  },
  {
    id: "PO-8008",
    vendorId: "VEN-BOLT",
    entity: "South Ops",
    lines: [
      { id: "PO-8008-1", description: "Emergency panel replacement labor", quantity: 12, unitPrice: 240 },
      { id: "PO-8008-2", description: "Panel replacement kit", quantity: 1, unitPrice: 6400 },
    ],
  },
  {
    id: "PO-9009",
    vendorId: "VEN-NOVA",
    entity: "North Ops",
    lines: [{ id: "PO-9009-1", description: "Fall protection anchor kits", quantity: 30, unitPrice: 140 }],
  },
  {
    id: "PO-1010",
    vendorId: "VEN-ACME",
    entity: "Central Ops",
    lines: [
      { id: "PO-1010-1", description: "Concrete slab finishing labor", quantity: 24, unitPrice: 335 },
      { id: "PO-1010-2", description: "Finishing machine rental", quantity: 1, unitPrice: 1450 },
    ],
  },
];

export const receipts: Receipt[] = [
  {
    id: "RCPT-1001",
    poId: "PO-1001",
    receivedLineQuantities: { "PO-1001-1": 40, "PO-1001-2": 1 },
    receivedAt: "2026-05-04",
  },
  {
    id: "RCPT-2002",
    poId: "PO-2002",
    receivedLineQuantities: { "PO-2002-1": 32, "PO-2002-2": 1 },
    receivedAt: "2026-05-05",
  },
  {
    id: "RCPT-3003",
    poId: "PO-3003",
    receivedLineQuantities: { "PO-3003-1": 50 },
    receivedAt: "2026-05-03",
  },
  {
    id: "RCPT-4004",
    poId: "PO-4004",
    receivedLineQuantities: { "PO-4004-1": 20, "PO-4004-2": 1 },
    receivedAt: "2026-05-08",
  },
  {
    id: "RCPT-5005",
    poId: "PO-5005",
    receivedLineQuantities: { "PO-5005-1": 16, "PO-5005-2": 1 },
    receivedAt: "2026-05-09",
  },
  {
    id: "RCPT-6006",
    poId: "PO-6006",
    receivedLineQuantities: { "PO-6006-1": 80, "PO-6006-2": 1 },
    receivedAt: "2026-05-10",
  },
  {
    id: "RCPT-7007",
    poId: "PO-7007",
    receivedLineQuantities: { "PO-7007-1": 18, "PO-7007-2": 1 },
    receivedAt: "2026-05-11",
  },
  {
    id: "RCPT-8008",
    poId: "PO-8008",
    receivedLineQuantities: { "PO-8008-1": 12, "PO-8008-2": 1 },
    receivedAt: "2026-05-10",
  },
  {
    id: "RCPT-9009",
    poId: "PO-9009",
    receivedLineQuantities: { "PO-9009-1": 30 },
    receivedAt: "2026-05-12",
  },
  {
    id: "RCPT-1010",
    poId: "PO-1010",
    receivedLineQuantities: { "PO-1010-1": 24, "PO-1010-2": 1 },
    receivedAt: "2026-05-12",
  },
];

export const contracts: Contract[] = [
  {
    id: "CON-882",
    vendorId: "VEN-ACME",
    name: "West Ops Concrete Services SOW",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    totalContractValue: 250000,
    ytdSpendBeforeCurrentInvoice: 213500,
    allowedRateByDescription: {
      "Concrete pour labor": 325,
      "Pump rental": 1250,
    },
  },
  {
    id: "CON-415",
    vendorId: "VEN-BOLT",
    name: "Electrical Buildout MSA",
    startDate: "2026-01-01",
    endDate: "2026-09-30",
    totalContractValue: 27500,
    ytdSpendBeforeCurrentInvoice: 20500,
    allowedRateByDescription: {
      "Electrical rough-in labor": 180,
      "Panel materials": 4100,
    },
  },
  {
    id: "CON-731",
    vendorId: "VEN-NOVA",
    name: "Safety Supplies and Compliance MSA",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    totalContractValue: 160000,
    ytdSpendBeforeCurrentInvoice: 92400,
    allowedRateByDescription: {
      "Site PPE replenishment": 45,
      "Forklift safety inspection": 1200,
      "Fall protection anchor kits": 140,
    },
  },
  {
    id: "CON-906",
    vendorId: "VEN-ACME",
    name: "Concrete Structures Addendum",
    startDate: "2026-02-01",
    endDate: "2026-12-31",
    totalContractValue: 180000,
    ytdSpendBeforeCurrentInvoice: 129300,
    allowedRateByDescription: {
      "Retaining wall labor": 410,
      "Shotcrete equipment": 2200,
      "Concrete slab finishing labor": 335,
      "Finishing machine rental": 1450,
    },
  },
];

export const budgets: Budget[] = [
  {
    department: "Field Operations",
    project: "West Hospital Expansion",
    allocated: 620000,
    consumedBeforeCurrentInvoice: 488000,
  },
  {
    department: "Electrical",
    project: "West Hospital Expansion",
    allocated: 95000,
    consumedBeforeCurrentInvoice: 88400,
  },
  {
    department: "Safety",
    project: "Central Warehouse Retrofit",
    allocated: 42000,
    consumedBeforeCurrentInvoice: 22100,
  },
  {
    department: "Field Operations",
    project: "South Campus Build",
    allocated: 280000,
    consumedBeforeCurrentInvoice: 194000,
  },
  {
    department: "Electrical",
    project: "Central Data Center Upgrade",
    allocated: 140000,
    consumedBeforeCurrentInvoice: 106000,
  },
  {
    department: "Safety",
    project: "Central Logistics Hub",
    allocated: 78000,
    consumedBeforeCurrentInvoice: 42100,
  },
  {
    department: "Field Operations",
    project: "West Retaining Wall Program",
    allocated: 210000,
    consumedBeforeCurrentInvoice: 158200,
  },
  {
    department: "Electrical",
    project: "South Campus Emergency Retrofit",
    allocated: 165000,
    consumedBeforeCurrentInvoice: 139800,
  },
  {
    department: "Safety",
    project: "North Yard Expansion",
    allocated: 86000,
    consumedBeforeCurrentInvoice: 52100,
  },
  {
    department: "Field Operations",
    project: "Central Atrium Upgrade",
    allocated: 190000,
    consumedBeforeCurrentInvoice: 121400,
  },
];

export const invoices: Invoice[] = [
  {
    id: "INV-001",
    invoiceNumber: "ACME-2026-044",
    vendorId: "VEN-ACME",
    vendorName: "ACME Concrete",
    amount: 14250,
    date: "2026-05-06",
    dueDate: "2026-06-05",
    entity: "West Ops",
    department: "Field Operations",
    project: "West Hospital Expansion",
    requesterId: "user-requester-1",
    approverId: "user-approver-1",
    payerId: "user-payer-1",
    extractionConfidence: 0.98,
    remitTo: "ACH-ACME-001",
    poId: "PO-1001",
    contractId: "CON-882",
    lines: [
      { id: "INV-001-1", description: "Concrete pour labor", quantity: 40, unitPrice: 325, poLineId: "PO-1001-1" },
      { id: "INV-001-2", description: "Pump rental", quantity: 1, unitPrice: 1250, poLineId: "PO-1001-2" },
    ],
  },
  {
    id: "INV-002",
    invoiceNumber: "BOLT-2026-118",
    vendorId: "VEN-BOLT",
    vendorName: "Bolt Electrical",
    amount: 10780,
    date: "2026-05-07",
    dueDate: "2026-05-22",
    entity: "West Ops",
    department: "Electrical",
    project: "West Hospital Expansion",
    requesterId: "user-requester-2",
    approverId: "user-approver-2",
    payerId: "user-payer-2",
    extractionConfidence: 0.97,
    remitTo: "ACH-BOLT-200",
    poId: "PO-2002",
    contractId: "CON-415",
    lines: [
      { id: "INV-002-1", description: "Electrical rough-in labor", quantity: 32, unitPrice: 188, poLineId: "PO-2002-1" },
      { id: "INV-002-2", description: "Panel materials", quantity: 1, unitPrice: 4764, poLineId: "PO-2002-2" },
    ],
  },
  {
    id: "INV-003",
    invoiceNumber: "NOVA-2026-019",
    vendorId: "VEN-NOVA",
    vendorName: "Nova Safety Supplies",
    amount: 4750,
    date: "2026-05-08",
    dueDate: "2026-05-30",
    entity: "Central Ops",
    department: "Safety",
    project: "Central Warehouse Retrofit",
    requesterId: "user-requester-3",
    approverId: "user-approver-3",
    payerId: "user-payer-3",
    extractionConfidence: 0.94,
    remitTo: "ACH-NOVA-999",
    poId: "PO-3003",
    lines: [{ id: "INV-003-1", description: "Safety harness kits", quantity: 50, unitPrice: 95, poLineId: "PO-3003-1" }],
  },
  {
    id: "INV-HIST-003-A",
    invoiceNumber: "NOVA-2026-019",
    vendorId: "VEN-NOVA",
    vendorName: "Nova Safety Supplies",
    amount: 4750,
    date: "2026-05-02",
    dueDate: "2026-05-24",
    entity: "North Ops",
    department: "Safety",
    project: "North Yard Expansion",
    requesterId: "user-requester-4",
    approverId: "user-approver-4",
    payerId: "user-payer-4",
    extractionConfidence: 0.99,
    remitTo: "ACH-NOVA-777",
    poId: "PO-3003",
    lines: [{ id: "INV-HIST-003-A-1", description: "Safety harness kits", quantity: 50, unitPrice: 95, poLineId: "PO-3003-1" }],
  },
  {
    id: "INV-004",
    invoiceNumber: "ACME-2026-061",
    vendorId: "VEN-ACME",
    vendorName: "ACME Concrete",
    amount: 8800,
    date: "2026-05-09",
    dueDate: "2026-06-10",
    entity: "South Ops",
    department: "Field Operations",
    project: "South Campus Build",
    requesterId: "user-requester-5",
    approverId: "user-approver-5",
    payerId: "user-payer-5",
    extractionConfidence: 0.99,
    remitTo: "ACH-ACME-001",
    poId: "PO-4004",
    contractId: "CON-882",
    lines: [
      { id: "INV-004-1", description: "Foundation prep labor", quantity: 20, unitPrice: 360, poLineId: "PO-4004-1" },
      { id: "INV-004-2", description: "Site pump rental", quantity: 1, unitPrice: 1600, poLineId: "PO-4004-2" },
    ],
  },
  {
    id: "INV-005",
    invoiceNumber: "BOLT-2026-141",
    vendorId: "VEN-BOLT",
    vendorName: "Bolt Electrical",
    amount: 8850,
    date: "2026-05-10",
    dueDate: "2026-05-28",
    entity: "Central Ops",
    department: "Electrical",
    project: "Central Data Center Upgrade",
    requesterId: "user-requester-6",
    approverId: "user-approver-6",
    payerId: "user-payer-6",
    extractionConfidence: 0.96,
    remitTo: "ACH-BOLT-200",
    poId: "PO-5005",
    contractId: "CON-415",
    lines: [
      { id: "INV-005-1", description: "Switchgear install labor", quantity: 16, unitPrice: 220, poLineId: "PO-5005-1" },
      { id: "INV-005-2", description: "Switchgear materials", quantity: 1, unitPrice: 5330, poLineId: "PO-5005-2" },
    ],
  },
  {
    id: "INV-006",
    invoiceNumber: "NOVA-2026-045",
    vendorId: "VEN-NOVA",
    vendorName: "Nova Safety Supplies",
    amount: 4800,
    date: "2026-05-11",
    dueDate: "2026-06-02",
    entity: "Central Ops",
    department: "Safety",
    project: "Central Logistics Hub",
    requesterId: "user-requester-7",
    approverId: "user-approver-7",
    payerId: "user-payer-7",
    extractionConfidence: 0.99,
    remitTo: "ACH-NOVA-777",
    poId: "PO-6006",
    contractId: "CON-731",
    lines: [
      { id: "INV-006-1", description: "Site PPE replenishment", quantity: 80, unitPrice: 45, poLineId: "PO-6006-1" },
      { id: "INV-006-2", description: "Forklift safety inspection", quantity: 1, unitPrice: 1200, poLineId: "PO-6006-2" },
    ],
  },
  {
    id: "INV-007",
    invoiceNumber: "ACME-2026-078",
    vendorId: "VEN-ACME",
    vendorName: "ACME Concrete",
    amount: 9580,
    date: "2026-05-12",
    dueDate: "2026-06-12",
    entity: "West Ops",
    department: "Field Operations",
    project: "West Retaining Wall Program",
    requesterId: "user-requester-8",
    approverId: "user-approver-8",
    payerId: "user-payer-8",
    extractionConfidence: 0.96,
    remitTo: "ACH-ACME-001",
    poId: "PO-7007",
    contractId: "CON-906",
    lines: [
      { id: "INV-007-1", description: "Retaining wall labor", quantity: 18, unitPrice: 410, poLineId: "PO-7007-1" },
      { id: "INV-007-2", description: "Shotcrete equipment", quantity: 1, unitPrice: 2200, poLineId: "PO-7007-2" },
    ],
  },
  {
    id: "INV-008",
    invoiceNumber: "BOLT-2026-155",
    vendorId: "VEN-BOLT",
    vendorName: "Bolt Electrical",
    amount: 9280,
    date: "2026-05-12",
    dueDate: "2026-05-26",
    entity: "South Ops",
    department: "Electrical",
    project: "South Campus Emergency Retrofit",
    requesterId: "user-requester-9",
    approverId: "user-approver-9",
    payerId: "user-payer-9",
    extractionConfidence: 0.95,
    remitTo: "ACH-BOLT-ALT",
    poId: "PO-8008",
    contractId: "CON-415",
    lines: [
      { id: "INV-008-1", description: "Emergency panel replacement labor", quantity: 12, unitPrice: 240, poLineId: "PO-8008-1" },
      { id: "INV-008-2", description: "Panel replacement kit", quantity: 1, unitPrice: 6400, poLineId: "PO-8008-2" },
    ],
  },
  {
    id: "INV-009",
    invoiceNumber: "NOVA-2026-058",
    vendorId: "VEN-NOVA",
    vendorName: "Nova Safety Supplies",
    amount: 4200,
    date: "2026-05-13",
    dueDate: "2026-06-04",
    entity: "North Ops",
    department: "Safety",
    project: "North Yard Expansion",
    requesterId: "user-requester-10",
    approverId: "user-approver-10",
    payerId: "user-payer-10",
    extractionConfidence: 0.97,
    remitTo: "ACH-NOVA-777",
    poId: "PO-9009",
    contractId: "CON-731",
    lines: [{ id: "INV-009-1", description: "Fall protection anchor kits", quantity: 30, unitPrice: 140, poLineId: "PO-9009-1" }],
  },
  {
    id: "INV-010",
    invoiceNumber: "ACME-2026-084",
    vendorId: "VEN-ACME",
    vendorName: "ACME Concrete",
    amount: 9490,
    date: "2026-05-13",
    dueDate: "2026-06-14",
    entity: "Central Ops",
    department: "Field Operations",
    project: "Central Atrium Upgrade",
    requesterId: "user-requester-11",
    approverId: "user-approver-11",
    payerId: "user-payer-11",
    extractionConfidence: 0.98,
    remitTo: "ACH-ACME-001",
    poId: "PO-1010",
    contractId: "CON-906",
    lines: [
      { id: "INV-010-1", description: "Concrete slab finishing labor", quantity: 24, unitPrice: 335, poLineId: "PO-1010-1" },
      { id: "INV-010-2", description: "Finishing machine rental", quantity: 1, unitPrice: 1450, poLineId: "PO-1010-2" },
    ],
  },
];

export const visibleInvoiceIds = ["INV-001", "INV-002", "INV-003", "INV-004", "INV-005", "INV-006", "INV-007", "INV-008", "INV-009", "INV-010"];

export function getInvoiceById(id: string): Invoice | undefined {
  return invoices.find((invoice) => invoice.id === id);
}

export function getEvidenceBundle(invoiceId: string) {
  const invoice = getInvoiceById(invoiceId);
  if (!invoice) return undefined;

  const vendor = vendors.find((item) => item.id === invoice.vendorId);
  const purchaseOrder = purchaseOrders.find((item) => item.id === invoice.poId);
  const receipt = receipts.find((item) => item.poId === invoice.poId);
  const contract = contracts.find((item) => item.id === invoice.contractId);
  const budget = budgets.find((item) => item.department === invoice.department && item.project === invoice.project);
  const duplicateCandidates = invoices.filter(
    (candidate) =>
      candidate.id !== invoice.id &&
      candidate.vendorId === invoice.vendorId &&
      candidate.invoiceNumber === invoice.invoiceNumber &&
      candidate.amount === invoice.amount,
  );

  return {
    invoice,
    vendor,
    purchaseOrder,
    receipt,
    contract,
    budget,
    duplicateCandidates,
    tenantPolicy,
  };
}
