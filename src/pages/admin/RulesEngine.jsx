import { useState, useMemo } from "react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { useRole } from "../../context/RoleContext";
import { 
  Play, Edit2, Save, X, Plus, Trash2, 
  AlertTriangle, CheckCircle2, FlaskConical,
  ChevronRight, Calculator, Info
} from "lucide-react";
import { houseTypes, components } from "../../mock/houseTypes";

const initialRules = [
  { id: "R-01", layer: "BASE", trigger: "always", formula: "1", output: "FND-SET-001", status: "PUBLISHED", version: 1 },
  { id: "R-02", layer: "BASE", trigger: "floor_area", formula: "+(floorArea * 0.2).toFixed(2)", output: "FND-EXC-001", status: "PUBLISHED", version: 1 },
  { id: "R-03", layer: "BASE", trigger: "floor_area", formula: "+(floorArea * 0.208).toFixed(2)", output: "FND-HCF-001", status: "PUBLISHED", version: 1 },
  { id: "R-04", layer: "BASE", trigger: "floor_area", formula: "+(floorArea * 0.052).toFixed(2)", output: "FND-SND-001", status: "PUBLISHED", version: 1 },
  { id: "R-05", layer: "BASE", trigger: "floor_area", formula: "+(floorArea * 0.0416).toFixed(2)", output: "FND-BLN-001", status: "PUBLISHED", version: 1 },
  { id: "R-06", layer: "BASE", trigger: "floor_area", formula: "+(floorArea * 0.1).toFixed(2)", output: "FND-STR-001", status: "PUBLISHED", version: 1 },
  { id: "R-07", layer: "BASE", trigger: "floor_area", formula: "+(floorArea * 1.04).toFixed(2)", output: "FND-DPM-001", status: "PUBLISHED", version: 1 },
  { id: "R-08", layer: "BASE", trigger: "floor_area", formula: "+(floorArea * 0.104).toFixed(2)", output: "FND-SLB-001", status: "PUBLISHED", version: 1 },
  { id: "R-09", layer: "BASE", trigger: "floor_area", formula: "+(floorArea * 1.04).toFixed(2)", output: "FND-MSH-001", status: "PUBLISHED", version: 1 },
  { id: "R-10", layer: "BASE", trigger: "floor_area", formula: "+(floorArea * 1.6667).toFixed(1)", output: "WAL-EXT-001", status: "PUBLISHED", version: 1 },
  { id: "R-11", layer: "BASE", trigger: "floor_area", formula: "+(floorArea * 0.6667).toFixed(1)", output: "STR-RBM-001", status: "PUBLISHED", version: 1 },
  { id: "R-12", layer: "BASE", trigger: "floor_area", formula: "+(floorArea * 1.2).toFixed(2)", output: "ROF-FRM-001", status: "PUBLISHED", version: 1 },
  { id: "R-13", layer: "BASE", trigger: "floor_area", formula: "+(floorArea * 1.2).toFixed(2)", output: "ROF-COV-001", status: "PUBLISHED", version: 1 },
  { id: "R-14", layer: "BASE", trigger: "floor_area", formula: "+(floorArea * 0.1733).toFixed(1)", output: "ROF-RDG-001", status: "PUBLISHED", version: 1 },
  { id: "R-15", layer: "BASE", trigger: "floor_area", formula: "+(floorArea * 0.6667).toFixed(1)", output: "ROF-FAS-001", status: "PUBLISHED", version: 1 },
  { id: "R-16", layer: "BASE", trigger: "floor_area", formula: "+(floorArea * 0.48).toFixed(2)", output: "ROF-GTR-001", status: "PUBLISHED", version: 1 },
  { id: "R-17", layer: "BASE", trigger: "floor_area", formula: "Math.ceil(floorArea / 18.75)", output: "ROF-DWP-001", status: "PUBLISHED", version: 1 },
  { id: "R-18", layer: "BASE", trigger: "bedrooms", formula: "1 + Math.floor(bedrooms / 3)", output: "OPN-DRF-001", status: "PUBLISHED", version: 1 },
  { id: "R-19", layer: "BASE", trigger: "bedrooms", formula: "2 + bedrooms", output: "OPN-WOP-001", status: "PUBLISHED", version: 1 },
  { id: "R-20", layer: "BASE", trigger: "bedrooms", formula: "(2 + bedrooms) * 2", output: "OPN-LNT-001", status: "PUBLISHED", version: 1 }
];

const layerColors = { 
  BASE: "bg-blue-100 text-blue-700 border-blue-200", 
  ADJUSTMENT: "bg-amber-100 text-amber-700 border-amber-200", 
  GUARD: "bg-red-100 text-red-700 border-red-200", 
  OVERRIDE: "bg-purple-100 text-purple-700 border-purple-200" 
};

