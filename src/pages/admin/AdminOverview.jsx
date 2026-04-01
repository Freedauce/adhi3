import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ClipboardList, BarChart2, Users, MapPin } from "lucide-react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { StatCard } from "../../components/ui/StatCard";
import { AlertCard } from "../../components/ui/AlertCard";
import { useRole } from "../../context/RoleContext";
import { platformHealthData, systemAlerts, adminOverviewStats } from "../../mock/adminData";

export default function AdminOverview() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel]} />

            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Overview</h2>
                <p className="text-sm text-gray-500 mt-1">Deep dive metrics and operational data.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-6">
                {adminOverviewStats.map((stat, idx) => (
                    <StatCard key={idx} icon={stat.icon} label={stat.label} value={stat.value} delta={stat.delta} />
                ))}
            </div>

            {/* Main Content Area: 2 Columns */}
            <div className="grid grid-cols-12 gap-6 items-stretch">
                <div className="col-span-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Global Platform Health</h3>
                    <div className="flex-1 w-full min-h-[250px]">
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={platformHealthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000000" stopOpacity={0.05} />
                                        <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="#111827" strokeWidth={2} fillOpacity={1} fill="url(#colorHealth)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="col-span-4 bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">System Alerts</h3>
                    <div className="flex-1 flex flex-col">
                        {systemAlerts.map((alert, idx) => (
                            <AlertCard key={idx} type={alert.type} message={alert.message} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
