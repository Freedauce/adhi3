import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { useRole } from "../../context/RoleContext";
import { allOrders, orderStatusLabels } from "../../mock/orderData";

export default function MyOrders() {
    const { roleConfig } = useRole();
    const myOrders = allOrders.filter(o => o.userId === "USR-789");

    const statusVariant = (status) => {
        if (status === "DELIVERED") return "verified";
        if (status === "PENDING_PAYMENT") return "pending";
        if (status === "CANCELLED") return "delayed";
        return "active";
    };

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "MY ORDERS"]} />
            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">My Orders</h2>
                <p className="text-sm text-gray-500 mt-1">Track all your house kit purchases.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">House Type</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Region</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Total</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myOrders.map(order => (
                            <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-adhi-primary">{order.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{order.houseType}</td>
                                <td className="px-6 py-4 text-gray-500">{order.region}</td>
                                <td className="px-6 py-4 text-gray-500">{order.orderDate}</td>
                                <td className="px-6 py-4 text-right font-bold text-gray-900">${order.totalAmountUsd.toLocaleString()}</td>
                                <td className="px-6 py-4"><Badge label={orderStatusLabels[order.status]} variant={statusVariant(order.status)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {myOrders.length === 0 && (
                    <div className="text-center py-12 text-gray-400">No orders yet. Browse the catalog to get started.</div>
                )}
            </div>
        </div>
    );
}
