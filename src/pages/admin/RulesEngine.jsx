import { useState, useCallback, useMemo } from "react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { useRole } from "../../context/RoleContext";
import {
  Save, Plus, Trash2, CheckCircle2, Eye, EyeOff,
  Calculator, RotateCcw, GripVertical, AlertCircle,
  FileText, Pencil, DollarSign,
} from "lucide-react";
import {
  getBOQTemplate, saveBOQTemplate, MVP_PRODUCT,
  BOQ_CATEGORIES, computeBOQTotal,
} from "../../mock/mvpData";

/* ═══════════════════════════════════════════════════════════════════
   RULES ENGINE — Text-Field BOQ Template Editor (MVP)

   The admin defines what the BOQ looks like by typing plain text
   into each row. No formulas. No computation. No eval().
   Whatever the admin types is what the franchisee / accountant sees.

   Columns: Code | Category | Description | Unit | Qty | Rate (USD) | Amount (USD)
   ═══════════════════════════════════════════════════════════════════ */

export default function RulesEngine() {
  const { roleConfig } = useRole();
  const [rows, setRows] = useState(() => getBOQTemplate());
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);

  const grandTotal = useMemo(() => computeBOQTotal(rows), [rows]);

  /* ── Category stats ── */
  const categoryStats = useMemo(() => {
    const stats = {};
    rows.forEach((r) => {
      const cat = r.category || "Other";
      if (!stats[cat]) stats[cat] = { count: 0, total: 0 };
      stats[cat].count++;
      stats[cat].total += parseFloat(String(r.amount).replace(/,/g, "")) || 0;
    });
    return stats;
  }, [rows]);

  /* ── Handlers ── */
  const updateRow = useCallback((id, field, value) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
    setSaved(false);
  }, []);

  const addRow = useCallback(() => {
    const maxNum = rows.reduce((max, r) => {
      const m = r.id.match(/BOQ-(\d+)/);
      return m ? Math.max(max, parseInt(m[1])) : max;
    }, 0);
    const newRow = {
      id: `BOQ-${String(maxNum + 1).padStart(3, "0")}`,
      code: "",
      category: BOQ_CATEGORIES[0],
      description: "",
      unit: "",
      qty: "",
      rate: "",
      amount: "",
    };
    setRows((prev) => [...prev, newRow]);
    setEditingRowId(newRow.id);
    setSaved(false);
  }, [rows]);

  const removeRow = useCallback(
    (id) => {
      setRows((prev) => prev.filter((r) => r.id !== id));
      if (editingRowId === id) setEditingRowId(null);
      setSaved(false);
    },
    [editingRowId]
  );

  const handleSave = useCallback(() => {
    saveBOQTemplate(rows);
    setSaved(true);
    setEditingRowId(null);
    setTimeout(() => setSaved(false), 3000);
  }, [rows]);

  const handleReset = useCallback(() => {
    setRows(getBOQTemplate());
    setEditingRowId(null);
    setSaved(false);
  }, []);

  /* ── Category colour mapping ── */
  const catColor = (cat) => {
    const map = {
      Foundation: "bg-blue-50 text-blue-700 border-blue-200",
      Walls: "bg-amber-50 text-amber-700 border-amber-200",
      Structure: "bg-violet-50 text-violet-700 border-violet-200",
      Roof: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Openings: "bg-rose-50 text-rose-700 border-rose-200",
    };
    return map[cat] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  /* ═══ RENDER ═══ */
  return (
    <div className="flex flex-col gap-5 pb-10">
      <Breadcrumb
        items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "RULES ENGINE"]}
      />

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-adhi-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-adhi-primary/20">
              <Calculator size={20} className="text-white" />
            </div>
            Rules Engine
          </h2>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">
            Define the BOQ template for{" "}
            <span className="font-semibold text-gray-700">
              {MVP_PRODUCT.name} ({MVP_PRODUCT.floorArea})
            </span>{" "}
            · {rows.length} line items · Grand Total:{" "}
            <span className="font-bold text-adhi-primary">
              ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleReset}
            className="bg-white border border-gray-200 text-gray-500 px-3 py-2 rounded-xl text-sm hover:bg-gray-50 transition-all flex items-center gap-1.5 shadow-sm"
            title="Reset to saved"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={() => setShowPreview((v) => !v)}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-sm border ${
              showPreview
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            Preview
          </button>
          <button
            onClick={handleSave}
            className="bg-adhi-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-adhi-dark transition-all flex items-center gap-2 shadow-lg shadow-adhi-primary/20"
          >
            <Save size={16} /> Save Template
          </button>
        </div>
      </div>

      {/* ── Success Toast ── */}
      {saved && (
        <div className="bg-emerald-500 text-white px-6 py-3 rounded-xl flex items-center gap-3 font-semibold shadow-lg animate-pulse">
          <CheckCircle2 size={18} /> BOQ template saved successfully!
        </div>
      )}

      {/* ── Category Summary Pills ── */}
      <div className="flex gap-2 flex-wrap">
        {BOQ_CATEGORIES.map((cat) => {
          const stat = categoryStats[cat];
          if (!stat) return null;
          return (
            <div
              key={cat}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-bold ${catColor(cat)}`}
            >
              {cat}
              <span className="bg-white/60 px-1.5 rounded-md text-[10px] font-black">
                {stat.count}
              </span>
              <span className="text-[10px] font-mono opacity-70">
                ${stat.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Info Banner ── */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle size={18} className="text-blue-500 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-800">
          <strong>Text-field mode.</strong> Each field is free-text — type the
          exact values you want the franchisee and accountant to see in the BOQ.
          Click the pencil icon on any row to edit it.
        </div>
      </div>

      {/* ── Main Content ── */}
      <div
        className={`grid gap-6 ${
          showPreview ? "grid-cols-1 xl:grid-cols-[1fr_460px]" : "grid-cols-1"
        }`}
      >
        {/* ═══ EDITOR TABLE ═══ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          {/* Table Header Bar */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/80 to-transparent shrink-0">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <FileText size={16} className="text-adhi-primary" />
              BOQ Line Items
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold ml-1">
                {rows.length}
              </span>
            </div>
            <button
              onClick={addRow}
              className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-semibold text-xs hover:bg-gray-50 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={14} /> Add Row
            </button>
          </div>

          {/* Table */}
          <div
            className="flex-1 overflow-auto"
            style={{ maxHeight: "calc(100vh - 400px)" }}
          >
            <table
              className="w-full text-left text-sm border-collapse"
              style={{ minWidth: "1100px" }}
            >
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-3 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest w-[30px]"></th>
                  <th className="px-3 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest w-[110px]">
                    Code
                  </th>
                  <th className="px-3 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest w-[100px]">
                    Category
                  </th>
                  <th className="px-3 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                    Description
                  </th>
                  <th className="px-3 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest w-[65px]">
                    Unit
                  </th>
                  <th className="px-3 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest w-[75px] text-right">
                    Qty
                  </th>
                  <th className="px-3 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest w-[95px] text-right">
                    Rate (USD)
                  </th>
                  <th className="px-3 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest w-[110px] text-right">
                    Amount (USD)
                  </th>
                  <th className="px-3 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-right w-[70px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((row) => {
                  const isEditing = editingRowId === row.id;

                  return (
                    <tr
                      key={row.id}
                      className={`group transition-all duration-150 ${
                        isEditing
                          ? "bg-adhi-light/40 ring-1 ring-inset ring-adhi-primary/20"
                          : "hover:bg-gray-50/60"
                      }`}
                    >
                      {/* Grip */}
                      <td className="px-3 py-2.5 text-center">
                        <GripVertical size={12} className="text-gray-300 mx-auto" />
                      </td>

                      {/* Code */}
                      <td className="px-3 py-2.5">
                        {isEditing ? (
                          <input
                            type="text"
                            value={row.code}
                            onChange={(e) => updateRow(row.id, "code", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white text-gray-900 font-mono focus:ring-2 focus:ring-adhi-primary focus:border-adhi-primary outline-none"
                            placeholder="FND-001"
                          />
                        ) : (
                          <span className="font-mono text-xs text-gray-500 font-semibold">
                            {row.code || <span className="text-gray-300">—</span>}
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-3 py-2.5">
                        {isEditing ? (
                          <select
                            value={row.category}
                            onChange={(e) => updateRow(row.id, "category", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white focus:ring-2 focus:ring-adhi-primary outline-none"
                          >
                            {BOQ_CATEGORIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border ${catColor(row.category)}`}>
                            {row.category}
                          </span>
                        )}
                      </td>

                      {/* Description */}
                      <td className="px-3 py-2.5">
                        {isEditing ? (
                          <input
                            type="text"
                            value={row.description}
                            onChange={(e) => updateRow(row.id, "description", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white text-gray-900 focus:ring-2 focus:ring-adhi-primary focus:border-adhi-primary outline-none"
                            placeholder="e.g. Setting out"
                          />
                        ) : (
                          <span className="font-medium text-gray-900 text-[13px]">
                            {row.description || <span className="text-gray-300 italic">Empty</span>}
                          </span>
                        )}
                      </td>

                      {/* Unit */}
                      <td className="px-3 py-2.5">
                        {isEditing ? (
                          <input
                            type="text"
                            value={row.unit}
                            onChange={(e) => updateRow(row.id, "unit", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white text-gray-900 focus:ring-2 focus:ring-adhi-primary outline-none text-center"
                            placeholder="m2"
                          />
                        ) : (
                          <span className="text-gray-500 text-xs font-bold uppercase text-center block">
                            {row.unit}
                          </span>
                        )}
                      </td>

                      {/* Qty */}
                      <td className="px-3 py-2.5">
                        {isEditing ? (
                          <input
                            type="text"
                            value={row.qty}
                            onChange={(e) => updateRow(row.id, "qty", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white text-gray-900 focus:ring-2 focus:ring-adhi-primary outline-none text-right font-mono"
                            placeholder="0"
                          />
                        ) : (
                          <span className="text-gray-700 font-semibold text-right block font-mono text-xs">
                            {row.qty}
                          </span>
                        )}
                      </td>

                      {/* Rate */}
                      <td className="px-3 py-2.5">
                        {isEditing ? (
                          <input
                            type="text"
                            value={row.rate}
                            onChange={(e) => updateRow(row.id, "rate", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white text-gray-900 focus:ring-2 focus:ring-adhi-primary outline-none text-right font-mono"
                            placeholder="0"
                          />
                        ) : (
                          <span className="text-gray-600 font-mono text-right block text-xs">
                            ${row.rate}
                          </span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="px-3 py-2.5">
                        {isEditing ? (
                          <input
                            type="text"
                            value={row.amount}
                            onChange={(e) => updateRow(row.id, "amount", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white text-gray-900 font-bold focus:ring-2 focus:ring-adhi-primary outline-none text-right font-mono"
                            placeholder="0"
                          />
                        ) : (
                          <span className="text-gray-900 font-bold font-mono text-right block text-xs">
                            ${row.amount}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          <button
                            onClick={() => setEditingRowId(isEditing ? null : row.id)}
                            title={isEditing ? "Done" : "Edit"}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isEditing
                                ? "text-adhi-primary bg-adhi-surface"
                                : "text-gray-400 hover:text-adhi-primary hover:bg-adhi-surface opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            {isEditing ? <CheckCircle2 size={14} /> : <Pencil size={13} />}
                          </button>
                          <button
                            onClick={() => removeRow(row.id)}
                            title="Delete"
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {rows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-16 text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <FileText size={32} className="text-gray-300" />
                        <p className="text-sm font-medium">No line items defined yet.</p>
                        <button onClick={addRow} className="text-adhi-primary font-semibold text-sm hover:underline">
                          + Add your first line item
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer — Grand Total */}
          <div className="p-4 border-t-2 border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {rows.length} line items · All fields are free-text
            </span>
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-adhi-primary" />
              <span className="text-xl font-black text-gray-900 tabular-nums">
                ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* ═══ PREVIEW SIDEBAR ═══ */}
        {showPreview && (
          <div className="flex flex-col gap-5">
            {/* Preview Card — what the franchisee sees */}
            <div className="bg-gray-900 rounded-2xl text-white shadow-xl overflow-hidden">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-emerald-400" />
                  <span className="text-sm font-bold">Franchisee View</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold tracking-tight">
                  READ-ONLY
                </span>
              </div>

              {/* Product Header */}
              <div className="px-4 pt-4 pb-3 border-b border-gray-800">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Product
                </div>
                <div className="text-lg font-bold">
                  {MVP_PRODUCT.name}{" "}
                  <span className="text-sm text-gray-400 font-normal">({MVP_PRODUCT.floorArea})</span>
                </div>
              </div>

              {/* BOQ Preview Table — grouped by category */}
              <div className="overflow-auto" style={{ maxHeight: "500px" }}>
                <table className="w-full text-left text-xs" style={{ minWidth: "420px" }}>
                  <thead className="sticky top-0 bg-gray-800 z-10">
                    <tr className="text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-700">
                      <th className="px-3 py-2.5">Code</th>
                      <th className="px-3 py-2.5">Description</th>
                      <th className="px-3 py-2.5 text-center">Unit</th>
                      <th className="px-3 py-2.5 text-right">Qty</th>
                      <th className="px-3 py-2.5 text-right">Rate</th>
                      <th className="px-3 py-2.5 text-right text-emerald-400">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BOQ_CATEGORIES.map((cat) => {
                      const catRows = rows.filter((r) => r.category === cat);
                      if (catRows.length === 0) return null;
                      const catTotal = catRows.reduce(
                        (s, r) => s + (parseFloat(String(r.amount).replace(/,/g, "")) || 0), 0
                      );
                      return (
                        <React.Fragment key={cat}>
                          {/* Category Header */}
                          <tr className="bg-gray-800/80">
                            <td colSpan={5} className="px-3 py-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                              {cat}
                            </td>
                            <td className="px-3 py-2 text-right text-[10px] font-bold text-gray-400 font-mono">
                              ${catTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                          {catRows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-800/40 transition-colors border-b border-gray-800/30">
                              <td className="px-3 py-2 font-mono text-[9px] text-gray-500">{row.code}</td>
                              <td className="px-3 py-2 font-medium text-gray-300 text-[11px]">{row.description}</td>
                              <td className="px-3 py-2 text-center text-gray-600 font-bold uppercase text-[9px]">{row.unit}</td>
                              <td className="px-3 py-2 text-right text-gray-400 font-mono text-[11px]">{row.qty}</td>
                              <td className="px-3 py-2 text-right text-gray-500 font-mono text-[11px]">${row.rate}</td>
                              <td className="px-3 py-2 text-right font-bold text-emerald-400 tabular-nums text-[11px]">${row.amount}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Grand Total */}
              <div className="p-4 border-t-2 border-gray-700 bg-gray-900">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                      Grand Total (per unit)
                    </span>
                    <span className="text-[10px] text-gray-600 mt-0.5 block">
                      {MVP_PRODUCT.name} · {MVP_PRODUCT.floorArea}
                    </span>
                  </div>
                  <span className="text-2xl font-black text-white tabular-nums tracking-tight">
                    ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <AlertCircle size={14} className="text-adhi-primary" />
                How It Works
              </div>
              <div className="space-y-2 text-xs text-gray-500 leading-relaxed">
                <p><strong className="text-gray-700">1.</strong> Edit any row by clicking the pencil icon.</p>
                <p><strong className="text-gray-700">2.</strong> All 7 columns (Code, Category, Description, Unit, Qty, Rate, Amount) are free-text.</p>
                <p><strong className="text-gray-700">3.</strong> Click <strong className="text-adhi-primary">Save Template</strong> to publish. Franchisees see this exact BOQ as a read-only table when ordering.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Need React import for React.Fragment in the preview
import React from "react";
