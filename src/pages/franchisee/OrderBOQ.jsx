import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { useRole } from "../../context/RoleContext";
import { MVP_PRODUCT, getBOQTemplate, BOQ_CATEGORIES, computeBOQTotal } from "../../mock/mvpData";
import { regions } from "../../mock/houseTypes";
import {
  ArrowRight, ArrowLeft, MapPin, Package,
  FileText, Home,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   ORDER BOQ — BOQ Display + Order Form (MVP)

   Shows the admin-defined BOQ as READ-ONLY (no editing), grouped by
   category, plus order details (units, delivery location, total).
   "Proceed to Payment" navigates to the payment upload screen.
   ═══════════════════════════════════════════════════════════════════ */

export default function OrderBOQ() {
  const { roleConfig } = useRole();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const units = parseInt(searchParams.get("units")) || 1;
  const regionCode = searchParams.get("region") || "RW";

  const selectedRegion = regions.find((r) => r.code === regionCode) || regions[0];

  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [locationError, setLocationError] = useState(false);

  const boqTemplate = getBOQTemplate();
  const perUnitTotal = computeBOQTotal(boqTemplate);

  const grandTotalUsd = perUnitTotal * units;
  const localTotal = grandTotalUsd * selectedRegion.fxRateToUsd;
  const taxAmount = Math.round(localTotal * (selectedRegion.taxRatePct / 100));
  const grandTotalLocal = localTotal + taxAmount;

  /* Category subtotals */
  const categoryTotals = {};
  BOQ_CATEGORIES.forEach((cat) => {
    categoryTotals[cat] = boqTemplate
      .filter((r) => r.category === cat)
      .reduce((s, r) => s + (parseFloat(String(r.amount).replace(/,/g, "")) || 0), 0);
  });

  const handleProceed = () => {
    if (!deliveryLocation.trim()) {
      setLocationError(true);
      return;
    }
    navigate(
      `/franchisee/payment?units=${units}&region=${regionCode}&location=${encodeURIComponent(
        deliveryLocation.trim()
      )}&total=${grandTotalUsd}`
    );
  };

  /* Category colour mapping */
  const catColor = (cat) => {
    const map = {
      Foundation: "text-blue-600",
      Walls: "text-amber-600",
      Structure: "text-violet-600",
      Roof: "text-emerald-600",
      Openings: "text-rose-600",
    };
    return map[cat] || "text-gray-600";
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "BOQ & ORDER"]} />

      {/* Back */}
      <button onClick={() => navigate("/franchisee/catalog")} className="text-sm text-adhi-primary font-semibold hover:underline flex items-center gap-1.5 w-fit">
        <ArrowLeft size={14} /> Back to Catalog
      </button>

      {/* Product Summary Strip */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-adhi-primary/20 flex items-center justify-center shrink-0">
            <Home size={22} className="text-adhi-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{MVP_PRODUCT.name}</h2>
            <p className="text-sm text-gray-400">{MVP_PRODUCT.floorArea} · {units} unit{units > 1 ? "s" : ""} · {selectedRegion.label}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Estimated Total</div>
          <div className="text-2xl font-black tabular-nums">
            ${grandTotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
            <span className="text-sm text-gray-400 font-normal">USD</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        {/* ═══ BOQ TABLE — READ-ONLY, GROUPED BY CATEGORY ═══ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-transparent flex items-center gap-2">
            <FileText size={16} className="text-adhi-primary" />
            <span className="text-sm font-bold text-gray-700">Bill of Quantities</span>
            <span className="text-[10px] bg-adhi-surface text-adhi-primary px-2 py-0.5 rounded-full font-bold ml-1">{boqTemplate.length} items</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" style={{ minWidth: "750px" }}>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest w-[100px]">Code</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Description</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center w-[60px]">Unit</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-right w-[70px]">Qty</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-right w-[90px]">Rate (USD)</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-right w-[110px]">Amount (USD)</th>
                </tr>
              </thead>
              <tbody>
                {BOQ_CATEGORIES.map((cat) => {
                  const catRows = boqTemplate.filter((r) => r.category === cat);
                  if (catRows.length === 0) return null;

                  return (
                    <React.Fragment key={cat}>
                      {/* Category Header */}
                      <tr className="bg-gray-50/70">
                        <td colSpan={5} className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-widest ${catColor(cat)}`}>
                          {cat}
                        </td>
                        <td className="px-4 py-2.5 text-right text-[10px] font-bold text-gray-400 font-mono">
                          ${categoryTotals[cat]?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                      {/* Items */}
                      {catRows.map((row) => (
                        <tr key={row.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-2.5 font-mono text-xs text-gray-400">{row.code}</td>
                          <td className="px-4 py-2.5 font-medium text-gray-900 text-[13px]">{row.description}</td>
                          <td className="px-4 py-2.5 text-center text-xs text-gray-500 font-bold uppercase">{row.unit}</td>
                          <td className="px-4 py-2.5 text-right text-gray-700 font-mono text-xs font-semibold">{row.qty}</td>
                          <td className="px-4 py-2.5 text-right text-gray-600 font-mono text-xs">${row.rate}</td>
                          <td className="px-4 py-2.5 text-right font-bold text-gray-900 font-mono text-xs">${row.amount}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Footer */}
          <div className="border-t-2 border-gray-200 bg-gray-50 p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Subtotal (per unit)</span>
              <span className="font-bold text-gray-700 font-mono">
                ${perUnitTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">× {units} unit{units > 1 ? "s" : ""}</span>
              <span className="font-bold text-gray-700 font-mono">
                ${grandTotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Local estimate ({selectedRegion.currency})</span>
              <span className="font-semibold text-gray-600 font-mono">
                {localTotal.toLocaleString()} {selectedRegion.currency}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{selectedRegion.taxLabel} ({selectedRegion.taxRatePct}%)</span>
              <span className="font-semibold text-gray-600 font-mono">
                {taxAmount.toLocaleString()} {selectedRegion.currency}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="font-bold text-gray-900">Grand Total</span>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-adhi-primary tabular-nums">
                  {grandTotalLocal.toLocaleString()} {selectedRegion.currency}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  ≈ ${grandTotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ ORDER FORM SIDEBAR ═══ */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package size={18} className="text-adhi-primary" /> Order Details
            </h3>

            {/* Units */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Units</label>
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-700 font-medium">{MVP_PRODUCT.name} ({MVP_PRODUCT.floorArea})</span>
                <span className="text-lg font-black text-gray-900 tabular-nums">×{units}</span>
              </div>
            </div>

            {/* Delivery Location */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                <MapPin size={10} className="inline mr-1 -mt-0.5" /> Delivery Location
              </label>
              <input
                type="text"
                value={deliveryLocation}
                onChange={(e) => { setDeliveryLocation(e.target.value); setLocationError(false); }}
                placeholder="e.g. Kigali, Gasabo District"
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary outline-none bg-white transition-all ${
                  locationError ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
              />
              {locationError && <p className="text-xs text-red-500 mt-1.5 font-medium">Please enter a delivery location.</p>}
            </div>

            {/* Region */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Region</label>
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 font-medium">
                {selectedRegion.label} · {selectedRegion.currency}
              </div>
            </div>

            {/* Total Cost */}
            <div className="bg-gradient-to-br from-adhi-primary to-emerald-700 rounded-xl p-5 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full" />
              <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Total Cost</div>
              <div className="text-2xl font-black tabular-nums mt-1">
                ${grandTotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-white/60 mt-1">
                {grandTotalLocal.toLocaleString()} {selectedRegion.currency}
              </div>
            </div>

            {/* Proceed */}
            <button
              onClick={handleProceed}
              className="mt-6 w-full bg-adhi-primary text-white py-4 rounded-2xl font-bold text-[15px] hover:bg-adhi-dark transition-all flex items-center justify-center gap-3 shadow-lg shadow-adhi-primary/20 active:scale-[0.98]"
            >
              Proceed to Payment <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
