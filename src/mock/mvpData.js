// ═══════════════════════════════════════════════════════════════
// ADHI MVP — Centralised Data Store (For Spaceberry)
//
// All data is text-field-based. No formulas, no computation.
// The admin defines BOQ rows as plain text; the franchisee sees
// those exact values when placing an order (read-only).
// ═══════════════════════════════════════════════════════════════

import { regions } from "./houseTypes";

/* ── Product ─────────────────────────────────────────────────── */
export const MVP_PRODUCT = {
  id: "PROD-CS-001",
  name: "Core Shell",
  floorArea: "37.5 m²",
  description:
    "A complete structural housing kit — foundation to roof — ready for finishing. Designed for rapid assembly with pre-fabricated components.",
  imageUrl:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop",
};

/* ── BOQ Template (Admin-defined text fields) ────────────────── */
let _boqTemplate = [
  { id: "BOQ-001", code: "FND-SET-001", category: "Foundation", description: "Setting out",                      unit: "item", qty: "1",    rate: "150",   amount: "150"    },
  { id: "BOQ-002", code: "FND-EXC-001", category: "Foundation", description: "Excavation for strip footing",     unit: "m3",   qty: "7.5",  rate: "12",    amount: "90"     },
  { id: "BOQ-003", code: "FND-HCF-001", category: "Foundation", description: "Hardcore fill 200 mm",             unit: "m3",   qty: "7.8",  rate: "28",    amount: "218.4"  },
  { id: "BOQ-004", code: "FND-SND-001", category: "Foundation", description: "Sand blinding 50 mm",              unit: "m3",   qty: "1.95", rate: "22",    amount: "42.9"   },
  { id: "BOQ-005", code: "FND-BLN-001", category: "Foundation", description: "Concrete blinding 40 mm",          unit: "m3",   qty: "1.56", rate: "115",   amount: "179.4"  },
  { id: "BOQ-006", code: "FND-STR-001", category: "Foundation", description: "Strip footing concrete",           unit: "m3",   qty: "3.75", rate: "135",   amount: "506.25" },
  { id: "BOQ-007", code: "FND-DPM-001", category: "Foundation", description: "Damp proof membrane",              unit: "m2",   qty: "39",   rate: "3.5",   amount: "136.5"  },
  { id: "BOQ-008", code: "FND-SLB-001", category: "Foundation", description: "Reinforced slab concrete 100 mm",  unit: "m3",   qty: "3.9",  rate: "145",   amount: "565.5"  },
  { id: "BOQ-009", code: "FND-MSH-001", category: "Foundation", description: "Slab reinforcement mesh",          unit: "m2",   qty: "39",   rate: "8",     amount: "312"    },
  { id: "BOQ-010", code: "WAL-EXT-001", category: "Walls",      description: "External wall system",             unit: "m2",   qty: "62.5", rate: "45",    amount: "2,812.5"},
  { id: "BOQ-011", code: "STR-RBM-001", category: "Structure",  description: "Ring beam",                        unit: "m",    qty: "25",   rate: "18",    amount: "450"    },
  { id: "BOQ-012", code: "ROF-FRM-001", category: "Roof",       description: "Roof structure",                   unit: "m2",   qty: "45",   rate: "22",    amount: "990"    },
  { id: "BOQ-013", code: "ROF-COV-001", category: "Roof",       description: "Roof covering",                    unit: "m2",   qty: "45",   rate: "14",    amount: "630"    },
  { id: "BOQ-014", code: "ROF-RDG-001", category: "Roof",       description: "Ridge cap",                        unit: "m",    qty: "6.5",  rate: "7",     amount: "45.5"   },
  { id: "BOQ-015", code: "ROF-FAS-001", category: "Roof",       description: "Fascia board",                     unit: "m",    qty: "25",   rate: "6",     amount: "150"    },
  { id: "BOQ-016", code: "ROF-GTR-001", category: "Roof",       description: "Gutters",                          unit: "m",    qty: "18",   rate: "9",     amount: "162"    },
  { id: "BOQ-017", code: "ROF-DWP-001", category: "Roof",       description: "Downpipes",                        unit: "nr",   qty: "2",    rate: "25",    amount: "50"     },
  { id: "BOQ-018", code: "OPN-DRF-001", category: "Openings",   description: "External door frame provision",    unit: "nr",   qty: "1",    rate: "80",    amount: "80"     },
  { id: "BOQ-019", code: "OPN-WOP-001", category: "Openings",   description: "Window opening provisions",        unit: "nr",   qty: "4",    rate: "25",    amount: "100"    },
  { id: "BOQ-020", code: "OPN-LNT-001", category: "Openings",   description: "Lintels to openings",              unit: "m",    qty: "8",    rate: "15",    amount: "120"    },
];

