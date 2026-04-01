import { useState, useEffect } from "react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { useRole } from "../../context/RoleContext";
import { getConfirmedPayments } from "../../mock/paymentStore";
import { jsPDF } from "jspdf";
import {
  Search, Download, Eye, X, FileText, Calendar,
  DollarSign, CheckCircle2, User, Building2, Home,
  Globe, CreditCard, ArrowUpDown, ArrowUp, ArrowDown,
  Printer, Mail, ClipboardCopy, AlertCircle, Filter,
  TrendingUp, Receipt
} from "lucide-react";

/* ── Region flag/label mapping ── */
const regionMeta = {
  RW: { flag: "🇷🇼", label: "Rwanda", currency: "RWF" },
  KE: { flag: "🇰🇪", label: "Kenya", currency: "KES" },
  TZ: { flag: "🇹🇿", label: "Tanzania", currency: "TZS" },
  UG: { flag: "🇺🇬", label: "Uganda", currency: "UGX" },
};

/* ══════════════════════════════════════════
   PDF RECEIPT GENERATOR
   ══════════════════════════════════════════ */
function generatePaymentPDF(payment) {
  const doc = new jsPDF();
  const region = regionMeta[payment.region] || { flag: "", label: payment.region, currency: "" };
  const pageW = doc.internal.pageSize.getWidth();

  // ── Colors ──
  const primaryGreen = [26, 107, 58]; // #1A6B3A
  const darkGreen = [15, 76, 42];
  const lightGreen = [232, 245, 238];
  const gray = [85, 85, 85];
  const lightGray = [200, 200, 200];

  let y = 15;

  // ── Header bar ──
  doc.setFillColor(...primaryGreen);
  doc.rect(0, 0, pageW, 42, "F");

  // Logo text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("ADHI", 20, 18);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("House in a Kit — Africa", 20, 25);

  // Receipt title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("PAYMENT RECEIPT", pageW - 20, 18, { align: "right" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Receipt #: ${payment.orderId}`, pageW - 20, 26, { align: "right" });
  doc.text(`Generated: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`, pageW - 20, 33, { align: "right" });

  y = 55;

  // ── Payment Confirmed badge ──
  doc.setFillColor(...lightGreen);
  doc.roundedRect(20, y, pageW - 40, 16, 3, 3, "F");
  doc.setTextColor(...primaryGreen);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("✓  PAYMENT CONFIRMED", pageW / 2, y + 10.5, { align: "center" });

  y += 28;

  // ── Two-column info block ──
  const drawInfoRow = (label, value, x, yPos) => {
    doc.setTextColor(140, 140, 140);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(label.toUpperCase(), x, yPos);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(value, x, yPos + 6);
  };

  // Left column
  drawInfoRow("Order ID", payment.orderId, 20, y);
  drawInfoRow("Franchisee", payment.franchiseeName, 20, y + 20);
  drawInfoRow("House Type", payment.houseType, 20, y + 40);

  // Right column
  drawInfoRow("Region", `${region.label} (${payment.region})`, pageW / 2 + 10, y);
  drawInfoRow("Confirmed Date", payment.confirmedAt, pageW / 2 + 10, y + 20);
  drawInfoRow("Confirmed By", payment.confirmedBy, pageW / 2 + 10, y + 40);

  y += 65;

  // ── Divider ──
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.3);
  doc.line(20, y, pageW - 20, y);
  y += 12;

  // ── Payment Summary Table ──
  doc.setTextColor(...gray);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Payment Summary", 20, y);
  y += 10;

  // Table header
  doc.setFillColor(245, 246, 250);
  doc.rect(20, y, pageW - 40, 10, "F");
  doc.setTextColor(140, 140, 140);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("DESCRIPTION", 25, y + 7);
  doc.text("AMOUNT (LOCAL)", pageW / 2, y + 7, { align: "center" });
  doc.text("AMOUNT (USD)", pageW - 25, y + 7, { align: "right" });
  y += 14;

  // Row: House Kit
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`${payment.houseType} — Complete Kit`, 25, y + 5);
  doc.text(payment.totalAmount, pageW / 2, y + 5, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.text(payment.totalUsd, pageW - 25, y + 5, { align: "right" });
  y += 12;

  // Divider within table
  doc.setDrawColor(230, 230, 230);
  doc.line(20, y, pageW - 20, y);
  y += 4;

  // Row: VAT
  doc.setFont("helvetica", "normal");
  doc.setTextColor(140, 140, 140);
  doc.text("VAT (Included)", 25, y + 5);
  doc.text("Included", pageW / 2, y + 5, { align: "center" });
  doc.text("Included", pageW - 25, y + 5, { align: "right" });
  y += 14;

  // Total row
  doc.setFillColor(...primaryGreen);
  doc.rect(20, y, pageW - 40, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL PAID", 25, y + 9.5);
  doc.text(payment.totalAmount, pageW / 2, y + 9.5, { align: "center" });
  doc.setFontSize(12);
  doc.text(payment.totalUsd, pageW - 25, y + 9.5, { align: "right" });

  y += 28;

  // ── Audit Trail ──
  doc.setTextColor(...gray);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Audit Trail", 20, y);
  y += 10;

  const auditRows = [
    { date: payment.confirmedAt, action: "Payment Confirmed", actor: payment.confirmedBy },
    { date: payment.confirmedAt, action: "Payment Proof Verified", actor: "System" },
    { date: payment.confirmedAt, action: "Order Released to Procurement", actor: "ADHI Platform" },
  ];

  auditRows.forEach((row, i) => {
    const rowY = y + i * 12;
    if (i % 2 === 0) {
      doc.setFillColor(250, 250, 252);
      doc.rect(20, rowY - 3, pageW - 40, 12, "F");
    }
    doc.setTextColor(140, 140, 140);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(row.date, 25, rowY + 5);
    doc.setTextColor(30, 30, 30);
    doc.text(row.action, 60, rowY + 5);
    doc.setTextColor(100, 100, 100);
    doc.text(row.actor, pageW - 25, rowY + 5, { align: "right" });
  });

  y += auditRows.length * 12 + 15;

  // ── Footer ──
  doc.setDrawColor(...lightGray);
  doc.line(20, y, pageW - 20, y);
  y += 8;
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("This is a system-generated receipt from the ADHI Housing Platform.", pageW / 2, y, { align: "center" });
  doc.text("For queries, contact finance@adhi.io · www.adhi.io", pageW / 2, y + 5, { align: "center" });
  doc.text(`Document ID: ${payment.orderId}-REC-${Date.now().toString(36).toUpperCase()}`, pageW / 2, y + 10, { align: "center" });

  // Save
  doc.save(`ADHI_Receipt_${payment.orderId}.pdf`);
}

/* ══════════════════════════════════════════
   PAYMENT HISTORY PAGE
   ══════════════════════════════════════════ */
export default function PaymentHistory() {
  const { roleConfig } = useRole();
  
  const [completedPayments, setCompletedPayments] = useState([]);
  
  useEffect(() => {
     setCompletedPayments(getConfirmedPayments());
  }, []);

  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("ALL");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [detailPayment, setDetailPayment] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Sorting ── */
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="text-gray-300 ml-1" />;
    return sortDir === "asc"
      ? <ArrowUp size={12} className="text-adhi-primary ml-1" />
      : <ArrowDown size={12} className="text-adhi-primary ml-1" />;
  };

  /* ── Filter + sort ── */
  const filtered = completedPayments
    .filter(p => {
      const matchSearch =
        p.orderId.toLowerCase().includes(search.toLowerCase()) ||
        p.franchiseeName.toLowerCase().includes(search.toLowerCase()) ||
        p.houseType.toLowerCase().includes(search.toLowerCase()) ||
        p.confirmedBy.toLowerCase().includes(search.toLowerCase());
      const matchRegion = regionFilter === "ALL" || p.region === regionFilter;
      return matchSearch && matchRegion;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      let va, vb;
      if (sortField === "amount") {
        va = parseFloat(a.totalUsd.replace(/[$,]/g, ""));
        vb = parseFloat(b.totalUsd.replace(/[$,]/g, ""));
      } else if (sortField === "date") {
        va = new Date(a.confirmedAt).getTime();
        vb = new Date(b.confirmedAt).getTime();
      } else if (sortField === "franchisee") {
        va = a.franchiseeName; vb = b.franchiseeName;
      } else {
        va = a[sortField]; vb = b[sortField];
      }
      if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc" ? va - vb : vb - va;
    });

  /* ── Summary ── */
  const totalAmount = completedPayments.reduce((sum, p) => sum + parseFloat(p.totalUsd.replace(/[$,]/g, "")), 0);
  const uniqueFranchisees = new Set(completedPayments.map(p => p.franchiseeName)).size;
  const uniqueRegions = new Set(completedPayments.map(p => p.region)).size;

  /* ── Download All ── */
  const downloadAllPDFs = () => {
    filtered.forEach((payment, i) => {
      setTimeout(() => generatePaymentPDF(payment), i * 400);
    });
    showToast(`Downloading ${filtered.length} receipt(s)…`);
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold text-white bg-emerald-500"
          style={{ animation: "slideInRight .3s ease" }}
        >
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* Header */}
      <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "PAYMENT HISTORY"]} />
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Payment History</h2>
          <p className="text-sm text-gray-500 mt-1">All confirmed payments with audit trail.</p>
        </div>
        <button
          onClick={downloadAllPDFs}
          className="bg-adhi-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-adhi-dark transition-all duration-200 flex items-center gap-2 shadow-lg shadow-adhi-primary/20 hover:shadow-xl hover:shadow-adhi-primary/30 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Download size={16} /> Download All Receipts
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Confirmed", value: `$${totalAmount.toLocaleString()}`, icon: DollarSign, color: "text-adhi-primary", bg: "bg-adhi-surface" },
          { label: "Payments", value: completedPayments.length, icon: Receipt, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Franchisees", value: uniqueFranchisees, icon: Building2, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Regions", value: uniqueRegions, icon: Globe, color: "text-teal-600", bg: "bg-teal-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4 shadow-sm">
            <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order, franchisee, house type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {["ALL", "RW", "KE", "TZ", "UG"].map(r => (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                regionFilter === r
                  ? "bg-adhi-primary text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {r !== "ALL" && <span className="text-xs">{regionMeta[r]?.flag}</span>}
              {r === "ALL" ? "ALL" : r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Order</th>
              <th
                className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer select-none hover:text-gray-600"
                onClick={() => handleSort("franchisee")}
              >
                <span className="flex items-center">Franchisee <SortIcon field="franchisee" /></span>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">House Type</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Region</th>
              <th
                className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right cursor-pointer select-none hover:text-gray-600"
                onClick={() => handleSort("amount")}
              >
                <span className="flex items-center justify-end">Amount <SortIcon field="amount" /></span>
              </th>
              <th
                className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer select-none hover:text-gray-600"
                onClick={() => handleSort("date")}
              >
                <span className="flex items-center">Confirmed <SortIcon field="date" /></span>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">By</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                  <FileText size={32} className="mx-auto mb-3 text-gray-300" />
                  <p className="font-semibold">No payments found</p>
                  <p className="text-xs mt-1">Adjust your search or filter criteria.</p>
                </td>
              </tr>
            )}
            {filtered.map(payment => {
              const region = regionMeta[payment.region];
              return (
                <tr
                  key={payment.orderId + payment.confirmedAt}
                  className="border-t border-gray-50 hover:bg-adhi-light/40 transition-colors cursor-pointer group"
                  onClick={() => setDetailPayment(payment)}
                >
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-adhi-primary bg-adhi-surface px-2.5 py-1 rounded-lg text-xs">
                      {payment.orderId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-adhi-primary to-adhi-dark flex items-center justify-center text-white text-xs font-bold">
                        {payment.franchiseeName.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-900">{payment.franchiseeName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{payment.houseType}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-600">
                      {region?.flag} {payment.region}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div>
                      <p className="font-bold text-gray-900">{payment.totalUsd}</p>
                      <p className="text-[11px] text-gray-400">{payment.totalAmount}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{payment.confirmedAt}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{payment.confirmedBy}</td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setDetailPayment(payment)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-adhi-surface hover:border-adhi-primary/30 text-gray-500 hover:text-adhi-primary transition-all"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => {
                          generatePaymentPDF(payment);
                          showToast(`Receipt for ${payment.orderId} downloaded.`);
                        }}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-200 text-gray-500 hover:text-emerald-600 transition-all"
                        title="Download PDF Receipt"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ══════════════════════════════════════
         DETAIL DRAWER
         ══════════════════════════════════════ */}
      {detailPayment && (() => {
        const region = regionMeta[detailPayment.region] || { flag: "🌍", label: detailPayment.region, currency: "" };
        return (
          <>
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
              onClick={() => setDetailPayment(null)}
              style={{ animation: "fadeIn .2s ease" }}
            />
            <div
              className="fixed top-0 right-0 h-full w-full max-w-[520px] bg-white shadow-2xl z-[101] flex flex-col overflow-hidden"
              style={{ animation: "slideInRight .3s ease" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Receipt size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Payment Receipt</h3>
                    <p className="text-xs text-gray-400 font-mono">{detailPayment.orderId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      generatePaymentPDF(detailPayment);
                      showToast(`Receipt downloaded.`);
                    }}
                    className="px-4 py-2 rounded-lg bg-adhi-primary text-white text-xs font-bold hover:bg-adhi-dark transition-colors flex items-center gap-1.5"
                  >
                    <Download size={12} /> PDF
                  </button>
                  <button
                    onClick={() => setDetailPayment(null)}
                    className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto">
                {/* Status banner */}
                <div className="mx-6 mt-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl px-5 py-4 flex items-center gap-3 border border-emerald-100">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-800">Payment Confirmed</p>
                    <p className="text-xs text-emerald-600">Verified on {detailPayment.confirmedAt} by {detailPayment.confirmedBy}</p>
                  </div>
                </div>

                {/* Amount hero */}
                <div className="px-6 py-6 text-center border-b border-gray-100">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Paid</p>
                  <p className="text-4xl font-extrabold text-gray-900">{detailPayment.totalUsd}</p>
                  <p className="text-sm text-gray-400 mt-1">{detailPayment.totalAmount}</p>
                </div>

                {/* Details grid */}
                <div className="px-6 py-5 border-b border-gray-100 space-y-4">
                  {[
                    { icon: FileText, label: "Order ID", value: detailPayment.orderId },
                    { icon: Building2, label: "Franchisee", value: detailPayment.franchiseeName },
                    { icon: Home, label: "House Type", value: detailPayment.houseType },
                    { icon: Globe, label: "Region", value: `${region.flag} ${region.label} (${detailPayment.region})` },
                    { icon: Calendar, label: "Confirmed Date", value: detailPayment.confirmedAt },
                    { icon: User, label: "Confirmed By", value: detailPayment.confirmedBy },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
                        <p className="text-sm font-medium text-gray-900">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Audit trail */}
                <div className="px-6 py-5">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ClipboardCopy size={16} className="text-adhi-primary" />
                    Audit Trail
                  </h4>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100" />
                    <div className="space-y-4">
                      {[
                        { time: detailPayment.confirmedAt, action: "Payment Confirmed", actor: detailPayment.confirmedBy, color: "bg-emerald-500" },
                        { time: detailPayment.confirmedAt, action: "Payment Proof Verified", actor: "System", color: "bg-blue-500" },
                        { time: detailPayment.confirmedAt, action: "Order Released to Procurement", actor: "ADHI Platform", color: "bg-adhi-primary" },
                        { time: detailPayment.confirmedAt, action: "Franchisee Notified", actor: "System", color: "bg-purple-500" },
                      ].map((entry, i) => (
                        <div key={i} className="flex items-start gap-3 relative">
                          <div className={`w-[8px] h-[8px] rounded-full mt-1.5 ${entry.color} ring-4 ring-white z-10 ml-[11px]`} />
                          <div className="flex-1 ml-1">
                            <p className="text-sm font-medium text-gray-800">{entry.action}</p>
                            <p className="text-[11px] text-gray-400">{entry.time} · {entry.actor}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Download section */}
                <div className="px-6 py-5 border-t border-gray-100">
                  <button
                    onClick={() => {
                      generatePaymentPDF(detailPayment);
                      showToast(`Receipt downloaded.`);
                    }}
                    className="w-full bg-gradient-to-r from-adhi-primary to-adhi-dark text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-adhi-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Download size={16} /> Download PDF Receipt
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
