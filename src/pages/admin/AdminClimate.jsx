import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Leaf } from "lucide-react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { useRole } from "../../context/RoleContext";
import { climateData, carbonCredits, adminClimateStats } from "../../mock/adminData";

const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B'];
const pieData = [
    { name: 'Solar Energy', value: 45 },
    { name: 'Recycled Materials', value: 30 },
    { name: 'Water Management', value: 25 },
];

export default function AdminClimate() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "CLIMATE"]} />

            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Climate</h2>
                <p className="text-sm text-gray-500 mt-1">Deep dive metrics and operational data.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col items-stretch min-h-[350px]">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Decarbonization Roadmap</h3>
                <p className="text-sm text-gray-500 mb-8">CO2 reduction vs Net Zero targets</p>

                <div className="flex-1 w-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={climateData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} ticks={[0, 250, 500, 750, 1000]} />
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorGreen)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 items-stretch">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Environmental Impact</h3>
                        <div className="relative w-full min-h-[260px]">
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center absolute indicator */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                                <span className="text-4xl font-extrabold text-gray-900">{adminClimateStats.sustainabilityScore}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Sustainability<br />Score</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center flex-wrap gap-4 mt-8">
                        {pieData.map((entry, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }}></div>
                                <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                                <span className="text-sm font-bold text-gray-900 ml-1">{entry.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Carbon Credits Generated</h3>

                    <div className="space-y-4">
                        {carbonCredits.map((credit, idx) => (
                            <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-green-50 flex flex-shrink-0 items-center justify-center border border-green-100">
                                        <Leaf className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{credit.company}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{credit.date} • {credit.tx}</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center space-x-4">
                                    <span className="font-bold text-gray-900 text-lg">{credit.mt}</span>
                                    <Badge label={credit.status} variant={credit.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
