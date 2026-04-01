import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { useRole } from "../../context/RoleContext";
import { CheckCircle, XCircle, Ban } from "lucide-react";

const users = [
    { id: "USR-001", name: "Admin User", email: "admin@adhi.io", role: "ADMIN", region: "—", status: "ACTIVE" },
    { id: "USR-002", name: "Jane Mugisha", email: "jane@finance.co", role: "ACCOUNTANT", region: "RW", status: "ACTIVE" },
    { id: "USR-789", name: "Kigali Green Homes", email: "info@kigaligreen.rw", role: "FRANCHISEE", region: "RW", status: "ACTIVE" },
    { id: "USR-812", name: "Nairobi Housing Partners", email: "ops@nhp.ke", role: "FRANCHISEE", region: "KE", status: "ACTIVE" },
    { id: "USR-900", name: "Rwanda Housing Authority", email: "portal@rha.gov.rw", role: "GOVERNMENT", region: "RW", status: "ACTIVE" },
    { id: "USR-910", name: "GreenVest Capital", email: "invest@greenvest.com", role: "INVESTOR", region: "—", status: "PENDING_APPROVAL" },
    { id: "USR-920", name: "BuildRight Africa", email: "apply@buildright.tz", role: "FRANCHISEE", region: "TZ", status: "PENDING_APPROVAL" },
    { id: "USR-930", name: "Academy Trainer", email: "trainer@adhi.io", role: "ACADEMY", region: "RW", status: "ACTIVE" },
];

const statusMap = { ACTIVE: "active", PENDING_APPROVAL: "pending", PENDING_VERIFICATION: "review", SUSPENDED: "delayed" };
const roleColors = { ADMIN: "bg-gray-900 text-white", ACCOUNTANT: "bg-blue-100 text-blue-700", FRANCHISEE: "bg-green-100 text-green-700", GOVERNMENT: "bg-purple-100 text-purple-700", INVESTOR: "bg-amber-100 text-amber-700", ACADEMY: "bg-teal-100 text-teal-700" };

export default function UserManagement() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "USER MANAGEMENT"]} />
            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h2>
                <p className="text-sm text-gray-500 mt-1">Approve, suspend, and manage all platform users.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">User</th>
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Region</th>
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                                <td className="px-5 py-4">
                                    <p className="font-bold text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                                </td>
                                <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${roleColors[user.role] || 'bg-gray-100 text-gray-600'}`}>{user.role}</span></td>
                                <td className="px-5 py-4 text-gray-500">{user.region}</td>
                                <td className="px-5 py-4"><Badge label={user.status.replace(/_/g, " ")} variant={statusMap[user.status] || "ontrack"} /></td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        {user.status === "PENDING_APPROVAL" && (
                                            <>
                                                <button className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center hover:bg-green-100 text-green-600" title="Approve"><CheckCircle size={14} /></button>
                                                <button className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center hover:bg-red-100 text-red-600" title="Reject"><XCircle size={14} /></button>
                                            </>
                                        )}
                                        {user.status === "ACTIVE" && user.role !== "ADMIN" && (
                                            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500" title="Suspend"><Ban size={14} /></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
