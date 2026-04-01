import { useState, useRef } from "react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { useRole } from "../../context/RoleContext";
import { addApplication } from "../../mock/applicationStore";
import {
  TrendingUp, MapPin, X, Save, Upload, FileText,
  User, Mail, Phone, Building2, Globe, CreditCard,
  DollarSign, CheckCircle2, AlertCircle, Clock,
  Calendar, Shield, Briefcase, Hash, Signature,
  ChevronRight, Target, Percent, Timer
} from "lucide-react";

const opportunities = [
  { id: "INV-OPP-001", project: "Kigali Phase 5 — 200 Units", region: "Rwanda", regionCode: "RW", houseType: "Model M", units: 200, targetAmount: 2800000, returnTimeline: "36 months", expectedReturn: "14.2%", status: "open", minInvestment: 25000, raised: 1200000 },
  { id: "INV-OPP-002", project: "Nairobi Expansion — 150 Units", region: "Kenya", regionCode: "KE", houseType: "Model L", units: 150, targetAmount: 3750000, returnTimeline: "30 months", expectedReturn: "12.8%", status: "open", minInvestment: 50000, raised: 980000 },
  { id: "INV-OPP-003", project: "Dar es Salaam — 80 Units", region: "Tanzania", regionCode: "TZ", houseType: "Model S", units: 80, targetAmount: 680000, returnTimeline: "24 months", expectedReturn: "11.5%", status: "closing", minInvestment: 10000, raised: 520000 },
];

const regionFlags = { RW: "🇷🇼", KE: "🇰🇪", TZ: "🇹🇿", UG: "🇺🇬" };

/* ── Blank application form ── */
const blankForm = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  country: "",
  nationalId: "",
  investmentAmount: "",
  applicationLetter: "",
  letterSignature: "",
  letterDate: new Date().toISOString().split("T")[0],
};

