import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { useRole } from "../../context/RoleContext";
import {
  MVP_PRODUCT, getBOQTemplate, addMVPOrder,
} from "../../mock/mvpData";
import { regions } from "../../mock/houseTypes";
import {
  Upload, CheckCircle2, ArrowLeft, FileText,
  AlertCircle, X, Home,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   PAYMENT UPLOAD — Proof of Payment Screen (MVP)

   The franchisee uploads a payment proof file, enters a reference
   number and optional notes, then submits the order.
   ═══════════════════════════════════════════════════════════════════ */

export default function PaymentUpload() {
  const { roleConfig } = useRole();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const units = parseInt(searchParams.get("units")) || 1;
  const regionCode = searchParams.get("region") || "RW";
  const deliveryLocation = searchParams.get("location") || "";
  const totalUsd = parseInt(searchParams.get("total")) || 0;

  const selectedRegion = regions.find((r) => r.code === regionCode) || regions[0];
  const localTotal = totalUsd * selectedRegion.fxRateToUsd;

  const [proofFile, setProofFile] = useState(null);
  const [proofFileName, setProofFileName] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofFile(URL.createObjectURL(file));
      setProofFileName(file.name);
      setErrors((prev) => ({ ...prev, proof: false }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!proofFile) errs.proof = true;
    if (!referenceNumber.trim()) errs.ref = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate a short async delay
    setTimeout(() => {
      addMVPOrder({
        product: MVP_PRODUCT.name,
        units,
        deliveryLocation,
        regionCode,
        boqSnapshot: getBOQTemplate(),
        totalCost: totalUsd.toLocaleString(),
        currency: "USD",
        paymentProofUrl: proofFile,
        paymentRef: referenceNumber.trim(),
        paymentNotes: notes.trim(),
      });
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  /* ── Success Screen ── */
  if (submitted) {
    return (
      <div className="flex flex-col gap-6 pb-10">
        <Breadcrumb
          items={[
            "ADHI DASHBOARD",
            roleConfig.perspectiveLabel,
            "ORDER SUBMITTED",
          ]}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-10 max-w-md w-full text-center">
            {/* Animated check */}
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Order Submitted!
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Your order for{" "}
              <strong>
                {units}× {MVP_PRODUCT.name}
              </strong>{" "}
              has been submitted. Our team will verify your payment and update
              the status.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Product</span>
                <span className="font-semibold text-gray-900">
                  {MVP_PRODUCT.name} ({MVP_PRODUCT.floorArea})
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Units</span>
                <span className="font-semibold text-gray-900">{units}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery</span>
                <span className="font-semibold text-gray-900">
                  {deliveryLocation}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-extrabold text-adhi-primary">
                  ${totalUsd.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Reference</span>
                <span className="font-semibold text-gray-900">
                  {referenceNumber}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/franchisee/orders")}
              className="w-full bg-adhi-primary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-adhi-dark transition-all shadow-lg shadow-adhi-primary/20"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Payment Form ── */
  return (
    <div className="flex flex-col gap-6 pb-10">
      <Breadcrumb
        items={[
          "ADHI DASHBOARD",
          roleConfig.perspectiveLabel,
          "PAYMENT UPLOAD",
        ]}
      />

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-adhi-primary font-semibold hover:underline flex items-center gap-1.5 w-fit"
      >
        <ArrowLeft size={14} /> Back to BOQ
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        {/* ═══ PAYMENT FORM ═══ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-transparent">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Upload size={18} className="text-adhi-primary" />
              Upload Proof of Payment
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Upload your payment receipt and provide reference details.
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* ── File Upload ── */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Payment Proof (File)
              </label>

              {!proofFile ? (
                <div
                  className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer relative ${
                    errors.proof
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl bg-adhi-surface flex items-center justify-center mb-4">
                    <Upload size={24} className="text-adhi-primary" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, PDF up to 10MB
                  </p>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {errors.proof && (
                    <p className="text-xs text-red-500 mt-3 font-medium flex items-center gap-1">
                      <AlertCircle size={12} /> Please upload a payment proof.
                    </p>
                  )}
                </div>
              ) : (
                <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">
                        {proofFileName}
                      </p>
                      <p className="text-xs text-emerald-600">
                        File attached successfully
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setProofFile(null);
                      setProofFileName("");
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* ── Reference Number ── */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Reference Number *
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => {
                  setReferenceNumber(e.target.value);
                  setErrors((prev) => ({ ...prev, ref: false }));
                }}
                placeholder="e.g. TXN-12345 or bank ref"
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary outline-none bg-white transition-all ${
                  errors.ref ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.ref && (
                <p className="text-xs text-red-500 mt-1.5 font-medium">
                  Please enter a reference number.
                </p>
              )}
            </div>

            {/* ── Notes ── */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary outline-none bg-white resize-none transition-all"
              />
            </div>

            {/* ── Submit Button ── */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-adhi-primary text-white py-4 rounded-2xl font-bold text-[15px] hover:bg-adhi-dark transition-all flex items-center justify-center gap-3 shadow-lg shadow-adhi-primary/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Submit Order
                </>
              )}
            </button>
          </div>
        </div>

        {/* ═══ ORDER SUMMARY SIDEBAR ═══ */}
        <div className="flex flex-col gap-5">
          <div className="bg-gray-900 rounded-2xl text-white shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center gap-2">
              <FileText size={16} className="text-emerald-400" />
              <span className="text-sm font-bold">Order Summary</span>
            </div>

            <div className="p-5 space-y-4">
              <SummaryRow label="Product" value={`${MVP_PRODUCT.name} (${MVP_PRODUCT.floorArea})`} />
              <SummaryRow label="Units" value={`${units}`} highlight />
              <SummaryRow label="Delivery" value={deliveryLocation || "—"} />
              <SummaryRow label="Region" value={`${selectedRegion.label} (${selectedRegion.currency})`} />
              
              <div className="border-t border-gray-700 pt-4 mt-4">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Total
                </div>
                <div className="text-2xl font-black tabular-nums mt-1">
                  ${totalUsd.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  ≈ {localTotal.toLocaleString()} {selectedRegion.currency}
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle size={16} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed">
              After submitting, our team will verify your payment. You can track
              the status in{" "}
              <strong className="text-blue-900">My Orders</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Summary Row Helper ── */
function SummaryRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500">{label}</span>
      <span
        className={`text-sm font-semibold ${
          highlight ? "text-adhi-primary" : "text-gray-200"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
