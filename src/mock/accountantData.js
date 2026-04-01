// Accountant dashboard mock data
export const pendingPayments = [
  {
    orderId: "ORD-2026-0071",
    franchiseeName: "Dar es Salaam Homes",
    houseType: "Model S — Studio",
    region: "TZ",
    totalAmount: "28,500,000 TZS",
    totalUsd: "$11,400",
    submittedAt: "2026-03-25",
    paymentMethod: "BANK_TRANSFER",
    proofUrl: "#",
  },
  {
    orderId: "ORD-2026-0079",
    franchiseeName: "Mombasa Affordable Living",
    houseType: "Model L — 3 Bedroom",
    region: "KE",
    totalAmount: "3,250,000 KES",
    totalUsd: "$25,000",
    submittedAt: "2026-03-28",
    paymentMethod: "BANK_TRANSFER",
    proofUrl: "#",
  },
];

export const completedPayments = [
  {
    orderId: "ORD-2026-0042",
    franchiseeName: "Kigali Green Homes Ltd",
    houseType: "Model M — 2 Bedroom",
    region: "RW",
    totalAmount: "22,450,000 RWF",
    totalUsd: "$17,137",
    confirmedAt: "2026-01-18",
    confirmedBy: "Acc. Jane Mugisha",
  },
  {
    orderId: "ORD-2026-0058",
    franchiseeName: "Nairobi Housing Partners",
    houseType: "Model L — 3 Bedroom",
    region: "KE",
    totalAmount: "3,250,000 KES",
    totalUsd: "$25,000",
    confirmedAt: "2026-02-25",
    confirmedBy: "Acc. James Odera",
  },
  {
    orderId: "ORD-2026-0063",
    franchiseeName: "Kampala Build Corp",
    houseType: "Model X — Duplex",
    region: "UG",
    totalAmount: "142,000,000 UGX",
    totalUsd: "$38,378",
    confirmedAt: "2026-03-12",
    confirmedBy: "Acc. Jane Mugisha",
  },
  {
    orderId: "ORD-2026-0075",
    franchiseeName: "Kigali Green Homes Ltd",
    houseType: "Model M — 2 Bedroom",
    region: "RW",
    totalAmount: "22,450,000 RWF",
    totalUsd: "$17,137",
    confirmedAt: "2026-03-03",
    confirmedBy: "Acc. Jane Mugisha",
  },
];

export const financialSummary = {
  totalConfirmed: "$97,652",
  totalPending: "$36,400",
  totalProcessed: "$134,052",
  ordersThisMonth: 3,
};