export function getBOQTemplate() {
  return _boqTemplate.map((row) => ({ ...row }));
}

export function saveBOQTemplate(rows) {
  _boqTemplate = rows.map((row) => ({ ...row }));
}

/* ── BOQ Categories (for grouping in display) ────────────────── */
export const BOQ_CATEGORIES = ["Foundation", "Walls", "Structure", "Roof", "Openings"];

/* ── Order Status Flow ───────────────────────────────────────── */
export const MVP_STATUS_FLOW = [
  "SUBMITTED",
  "PAYMENT_PENDING",
  "PAYMENT_VERIFIED",
  "APPROVED",
  "IN_FULFILLMENT",
];

export const MVP_STATUS_LABELS = {
  SUBMITTED: "Submitted",
  PAYMENT_PENDING: "Payment Pending",
  PAYMENT_VERIFIED: "Payment Verified",
  APPROVED: "Approved",
  IN_FULFILLMENT: "In Fulfillment",
};

export const MVP_STATUS_COLORS = {
  SUBMITTED: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  PAYMENT_PENDING: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  PAYMENT_VERIFIED: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  APPROVED: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500" },
  IN_FULFILLMENT: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
};

/* ── Orders Store ────────────────────────────────────────────── */
let _nextOrderNum = 102;

let _mvpOrders = [
  {
    id: "ORD-2026-0098",
    product: "Core Shell",
    units: 2,
    deliveryLocation: "Kigali, Gasabo District",
    regionCode: "RW",
    boqSnapshot: getBOQTemplate(),
    totalCost: "15,581.90",
    currency: "USD",
    status: "IN_FULFILLMENT",
    submittedAt: "2026-04-10",
    paymentProofUrl: null,
    paymentRef: "TXN-88421",
    paymentNotes: "Wire transfer from BK account",
  },
  {
    id: "ORD-2026-0099",
    product: "Core Shell",
    units: 1,
    deliveryLocation: "Nairobi, Westlands",
    regionCode: "KE",
    boqSnapshot: getBOQTemplate(),
    totalCost: "7,790.95",
    currency: "USD",
    status: "APPROVED",
    submittedAt: "2026-04-18",
    paymentProofUrl: null,
    paymentRef: "TXN-90215",
    paymentNotes: "",
  },
  {
    id: "ORD-2026-0100",
    product: "Core Shell",
    units: 3,
    deliveryLocation: "Dar es Salaam, Kinondoni",
    regionCode: "TZ",
    boqSnapshot: getBOQTemplate(),
    totalCost: "23,372.85",
    currency: "USD",
    status: "PAYMENT_VERIFIED",
    submittedAt: "2026-04-22",
    paymentProofUrl: null,
    paymentRef: "TXN-91003",
    paymentNotes: "M-Pesa confirmation",
  },
  {
    id: "ORD-2026-0101",
    product: "Core Shell",
    units: 1,
    deliveryLocation: "Kampala, Makindye",
    regionCode: "UG",
    boqSnapshot: getBOQTemplate(),
    totalCost: "7,790.95",
    currency: "USD",
    status: "PAYMENT_PENDING",
    submittedAt: "2026-05-01",
    paymentProofUrl: null,
    paymentRef: "",
    paymentNotes: "",
  },
];

export function getMVPOrders() {
  return _mvpOrders.map((o) => ({ ...o }));
}

export function addMVPOrder(order) {
  const newOrder = {
    ...order,
    id: `ORD-2026-${String(_nextOrderNum++).padStart(4, "0")}`,
    status: "SUBMITTED",
    submittedAt: new Date().toISOString().split("T")[0],
  };
  _mvpOrders.unshift(newOrder);
  return newOrder;
}

export function updateMVPOrderStatus(orderId, newStatus) {
  const idx = _mvpOrders.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    _mvpOrders[idx] = { ..._mvpOrders[idx], status: newStatus };
  }
}

/* ── Helper: Compute grand total from template ───────────────── */
export function computeBOQTotal(rows) {
  return rows.reduce(
    (sum, r) => sum + (parseFloat(String(r.amount).replace(/,/g, "")) || 0),
    0
  );
}
