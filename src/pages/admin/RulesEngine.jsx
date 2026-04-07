import { useState, useMemo, useCallback } from "react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { useRole } from "../../context/RoleContext";
import {
  Play, Edit2, Save, X, Plus, Trash2,
  AlertTriangle, CheckCircle2, FlaskConical,
  Calculator, Info, ChevronDown, Zap,
  ShieldCheck, Layers, ArrowRight, RotateCcw,
  Copy, Eye, EyeOff, TrendingUp, Home,
} from "lucide-react";
import { houseTypes, components } from "../../mock/houseTypes";

/* ═══════════════════════════════════════════════════════════════════
   RULES ENGINE — ADHI House-in-a-Kit BOQ Logic Layer
   
   Architecture:
   ┌─────────┐    ┌──────────────┐    ┌─────────┐
   │  BASE   │ →  │  ADJUSTMENT  │ →  │  GUARD  │  →  Final Qty
   │ (seed)  │    │  (modifier)  │    │ (clamp) │
   └─────────┘    └──────────────┘    └─────────┘
   
   Rules:
   - BASE: computes initial quantity from inputs (floorArea, bedrooms)
   - ADJUSTMENT: modifies the BASE value (wastage, rounding, etc.)
   - GUARD: final validation (min/max clamping, ceiling)
   - No two rules may target the same output at the same layer.
   
   Formula Context Variables:
   - floorArea  : computed from bedrooms or house type
   - bedrooms   : number of bedrooms
   - base       : the BASE value for the current output (available in ADJUSTMENT/GUARD)
   - adjustment : the ADJUSTMENT value (available in GUARD)
   ═══════════════════════════════════════════════════════════════════ */

const INITIAL_RULES = [
  // ── Foundation ──
  { id: "R-001", layer: "BASE",       trigger: "always",     formula: "1",                                output: "FND-SET-001", description: "Setting out — fixed item" },
  { id: "R-002", layer: "BASE",       trigger: "floor_area", formula: "+(floorArea * 0.2).toFixed(2)",     output: "FND-EXC-001", description: "Excavation ≈ 20% of floor area" },
  { id: "R-003", layer: "BASE",       trigger: "floor_area", formula: "+(floorArea * 0.208).toFixed(2)",   output: "FND-HCF-001", description: "Hardcore fill ≈ 20.8% of floor area" },
  { id: "R-004", layer: "BASE",       trigger: "floor_area", formula: "+(floorArea * 0.052).toFixed(2)",   output: "FND-SND-001", description: "Sand blinding ≈ 5.2% of floor area" },
  { id: "R-005", layer: "BASE",       trigger: "floor_area", formula: "+(floorArea * 0.0416).toFixed(2)",  output: "FND-BLN-001", description: "Concrete blinding ≈ 4.16% of floor area" },
  { id: "R-006", layer: "BASE",       trigger: "floor_area", formula: "+(floorArea * 0.1).toFixed(2)",     output: "FND-STR-001", description: "Strip footing ≈ 10% of floor area" },
  { id: "R-007", layer: "BASE",       trigger: "floor_area", formula: "+(floorArea * 1.04).toFixed(2)",    output: "FND-DPM-001", description: "DPM ≈ 104% of floor area (overlap)" },
  { id: "R-008", layer: "BASE",       trigger: "floor_area", formula: "+(floorArea * 0.104).toFixed(2)",   output: "FND-SLB-001", description: "Slab concrete ≈ 10.4% of floor area" },
  { id: "R-009", layer: "BASE",       trigger: "floor_area", formula: "+(floorArea * 1.04).toFixed(2)",    output: "FND-MSH-001", description: "Mesh ≈ 104% of floor area" },
  // ── Walls ──
  { id: "R-010", layer: "BASE",       trigger: "floor_area", formula: "+(floorArea * 1.6667).toFixed(1)",  output: "WAL-EXT-001", description: "External walls ≈ 166.7% of floor area" },
  // ── Structure ──
  { id: "R-011", layer: "BASE",       trigger: "floor_area", formula: "+(floorArea * 0.6667).toFixed(1)",  output: "STR-RBM-001", description: "Ring beam ≈ 66.7% of floor area" },
  // ── Roof ──
  { id: "R-012", layer: "BASE",       trigger: "floor_area", formula: "+(floorArea * 1.2).toFixed(2)",     output: "ROF-FRM-001", description: "Roof structure ≈ 120% of floor area" },
  { id: "R-013", layer: "BASE",       trigger: "floor_area", formula: "+(floorArea * 1.2).toFixed(2)",     output: "ROF-COV-001", description: "Roof covering ≈ 120% of floor area" },
  { id: "R-014", layer: "BASE",       trigger: "floor_area", formula: "+(floorArea * 0.1733).toFixed(1)",  output: "ROF-RDG-001", description: "Ridge cap ≈ 17.33% of floor area" },
  { id: "R-015", layer: "BASE",       trigger: "floor_area", formula: "+(floorArea * 0.6667).toFixed(1)",  output: "ROF-FAS-001", description: "Fascia ≈ 66.7% of floor area" },
  { id: "R-016", layer: "BASE",       trigger: "floor_area", formula: "+(floorArea * 0.48).toFixed(2)",    output: "ROF-GTR-001", description: "Gutters ≈ 48% of floor area" },
  { id: "R-017", layer: "BASE",       trigger: "floor_area", formula: "Math.ceil(floorArea / 18.75)",      output: "ROF-DWP-001", description: "Downpipes — 1 per 18.75 m²" },
  // ── Openings ──
  { id: "R-018", layer: "BASE",       trigger: "bedrooms",   formula: "1 + Math.floor(bedrooms / 3)",      output: "OPN-DRF-001", description: "External doors ≈ 1 + bedrooms/3" },
  { id: "R-019", layer: "BASE",       trigger: "bedrooms",   formula: "2 + bedrooms",                      output: "OPN-WOP-001", description: "Windows ≈ 2 + bedrooms" },
  { id: "R-020", layer: "BASE",       trigger: "bedrooms",   formula: "(2 + bedrooms) * 2",                 output: "OPN-LNT-001", description: "Lintels ≈ 2× window count" },
  // ── Example ADJUSTMENT / GUARD rules (demonstrating the full pipeline) ──
  { id: "R-021", layer: "ADJUSTMENT", trigger: "floor_area", formula: "+(base * 1.05).toFixed(2)",          output: "FND-EXC-001", description: "Excavation +5% wastage allowance" },
  { id: "R-022", layer: "GUARD",      trigger: "floor_area", formula: "Math.max(adjustment || base, 1)",    output: "FND-EXC-001", description: "Excavation minimum 1 m³" },
];

