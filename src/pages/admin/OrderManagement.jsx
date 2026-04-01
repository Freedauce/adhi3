import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { useRole } from "../../context/RoleContext";
import { allOrders, orderStatusLabels } from "../../mock/orderData";
import { RefreshCw, Download } from "lucide-react";

const statusVariant = (s) => { if (s === "DELIVERED") return "verified"; if (s === "PENDING_PAYMENT") return "pending"; if (s === "CANCELLED") return "delayed"; return "active"; };

export default function OrderManagement() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "ORDER MANAGEMENT"]} />
            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Order Management</h2>
                <p className="text-sm text-gray-500 mt-1">View and manage all orders across regions.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Order</th>
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Franchisee</th>
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">House</th>
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Region</th>
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Total</th>
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Odoo</th>
                            <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allOrders.map(order => (
                            <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                                <td className="px-5 py-3.5 font-bold text-adhi-primary">{order.id}</td>
                                <td className="px-5 py-3.5 font-medium text-gray-900">{order.franchiseeName}</td>
                                <td className="px-5 py-3.5 text-gray-600 text-xs">{order.houseType}</td>
                                <td className="px-5 py-3.5 text-gray-500">{order.region}</td>
                                <td className="px-5 py-3.5 text-right font-bold text-gray-900">${order.totalAmountUsd.toLocaleString()}</td>
                                <td className="px-5 py-3.5"><Badge label={orderStatusLabels[order.status]} variant={statusVariant(order.status)} /></td>
                                <td className="px-5 py-3.5"><Badge label={order.odooSyncStatus} variant={order.odooSyncStatus === "SUCCESS" ? "active" : order.odooSyncStatus === "FAILED" ? "delayed" : "pending"} /></td>
                                <td className="px-5 py-3.5 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500" title="Download BOQ"><Download size={14} /></button>
                                        {order.odooSyncStatus === "FAILED" && (
                                            <button className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center hover:bg-amber-100 text-amber-600" title="Retry Odoo Sync"><RefreshCw size={14} /></button>
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
