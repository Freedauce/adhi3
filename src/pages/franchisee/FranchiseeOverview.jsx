import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { useRole } from "../../context/RoleContext";

export default function FranchiseeOverview() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel]} />

            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Franchisee Overview</h2>
                <p className="text-sm text-gray-500 mt-1">Welcome back. Here's your high-level summary.</p>
            </div>

            <div className="flex flex-row gap-6 w-full">

                {/* LEFT COLUMN */}
                <div className="flex-1 flex flex-col gap-4">

                    {/* CARD 1: My Training Status */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-base font-semibold text-gray-800 mb-5">
                            My Training Status
                        </h3>

                        <div className="flex items-center gap-8">
                            <div className="relative w-[140px] h-[140px] flex-shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[{ value: 82 }, { value: 18 }]}
                                            cx="50%" cy="50%"
                                            innerRadius={52} outerRadius={68}
                                            startAngle={90} endAngle={-270}
                                            dataKey="value"
                                            strokeWidth={0}
                                        >
                                            <Cell fill="#3B82F6" />
                                            <Cell fill="#E5E7EB" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-900">82%</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div>
                                    <p className="text-xl font-bold text-gray-900">Certification Level 2</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        You are on track! Next module: Project Management
                                    </p>
                                </div>
                                <button className="bg-black text-white text-sm font-medium px-6 py-2 rounded-full w-fit hover:bg-gray-800 transition-colors">
                                    Resume Training
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* LEFT COLUMN — BOTTOM ROW */}
                    <div className="flex flex-row gap-4">
                        {/* CARD 2: Eligibility Indicators */}
                        <div className="bg-white rounded-xl p-6 shadow-sm flex-1">
                            <h3 className="text-base font-semibold text-gray-800 mb-2">
                                Eligibility Indicators
                            </h3>
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-sm text-gray-700">Capital Ratio</span>
                                    <CheckCircle2 size={20} className="text-green-500" />
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-sm text-gray-700">Site Permits</span>
                                    <AlertCircle size={20} className="text-yellow-500" />
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-sm text-gray-700">Crew Size</span>
                                    <CheckCircle2 size={20} className="text-green-500" />
                                </div>
                            </div>
                        </div>

                        {/* CARD 3: Regional Rank */}
                        <div className="bg-white rounded-xl p-6 shadow-sm flex-1">
                            <h3 className="text-base font-semibold text-gray-800 mb-3">
                                Regional Rank
                            </h3>
                            <p className="text-7xl font-black text-gray-900 leading-none">#4</p>
                            <p className="text-sm text-gray-500 mt-3">Top 10% of</p>
                            <p className="text-sm text-gray-500">Active Franchisees</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="w-[340px] flex-shrink-0 flex flex-col gap-3">
                    <h3 className="text-lg font-semibold text-gray-800">New House Kits</h3>

                    {/* CARD A */}
                    <div className="relative rounded-xl overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=220&fit=crop"
                            alt="Model X-1"
                            className="w-full h-[200px] object-cover"
                        />
                        <div className="absolute bottom-3 left-3">
                            <span className="bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                                MODEL X-1
                            </span>
                        </div>
                    </div>

                    {/* CARD B */}
                    <div className="flex flex-col gap-2">
                        <div className="relative rounded-xl overflow-hidden bg-gray-200 h-[180px] flex items-center justify-center">
                            <div className="absolute inset-0 bg-gray-300/40" />
                            <span className="relative z-10 bg-gray-700 text-white text-xs font-semibold px-5 py-2 rounded-full">
                                LOCKED
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 text-center">
                            Complete certification to unlock
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
