import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { UserCircle2 } from "lucide-react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { useRole } from "../../context/RoleContext";
import { housingProgress } from "../../mock/adminData";
import { impactIndicators, roleIntelligence } from "../../mock/governmentData";
import { Badge } from "../../components/ui/Badge";
import { SummaryBanner } from "../../components/ui/SummaryBanner";

export default function GovernmentHousing() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "HOUSING"]} />

            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Housing</h2>
                <p className="text-sm text-gray-500 mt-1">Deep dive metrics and operational data.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col min-h-[350px]">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Public Housing Impact</h3>
                <p className="text-sm text-gray-500 mb-8">Tracking citizen welfare and urban development</p>

                <div className="flex-1 w-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={housingProgress} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barCategoryGap="15%">
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} ticks={[0, 35, 70, 105, 140]} />
                            <Tooltip cursor={{ fill: '#f9fafb' }} />
                            <Bar dataKey="completed" stackId="a" fill="#111827" />
                            <Bar dataKey="inProgress" stackId="a" fill="#94A3B8" />
                            <Bar dataKey="planned" stackId="a" fill="#CBD5E1" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 items-stretch">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Impact Indicators</h3>
                    <div className="space-y-4">
                        {impactIndicators.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div>
                                    <h4 className="font-bold text-gray-900">{item.label}</h4>
                                    <p className="text-sm text-gray-500 mt-0.5">{item.impact} Impact</p>
                                </div>
                                <Badge label={item.status} variant={item.status} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Role Intelligence</h3>

                        <div className="grid grid-cols-2 gap-4 h-[160px] mb-6">
                            <div className="p-4 rounded-xl border border-gray-100 flex flex-col justify-center">
                                <p className="text-sm text-gray-500 mb-1">Social ROI</p>
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl font-bold text-gray-900">{roleIntelligence.socialROI}</span>
                                    <Badge label="+12%" variant="active" />
                                </div>
                            </div>
                            <div className="p-4 rounded-xl border border-gray-100 flex flex-col justify-center">
                                <p className="text-sm text-gray-500 mb-1">Active Nodes</p>
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl font-bold text-gray-900">{roleIntelligence.activeNodes}</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl border border-gray-100 flex flex-col justify-center">
                                <p className="text-sm text-gray-500 mb-1">System Health</p>
                                <div className="flex items-center space-x-2 text-2xl font-bold text-gray-900">{roleIntelligence.systemHealth}</div>
                            </div>
                            <div className="p-4 rounded-xl border border-gray-100 flex flex-col justify-center">
                                <p className="text-sm text-gray-500 mb-1">User Rating</p>
                                <div className="flex items-center space-x-2 text-2xl font-bold text-gray-900">{roleIntelligence.userRating}</div>
                            </div>
                        </div>
                    </div>

                    <SummaryBanner
                        icon="UserCircle2"
                        title="Government Summary"
                        subtitle="Public housing targets 82% completed."
                    />
                </div>
            </div>
        </div>
    );
}