export default function RulesEngine() {
  const { roleConfig } = useRole();
  const [rules, setRules] = useState(initialRules);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  // Simulator State
  const [simConfig, setSimConfig] = useState({
    bedrooms: 2,
  });

  /* ── Formula Execution Hub ── */
  const { computedResults, conflicts } = useMemo(() => {
    const results = {};
    const conflictList = [];
    const context = {
      floorArea: Math.max(15, 37.5 + ((Number(simConfig.bedrooms) - 2) * 12.5)),
      bedrooms: Number(simConfig.bedrooms),
    };

    // Sort rules by layer priority: BASE -> ADJUSTMENT -> GUARD
    const sortedRules = [...rules].sort((a, b) => {
      const order = { BASE: 1, ADJUSTMENT: 2, GUARD: 3, OVERRIDE: 4 };
      return order[a.layer] - order[b.layer];
    });

    sortedRules.forEach(rule => {
      try {
        if (!results[rule.output]) {
          results[rule.output] = { final: 0, steps: [], base: 0, adjustment: 0 };
        }
        
        // Conflict detection: No two rules should overwrite the same field at the same level
        if (results[rule.output].steps.some(s => s.layer === rule.layer) && rule.layer !== "GUARD") {
           conflictList.push(`Conflict: Multiple ${rule.layer} rules target ${rule.output}`);
        }

        // Simple evaluator using Function constructor (scoped context)
        const fn = new Function("bedrooms", "floorArea", "base", "adjustment", `return ${rule.formula}`);
        const base = results[rule.output].base || 0;
        const adjustment = results[rule.output].adjustment || 0;
        
        const value = fn(context.bedrooms, context.floorArea, base, adjustment);
        
        if (rule.layer === "BASE") results[rule.output].base = value;
        if (rule.layer === "ADJUSTMENT") results[rule.output].adjustment = value;
        
        results[rule.output].final = value;
        results[rule.output].steps.push({ ruleId: rule.id, layer: rule.layer, value });
      } catch (e) {
        console.error(`Error in rule ${rule.id}:`, e);
        conflictList.push(`Error computing ${rule.id}: ${e.message}`);
      }
    });

    return { computedResults: results, conflicts: conflictList };
  }, [rules, simConfig]);

  /* ── Handlers ── */
  const startEdit = (rule) => {
    setEditingId(rule.id);
    setEditForm({ ...rule });
  };

  const saveEdit = () => {
    setRules(prev => prev.map(r => r.id === editingId ? editForm : r));
    setEditingId(null);
  };

  const addNewRule = () => {
    const newId = `RULE-${String(rules.length + 1).padStart(3, "0")}`;
    const newRule = { id: newId, layer: "BASE", trigger: "always", formula: "0", output: components[0]?.id || "COMP-001", status: "DRAFT", version: 1 };
    setRules([...rules, newRule]);
    startEdit(newRule);
  };

  const deleteRule = (idToDelete) => {
    setRules(prev => prev.filter(r => r.id !== idToDelete));
  };

  return (
    <div className="flex flex-col gap-6 lg:max-h-[calc(100vh-120px)] lg:overflow-hidden mb-10">
      <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "RULES ENGINE"]} />
      
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Rules Engine</h2>
          <p className="text-sm text-gray-500 mt-1">Logic Layer for House-in-a-Kit BOQ Generation.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={addNewRule}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus size={16} /> New Rule
          </button>
          <button className="bg-adhi-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-adhi-dark transition-all flex items-center gap-2 shadow-lg shadow-adhi-primary/20">
            <Play size={16} /> Deploy Rules
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* ── Main Rules Table ── */}
        <div className="lg:col-span-2 flex flex-col min-h-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <Calculator size={16} className="text-adhi-primary" />
              Active Logic Rules
            </div>
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
              Execution Order: Base → Adjustment → Guard
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[900px]">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="bg-white border-b border-gray-100">
                  <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Rule ID</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Layer</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Trigger</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Formula</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Output</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rules.map(rule => (
                  <tr key={rule.id} className={`group hover:bg-adhi-light/30 transition-colors ${editingId === rule.id ? 'bg-adhi-light/20' : ''}`}>
                    <td className="px-5 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                      {editingId === rule.id ? (
                        <input 
                          type="text" 
                          value={editForm.id}
                          onChange={e => setEditForm({...editForm, id: e.target.value})}
                          className="text-xs border border-gray-300 rounded p-1.5 w-24 bg-white text-gray-900 focus:ring-2 focus:ring-adhi-primary outline-none"
                        />
                      ) : (
                        rule.id
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {editingId === rule.id ? (
                        <select 
                          value={editForm.layer}
                          onChange={e => setEditForm({...editForm, layer: e.target.value})}
                          className="text-xs border border-gray-300 rounded p-1.5 focus:ring-2 focus:ring-adhi-primary outline-none"
                        >
                          <option>BASE</option>
                          <option>ADJUSTMENT</option>
                          <option>GUARD</option>
                          <option>OVERRIDE</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-0.5 border rounded-md text-[10px] font-black tracking-tight ${layerColors[rule.layer]}`}>
                          {rule.layer}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {editingId === rule.id ? (
                        <input 
                          type="text" 
                          value={editForm.trigger}
                          onChange={e => setEditForm({...editForm, trigger: e.target.value})}
                          className="text-xs border border-gray-300 rounded p-1.5 w-32 font-mono bg-white outline-none focus:ring-2 focus:ring-adhi-primary"
                        />
                      ) : (
                        <span className="text-gray-500 font-mono text-xs">{rule.trigger}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 min-w-[250px]">
                      {editingId === rule.id ? (
                        <input 
                          type="text" 
                          value={editForm.formula}
                          onChange={e => setEditForm({...editForm, formula: e.target.value})}
                          className="text-xs border border-gray-300 rounded p-1.5 w-full font-mono bg-white outline-none focus:ring-2 focus:ring-adhi-primary"
                        />
                      ) : (
                        <span className="text-gray-700 text-xs font-medium px-2 py-1 bg-gray-50 rounded italic border border-gray-100 break-words whitespace-normal block">
                          {rule.formula}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {editingId === rule.id ? (
                        <select 
                          value={editForm.output}
                          onChange={e => setEditForm({...editForm, output: e.target.value})}
                          className="text-xs border border-gray-300 rounded p-1.5 focus:ring-2 focus:ring-adhi-primary outline-none max-w-[150px]"
                        >
                          {components.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                        </select>
                      ) : (
                        <span className="font-mono text-xs text-adhi-primary font-bold">{rule.output}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      {editingId === rule.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={saveEdit} title="Save" className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"><Save size={16}/></button>
                          <button onClick={() => setEditingId(null)} title="Cancel" className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X size={16}/></button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => startEdit(rule)} title="Edit Configuration" className="p-1.5 text-gray-400 hover:text-adhi-primary hover:bg-adhi-surface rounded-lg">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => deleteRule(rule.id)} title="Delete Rule" className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Core Shell Simulator Sidebar ── */}
        <div className="flex flex-col gap-6 lg:overflow-y-auto min-h-0 custom-scrollbar pr-1">
          <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl shadow-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <FlaskConical size={20} className="text-adhi-primary" />
              <h3 className="text-lg font-bold">Core Shell BOQ Simulator</h3>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Bedrooms (Expands Floor Area & BOQ)</label>
                <div className="relative">
                  <input 
                    type="number"
                    min="0"
                    value={simConfig.bedrooms}
                    onChange={e => setSimConfig({...simConfig, bedrooms: e.target.value})}
                    className="w-full bg-gray-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-adhi-primary text-white"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-adhi-primary font-bold bg-adhi-primary/10 px-2 py-1 rounded-md">
                    {Math.max(15, 37.5 + ((Number(simConfig.bedrooms || 0) - 2) * 12.5))} m² TOTAL
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold">Live Computed BOQ</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold tracking-tight">LIVE USD</span>
              </div>
              
              <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-900/50">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-800/80 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-700">
                    <tr>
                      <th className="px-3 py-2 whitespace-nowrap">Code</th>
                      <th className="px-3 py-2 whitespace-nowrap">Category</th>
                      <th className="px-3 py-2 whitespace-nowrap min-w-[150px]">Description</th>
                      <th className="px-3 py-2 whitespace-nowrap text-center">Unit</th>
                      <th className="px-3 py-2 whitespace-nowrap text-right text-adhi-primary">Qty</th>
                      <th className="px-3 py-2 whitespace-nowrap text-right">Rate (USD)</th>
                      <th className="px-3 py-2 whitespace-nowrap text-right text-emerald-400">Amount (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {Object.keys(computedResults).map(compId => {
                      const comp = components.find(c => c.id === compId);
                      const rate = comp?.rateUsd || 0;
                      const qty = Number(computedResults[compId].final) || 0;
                      const amount = qty * rate;

                      return (
                        <tr key={compId} className="hover:bg-gray-800/40 transition-colors">
                          <td className="px-3 py-2.5 font-mono text-[10px] text-gray-300 whitespace-nowrap">{compId}</td>
                          <td className="px-3 py-2.5 text-gray-400 whitespace-nowrap">{comp?.category}</td>
                          <td className="px-3 py-2.5 font-medium text-gray-200">{comp?.name || compId}</td>
                          <td className="px-3 py-2.5 text-center text-gray-500 font-bold uppercase">{comp?.unit}</td>
                          <td className="px-3 py-2.5 text-right font-black text-adhi-primary text-sm">{qty}</td>
                          <td className="px-3 py-2.5 text-right text-gray-300 font-mono tracking-tight">${rate.toFixed(2)}</td>
                          <td className="px-3 py-2.5 text-right font-bold text-emerald-400">${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-4 border-t-2 border-gray-700 flex flex-col justify-end gap-1">
                <div className="flex items-end justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Grand Total</span>
                  <span className="text-2xl font-black text-white">
                    ${Object.keys(computedResults).reduce((sum, compId) => {
                      const comp = components.find(c => c.id === compId);
                      return sum + (Number(computedResults[compId].final) * (comp?.rateUsd || 0));
                    }, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 text-right">Based on {Math.max(15, 37.5 + ((Number(simConfig.bedrooms || 0) - 2) * 12.5))} m² flow area.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

