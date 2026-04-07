import { useState, useEffect } from "react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { useRole } from "../../context/RoleContext";
import {
  components as initialComponents,
  houseTypes,
} from "../../mock/houseTypes";
import {
  Plus, Edit2, Copy, Trash2, X, Save, RotateCcw,
  Search, Package, ChevronRight, CheckCircle2, AlertCircle,
  Globe, DollarSign, Tag, Layers, Wrench, Eye,
  Home, ArrowUpDown, ArrowUp, ArrowDown, Boxes,
  Link2, Hash, FileText, Settings2
} from "lucide-react";

/* ── Category styling ── */
const categoryColors = {
  Structural: { bg: "bg-blue-100 text-blue-700", icon: "🏗️", ring: "ring-blue-200" },
  Envelope:   { bg: "bg-teal-100 text-teal-700", icon: "🧱", ring: "ring-teal-200" },
  Interior:   { bg: "bg-amber-100 text-amber-700", icon: "🚪", ring: "ring-amber-200" },
  MEP:        { bg: "bg-purple-100 text-purple-700", icon: "⚡", ring: "ring-purple-200" },
  Finishes:   { bg: "bg-green-100 text-green-700", icon: "🎨", ring: "ring-green-200" },
  Openings:   { bg: "bg-rose-100 text-rose-700", icon: "🚪", ring: "ring-rose-200" },
};

const CATEGORIES = ["Structural", "Envelope", "Interior", "MEP", "Finishes", "Openings"];
const TYPES = ["Fixed", "Variable"];
const UNITS = ["set", "panel", "piece", "unit", "fixture", "sheet", "m2", "kg", "roll", "Lot"];

/* ── Blank form ── */
const blankForm = {
  name: "",
  category: "Structural",
  type: "Fixed",
  unit: "set",
  description: "",
  rateUsd: 0,
};

/* ══════════════════════════════════════════
   COMPONENT REGISTRY — Full CRUD
   ══════════════════════════════════════════ */
