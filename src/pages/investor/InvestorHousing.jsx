import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { UserCircle2 } from "lucide-react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { useRole } from "../../context/RoleContext";
import { housingProgress } from "../../mock/adminData";
import { investorRegions, roleIntelligence } from "../../mock/investorData";
import { Badge } from "../../components/ui/Badge";
import { SummaryBanner } from "../../components/ui/SummaryBanner";

export default function InvestorHousing() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "HOUSING"]} />

            <div>
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Housing</h2>
                <p className="text-sm text-gray-500 mt-1">Deep dive metrics and operational data.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 flex flex-col min-h-[400px]">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Portfolio Snapshot</h3>
                <p className="text-sm text-gray-400 mb-8 mt-1 font-medium">Project performance and capital allocation</p>

                <div className="flex-1 w-full min-h-[250px] mt-4">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={housingProgress} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barCategoryGap="15%">
                            <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="3 3" />
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

            <div className="grid grid-cols-2 gap-6 items-stretch">
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Regional Distribution</h3>
                    <div className="space-y-6">
                        {investorRegions.map((region, idx) => (
                            <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                <div className="flex items-start space-x-3">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 ${region.color === 'green' ? 'bg-green-500' :
                                        region.color === 'blue' ? 'bg-blue-500' : 'bg-amber-400'
                                        }`} />
                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-900">{region.city}</h4>
                                        <p className="text-xs text-gray-400 mt-0.5">{region.units.toLocaleString()} Units</p>
                                    </div>
                                </div>
                                <Badge label={region.status === 'ontrack' ? 'On Track' : (region.status === 'planning' ? 'Planning' : 'Delayed')} variant={region.status} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Role Intelligence</h3>

                        <div className="grid grid-cols-2 gap-4 h-[160px] mb-6">
                            <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100 flex flex-col justify-center">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Est. Yield</p>
                                <div className="flex items-center space-x-3">
                                    <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{roleIntelligence.estYield}</span>
                                    <Badge label="+12%" variant="active" />
                                </div>
                            </div>
                            <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100 flex flex-col justify-center">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Active Nodes</p>
                                <div className="flex items-center space-x-2">
                                    <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{roleIntelligence.activeNodes}</span>
                                </div>
                            </div>
                            <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100 flex flex-col justify-center">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">System Health</p>
                                <div className="flex items-center space-x-2 text-3xl font-extrabold text-gray-900 tracking-tight">{roleIntelligence.systemHealth}</div>
                            </div>
                            <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100 flex flex-col justify-center">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">User Rating</p>
                                <div className="flex items-center space-x-2 text-3xl font-extrabold text-gray-900 tracking-tight">{roleIntelligence.userRating}</div>
                            </div>
                        </div>
                    </div>

                    <SummaryBanner
                        icon="UserCircle2"
                        title="Investor Summary"
                        subtitle="ESG and ROI thresholds are within target."
                    />
                </div>
            </div>
        </div>
    );
}
