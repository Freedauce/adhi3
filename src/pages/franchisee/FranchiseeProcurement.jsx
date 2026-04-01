import { Package } from "lucide-react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useRole } from "../../context/RoleContext";
import { activeOrders, inventoryForecast } from "../../mock/franchiseeData";

export default function FranchiseeProcurement() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "PROCUREMENT"]} />

            <div>
                <h2 className="text-4xl font-extrabold text-[#111827] tracking-tight">Procurement</h2>
                <p className="text-[15px] text-gray-500 mt-2">Deep dive metrics and operational data.</p>
            </div>

            {/* Banner */}
            <div className="bg-[#F4F9FF] rounded-[24px] px-10 py-8 flex flex-col md:flex-row items-center md:items-start gap-6 w-full">
                <div className="w-14 h-14 bg-[#2563EB] shadow-md shadow-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col justify-center h-14">
                    <h3 className="text-[22px] font-bold text-[#1E3A8A] tracking-tight leading-tight">My Supply Requests</h3>
                    <p className="text-[15px] text-[#2563EB] font-medium leading-tight mt-1">Track your kit components and local site deliveries.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 items-stretch">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Active Orders</h3>
                    <div className="space-y-4 flex-1">
                        {activeOrders.map((order, idx) => (
                            <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div>
                                    <h4 className="font-bold text-gray-900">{order.item}</h4>
                                    <p className="text-sm text-gray-500 mt-0.5">Est. Delivery: <span className="font-medium text-gray-700">{order.delivery}</span></p>
                                </div>
                                <Badge label={order.status === 'intransit' ? 'In Transit' : 'Processing'} variant={order.status} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">Inventory Forecast</h3>
                    <p className="text-sm text-gray-500 mb-8">Predicted requirements for your next 5 units based on site progress.</p>

                    <div className="flex-1">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-medium text-gray-700">Current Stock</span>
                            <span className="text-sm font-bold text-gray-900">Target</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
                            <div
                                className="h-3 rounded-full bg-blue-500"
                                style={{ width: `${inventoryForecast.current}%` }}
                            ></div>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Materials Allocated: {inventoryForecast.current}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
