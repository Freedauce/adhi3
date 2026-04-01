import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart2, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { StatCard } from "../../components/ui/StatCard";
import { SummaryBanner } from "../../components/ui/SummaryBanner";
import { useRole } from "../../context/RoleContext";
import { portfolioValue, yieldValue, riskRating, esgROI, investorOverviewStats } from "../../mock/investorData";

export default function InvestorOverview() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel]} />

            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Investor Overview</h2>
                <p className="text-sm text-gray-500 mt-1">Deep dive metrics and operational data.</p>
            </div>

            <div className="grid grid-cols-12 gap-6 items-stretch">
                {/* LEFT COLUMN */}
                <div className="col-span-4 flex flex-col space-y-6">
                    <StatCard icon="BarChart2" label="Portfolio Value" value={portfolioValue} delta="+14.2%" />
                    <StatCard icon="TrendingUp" label="Avg. Annual Yield" value={yieldValue} />

                    <div className="bg-black text-white rounded-xl p-6 relative overflow-hidden h-full min-h-[160px] flex flex-col justify-end">
                        {/* Absolute decorational icon */}
                        <CheckCircle className="absolute -right-4 -top-4 w-32 h-32 text-white/5" />

                        <p className="text-sm text-gray-400 font-medium mb-2 relative z-10">Risk Rating title</p>
                        <h3 className="text-[48px] font-extrabold leading-none tracking-tighter mb-4 relative z-10">{riskRating}</h3>
                        <p className="text-xs font-bold text-green-400 tracking-widest uppercase relative z-10">
                            Sustainable Infrastructure Class
                        </p>
                        <div className="absolute right-6 bottom-6 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 text-green-400 -rotate-45" />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="col-span-8 flex flex-col gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex-1 min-h-[220px]">
                        <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-6">ESG & Climate ROI</h3>
                        <div className="w-full min-h-[250px]">
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={esgROI} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barCategoryGap="15%">
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                                    <Tooltip cursor={{ fill: '#f9fafb' }} />
                                    <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center space-x-4 cursor-pointer hover:border-gray-300 transition-colors">
                            <div className="w-16 h-16 rounded-lg bg-gray-200 bg-cover bg-center flex-shrink-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80')" }}></div>
                            <div>
                                <h4 className="font-bold text-gray-900">Nairobi Phase 4</h4>
                                <p className="text-sm font-semibold text-green-600 mt-1">On Schedule</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center space-x-4 cursor-pointer hover:border-gray-300 transition-colors">
                            <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">+12<br />More</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 underline decoration-gray-300 underline-offset-4">View Portfolio</h4>
                                <p className="text-sm text-gray-500 mt-1">Global assets</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