export default function InvestmentOpportunities() {
  const { roleConfig } = useRole();
  const [showApply, setShowApply] = useState(null); // opportunity object
  const [form, setForm] = useState({ ...blankForm });
  const [step, setStep] = useState(1); // 1=info, 2=letter, 3=review
  const [toast, setToast] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const openApply = (opp) => {
    setShowApply(opp);
    setForm({ ...blankForm, investmentAmount: opp.minInvestment });
    setStep(1);
    setSubmitted(false);
  };

  const validate = () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      showToast("Please fill in all required personal fields.", "error");
      return false;
    }
    if (!form.investmentAmount || form.investmentAmount < (showApply?.minInvestment || 0)) {
      showToast(`Minimum investment is $${(showApply?.minInvestment || 0).toLocaleString()}.`, "error");
      return false;
    }
    return true;
  };

  const validateLetter = () => {
    if (!form.applicationLetter.trim() || form.applicationLetter.length < 50) {
      showToast("Application letter must be at least 50 characters.", "error");
      return false;
    }
    if (!form.letterSignature.trim()) {
      showToast("Please sign your application letter.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    const app = addApplication({
      type: "INVESTOR",
      opportunityId: showApply.id,
      opportunityTitle: showApply.project,
      region: showApply.region,
      investmentAmount: parseFloat(form.investmentAmount),
      applicant: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        company: form.company,
        country: form.country,
        nationalId: form.nationalId,
      },
      applicationLetter: form.applicationLetter,
      letterSignature: form.letterSignature,
      letterDate: form.letterDate,
    });

    setSubmitted(true);
    showToast(`Application ${app.id} submitted! Admin will review it shortly.`);
  };

  const progressPct = (opp) => Math.round((opp.raised / opp.targetAmount) * 100);

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold text-white ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}
          style={{ animation: "slideInRight .3s ease" }}
        >
          {toast.type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}

      <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "OPPORTUNITIES"]} />
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Investment Opportunities</h2>
        <p className="text-sm text-gray-500 mt-1">Explore upcoming projects open for investment.</p>
      </div>

      {/* ── Opportunity Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {opportunities.map(opp => (
          <div key={opp.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
            {/* Top gradient bar */}
            <div className={`h-1.5 ${opp.status === "closing" ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-gradient-to-r from-adhi-primary to-emerald-400"}`} />

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge label={opp.status === "open" ? "Open" : "Closing Soon"} variant={opp.status === "open" ? "active" : "review"} />
                <span className="text-xs text-gray-400 font-mono">{opp.id}</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-adhi-primary transition-colors">
                {opp.project}
              </h3>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
                <span className="text-base">{regionFlags[opp.regionCode]}</span>
                <MapPin size={14} /> {opp.region} • {opp.houseType}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target</p>
                  <p className="text-lg font-bold text-gray-900">${opp.targetAmount.toLocaleString()}</p>
                </div>
                <div className="bg-adhi-surface rounded-xl p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expected Return</p>
                  <p className="text-lg font-bold text-adhi-primary flex items-center gap-1"><TrendingUp size={16} /> {opp.expectedReturn}</p>
                </div>
              </div>

              {/* Funding progress bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                  <span>Raised: ${opp.raised.toLocaleString()}</span>
                  <span className="font-bold text-adhi-primary">{progressPct(opp)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-adhi-primary to-emerald-400 rounded-full transition-all duration-700"
                    style={{ width: `${progressPct(opp)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 mb-5">
                <span className="flex items-center gap-1"><Timer size={12} /> {opp.returnTimeline}</span>
                <span>Min. ${opp.minInvestment.toLocaleString()}</span>
              </div>

              <button
                onClick={() => openApply(opp)}
                className="w-full bg-adhi-primary text-white py-3 rounded-xl text-sm font-semibold hover:bg-adhi-dark transition-all hover:shadow-lg hover:shadow-adhi-primary/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <Briefcase size={16} /> Apply to Invest
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════
         APPLICATION MODAL — Multi-Step
         ══════════════════════════════════════ */}
      {showApply && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            onClick={() => setShowApply(null)}
            style={{ animation: "fadeIn .2s ease" }}
          />
          <div
            className="fixed inset-0 z-[101] flex items-start justify-center pt-6 pb-6 overflow-y-auto"
            onClick={() => setShowApply(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-[680px] mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: "popIn .3s ease" }}
            >
              {/* Header */}
              <div className="px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-adhi-light to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Apply to Invest</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{showApply.project} · {showApply.id}</p>
                  </div>
                  <button
                    onClick={() => setShowApply(null)}
                    className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-500"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Step indicator */}
                {!submitted && (
                  <div className="flex items-center gap-2 mt-4">
                    {[
                      { num: 1, label: "Personal Info" },
                      { num: 2, label: "Application Letter" },
                      { num: 3, label: "Review & Submit" },
                    ].map(({ num, label }) => (
                      <div key={num} className="flex items-center gap-2 flex-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          step >= num ? "bg-adhi-primary text-white" : "bg-gray-100 text-gray-400"
                        }`}>
                          {step > num ? <CheckCircle2 size={14} /> : num}
                        </div>
                        <span className={`text-xs font-medium hidden sm:block ${step >= num ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
                        {num < 3 && <div className={`flex-1 h-0.5 ${step > num ? "bg-adhi-primary" : "bg-gray-100"}`} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="px-7 py-6 max-h-[calc(100vh-220px)] overflow-y-auto">
                {submitted ? (
                  /* ── Success state ── */
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} className="text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                      Your investment application for <strong>{showApply.project}</strong> has been sent to the ADHI admin team for review. You'll be notified once a decision is made.
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 max-w-xs mx-auto text-left space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-400">Amount</span><span className="font-bold">${parseFloat(form.investmentAmount).toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Project</span><span className="font-medium">{showApply.project}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Status</span><Badge label="PENDING" variant="pending" /></div>
                    </div>
                    <button
                      onClick={() => setShowApply(null)}
                      className="mt-6 bg-adhi-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-adhi-dark transition-colors"
                    >
                      Done
                    </button>
                  </div>
                ) : step === 1 ? (
                  /* ── Step 1: Personal Info ── */
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                        <div className="relative">
                          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type="text" placeholder="John Doe" value={form.fullName}
                            onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email *</label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type="email" placeholder="john@example.com" value={form.email}
                            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone *</label>
                        <div className="relative">
                          <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type="tel" placeholder="+250 788 123 456" value={form.phone}
                            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Company</label>
                        <div className="relative">
                          <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type="text" placeholder="Company name (optional)" value={form.company}
                            onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Country *</label>
                        <div className="relative">
                          <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type="text" placeholder="e.g. Rwanda" value={form.country}
                            onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">National / Passport ID</label>
                        <div className="relative">
                          <Shield size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type="text" placeholder="ID number" value={form.nationalId}
                            onChange={e => setForm(p => ({ ...p, nationalId: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Investment Amount (USD) * <span className="text-gray-400 normal-case">— Min. ${showApply.minInvestment.toLocaleString()}</span>
                      </label>
                      <div className="relative">
                        <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="number" min={showApply.minInvestment} step="1000" value={form.investmentAmount}
                          onChange={e => setForm(p => ({ ...p, investmentAmount: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all" />
                      </div>
                    </div>
                  </div>
                ) : step === 2 ? (
                  /* ── Step 2: Application Letter ── */
                  <div className="space-y-5">
                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-3">
                      <FileText size={18} className="text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-amber-800">Application Letter Required</p>
                        <p className="text-xs text-amber-600 mt-0.5">Write a formal letter explaining your interest, experience, and investment goals. This letter will be reviewed by the ADHI admin team.</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Application Letter *</label>
                      <textarea
                        rows={8}
                        placeholder="Dear ADHI Investment Committee,&#10;&#10;I am writing to express my interest in investing in..."
                        value={form.applicationLetter}
                        onChange={e => setForm(p => ({ ...p, applicationLetter: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all resize-none leading-relaxed"
                      />
                      <p className="text-[11px] text-gray-400 mt-1 text-right">{form.applicationLetter.length} characters (min. 50)</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Signature *</label>
                        <input type="text" placeholder="Type your full name as signature" value={form.letterSignature}
                          onChange={e => setForm(p => ({ ...p, letterSignature: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm italic focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
                        <input type="date" value={form.letterDate}
                          onChange={e => setForm(p => ({ ...p, letterDate: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all" />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── Step 3: Review ── */
                  <div className="space-y-5">
                    <div className="bg-adhi-light rounded-xl p-5 space-y-3">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2"><User size={16} className="text-adhi-primary" /> Investor Details</h4>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        {[
                          ["Name", form.fullName], ["Email", form.email], ["Phone", form.phone],
                          ["Company", form.company || "—"], ["Country", form.country], ["ID", form.nationalId || "—"],
                        ].map(([l, v]) => (
                          <div key={l}><span className="text-gray-400 text-xs">{l}:</span> <span className="font-medium text-gray-800">{v}</span></div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2"><Briefcase size={16} className="text-adhi-primary" /> Investment</h4>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div><span className="text-gray-400 text-xs">Project:</span> <span className="font-medium">{showApply.project}</span></div>
                        <div><span className="text-gray-400 text-xs">Amount:</span> <span className="font-bold text-adhi-primary text-lg">${parseFloat(form.investmentAmount).toLocaleString()}</span></div>
                        <div><span className="text-gray-400 text-xs">Return:</span> <span className="font-medium">{showApply.expectedReturn} in {showApply.returnTimeline}</span></div>
                        <div><span className="text-gray-400 text-xs">Region:</span> <span className="font-medium">{showApply.region}</span></div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2"><FileText size={16} className="text-adhi-primary" /> Application Letter</h4>
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{form.applicationLetter}</p>
                      <div className="border-t border-gray-200 pt-3 flex items-center justify-between text-sm">
                        <span className="italic text-gray-500">Signed: {form.letterSignature}</span>
                        <span className="text-gray-400">{form.letterDate}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {!submitted && (
                <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 bg-gray-50/50">
                  <button
                    onClick={() => step > 1 ? setStep(s => s - 1) : setShowApply(null)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    {step > 1 ? "Back" : "Cancel"}
                  </button>
                  {step < 3 ? (
                    <button
                      onClick={() => {
                        if (step === 1 && !validate()) return;
                        if (step === 2 && !validateLetter()) return;
                        setStep(s => s + 1);
                      }}
                      className="bg-adhi-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-adhi-dark transition-all flex items-center gap-2 shadow-lg shadow-adhi-primary/20"
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="bg-adhi-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-adhi-dark transition-all flex items-center gap-2 shadow-lg shadow-adhi-primary/20"
                    >
                      <Save size={14} /> Submit Application
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </div>
  );
}
