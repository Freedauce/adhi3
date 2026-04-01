// Shared store for orders and payments

let _orderId = [71, 79];

const nextId = () => {
    const next = Math.max(..._orderId) + 1;
    _orderId.push(next);
    return `ORD-2026-${String(next).padStart(4, "0")}`;
};

const _payments = [
    {
        orderId: "ORD-2026-0071",
        franchiseeName: "Dar es Salaam Homes",
        houseType: "Model S — Studio",
        region: "TZ",
        totalAmount: "28,500,000 TZS",
        totalUsd: "$11,400",
        submittedAt: "2026-03-25",
        paymentMethod: "BANK_TRANSFER",
        status: "PENDING",
        proofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80", // mock receipt image
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
        status: "PENDING",
        proofUrl: "https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=400&q=80", // mock receipt image
    },
    {
        orderId: "ORD-2026-0042",
        franchiseeName: "Kigali Green Homes Ltd",
        houseType: "Model M — 2 Bedroom",
        region: "RW",
        totalAmount: "22,450,000 RWF",
        totalUsd: "$17,137",
        confirmedAt: "2026-01-18",
        confirmedBy: "Acc. Jane Mugisha",
        status: "CONFIRMED",
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
        status: "CONFIRMED",
    },
];

export function getPayments() {
    return [..._payments];
}

export function getPendingPayments() {
    return _payments.filter(p => p.status === "PENDING");
}

export function getConfirmedPayments() {
    return _payments.filter(p => p.status === "CONFIRMED");
}

export function addPayment(paymentData) {
    const newPayment = {
        ...paymentData,
        orderId: nextId(),
        status: "PENDING",
        submittedAt: new Date().toISOString().split("T")[0],
    };
    _payments.unshift(newPayment);
    return newPayment;
}

export function confirmPayment(orderId, confirmedBy = "Acc. Jane") {
    const idx = _payments.findIndex(p => p.orderId === orderId);
    if (idx !== -1) {
        _payments[idx] = {
            ..._payments[idx],
            status: "CONFIRMED",
            confirmedAt: new Date().toISOString().split("T")[0],
            confirmedBy,
        };
    }
}
