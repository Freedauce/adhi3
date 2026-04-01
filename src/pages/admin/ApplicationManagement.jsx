import { useState, useEffect } from "react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { useRole } from "../../context/RoleContext";
import { getApplications, reviewApplication } from "../../mock/applicationStore";
import {
  Search, Eye, X, CheckCircle, XCircle, Clock,
  User, Mail, Phone, Building2, Globe, DollarSign,
  FileText, Briefcase, Shield, ChevronRight, Filter,
  CheckCircle2, AlertCircle, Home, TrendingUp,
  ClipboardList, Hash, Calendar, MessageSquare,
  ThumbsUp, ThumbsDown, Users
} from "lucide-react";

const statusConfig = {
  PENDING: { label: "Pending", variant: "pending", color: "text-orange-600", bg: "bg-orange-50" },
  APPROVED: { label: "Approved", variant: "active", color: "text-emerald-600", bg: "bg-emerald-50" },
  REJECTED: { label: "Rejected", variant: "delayed", color: "text-red-600", bg: "bg-red-50" },
};

const typeConfig = {
  INVESTOR: { label: "Investor", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
  FRANCHISE: { label: "Franchise", icon: Home, color: "text-purple-600", bg: "bg-purple-50" },
};

export default function ApplicationManagement() {
  const { roleConfig } = useRole();

  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [detail, setDetail] = useState(null);
  const [reviewNote, setReviewNote] = useState("");
  const [toast, setToast] = useState(null);

  const refresh = () => setApps(getApplications());
  useEffect(() => { refresh(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleReview = (id, status) => {
    reviewApplication(id, status, reviewNote, "Admin");
    refresh();
    if (detail?.id === id) setDetail(getApplications().find(a => a.id === id));
    setReviewNote("");
    showToast(status === "APPROVED" ? "Application approved!" : "Application rejected.", status === "APPROVED" ? "success" : "error");
  };

  /* ── Filtered list ── */
  const filtered = apps.filter(a => {
    const matchSearch =
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.applicant.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.applicant.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.applicant.company || "").toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "ALL" || a.type === typeFilter;
    const matchStatus = statusFilter === "ALL" || a.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  /* ── Stats ── */
  const stats = {
    total: apps.length,
    pending: apps.filter(a => a.status === "PENDING").length,
    approved: apps.filter(a => a.status === "APPROVED").length,
    rejected: apps.filter(a => a.status === "REJECTED").length,
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold text-white ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`} style={{ animation: "slideInRight .3s ease" }}>
          {toast.type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}

      <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "APPLICATIONS"]} />
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Application Management</h2>
        <p className="text-sm text-gray-500 mt-1">Review and manage investor and franchise applications.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: ClipboardList, color: "text-adhi-primary", bg: "bg-adhi-surface" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4 shadow-sm">
            <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center`}><Icon size={20} className={color} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name, email, ID…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all" />
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {["ALL", "INVESTOR", "FRANCHISE"].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${typeFilter === t ? "bg-adhi-primary text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}>
              {t === "ALL" ? "ALL" : t === "INVESTOR" ? "📈 Investor" : "🏠 Franchise"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === s ? "bg-adhi-primary text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>
              <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
              <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Applicant</th>
              <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Details</th>
              <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Submitted</th>
              <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  <ClipboardList size={32} className="mx-auto mb-3 text-gray-300" />
                  <p className="font-semibold">No applications found</p>
                </td>
              </tr>
            )}
            {filtered.map(app => {
              const tConf = typeConfig[app.type];
              const sConf = statusConfig[app.status];
              const TypeIcon = tConf.icon;
              return (
                <tr key={app.id} className="border-t border-gray-50 hover:bg-adhi-light/40 transition-colors cursor-pointer" onClick={() => setDetail(app)}>
                  <td className="px-5 py-3.5">
                    <span className="font-mono font-bold text-adhi-primary bg-adhi-surface px-2.5 py-1 rounded-lg text-xs">{app.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${tConf.bg} ${tConf.color}`}>
                      <TypeIcon size={12} /> {tConf.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-adhi-primary to-adhi-dark flex items-center justify-center text-white text-xs font-bold">
                        {app.applicant.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{app.applicant.fullName}</p>
                        <p className="text-[11px] text-gray-400">{app.applicant.company || app.applicant.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 text-xs">
                    {app.type === "INVESTOR"
                      ? <span><strong>${app.investmentAmount?.toLocaleString()}</strong> · {app.opportunityTitle}</span>
                      : <span><strong>{app.targetUnitsPerYear} units/yr</strong> · {app.franchiseRegion}</span>
                    }
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {new Date(app.submittedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge label={sConf.label} variant={sConf.variant} />
                  </td>
                  <td className="px-5 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setDetail(app)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-adhi-surface hover:border-adhi-primary/30 text-gray-500 hover:text-adhi-primary transition-all" title="View"><Eye size={14} /></button>
                      {app.status === "PENDING" && (
                        <>
                          <button onClick={() => handleReview(app.id, "APPROVED")} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-200 text-gray-500 hover:text-emerald-600 transition-all" title="Approve"><ThumbsUp size={14} /></button>
                          <button onClick={() => handleReview(app.id, "REJECTED")} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 text-gray-500 hover:text-red-600 transition-all" title="Reject"><ThumbsDown size={14} /></button>
                        </>
                      )}
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
      {detail && (() => {
        const tConf = typeConfig[detail.type];
        const sConf = statusConfig[detail.status];
        const TypeIcon = tConf.icon;
        return (
          <>
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]" onClick={() => setDetail(null)} style={{ animation: "fadeIn .2s ease" }} />
            <div className="fixed top-0 right-0 h-full w-full max-w-[560px] bg-white shadow-2xl z-[101] flex flex-col overflow-hidden" style={{ animation: "slideInRight .3s ease" }}>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tConf.bg}`}>
                    <TypeIcon size={20} className={tConf.color} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{tConf.label} Application</h3>
                    <p className="text-xs text-gray-400 font-mono">{detail.id}</p>
                  </div>
                </div>
                <button onClick={() => setDetail(null)} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-500"><X size={16} /></button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto">
                {/* Status bar */}
                <div className={`mx-6 mt-5 rounded-xl px-5 py-4 flex items-center gap-3 border ${
                  detail.status === "APPROVED" ? "bg-emerald-50 border-emerald-100" :
                  detail.status === "REJECTED" ? "bg-red-50 border-red-100" : "bg-orange-50 border-orange-100"
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    detail.status === "APPROVED" ? "bg-emerald-500" : detail.status === "REJECTED" ? "bg-red-500" : "bg-orange-500"
                  }`}>
                    {detail.status === "APPROVED" ? <CheckCircle size={20} className="text-white" /> :
                     detail.status === "REJECTED" ? <XCircle size={20} className="text-white" /> :
                     <Clock size={20} className="text-white" />}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${sConf.color}`}>{sConf.label}</p>
                    <p className="text-xs text-gray-500">
                      {detail.reviewedAt ? `Reviewed on ${new Date(detail.reviewedAt).toLocaleDateString()} by ${detail.reviewedBy}` : "Awaiting admin review"}
                    </p>
                  </div>
                </div>

                {/* Review note if exists */}
                {detail.reviewNote && (
                  <div className="mx-6 mt-3 bg-gray-50 rounded-xl px-4 py-3 flex items-start gap-2">
                    <MessageSquare size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-600 italic">"{detail.reviewNote}"</p>
                  </div>
                )}

                {/* Applicant info */}
                <div className="px-6 py-5 border-b border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><User size={16} className="text-adhi-primary" /> Applicant Information</h4>
                  <div className="space-y-3">
                    {[
                      { icon: User, label: "Full Name", value: detail.applicant.fullName },
                      { icon: Mail, label: "Email", value: detail.applicant.email },
                      { icon: Phone, label: "Phone", value: detail.applicant.phone },
                      { icon: Building2, label: "Company", value: detail.applicant.company || "—" },
                      { icon: Globe, label: "Country", value: detail.applicant.country },
                      detail.applicant.nationalId && { icon: Shield, label: "National ID", value: detail.applicant.nationalId },
                      detail.applicant.businessRegNo && { icon: Hash, label: "Business Reg. No", value: detail.applicant.businessRegNo },
                    ].filter(Boolean).map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0"><Icon size={14} className="text-gray-400" /></div>
                        <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</p><p className="text-sm font-medium text-gray-900">{value}</p></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Investment / Franchise details */}
                <div className="px-6 py-5 border-b border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Briefcase size={16} className="text-adhi-primary" />
                    {detail.type === "INVESTOR" ? "Investment Details" : "Franchise Details"}
                  </h4>
                  {detail.type === "INVESTOR" ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-adhi-surface rounded-xl p-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Investment Amount</p>
                        <p className="text-2xl font-extrabold text-adhi-primary">${detail.investmentAmount?.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Project</p>
                        <p className="text-sm font-bold text-gray-900">{detail.opportunityTitle}</p>
                        <p className="text-xs text-gray-400 mt-1">{detail.region}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Target Units/Year</p>
                        <p className="text-2xl font-extrabold text-purple-700">{detail.targetUnitsPerYear}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Franchise Region</p>
                        <p className="text-sm font-bold text-gray-900">{detail.franchiseRegion}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Application Letter */}
                <div className="px-6 py-5 border-b border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText size={16} className="text-adhi-primary" /> Application Letter</h4>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{detail.applicationLetter}</p>
                    <div className="border-t border-gray-200 mt-4 pt-3 flex items-center justify-between">
                      <span className="text-sm italic text-gray-500">Signed: <strong>{detail.letterSignature}</strong></span>
                      <span className="text-xs text-gray-400">{detail.letterDate}</span>
                    </div>
                  </div>
                </div>

                {/* Action section for pending */}
                {detail.status === "PENDING" && (
                  <div className="px-6 py-5">
                    <h4 className="font-bold text-gray-900 mb-3">Review Decision</h4>
                    <textarea
                      rows={2}
                      placeholder="Add a review note (optional)…"
                      value={reviewNote}
                      onChange={e => setReviewNote(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all resize-none mb-3"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleReview(detail.id, "APPROVED")}
                        className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                      >
                        <ThumbsUp size={16} /> Approve
                      </button>
                      <button
                        onClick={() => handleReview(detail.id, "REJECTED")}
                        className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                      >
                        <ThumbsDown size={16} /> Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        );
      })()}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}
