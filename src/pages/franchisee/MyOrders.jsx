import { useState } from "react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { useRole } from "../../context/RoleContext";
import {
  getMVPOrders,
  MVP_STATUS_FLOW,
  MVP_STATUS_LABELS,
  MVP_STATUS_COLORS,
  MVP_PRODUCT,
} from "../../mock/mvpData";
import {
  Package, ChevronDown, ChevronUp, MapPin, FileText,
  CheckCircle2, Clock, CreditCard, ShieldCheck, Truck,
  Home,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   MY ORDERS — Order Status Tracker (MVP)

   Shows all franchisee orders with a 5-step visual progress stepper:
   Submitted → Payment Pending → Payment Verified → Approved → In Fulfillment
   ═══════════════════════════════════════════════════════════════════ */

const STATUS_ICONS = {
  SUBMITTED: Clock,
  PAYMENT_PENDING: CreditCard,
  PAYMENT_VERIFIED: CheckCircle2,
  APPROVED: ShieldCheck,
  IN_FULFILLMENT: Truck,
};

export default function MyOrders() {
  const { roleConfig } = useRole();
  const orders = getMVPOrders();
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <Breadcrumb
        items={[
          "ADHI DASHBOARD",
          roleConfig.perspectiveLabel,
          "MY ORDERS",
        ]}
      />

      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          My Orders
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Track all your Core Shell orders and payment statuses.
        </p>
      </div>

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {MVP_STATUS_FLOW.map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          const colors = MVP_STATUS_COLORS[status];
          const Icon = STATUS_ICONS[status];
          return (
            <div
              key={status}
              className={`${colors.bg} border ${colors.border} rounded-xl px-4 py-3 flex items-center gap-3`}
            >
              <Icon size={16} className={colors.text} />
              <div>
                <div
                  className={`text-lg font-black tabular-nums ${colors.text}`}
                >
                  {count}
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {MVP_STATUS_LABELS[status]}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Orders List ── */}
      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedId === order.id;
          const statusColors = MVP_STATUS_COLORS[order.status];
          const currentIdx = MVP_STATUS_FLOW.indexOf(order.status);

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              {/* ── Order Header Row ── */}
              <button
                onClick={() =>
                  setExpandedId(isExpanded ? null : order.id)
                }
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-adhi-surface flex items-center justify-center shrink-0">
                    <Home size={18} className="text-adhi-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-bold text-adhi-primary text-sm">
                        {order.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`}
                        />
                        {MVP_STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5 truncate">
                      {order.units}× {order.product} · {order.deliveryLocation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-black text-gray-900 tabular-nums">
                      ${order.totalCost}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {order.submittedAt}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400" />
                  )}
                </div>
              </button>

              {/* ── Expanded Details ── */}
              {isExpanded && (
                <div className="border-t border-gray-100 px-6 py-6 bg-gray-50/30">
                  {/* Status Pipeline */}
                  <div className="mb-8">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                      Order Progress
                    </h4>
                    <div className="flex items-center gap-0">
                      {MVP_STATUS_FLOW.map((step, idx) => {
                        const StepIcon = STATUS_ICONS[step];
                        const isPast = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;
                        const colors = MVP_STATUS_COLORS[step];

                        return (
                          <div key={step} className="flex items-center flex-1 last:flex-none">
                            {/* Step circle */}
                            <div className="flex flex-col items-center gap-1.5">
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                  isCurrent
                                    ? `${colors.bg} ring-4 ring-offset-2 ${colors.border} ring-current/20`
                                    : isPast
                                    ? "bg-emerald-100"
                                    : "bg-gray-100"
                                }`}
                              >
                                <StepIcon
                                  size={16}
                                  className={
                                    isCurrent
                                      ? colors.text
                                      : isPast
                                      ? "text-emerald-500"
                                      : "text-gray-400"
                                  }
                                />
                              </div>
                              <span
                                className={`text-[9px] font-bold text-center leading-tight max-w-[80px] ${
                                  isCurrent
                                    ? colors.text
                                    : isPast
                                    ? "text-emerald-600"
                                    : "text-gray-400"
                                }`}
                              >
                                {MVP_STATUS_LABELS[step]}
                              </span>
                            </div>

                            {/* Connector line */}
                            {idx < MVP_STATUS_FLOW.length - 1 && (
                              <div
                                className={`flex-1 h-0.5 mx-2 rounded-full ${
                                  idx < currentIdx
                                    ? "bg-emerald-300"
                                    : "bg-gray-200"
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Detail Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DetailCard
                      icon={Package}
                      label="Product"
                      value={`${order.product} (${MVP_PRODUCT.floorArea})`}
                    />
                    <DetailCard
                      icon={Home}
                      label="Units"
                      value={`${order.units} unit${order.units > 1 ? "s" : ""}`}
                    />
                    <DetailCard
                      icon={MapPin}
                      label="Delivery"
                      value={order.deliveryLocation}
                    />
                    <DetailCard
                      icon={CreditCard}
                      label="Total"
                      value={`$${order.totalCost}`}
                      highlight
                    />
                  </div>

                  {/* Payment Info */}
                  {(order.paymentRef || order.paymentNotes) && (
                    <div className="mt-5 bg-white rounded-xl border border-gray-100 p-4">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                        <FileText
                          size={10}
                          className="inline mr-1 -mt-0.5"
                        />
                        Payment Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {order.paymentRef && (
                          <div>
                            <span className="text-gray-400 text-xs">
                              Reference:
                            </span>
                            <span className="ml-2 font-semibold text-gray-900">
                              {order.paymentRef}
                            </span>
                          </div>
                        )}
                        {order.paymentNotes && (
                          <div>
                            <span className="text-gray-400 text-xs">
                              Notes:
                            </span>
                            <span className="ml-2 text-gray-700">
                              {order.paymentNotes}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <Package size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No orders yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              Browse the catalog to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Detail Card Helper ── */
function DetailCard({ icon: Icon, label, value, highlight }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={12} className="text-gray-400" />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <span
        className={`text-sm font-semibold ${
          highlight ? "text-adhi-primary" : "text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
