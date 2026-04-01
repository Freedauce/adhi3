import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { useRole } from "../../context/RoleContext";
import { MessageSquare, Flag } from "lucide-react";

const flaggedProjects = [
    { id: "FLAG-001", project: "Kigali Phase 3 — Model M", region: "RW", flag: "VAL-001: Seismic zone check required", severity: "high", status: "open", comments: 2 },
    { id: "FLAG-002", project: "Mombasa Coastal — Model L", region: "KE", flag: "VAL-003: Coastal wind-load factor missing", severity: "medium", status: "open", comments: 0 },
    { id: "FLAG-003", project: "Kampala — Model X Duplex", region: "UG", flag: "VAL-002: Energy certificate pending", severity: "low", status: "resolved", comments: 4 },
];

const severityColors = { high: "bg-red-100 text-red-700", medium: "bg-amber-100 text-amber-700", low: "bg-blue-100 text-blue-700" };

export default function ComplianceReview() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "COMPLIANCE REVIEW"]} />
            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Compliance Flag Review</h2>
                <p className="text-sm text-gray-500 mt-1">Review BOQs that triggered regulatory validation flags for your region.</p>
            </div>

            <div className="space-y-4">
                {flaggedProjects.map(flag => (
                    <div key={flag.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Flag className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{flag.project}</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">{flag.flag}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${severityColors[flag.severity]}`}>{flag.severity.toUpperCase()}</span>
                                <Badge label={flag.status === "open" ? "Open" : "Resolved"} variant={flag.status === "open" ? "pending" : "active"} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="text-sm text-gray-500">Region: {flag.region}</span>
                            <button className="text-sm font-semibold text-adhi-primary hover:underline flex items-center gap-1.5">
                                <MessageSquare size={14} /> {flag.comments > 0 ? `${flag.comments} Comments` : "Add Comment"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
