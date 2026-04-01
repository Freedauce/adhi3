import { useState } from "react";
import { addApplication } from "../../mock/applicationStore";
import {
  X, Save, ChevronRight, ChevronLeft, User, Mail, Phone, Building2,
  Globe, Shield, FileText, CheckCircle2, AlertCircle, MapPin,
  Home, Users, Hash, Briefcase, Clock, Target, ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const regions = [
  { code: "RW", label: "Rwanda", flag: "🇷🇼" },
  { code: "KE", label: "Kenya", flag: "🇰🇪" },
  { code: "TZ", label: "Tanzania", flag: "🇹🇿" },
  { code: "UG", label: "Uganda", flag: "🇺🇬" },
];

const blankForm = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  country: "",
  businessRegNo: "",
  franchiseRegion: "RW",
  targetUnitsPerYear: 50,
  teamSize: "",
  experience: "",
  applicationLetter: "",
  letterSignature: "",
  letterDate: new Date().toISOString().split("T")[0],
};

export default function FranchiseApplication() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...blankForm });
  const [step, setStep] = useState(1); // 1=info, 2=business, 3=letter, 4=review
  const [toast, setToast] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const validateStep1 = () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.country.trim()) {
      showToast("Please fill in all required fields.", "error");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!form.company.trim()) {
      showToast("Company name is required.", "error");
      return false;
    }
    if (!form.targetUnitsPerYear || form.targetUnitsPerYear < 10) {
      showToast("Target units must be at least 10 per year.", "error");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!form.applicationLetter.trim() || form.applicationLetter.length < 50) {
      showToast("Application letter must be at least 50 characters.", "error");
      return false;
    }
    if (!form.letterSignature.trim()) {
      showToast("Please sign your application.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    const app = addApplication({
      type: "FRANCHISE",
      applicant: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        company: form.company,
        country: form.country,
        businessRegNo: form.businessRegNo,
      },
      franchiseRegion: regions.find(r => r.code === form.franchiseRegion)?.label || form.franchiseRegion,
      targetUnitsPerYear: parseInt(form.targetUnitsPerYear),
      applicationLetter: form.applicationLetter,
      letterSignature: form.letterSignature,
      letterDate: form.letterDate,
    });

    setSubmitted(true);
    showToast(`Franchise application ${app.id} submitted!`);
  };

  const steps = [
    { num: 1, label: "Personal Info" },
    { num: 2, label: "Business Details" },
    { num: 3, label: "Application Letter" },
    { num: 4, label: "Review & Submit" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-adhi-light/30 flex flex-col">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold text-white ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`} style={{ animation: "slideInRight .3s ease" }}>
          {toast.type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <button onClick={() => navigate("/")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 bg-adhi-primary rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-extrabold text-lg text-adhi-dark">ADHI</span>
        </button>
        <button onClick={() => navigate("/")} className="text-sm text-gray-500 hover:text-adhi-primary transition-colors flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Home
        </button>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-[740px]">
          {/* Hero */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-adhi-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Home size={28} className="text-adhi-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Apply for ADHI Franchise</h1>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">Join the ADHI network and bring affordable, high-quality housing to your region.</p>
          </div>

          {/* Step indicator */}
          {!submitted && (
            <div className="flex items-center justify-center gap-1 mb-8">
              {steps.map(({ num, label }) => (
                <div key={num} className="flex items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= num ? "bg-adhi-primary text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {step > num ? <CheckCircle2 size={14} /> : num}
                  </div>
                  <span className={`text-xs font-medium hidden md:block ${step >= num ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
                  {num < 4 && <div className={`w-8 h-0.5 ${step > num ? "bg-adhi-primary" : "bg-gray-100"}`} />}
                </div>
              ))}
            </div>
          )}

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden" style={{ animation: "popIn .3s ease" }}>
            <div className="px-8 py-7">
              {submitted ? (
                /* ── Success ── */
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                    Your franchise application has been submitted to the ADHI team. We'll review it and notify you at <strong>{form.email}</strong>.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-5 max-w-sm mx-auto text-left space-y-2.5 text-sm mb-6">
                    <div className="flex justify-between"><span className="text-gray-400">Company</span><span className="font-bold">{form.company}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Region</span><span className="font-medium">{regions.find(r => r.code === form.franchiseRegion)?.label}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Target Units</span><span className="font-medium">{form.targetUnitsPerYear}/year</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="text-orange-600 font-bold text-xs bg-orange-50 px-2 py-0.5 rounded-full">PENDING</span></div>
                  </div>
                  <button onClick={() => navigate("/")} className="bg-adhi-primary text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-adhi-dark transition-colors">
                    Return to Home
                  </button>
                </div>
              ) : step === 1 ? (
                /* ── Step 1: Personal Info ── */
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Personal Information</h3>
                  <p className="text-sm text-gray-400 mb-4">Tell us about the primary contact for this franchise application.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Full name" value={form.fullName}
                          onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email *</label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="email" placeholder="email@company.com" value={form.email}
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
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Country *</label>
                      <div className="relative">
                        <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="e.g. Rwanda" value={form.country}
                          onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : step === 2 ? (
                /* ── Step 2: Business Details ── */
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Business Details</h3>
                  <p className="text-sm text-gray-400 mb-4">Tell us about your company and your franchise goals.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Company Name *</label>
                      <div className="relative">
                        <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Your company" value={form.company}
                          onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Business Reg. Number</label>
                      <div className="relative">
                        <Hash size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="BRN-XX-XXXX" value={form.businessRegNo}
                          onChange={e => setForm(p => ({ ...p, businessRegNo: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Franchise Region *</label>
                      <select value={form.franchiseRegion} onChange={e => setForm(p => ({ ...p, franchiseRegion: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all bg-white">
                        {regions.map(r => <option key={r.code} value={r.code}>{r.flag} {r.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Target Units / Year *</label>
                      <div className="relative">
                        <Target size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="number" min="10" step="10" value={form.targetUnitsPerYear}
                          onChange={e => setForm(p => ({ ...p, targetUnitsPerYear: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Team Size</label>
                      <div className="relative">
                        <Users size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="e.g. 25 builders" value={form.teamSize}
                          onChange={e => setForm(p => ({ ...p, teamSize: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Industry Experience</label>
                      <div className="relative">
                        <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="e.g. 5 years" value={form.experience}
                          onChange={e => setForm(p => ({ ...p, experience: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : step === 3 ? (
                /* ── Step 3: Application Letter ── */
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Application Letter</h3>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-3">
                    <FileText size={18} className="text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Formal Letter Required</p>
                      <p className="text-xs text-amber-600 mt-0.5">Write a formal letter explaining why you want to become an ADHI franchisee, your relevant experience, and your vision for the region.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Application Letter *</label>
                    <textarea rows={8}
                      placeholder="Dear ADHI Franchise Committee,&#10;&#10;We are writing to express our interest in becoming a licensed ADHI franchisee…"
                      value={form.applicationLetter}
                      onChange={e => setForm(p => ({ ...p, applicationLetter: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all resize-none leading-relaxed" />
                    <p className="text-[11px] text-gray-400 mt-1 text-right">{form.applicationLetter.length} characters (min. 50)</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Signature *</label>
                      <input type="text" placeholder="Full name + title as signature" value={form.letterSignature}
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
                /* ── Step 4: Review ── */
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Review Your Application</h3>
                  <div className="bg-adhi-light rounded-xl p-5 space-y-3">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2"><User size={16} className="text-adhi-primary" /> Applicant</h4>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      {[["Name", form.fullName], ["Email", form.email], ["Phone", form.phone], ["Country", form.country]].map(([l, v]) => (
                        <div key={l}><span className="text-gray-400 text-xs">{l}:</span> <span className="font-medium text-gray-800">{v}</span></div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-5 space-y-3">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2"><Building2 size={16} className="text-purple-600" /> Business</h4>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      {[
                        ["Company", form.company], ["Reg. No", form.businessRegNo || "—"],
                        ["Region", regions.find(r => r.code === form.franchiseRegion)?.label],
                        ["Target Units", `${form.targetUnitsPerYear}/year`],
                        ["Team Size", form.teamSize || "—"], ["Experience", form.experience || "—"],
                      ].map(([l, v]) => (
                        <div key={l}><span className="text-gray-400 text-xs">{l}:</span> <span className="font-medium text-gray-800">{v}</span></div>
                      ))}
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
              <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={() => step > 1 ? setStep(s => s - 1) : navigate("/")}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft size={14} /> {step > 1 ? "Back" : "Cancel"}
                </button>
                {step < 4 ? (
                  <button
                    onClick={() => {
                      if (step === 1 && !validateStep1()) return;
                      if (step === 2 && !validateStep2()) return;
                      if (step === 3 && !validateStep3()) return;
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
                    <Save size={14} /> Submit Franchise Application
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.97) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </div>
  );
}
