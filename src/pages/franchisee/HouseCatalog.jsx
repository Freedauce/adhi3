import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { useRole } from "../../context/RoleContext";
import { MVP_PRODUCT, getBOQTemplate, BOQ_CATEGORIES, computeBOQTotal } from "../../mock/mvpData";
import { regions } from "../../mock/houseTypes";
import {
  Home, ArrowRight, Minus, Plus, MapPin, Package,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   HOUSE CATALOG — Core Shell Selection (MVP)

   Single product: Core Shell (37.5 m²)
   Franchisee selects units count and region, then proceeds to
   BOQ / Order screen. BOQ is displayed as read-only.
   ═══════════════════════════════════════════════════════════════════ */

export default function HouseCatalog() {
  const { roleConfig } = useRole();
  const navigate = useNavigate();
  const [units, setUnits] = useState(1);
  const [regionCode, setRegionCode] = useState("RW");
  const [showDetails, setShowDetails] = useState(false);

  const boqTemplate = getBOQTemplate();
  const perUnitTotal = computeBOQTotal(boqTemplate);

  const selectedRegion = regions.find((r) => r.code === regionCode) || regions[0];

  const handleProceed = () => {
    navigate(`/franchisee/order-boq?units=${units}&region=${regionCode}`);
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <Breadcrumb
        items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "HOUSE CATALOG"]}
      />

      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">House Catalog</h2>
        <p className="text-sm text-gray-500 mt-1">Select your house kit and configure your order.</p>
      </div>

      {/* ── Product Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {/* Hero Image */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img src={MVP_PRODUCT.imageUrl} alt={MVP_PRODUCT.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute top-5 left-6">
            <div className="bg-adhi-primary text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-lg">
              <Home size={13} /> Core Shell Kit
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">{MVP_PRODUCT.name}</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-white/80 text-sm font-medium">{MVP_PRODUCT.floorArea}</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-white/80 text-sm font-medium">Pre-fabricated Kit</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-white/80 text-sm font-medium">Rapid Assembly</span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <p className="text-gray-600 text-[15px] leading-relaxed max-w-2xl">{MVP_PRODUCT.description}</p>

          {/* ── Configurator ── */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Units Selector */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                <Package size={12} className="inline mr-1.5 -mt-0.5" /> Number of Units
              </label>
              <div className="flex items-center gap-4">
                <button onClick={() => setUnits((u) => Math.max(1, u - 1))} className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-gray-300 transition-all active:scale-95 shadow-sm">
                  <Minus size={16} />
                </button>
                <div className="flex-1 text-center">
                  <span className="text-4xl font-black text-gray-900 tabular-nums">{units}</span>
                  <span className="text-xs text-gray-400 block mt-0.5">unit{units > 1 ? "s" : ""}</span>
                </div>
                <button onClick={() => setUnits((u) => Math.min(50, u + 1))} className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-gray-300 transition-all active:scale-95 shadow-sm">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Region Selector */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                <MapPin size={12} className="inline mr-1.5 -mt-0.5" /> Delivery Region
              </label>
              <select
                value={regionCode}
                onChange={(e) => setRegionCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary bg-white text-gray-900 appearance-none cursor-pointer"
              >
                {regions.filter((r) => r.active).map((r) => (
                  <option key={r.code} value={r.code}>{r.label} ({r.currency})</option>
                ))}
              </select>
              <p className="text-[10px] text-gray-400 mt-2">
                Currency: {selectedRegion.currency} · Tax: {selectedRegion.taxRatePct}% {selectedRegion.taxLabel}
              </p>
            </div>

            {/* Price Summary */}
            <div className="bg-gradient-to-br from-adhi-primary to-emerald-700 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full" />
              <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-2">Estimated Total</div>
              <div className="text-3xl font-black tabular-nums tracking-tight">
                ${(perUnitTotal * units).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-white/70 mt-1">
                {units} × ${perUnitTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per unit
              </div>
              <div className="text-[10px] text-white/50 mt-3">Final pricing in BOQ review</div>
            </div>
          </div>

          {/* ── BOQ Preview Toggle ── */}
          <div className="mt-6">
            <button onClick={() => setShowDetails((v) => !v)} className="text-sm text-adhi-primary font-semibold hover:underline">
              {showDetails ? "Hide BOQ Preview ▲" : "Show BOQ Preview ▼"}
            </button>

            {showDetails && (
              <div className="mt-4 overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-left text-sm" style={{ minWidth: "750px" }}>
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase w-[100px]">Code</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase w-[90px]">Category</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Description</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase text-center w-[60px]">Unit</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase text-right w-[60px]">Qty</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase text-right w-[90px]">Rate (USD)</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase text-right w-[100px]">Amount (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boqTemplate.map((row) => (
                      <tr key={row.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-2.5 font-mono text-xs text-gray-400">{row.code}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-500">{row.category}</td>
                        <td className="px-4 py-2.5 font-medium text-gray-900 text-[13px]">{row.description}</td>
                        <td className="px-4 py-2.5 text-center text-xs text-gray-500 font-bold uppercase">{row.unit}</td>
                        <td className="px-4 py-2.5 text-right text-gray-700 font-mono text-xs font-semibold">{row.qty}</td>
                        <td className="px-4 py-2.5 text-right text-gray-600 font-mono text-xs">${row.rate}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-gray-900 font-mono text-xs">${row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200 bg-gray-50">
                      <td colSpan={6} className="px-4 py-3 font-bold text-gray-700 text-right">Total per Unit</td>
                      <td className="px-4 py-3 text-right font-black text-adhi-primary font-mono text-lg">
                        ${perUnitTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* ── CTA Button ── */}
          <button
            onClick={handleProceed}
            className="mt-8 w-full md:w-auto bg-adhi-primary text-white px-8 py-4 rounded-2xl font-bold text-[15px] hover:bg-adhi-dark transition-all flex items-center justify-center gap-3 shadow-lg shadow-adhi-primary/20 active:scale-[0.98]"
          >
            View BOQ & Place Order
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
