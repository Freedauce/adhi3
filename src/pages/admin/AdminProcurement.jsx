import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Package } from "lucide-react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Badge } from "../../components/ui/Badge";
import { useRole } from "../../context/RoleContext";
import { supplyChainData, vendors, inventoryAlerts, adminProcurementStats } from "../../mock/adminData";

export default function AdminProcurement() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "PROCUREMENT"]} />

            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Procurement</h2>
                <p className="text-sm text-gray-500 mt-1">Deep dive metrics and operational data.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Supply Chain Control</h3>
                <p className="text-sm text-gray-500 mb-8">Tracking RFQ to Delivery pipeline</p>

                <div className="w-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={supplyChainData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                            <XAxis dataKey="material" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} ticks={[0, 250, 500, 750, 1000]} />
                            <Tooltip cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }} />
                            <Line type="monotone" dataKey="target" stroke="#9CA3AF" strokeWidth={2} dot={{ r: 4, fill: 'white', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="rfq" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4, fill: 'white', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="delivery" stroke="#10B981" strokeWidth={2} dot={{ r: 4, fill: 'white', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 items-stretch">
                <div className="col-span-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Active Vendors</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Vendor</th>
                                    <th className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Contract</th>
                                    <th className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Status</th>
                                    <th className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Value</th>
                                </tr>
                            </thead>
                            <tbody className="align-top">
                                {vendors.map((vendor, idx) => (
                                    <tr key={idx} className="group">
                                        <td className="py-4 border-b border-gray-50 group-last:border-0 pl-1">
                                            <p className="font-bold text-gray-900">{vendor.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{vendor.category}</p>
                                        </td>
                                        <td className="py-4 border-b border-gray-50 group-last:border-0 text-gray-500">{vendor.contract}</td>
                                        <td className="py-4 border-b border-gray-50 group-last:border-0">
                                            <Badge label={vendor.status} variant={vendor.status} />
                                        </td>
                                        <td className="py-4 border-b border-gray-50 group-last:border-0 text-right font-bold text-gray-900">
                                            {vendor.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-span-4 bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Inventory Management</h3>

                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-6">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-100 text-blue-500">
                                    <Package className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">In-Stock Rate</p>
                                    <p className="text-2xl font-bold text-gray-900 leading-tight">{adminProcurementStats.inStockRate}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold text-green-600 block">{adminProcurementStats.inStockDelta}</span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest">{adminProcurementStats.inStockCompare}</span>
                            </div>
                        </div>
                    </div>

                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Low Stock Alerts</h4>
                    <div className="space-y-4">
                        {inventoryAlerts.map((alert, idx) => (
                            <ProgressBar
                                key={idx}
                                label={alert.item}
                                value={alert.percent}
                                colorClass="bg-red-500"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