const LAYER_CONFIG = {
  BASE:       { color: "bg-blue-500/10 text-blue-600 border-blue-200",   icon: Layers,      order: 1, label: "BASE",       desc: "Computes initial quantity" },
  ADJUSTMENT: { color: "bg-amber-500/10 text-amber-600 border-amber-200", icon: TrendingUp,  order: 2, label: "ADJUSTMENT", desc: "Modifies base value" },
  GUARD:      { color: "bg-rose-500/10 text-rose-600 border-rose-200",   icon: ShieldCheck,  order: 3, label: "GUARD",      desc: "Final clamp / validation" },
};

const TRIGGERS = ["always", "floor_area", "bedrooms", "house_type"];

/* ── Safe formula evaluator ── */
function evaluateFormula(formula, context) {
  try {
    const fn = new Function(
      "bedrooms", "floorArea", "base", "adjustment",
      `"use strict"; return (${formula});`
    );
    const result = fn(context.bedrooms, context.floorArea, context.base, context.adjustment);
    if (typeof result !== "number" || !isFinite(result)) return { value: 0, error: "Non-numeric result" };
    return { value: Number(result), error: null };
  } catch (e) {
    return { value: 0, error: e.message };
  }
}

/* ══════════════════════════════════════════════════════════════════ */

export default function RulesEngine() {
  const { roleConfig } = useRole();
  const [rules, setRules] = useState(INITIAL_RULES);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [showSimulator, setShowSimulator] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  // Simulator inputs — bedrooms is the single control; floor area is derived
  const [simConfig, setSimConfig] = useState({
    houseTypeId: "HT-002",
    bedrooms: 2,
  });

  /* ── Derived floor area: 15 + (bedrooms × 12)  →  2 bed = 39 m² ── */
  const selectedHouse = houseTypes.find(h => h.id === simConfig.houseTypeId);
  const computedFloorArea = useMemo(() => {
    const beds = Math.max(0, Number(simConfig.bedrooms) || 0);
    return 15 + (beds * 12);
  }, [simConfig.bedrooms]);

  /* ═════════════════════════════════════════════════════════════
     CORE ENGINE: Evaluate all rules in layer order
     BASE → ADJUSTMENT → GUARD
     ═════════════════════════════════════════════════════════════ */
  const { computedResults, conflicts, ruleErrors } = useMemo(() => {
    const results = {};      // { [outputId]: { base, adjustment, guard, final, steps[] } }
    const conflictList = [];
    const errorMap = {};     // { [ruleId]: errorMessage }

    const context = {
      floorArea: computedFloorArea,
      bedrooms: Number(simConfig.bedrooms),
    };

    // Sort rules by execution order
    const sorted = [...rules].sort((a, b) => {
      const orderA = LAYER_CONFIG[a.layer]?.order ?? 99;
      const orderB = LAYER_CONFIG[b.layer]?.order ?? 99;
      return orderA - orderB;
    });

    sorted.forEach(rule => {
      const cfg = LAYER_CONFIG[rule.layer];
      if (!cfg) return;

      // Initialise result bucket for this output
      if (!results[rule.output]) {
        results[rule.output] = { base: 0, adjustment: 0, guard: null, final: 0, steps: [] };
      }

      const bucket = results[rule.output];

      // ── Conflict: duplicate layer for same output (except GUARD can override) ──
      const existingAtLayer = bucket.steps.filter(s => s.layer === rule.layer);
      if (existingAtLayer.length > 0) {
        conflictList.push({
          ruleId: rule.id,
          msg: `Conflict: "${rule.id}" duplicates ${rule.layer} layer for output "${rule.output}" (already set by "${existingAtLayer[0].ruleId}")`,
        });
      }

      // Evaluate
      const evalCtx = { ...context, base: bucket.base, adjustment: bucket.adjustment };
      const { value, error } = evaluateFormula(rule.formula, evalCtx);

      if (error) {
        errorMap[rule.id] = error;
      }

      // Track value per layer
      if (rule.layer === "BASE") {
        bucket.base = value;
        bucket.final = value;
      } else if (rule.layer === "ADJUSTMENT") {
        bucket.adjustment = value;
        bucket.final = value;
      } else if (rule.layer === "GUARD") {
        bucket.guard = value;
        bucket.final = value;
      }

      bucket.steps.push({ ruleId: rule.id, layer: rule.layer, value, error });
    });

    return { computedResults: results, conflicts: conflictList, ruleErrors: errorMap };
  }, [rules, simConfig, computedFloorArea]);

  /* ── Handlers ────────────────────────────────────────────────── */
  const startEdit = useCallback((rule) => {
    setEditingId(rule.id);
    setEditForm({ ...rule });
  }, []);

  const saveEdit = useCallback(() => {
    if (!editForm) return;
    setRules(prev => prev.map(r => r.id === editingId ? { ...editForm } : r));
    setEditingId(null);
    setEditForm(null);
  }, [editingId, editForm]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditForm(null);
  }, []);

  const addNewRule = useCallback(() => {
    const maxNum = rules.reduce((max, r) => {
      const m = r.id.match(/R-(\d+)/);
      return m ? Math.max(max, parseInt(m[1])) : max;
    }, 0);
    const newId = `R-${String(maxNum + 1).padStart(3, "0")}`;
    const newRule = {
      id: newId, layer: "BASE", trigger: "always", formula: "0",
      output: components[0]?.id || "COMP-001", description: "New rule",
    };
    setRules(prev => [...prev, newRule]);
    startEdit(newRule);
  }, [rules, startEdit]);

  const duplicateRule = useCallback((rule) => {
    const maxNum = rules.reduce((max, r) => {
      const m = r.id.match(/R-(\d+)/);
      return m ? Math.max(max, parseInt(m[1])) : max;
    }, 0);
    const newId = `R-${String(maxNum + 1).padStart(3, "0")}`;
    const dup = { ...rule, id: newId, description: `${rule.description} (copy)` };
    setRules(prev => [...prev, dup]);
  }, [rules]);

  const deleteRule = useCallback((id) => {
    setRules(prev => prev.filter(r => r.id !== id));
    if (editingId === id) cancelEdit();
  }, [editingId, cancelEdit]);

  const resetRules = useCallback(() => {
    setRules(INITIAL_RULES);
    setEditingId(null);
    setEditForm(null);
  }, []);

  /* ── Stats ───────────────────────────────────────────────────── */
  const stats = useMemo(() => ({
    total: rules.length,
    base: rules.filter(r => r.layer === "BASE").length,
    adj: rules.filter(r => r.layer === "ADJUSTMENT").length,
    guard: rules.filter(r => r.layer === "GUARD").length,
    errors: Object.keys(ruleErrors).length,
    conflicts: conflicts.length,
  }), [rules, ruleErrors, conflicts]);

  /* ── Grand total ─────────────────────────────────────────────── */
  const grandTotal = useMemo(() => {
    return Object.keys(computedResults).reduce((sum, compId) => {
      const comp = components.find(c => c.id === compId);
      const qty = Number(computedResults[compId].final) || 0;
      return sum + qty * (comp?.rateUsd || 0);
    }, 0);
  }, [computedResults]);

  /* ═════════════════════════════════════════════════════════════
     RENDER
     ═════════════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col gap-5 pb-10">
      <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "RULES ENGINE"]} />

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-adhi-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-adhi-primary/20">
              <Calculator size={20} className="text-white" />
            </div>
            Rules Engine
          </h2>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">Logic layer for House-in-a-Kit BOQ generation · <span className="font-semibold text-gray-700">{stats.total} rules</span></p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={resetRules} className="bg-white border border-gray-200 text-gray-500 px-3 py-2 rounded-xl text-sm hover:bg-gray-50 transition-all flex items-center gap-1.5 shadow-sm" title="Reset to defaults">
            <RotateCcw size={14} /> Reset
          </button>
          <button onClick={addNewRule} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
            <Plus size={16} /> New Rule
          </button>
          <button onClick={() => setShowSimulator(v => !v)} className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-sm border ${showSimulator ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
            <FlaskConical size={16} /> Simulator
          </button>
          <button className="bg-adhi-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-adhi-dark transition-all flex items-center gap-2 shadow-lg shadow-adhi-primary/20">
            <Play size={16} /> Deploy
          </button>
        </div>
      </div>

      {/* ── Status Badges ── */}
      <div className="flex gap-3 flex-wrap">
        <StatusPill icon={Layers} label="BASE" count={stats.base} color="blue" />
        <StatusPill icon={TrendingUp} label="ADJUSTMENT" count={stats.adj} color="amber" />
        <StatusPill icon={ShieldCheck} label="GUARD" count={stats.guard} color="rose" />
        {stats.errors > 0 && <StatusPill icon={AlertTriangle} label="ERRORS" count={stats.errors} color="red" />}
        {stats.conflicts > 0 && <StatusPill icon={AlertTriangle} label="CONFLICTS" count={stats.conflicts} color="orange" />}
        {stats.errors === 0 && stats.conflicts === 0 && <StatusPill icon={CheckCircle2} label="ALL CLEAR" count="✓" color="emerald" />}
      </div>

      {/* ── Conflicts/Errors Banner ── */}
      {(conflicts.length > 0 || Object.keys(ruleErrors).length > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm mb-2">
            <AlertTriangle size={16} /> Issues Detected
          </div>
          <div className="space-y-1">
            {conflicts.map((c, i) => (
              <p key={i} className="text-xs text-red-600 font-mono pl-4">• {c.msg}</p>
            ))}
            {Object.entries(ruleErrors).map(([id, err]) => (
              <p key={id} className="text-xs text-red-600 font-mono pl-4">• {id}: {err}</p>
            ))}
          </div>
        </div>
      )}

      {/* ── Main Content Grid ── */}
      <div className={`grid gap-6 ${showSimulator ? 'grid-cols-1 xl:grid-cols-[1fr_420px]' : 'grid-cols-1'}`}>

        {/* ═══ RULES TABLE ═══ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden" style={{ minHeight: "400px" }}>
          {/* Table Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/80 to-transparent shrink-0">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <Calculator size={16} className="text-adhi-primary" />
              Active Logic Rules
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold ml-1">{rules.length}</span>
            </div>
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest hidden sm:block">
              Execution: Base → Adjustment → Guard
            </div>
          </div>

          {/* Scrollable Table Container — BOTH axes */}
          <div className="flex-1 overflow-auto" style={{ maxHeight: "calc(100vh - 340px)" }}>
            <table className="w-full text-left text-sm border-collapse" style={{ minWidth: "1000px" }}>
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest w-[90px]">Rule ID</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest w-[120px]">Layer</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest w-[120px]">Trigger</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest" style={{ minWidth: "260px" }}>Formula</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest w-[140px]">Output</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-right w-[100px]">Result</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-right w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rules.map((rule, idx) => {
                  const isEditing = editingId === rule.id;
                  const hasError = ruleErrors[rule.id];
                  const hasConflict = conflicts.some(c => c.ruleId === rule.id);
                  const liveValue = computedResults[rule.output]?.steps.find(s => s.ruleId === rule.id)?.value;
                  const layerCfg = LAYER_CONFIG[rule.layer] || LAYER_CONFIG.BASE;
                  const LayerIcon = layerCfg.icon;
                  const isExpanded = expandedRow === rule.id;

                  return (
                    <tr
                      key={rule.id}
                      className={`
                        group transition-all duration-150
                        ${isEditing ? "bg-adhi-light/40 ring-1 ring-inset ring-adhi-primary/20" : ""}
                        ${hasError ? "bg-red-50/40" : ""}
                        ${hasConflict ? "bg-amber-50/40" : ""}
                        ${!isEditing && !hasError && !hasConflict ? "hover:bg-gray-50/60" : ""}
                      `}
                    >
                      {/* Rule ID */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.id}
                            onChange={e => setEditForm({ ...editForm, id: e.target.value })}
                            className="text-xs font-bold border border-gray-300 rounded-lg p-1.5 w-20 bg-white text-gray-900 focus:ring-2 focus:ring-adhi-primary focus:border-adhi-primary outline-none transition-all"
                          />
                        ) : (
                          <button
                            onClick={() => setExpandedRow(isExpanded ? null : rule.id)}
                            className="font-bold text-gray-900 text-xs hover:text-adhi-primary transition-colors flex items-center gap-1"
                          >
                            <ChevronDown size={12} className={`transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"} text-gray-400`} />
                            {rule.id}
                          </button>
                        )}
                      </td>

                      {/* Layer */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {isEditing ? (
                          <select
                            value={editForm.layer}
                            onChange={e => setEditForm({ ...editForm, layer: e.target.value })}
                            className="text-xs font-bold border border-gray-300 rounded-lg p-1.5 focus:ring-2 focus:ring-adhi-primary outline-none transition-all"
                          >
                            <option value="BASE">BASE</option>
                            <option value="ADJUSTMENT">ADJUSTMENT</option>
                            <option value="GUARD">GUARD</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded-lg text-[10px] font-black tracking-tight ${layerCfg.color}`}>
                            <LayerIcon size={10} />
                            {rule.layer}
                          </span>
                        )}
                      </td>

                      {/* Trigger */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {isEditing ? (
                          <select
                            value={editForm.trigger}
                            onChange={e => setEditForm({ ...editForm, trigger: e.target.value })}
                            className="text-xs border border-gray-300 rounded-lg p-1.5 font-mono focus:ring-2 focus:ring-adhi-primary outline-none transition-all"
                          >
                            {TRIGGERS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        ) : (
                          <span className="text-gray-500 font-mono text-xs bg-gray-50 px-2 py-0.5 rounded">{rule.trigger}</span>
                        )}
                      </td>

                      {/* Formula */}
                      <td className="px-4 py-3" style={{ minWidth: "260px" }}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.formula}
                            onChange={e => setEditForm({ ...editForm, formula: e.target.value })}
                            className="text-xs border border-gray-300 rounded-lg p-2 w-full font-mono bg-white outline-none focus:ring-2 focus:ring-adhi-primary transition-all"
                            placeholder="e.g. +(floorArea * 0.2).toFixed(2)"
                          />
                        ) : (
                          <code className={`text-xs font-medium px-2.5 py-1.5 rounded-lg block break-all whitespace-pre-wrap border ${hasError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
                            {rule.formula}
                          </code>
                        )}
                      </td>

                      {/* Output Component */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {isEditing ? (
                          <select
                            value={editForm.output}
                            onChange={e => setEditForm({ ...editForm, output: e.target.value })}
                            className="text-xs border border-gray-300 rounded-lg p-1.5 font-mono focus:ring-2 focus:ring-adhi-primary outline-none transition-all max-w-[140px]"
                          >
                            {components.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                          </select>
                        ) : (
                          <span className="font-mono text-xs text-adhi-primary font-bold">{rule.output}</span>
                        )}
                      </td>

                      {/* Live Result */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {hasError ? (
                          <span className="text-red-500 text-[10px] font-bold flex items-center justify-end gap-1">
                            <AlertTriangle size={10} /> ERR
                          </span>
                        ) : (
                          <span className={`font-mono text-xs font-black ${rule.layer === "GUARD" ? "text-rose-600" : rule.layer === "ADJUSTMENT" ? "text-amber-600" : "text-adhi-primary"}`}>
                            {liveValue !== undefined ? liveValue : "—"}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={saveEdit} title="Save" className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Save size={15} /></button>
                            <button onClick={cancelEdit} title="Cancel" className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"><X size={15} /></button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => startEdit(rule)} title="Edit" className="p-1.5 text-gray-400 hover:text-adhi-primary hover:bg-adhi-surface rounded-lg transition-colors"><Edit2 size={13} /></button>
                            <button onClick={() => duplicateRule(rule)} title="Duplicate" className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Copy size={13} /></button>
                            <button onClick={() => deleteRule(rule.id)} title="Delete" className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={13} /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest shrink-0">
            <span>{rules.length} rules · {Object.keys(computedResults).length} outputs</span>
            <span>Scroll → to see all columns</span>
          </div>
        </div>

        {/* ═══ SIMULATOR SIDEBAR ═══ */}
        {showSimulator && (
          <div className="flex flex-col gap-5">
            {/* Input Panel */}
            <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-adhi-primary/20 to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex items-center gap-2 mb-6 relative">
                <div className="w-8 h-8 rounded-lg bg-adhi-primary/20 flex items-center justify-center">
                  <FlaskConical size={18} className="text-adhi-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold">BOQ Simulator</h3>
                  <p className="text-[10px] text-gray-500 font-medium">Test rule outputs in real time</p>
                </div>
              </div>

              <div className="space-y-4 relative">
                {/* House Type Selector */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                    House Type
                  </label>
                  <select
                    value={simConfig.houseTypeId}
                    onChange={e => {
                      const ht = houseTypes.find(h => h.id === e.target.value);
                      setSimConfig({
                        ...simConfig,
                        houseTypeId: e.target.value,
                        bedrooms: ht?.defaultBedrooms ?? simConfig.bedrooms,
                      });
                    }}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-adhi-primary outline-none appearance-none cursor-pointer"
                  >
                    {houseTypes.map(ht => (
                      <option key={ht.id} value={ht.id}>{ht.name} ({ht.defaultBedrooms} bed)</option>
                    ))}
                  </select>
                </div>

                {/* Bedrooms — the ONLY input that drives floor area */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                    Bedrooms
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={simConfig.bedrooms}
                      onChange={e => setSimConfig({ ...simConfig, bedrooms: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-adhi-primary text-white outline-none"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-adhi-primary/15 text-adhi-primary px-2 py-0.5 rounded-md pointer-events-none">
                      → {computedFloorArea} m²
                    </div>
                  </div>
                  <p className="text-[9px] text-gray-600 mt-1.5 font-medium">Floor area = 15 + (bedrooms × 12) m²</p>
                </div>

                {/* Active Parameters Card */}
                <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/50 mt-2">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Active Parameters</div>
                  <div className="grid grid-cols-2 gap-2">
                    <ParamChip label="Floor Area" value={`${computedFloorArea} m²`} accent />
                    <ParamChip label="Bedrooms" value={simConfig.bedrooms} />
                    <ParamChip label="House Type" value={selectedHouse?.modelCode || "—"} />
                    <ParamChip label="Rules" value={rules.length} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Live BOQ Output ── */}
            <div className="bg-gray-900 rounded-2xl text-white shadow-xl overflow-hidden">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-emerald-400" />
                  <span className="text-sm font-bold">Computed BOQ</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold tracking-tight animate-pulse">
                  LIVE
                </span>
              </div>

              <div className="overflow-auto" style={{ maxHeight: "420px" }}>
                <table className="w-full text-left text-xs" style={{ minWidth: "600px" }}>
                  <thead className="sticky top-0 bg-gray-800 z-10">
                    <tr className="text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-700">
                      <th className="px-3 py-2.5">Code</th>
                      <th className="px-3 py-2.5">Category</th>
                      <th className="px-3 py-2.5" style={{ minWidth: "120px" }}>Description</th>
                      <th className="px-3 py-2.5 text-center">Unit</th>
                      <th className="px-3 py-2.5 text-right text-adhi-primary">Qty</th>
                      <th className="px-3 py-2.5 text-right">Rate</th>
                      <th className="px-3 py-2.5 text-right text-emerald-400">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {Object.keys(computedResults).map(compId => {
                      const comp = components.find(c => c.id === compId);
                      const rate = comp?.rateUsd || 0;
                      const qty = Number(computedResults[compId].final) || 0;
                      const amount = qty * rate;
                      const bucket = computedResults[compId];

                      return (
                        <tr key={compId} className="hover:bg-gray-800/40 transition-colors group/row">
                          <td className="px-3 py-2.5 font-mono text-[10px] text-gray-400 whitespace-nowrap">{compId}</td>
                          <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap text-[10px]">{comp?.category}</td>
                          <td className="px-3 py-2.5 font-medium text-gray-300 text-[11px]">{comp?.name || compId}</td>
                          <td className="px-3 py-2.5 text-center text-gray-600 font-bold uppercase text-[10px]">{comp?.unit}</td>
                          <td className="px-3 py-2.5 text-right">
                            <div className="flex flex-col items-end">
                              <span className="font-black text-adhi-primary text-sm tabular-nums">{qty}</span>
                              {bucket.steps.length > 1 && (
                                <span className="text-[8px] text-gray-600 font-mono mt-0.5">
                                  {bucket.steps.map(s => `${s.layer[0]}:${s.value}`).join(" → ")}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-right text-gray-400 font-mono tracking-tight text-[11px]">${rate.toFixed(2)}</td>
                          <td className="px-3 py-2.5 text-right font-bold text-emerald-400 tabular-nums">
                            ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Grand Total */}
              <div className="p-4 border-t-2 border-gray-700 bg-gray-900">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Grand Total (Core Shell)</span>
                    <span className="text-[10px] text-gray-600 mt-0.5 block">
                      {selectedHouse?.name} · {computedFloorArea} m² · {simConfig.bedrooms} bed
                    </span>
                  </div>
                  <span className="text-3xl font-black text-white tabular-nums tracking-tight">
                    ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Pipeline Explainer ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4">
                <Info size={14} className="text-adhi-primary" />
                Execution Pipeline
              </div>
              <div className="flex items-center gap-2 text-xs">
                <PipelineStep layer="BASE" desc="Seed quantity" color="blue" />
                <ArrowRight size={14} className="text-gray-300 shrink-0" />
                <PipelineStep layer="ADJUSTMENT" desc="Wastage / modify" color="amber" />
                <ArrowRight size={14} className="text-gray-300 shrink-0" />
                <PipelineStep layer="GUARD" desc="Clamp / validate" color="rose" />
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  <strong className="text-gray-600">Formula variables:</strong> <code className="bg-gray-100 px-1 rounded text-[9px]">floorArea</code>,{" "}
                  <code className="bg-gray-100 px-1 rounded text-[9px]">bedrooms</code>,{" "}
                  <code className="bg-gray-100 px-1 rounded text-[9px]">base</code> (BASE result),{" "}
                  <code className="bg-gray-100 px-1 rounded text-[9px]">adjustment</code> (ADJ result).
                  Guards can reference both <code className="bg-gray-100 px-1 rounded text-[9px]">base</code> and <code className="bg-gray-100 px-1 rounded text-[9px]">adjustment</code> to enforce min/max.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sub‑components ── */

function StatusPill({ icon: Icon, label, count, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    rose: "bg-rose-50 text-rose-600 border-rose-200",
    red: "bg-red-50 text-red-600 border-red-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold ${colorMap[color] || colorMap.blue}`}>
      <Icon size={12} />
      {label}
      <span className="bg-white/60 px-1.5 py-0 rounded-md text-[10px] font-black ml-0.5">{count}</span>
    </div>
  );
}

function PipelineStep({ layer, desc, color }) {
  const colorMap = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    rose: "bg-rose-50 border-rose-200 text-rose-700",
  };
  return (
    <div className={`flex-1 rounded-lg border p-2.5 text-center ${colorMap[color]}`}>
      <div className="font-black text-[10px] tracking-wider">{layer}</div>
      <div className="text-[9px] text-gray-500 mt-0.5">{desc}</div>
    </div>
  );
}

function ParamChip({ label, value, accent }) {
  return (
    <div className="bg-gray-700/30 rounded-lg px-2.5 py-1.5">
      <div className="text-[8px] text-gray-500 uppercase font-bold tracking-wider">{label}</div>
      <div className={`text-sm font-black mt-0.5 ${accent ? "text-adhi-primary" : "text-white"}`}>{value}</div>
    </div>
  );
}
