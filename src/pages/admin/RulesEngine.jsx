import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { useRole } from "../../context/RoleContext";
import { Play, Edit2 } from "lucide-react";

const rules = [
    { id: "RULE-001", layer: "BASE", trigger: "house_type", formula: "1BR→16, 2BR→24, 3BR→32 panels", output: "COMP-002", status: "PUBLISHED", version: 3 },
    { id: "RULE-002", layer: "ADJUSTMENT", trigger: "floor_area_m2", formula: "ceil(perimeter / 0.6)", output: "COMP-002", status: "PUBLISHED", version: 2 },
    { id: "RULE-002b", layer: "GUARD", trigger: "always", formula: "max(baseCount, adjCount)", output: "COMP-002", status: "PUBLISHED", version: 1 },
    { id: "RULE-003", layer: "BASE", trigger: "roof_type", formula: "flat→6, pitched→10, hip→14", output: "COMP-003", status: "PUBLISHED", version: 2 },
    { id: "RULE-004", layer: "BASE", trigger: "bedrooms", formula: "doors = bedrooms + 2", output: "COMP-005", status: "PUBLISHED", version: 1 },
    { id: "RULE-005", layer: "BASE", trigger: "bedrooms", formula: "windows = (bedrooms × 2) + 2", output: "COMP-006", status: "PUBLISHED", version: 1 },
    { id: "RULE-006", layer: "BASE", trigger: "bathrooms", formula: "fixtures = bathrooms × 3", output: "COMP-008", status: "PUBLISHED", version: 1 },
    { id: "RULE-007", layer: "ADJUSTMENT", trigger: "finishing_grade", formula: "premium → ×1.4 on COMP-010", output: "COMP-010", status: "PUBLISHED", version: 2 },
    { id: "RULE-008", layer: "BASE", trigger: "bedrooms", formula: "partitions = rooms - 1", output: "COMP-004", status: "PUBLISHED", version: 1 },
    { id: "RULE-009", layer: "OVERRIDE", trigger: "region=RW", formula: "Apply Rwanda pricing + 18% VAT", output: "ALL", status: "PUBLISHED", version: 1 },
    { id: "RULE-010", layer: "OVERRIDE", trigger: "region=KE", formula: "Apply Kenya pricing + 16% VAT", output: "ALL", status: "PUBLISHED", version: 1 },
];

const layerColors = { BASE: "bg-blue-100 text-blue-700", ADJUSTMENT: "bg-amber-100 text-amber-700", GUARD: "bg-red-100 text-red-700", OVERRIDE: "bg-purple-100 text-purple-700" };

export default function RulesEngine() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "RULES ENGINE"]} />
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Rules Engine</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage BOQ calculation rules. Changes affect all future BOQ generations.</p>
                </div>
                <button className="bg-adhi-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-adhi-dark transition-colors flex items-center gap-2">
                    <Play size={16} /> Test Rules
                </button>
            </div>

            <div className="bg-adhi-surface border border-adhi-primary/10 rounded-xl p-4 text-sm text-adhi-dark">
                <strong>Design Principle:</strong> When two rules target the same component, one is BASE and one ADJUSTMENT. The GUARD (max/min) is always the final step. No two rules may both unconditionally set the same field.
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Rule ID</th>
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Layer</th>
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Trigger</th>
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Formula</th>
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Output</th>
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Ver</th>
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rules.map(rule => (
                            <tr key={rule.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                                <td className="px-5 py-3.5 font-bold text-gray-900">{rule.id}</td>
                                <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${layerColors[rule.layer]}`}>{rule.layer}</span></td>
                                <td className="px-5 py-3.5 text-gray-600 font-mono text-xs">{rule.trigger}</td>
                                <td className="px-5 py-3.5 text-gray-700 text-xs">{rule.formula}</td>
                                <td className="px-5 py-3.5 font-mono text-xs text-adhi-primary">{rule.output}</td>
                                <td className="px-5 py-3.5"><Badge label={rule.status} variant={rule.status === "PUBLISHED" ? "active" : "pending"} /></td>
                                <td className="px-5 py-3.5 text-center text-gray-500">v{rule.version}</td>
                                <td className="px-5 py-3.5 text-right"><button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500 ml-auto"><Edit2 size={14} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
