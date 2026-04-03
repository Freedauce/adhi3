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

/* ── Default Rules — Functional ── */
const initialRules = [
  { id: "RULE-001", layer: "BASE", trigger: "house_type", formula: "bedrooms === 0 ? 12 : bedrooms === 1 ? 16 : 24", output: "COMP-002", status: "PUBLISHED", version: 3 },
  { id: "RULE-002", layer: "ADJUSTMENT", trigger: "floor_area", formula: "Math.ceil((Math.sqrt(floorArea) * 4) / 0.6)", output: "COMP-002", status: "PUBLISHED", version: 2 },
  { id: "RULE-002b", layer: "GUARD", trigger: "always", formula: "Math.max(base, adjustment)", output: "COMP-002", status: "PUBLISHED", version: 1 },
  { id: "RULE-003", layer: "BASE", trigger: "always", formula: "Math.ceil(floorArea / 10)", output: "COMP-003", status: "PUBLISHED", version: 2 },
  { id: "RULE-004", layer: "BASE", trigger: "bedrooms", formula: "bedrooms + 2", output: "COMP-004", status: "PUBLISHED", version: 1 },
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
    houseType: houseTypes[0].id,
    floorArea: houseTypes[0].defaultFloorAreaM2,
    bedrooms: houseTypes[0].defaultBedrooms,
  });

  /* ── Formula Execution Hub ── */
  const runRules = useMemo(() => {
    const results = {};
    const context = {
      houseType: simConfig.houseType,
      floorArea: Number(simConfig.floorArea),
      bedrooms: Number(simConfig.bedrooms),
    };

    // Sort rules by layer priority: BASE -> ADJUSTMENT -> GUARD
    const sortedRules = [...rules].sort((a, b) => {
      const order = { BASE: 1, ADJUSTMENT: 2, GUARD: 3, OVERRIDE: 4 };
      return order[a.layer] - order[b.layer];
    });

    sortedRules.forEach(rule => {
      try {
        // Simple evaluator using Function constructor (scoped context)
        const fn = new Function("bedrooms", "floorArea", "houseType", "base", "adjustment", `return ${rule.formula}`);
        const base = results[rule.output]?.base || 0;
        const adjustment = results[rule.output]?.adjustment || 0;
        
        const value = fn(context.bedrooms, context.floorArea, context.houseType, base, adjustment);
        
        if (!results[rule.output]) results[rule.output] = { final: 0, steps: [] };
        
        if (rule.layer === "BASE") results[rule.output].base = value;
        if (rule.layer === "ADJUSTMENT") results[rule.output].adjustment = value;
        
        results[rule.output].final = value;
        results[rule.output].steps.push({ ruleId: rule.id, value });
      } catch (e) {
        console.error(`Error in rule ${rule.id}:`, e);
      }
    });

    return results;
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
    const newRule = { id: newId, layer: "BASE", trigger: "always", formula: "0", output: "COMP-001", status: "DRAFT", version: 1 };
    setRules([...rules, newRule]);
    startEdit(newRule);
  };

  return (
    <div className="flex flex-col gap-6 max-h-[calc(100vh-120px)] overflow-hidden">
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
            <table className="w-full text-left text-sm border-collapse">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="bg-white border-b border-gray-100">
                  <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Rule ID</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Layer</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Trigger</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Formula</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Output</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rules.map(rule => (
                  <tr key={rule.id} className={`group hover:bg-adhi-light/30 transition-colors ${editingId === rule.id ? 'bg-adhi-light/20' : ''}`}>
                    <td className="px-5 py-3.5 font-bold text-gray-900">{rule.id}</td>
                    <td className="px-5 py-3.5">
                      {editingId === rule.id ? (
                        <select 
                          value={editForm.layer}
                          onChange={e => setEditForm({...editForm, layer: e.target.value})}
                          className="text-xs border border-gray-200 rounded p-1 focus:ring-1 focus:ring-adhi-primary"
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
                    <td className="px-5 py-3.5">
                      {editingId === rule.id ? (
                        <input 
                          type="text" 
                          value={editForm.trigger}
                          onChange={e => setEditForm({...editForm, trigger: e.target.value})}
                          className="text-xs border border-gray-200 rounded p-1 w-full font-mono bg-white"
                        />
                      ) : (
                        <span className="text-gray-500 font-mono text-xs">{rule.trigger}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {editingId === rule.id ? (
                        <input 
                          type="text" 
                          value={editForm.formula}
                          onChange={e => setEditForm({...editForm, formula: e.target.value})}
                          className="text-xs border border-gray-200 rounded p-1 w-full font-mono bg-white"
                        />
                      ) : (
                        <span className="text-gray-700 text-xs font-medium px-2 py-1 bg-gray-50 rounded italic border border-gray-100">
                          {rule.formula}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {editingId === rule.id ? (
                        <select 
                          value={editForm.output}
                          onChange={e => setEditForm({...editForm, output: e.target.value})}
                          className="text-xs border border-gray-200 rounded p-1 focus:ring-1 focus:ring-adhi-primary"
                        >
                          {components.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                        </select>
                      ) : (
                        <span className="font-mono text-xs text-adhi-primary font-bold">{rule.output}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {editingId === rule.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={saveEdit} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"><Save size={16}/></button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X size={16}/></button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(rule)} className="p-1.5 text-gray-400 hover:text-adhi-primary hover:bg-adhi-surface rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <Edit2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Simulator Sidebar ── */}
        <div className="flex flex-col gap-6">
          <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl shadow-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <FlaskConical size={20} className="text-adhi-primary" />
              <h3 className="text-lg font-bold">Rule Simulator</h3>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">House Model</label>
                <select 
                  value={simConfig.houseType}
                  onChange={e => {
                    const ht = houseTypes.find(h => h.id === e.target.value);
                    setSimConfig({...simConfig, houseType: e.target.value, floorArea: ht.defaultFloorAreaM2, bedrooms: ht.defaultBedrooms});
                  }}
                  className="w-full bg-gray-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-adhi-primary"
                >
                  {houseTypes.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Floor Area (m²)</label>
                  <input 
                    type="number"
                    value={simConfig.floorArea}
                    onChange={e => setSimConfig({...simConfig, floorArea: e.target.value})}
                    className="w-full bg-gray-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-adhi-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Bedrooms</label>
                  <input 
                    type="number"
                    value={simConfig.bedrooms}
                    onChange={e => setSimConfig({...simConfig, bedrooms: e.target.value})}
                    className="w-full bg-gray-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-adhi-primary"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold">Computed BOQ Result</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold tracking-tight">LIVE</span>
              </div>
              
              <div className="space-y-3">
                {Object.keys(runRules).map(compId => {
                  const comp = components.find(c => c.id === compId);
                  return (
                    <div key={compId} className="flex items-center justify-between bg-gray-800/40 p-3 rounded-xl border border-gray-800 group hover:border-gray-700 transition-all">
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">{compId}</p>
                        <p className="text-xs font-semibold text-gray-300">{comp?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-adhi-primary leading-none">{runRules[compId].final}</p>
                        <p className="text-[10px] text-gray-500 font-bold">{comp?.unit}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-adhi-surface border border-adhi-primary/10 rounded-2xl p-5">
            <div className="flex gap-3">
              <Info size={18} className="text-adhi-primary shrink-0" />
              <div>
                <p className="text-xs font-bold text-adhi-dark mb-1">Validation Status</p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
                  <CheckCircle2 size={12} /> No conflicts detected in sequence
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

