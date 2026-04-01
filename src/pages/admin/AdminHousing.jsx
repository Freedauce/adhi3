import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { useRole } from "../../context/RoleContext";
import { housingProgress, regionalDistribution } from "../../mock/adminData";
import { Badge } from "../../components/ui/Badge";
import { SummaryBanner } from "../../components/ui/SummaryBanner";

export default function AdminHousing() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "HOUSING"]} />

            <div>
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Housing</h2>
                <p className="text-sm text-gray-500 mt-2">Deep dive metrics and operational data.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200/60 flex flex-col min-h-[350px]">
                <h3 className="text-[20px] font-bold text-gray-900 tracking-tight">Project Progress Overview</h3>
                <p className="text-[15px] text-gray-500 mb-8">Real-time monitoring of housing units across active phases</p>

                <div className="flex-1 w-full min-h-[280px]">
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={housingProgress} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barCategoryGap="15%">
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#6B7280', fontWeight: 500 }} dy={12} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#6B7280', fontWeight: 500 }} ticks={[0, 35, 70, 105, 140]} />
                            <Tooltip cursor={{ fill: '#f9fafb' }} />
                            <Bar dataKey="completed" stackId="a" fill="#18181b" />
                            <Bar dataKey="inProgress" stackId="a" fill="#8b9cb0" />
                            <Bar dataKey="planned" stackId="a" fill="#e2e8f0" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 items-stretch">
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200/60">
                    <h3 className="text-[20px] font-bold text-gray-900 mb-6 tracking-tight">Regional Distribution</h3>
                    <div className="space-y-4">
                        {regionalDistribution.slice(0, 2).map((region, idx) => (
                            <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 px-2 -mx-2 rounded-lg transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${region.color === 'green' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    <div>
                                        <h4 className="font-semibold text-[15px] text-gray-900">{region.city}</h4>
                                        <p className="text-[13px] text-gray-500 mt-0.5">{region.units.toLocaleString()} Units</p>
                                    </div>
                                </div>
                                <Badge label={region.status === 'ontrack' ? 'On Track' : 'Delayed'} variant={region.status} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200/60 flex flex-col justify-between">
                    <div>
                        <h3 className="text-[20px] font-bold text-gray-900 mb-6 tracking-tight">Role Intelligence</h3>

                        <div className="grid grid-cols-2 gap-4 h-[160px] mb-6">
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-center">
                                <p className="text-[13px] font-semibold text-gray-500 mb-1">Units Delivered</p>
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl font-bold text-gray-900">3,150</span>
                                    <Badge label="+12%" variant="active" />
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-center">
                                <p className="text-[13px] font-semibold text-gray-500 mb-1">Active Nodes</p>
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl font-bold text-gray-900">24</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-center">
                                <p className="text-[13px] font-semibold text-gray-500 mb-1">System Health</p>
                                <div className="flex items-center space-x-2 text-2xl font-bold text-gray-900">99.9%</div>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-center">
                                <p className="text-[13px] font-semibold text-gray-500 mb-1">User Rating</p>
                                <div className="flex items-center space-x-2 text-2xl font-bold text-gray-900">4.8</div>
                            </div>
                        </div>
                    </div>

                    <SummaryBanner
                        icon="Users"
                        title="Admin Summary"
                        subtitle="Complete system oversight enabled."
                    />
                </div>
            </div>
        </div>
    );
}