export default function ComponentRegistry() {
  const { roleConfig } = useRole();

  /* ── State ── */
  const [comps, setComps] = useState(() =>
    initialComponents.map(c => ({ ...c }))
  );
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  // Modal
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...blankForm });

  // Detail drawer
  const [detailComp, setDetailComp] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Helpers ── */
  const nextId = () => {
    const max = comps.reduce((m, c) => {
      const n = parseInt(c.id.replace("COMP-", ""), 10);
      return n > m ? n : m;
    }, 0);
    return `COMP-${String(max + 1).padStart(3, "0")}`;
  };



  /* ── Which house kits use a component? ── */
  const getUsedByKits = (compId) =>
    houseTypes.filter(h => h.components.includes(compId));

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

  /* ── Filtered + sorted list ── */
  const filteredComps = comps
    .filter(c => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === "ALL" || c.category === categoryFilter;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      let va, vb;
      if (sortField === "name") { va = a.name; vb = b.name; }
      else if (sortField === "category") { va = a.category; vb = b.category; }
      else if (sortField === "rateUsd") { va = a.rateUsd || 0; vb = b.rateUsd || 0; }
      else { va = a[sortField]; vb = b[sortField]; }
      if (typeof va === "string") {
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === "asc" ? va - vb : vb - va;
    });

  /* ── Stats ── */
  const stats = {
    total: comps.length,
    structural: comps.filter(c => c.category === "Structural").length,
    fixed: comps.filter(c => c.type === "Fixed").length,
    variable: comps.filter(c => c.type === "Variable").length,
  };

  /* ── CRUD ── */
  const openCreateForm = () => {
    setEditingId(null);
    setForm({ ...blankForm });
    setShowForm(true);
  };

  const openEditForm = (comp) => {
    setEditingId(comp.id);
    setForm({
      name: comp.name,
      category: comp.category,
      type: comp.type,
      unit: comp.unit,
      description: comp.description,
      rateUsd: comp.rateUsd || 0,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      showToast("Component name is required.", "error");
      return;
    }

    if (editingId) {
      // Update component
      setComps(prev => prev.map(c => c.id === editingId ? { ...c, ...form } : c));
      // Update detail if open
      if (detailComp?.id === editingId) {
        setDetailComp(prev => ({ ...prev, ...form }));
      }
      showToast(`${form.name} updated successfully.`);
    } else {
      // Create component
      const newId = nextId();
      setComps(prev => [...prev, { id: newId, ...form }]);
      showToast(`${form.name} created successfully.`);
    }
    setShowForm(false);
  };

  const handleDuplicate = (comp) => {
    const newId = nextId();
    setComps(prev => [...prev, { ...comp, id: newId, name: comp.name + " (Copy)" }]);
    showToast(`Duplicated as ${comp.name} (Copy).`);
  };

  const handleDelete = (comp) => {
    const usedBy = getUsedByKits(comp.id);
    if (usedBy.length > 0) {
      showToast(`Cannot delete — used by ${usedBy.length} house kit(s).`, "error");
      return;
    }
    setComps(prev => prev.filter(c => c.id !== comp.id));
    if (detailComp?.id === comp.id) setDetailComp(null);
    showToast(`${comp.name} deleted.`, "error");
  };



  /* ══════════════════════════════════════
     RENDER
     ══════════════════════════════════════ */
  return (
    <div className="flex flex-col gap-6 relative">
      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold text-white transition-all duration-300 ${
            toast.type === "error" ? "bg-red-500" : "bg-emerald-500"
          }`}
          style={{ animation: "slideInRight .3s ease" }}
        >
          {toast.type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "COMPONENTS"]} />
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Component Registry</h2>
          <p className="text-sm text-gray-500 mt-1">
            Master list of all building components with Odoo SKU mappings.
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="bg-adhi-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-adhi-dark transition-all duration-200 flex items-center gap-2 shadow-lg shadow-adhi-primary/20 hover:shadow-xl hover:shadow-adhi-primary/30 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={16} /> New Component
        </button>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Components", value: stats.total, icon: Boxes, color: "text-adhi-primary", bg: "bg-adhi-surface" },
          { label: "Structural", value: stats.structural, icon: Layers, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Fixed Qty", value: stats.fixed, icon: Settings2, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Variable Qty", value: stats.variable, icon: ArrowUpDown, color: "text-teal-600", bg: "bg-teal-50" },
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

      {/* ── Search / Filter bar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, name, or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
          <button
            onClick={() => setCategoryFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              categoryFilter === "ALL"
                ? "bg-adhi-primary text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            ALL
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                categoryFilter === cat
                  ? "bg-adhi-primary text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>
              <th
                className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer select-none hover:text-gray-600"
                onClick={() => handleSort("name")}
              >
                <span className="flex items-center">Name <SortIcon field="name" /></span>
              </th>
              <th
                className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer select-none hover:text-gray-600"
                onClick={() => handleSort("category")}
              >
                <span className="flex items-center">Category <SortIcon field="category" /></span>
              </th>
              <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
              <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Unit</th>
              <th
                className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right cursor-pointer select-none hover:text-gray-600"
                onClick={() => handleSort("rateUsd")}
              >
                <span className="flex items-center justify-end">
                  Rate (USD) <SortIcon field="rateUsd" />
                </span>
              </th>
              <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComps.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                  <Package size={32} className="mx-auto mb-3 text-gray-300" />
                  <p className="font-semibold">No components found</p>
                  <p className="text-xs mt-1">Adjust your filters or create a new component.</p>
                </td>
              </tr>
            )}
            {filteredComps.map(comp => {
              const catStyle = categoryColors[comp.category] || { bg: "bg-gray-100 text-gray-600", icon: "📦" };
              const usedByCount = getUsedByKits(comp.id).length;
              return (
                <tr
                  key={comp.id}
                  className="border-t border-gray-50 hover:bg-adhi-light/40 transition-colors cursor-pointer group"
                  onClick={() => setDetailComp(comp)}
                >
                  <td className="px-5 py-3.5">
                    <span className="font-mono font-bold text-adhi-primary bg-adhi-surface px-2.5 py-1 rounded-lg text-xs">
                      {comp.id}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="font-semibold text-gray-900">{comp.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[220px]">{comp.description}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${catStyle.bg}`}>
                      <span>{catStyle.icon}</span> {comp.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      comp.type === "Fixed" ? "bg-purple-50 text-purple-600" : "bg-sky-50 text-sky-600"
                    }`}>
                      {comp.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs font-medium">{comp.unit}</td>
                  <td className="px-5 py-3.5 text-right font-bold text-emerald-600">
                    ${(comp.rateUsd || 0).toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setDetailComp(comp)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-adhi-surface hover:border-adhi-primary/30 text-gray-500 hover:text-adhi-primary transition-all"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => openEditForm(comp)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-adhi-surface hover:border-adhi-primary/30 text-gray-500 hover:text-adhi-primary transition-all"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDuplicate(comp)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 text-gray-500 hover:text-blue-600 transition-all"
                        title="Duplicate"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(comp)}
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                          usedByCount > 0
                            ? "border-gray-100 text-gray-300 cursor-not-allowed"
                            : "border-gray-200 hover:bg-red-50 hover:border-red-200 text-gray-500 hover:text-red-600"
                        }`}
                        title={usedByCount > 0 ? `Used by ${usedByCount} kit(s)` : "Delete"}
                        disabled={usedByCount > 0}
                      >
                        <Trash2 size={14} />
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
      {detailComp && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
            onClick={() => setDetailComp(null)}
            style={{ animation: "fadeIn .2s ease" }}
          />
          <div
            className="fixed top-0 right-0 h-full w-full max-w-[540px] bg-white shadow-2xl z-[101] flex flex-col overflow-hidden"
            style={{ animation: "slideInRight .3s ease" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${categoryColors[detailComp.category]?.bg || "bg-gray-100"}`}>
                  {categoryColors[detailComp.category]?.icon || "📦"}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{detailComp.name}</h3>
                  <p className="text-xs text-gray-400 font-mono">{detailComp.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { openEditForm(detailComp); setDetailComp(null); }}
                  className="px-4 py-2 rounded-lg bg-adhi-primary text-white text-xs font-bold hover:bg-adhi-dark transition-colors flex items-center gap-1.5"
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => setDetailComp(null)}
                  className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {/* ── Info banner ── */}
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-adhi-light to-white">
                <p className="text-sm text-gray-600 leading-relaxed">{detailComp.description}</p>
                <div className="flex items-center gap-3 mt-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[detailComp.category]?.bg || "bg-gray-100 text-gray-600"}`}>
                    {categoryColors[detailComp.category]?.icon} {detailComp.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    detailComp.type === "Fixed" ? "bg-purple-100 text-purple-700" : "bg-sky-100 text-sky-700"
                  }`}>
                    {detailComp.type}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                    Unit: {detailComp.unit}
                  </span>
                </div>
              </div>

              {/* ── Component Pricing ── */}
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign size={16} className="text-adhi-primary" />
                  <h4 className="font-bold text-gray-900">Component Rate (USD)</h4>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">Standard Rate</span>
                  <span className="text-xl font-black text-emerald-600">
                    ${(detailComp.rateUsd || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* ── Used by House Kits ── */}
              <div className="px-6 py-5">
                <div className="flex items-center gap-2 mb-4">
                  <Home size={16} className="text-adhi-primary" />
                  <h4 className="font-bold text-gray-900">Used by House Kits</h4>
                  <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {getUsedByKits(detailComp.id).length} kits
                  </span>
                </div>
                <div className="space-y-2">
                  {getUsedByKits(detailComp.id).length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                      <Package size={24} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Not used by any house kit</p>
                    </div>
                  ) : (
                    getUsedByKits(detailComp.id).map(kit => (
                      <div
                        key={kit.id}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-adhi-light/50 transition-colors"
                      >
                        <img
                          src={kit.imageUrl}
                          alt={kit.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{kit.name}</p>
                          <p className="text-[11px] text-gray-400">{kit.modelCode} · {kit.defaultBedrooms}bed · ${kit.basePriceUsd.toLocaleString()}</p>
                        </div>
                        <Badge label={kit.status} variant={kit.status === "ACTIVE" ? "active" : "pending"} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════
         CREATE / EDIT MODAL
         ══════════════════════════════════════ */}
      {showForm && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            onClick={() => setShowForm(false)}
            style={{ animation: "fadeIn .2s ease" }}
          />
          <div
            className="fixed inset-0 z-[101] flex items-start justify-center pt-8 pb-8 overflow-y-auto"
            onClick={() => setShowForm(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-[720px] mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: "popIn .3s ease" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gray-50/50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingId ? "Edit Component" : "New Component"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {editingId ? `Editing ${editingId}` : "Define a new building component with regional pricing."}
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="px-7 py-6 max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
                {/* ── Name ── */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Component Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Solar Panel System"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all"
                  />
                </div>

                {/* ── Category + Type + Unit ── */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{categoryColors[c]?.icon} {c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all"
                    >
                      {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Unit</label>
                    <select
                      value={form.unit}
                      onChange={(e) => setForm(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all"
                    >
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                {/* ── Description ── */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe this component…"
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all resize-none"
                  />
                </div>

                {/* ── Rate Pricing ── */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign size={15} className="text-adhi-primary" />
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Rate (USD)
                    </label>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter rate in USD..."
                    value={form.rateUsd}
                    onChange={(e) => setForm(prev => ({ ...prev, rateUsd: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all font-mono"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  {editingId && (
                    <button
                      onClick={() => {
                        const original = comps.find(c => c.id === editingId);
                        if (original) openEditForm(original);
                      }}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw size={14} /> Reset
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    className="bg-adhi-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-adhi-dark transition-all flex items-center gap-2 shadow-lg shadow-adhi-primary/20"
                  >
                    <Save size={14} />
                    {editingId ? "Save Changes" : "Create Component"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── CSS Animations ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
