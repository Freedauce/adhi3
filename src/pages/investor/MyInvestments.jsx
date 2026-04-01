import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { useRole } from "../../context/RoleContext";

const investments = [
    { id: "INV-001", project: "Kigali Phase 3", amount: "$250,000", investedAt: "2025-06-15", status: "active", projectedReturn: "$285,500", returnDate: "2027-06-15" },
    { id: "INV-002", project: "Nairobi Phase 2", amount: "$180,000", investedAt: "2025-09-01", status: "active", projectedReturn: "$203,400", returnDate: "2027-03-01" },
    { id: "INV-003", project: "Mombasa Phase 1", amount: "$100,000", investedAt: "2024-12-01", status: "returned", projectedReturn: "$114,200", returnDate: "2026-06-01" },
];

export default function MyInvestments() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "MY INVESTMENTS"]} />
            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">My Investments</h2>
                <p className="text-sm text-gray-500 mt-1">Track your investment portfolio and returns.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Project</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Invested</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Projected Return</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Return Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {investments.map(inv => (
                            <tr key={inv.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-bold text-gray-900">{inv.project}</td>
                                <td className="px-6 py-4 text-right font-bold text-gray-900">{inv.amount}</td>
                                <td className="px-6 py-4 text-gray-500">{inv.investedAt}</td>
                                <td className="px-6 py-4 text-right font-bold text-adhi-primary">{inv.projectedReturn}</td>
                                <td className="px-6 py-4 text-gray-500">{inv.returnDate}</td>
                                <td className="px-6 py-4"><Badge label={inv.status === "active" ? "Active" : "Returned"} variant={inv.status === "active" ? "active" : "verified"} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
