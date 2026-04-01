import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { useRole } from "../../context/RoleContext";
import { academyStats, franchisePerformance, adminAcademyStats } from "../../mock/adminData";
import { Users, CheckCircle, Briefcase, GraduationCap } from "lucide-react";

const ICON_MAP = {
    Users: <Users className="w-6 h-6 text-blue-500" />,
    CheckCircle: <CheckCircle className="w-6 h-6 text-green-500" />,
    Briefcase: <Briefcase className="w-6 h-6 text-purple-500" />,
    GraduationCap: <GraduationCap className="w-6 h-6 text-orange-500" />
};

export default function AdminAcademy() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "ACADEMY"]} />

            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Academy</h2>
                <p className="text-sm text-gray-500 mt-1">Deep dive metrics and operational data.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Training & Certification</h3>
                <p className="text-sm text-gray-500 mb-6">Monitoring decentralized delivery capacity</p>

                <div className="grid grid-cols-4 gap-4">
                    {academyStats.map((stat, idx) => (
                        <div key={idx} className="p-6 rounded-xl border border-gray-100 text-center flex flex-col items-center justify-center bg-gray-50/50">
                            <div className="mb-4">
                                {ICON_MAP[stat.icon]}
                            </div>
                            <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                            <h4 className="text-2xl font-bold text-gray-900">{stat.value}</h4>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 items-stretch">
                <div className="col-span-8 bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">House Kit Visualizer</h3>
                    <div className="grid grid-cols-2 gap-6">
                        {/* Card 1 */}
                        <div className="flex flex-col gap-2">
                            <div className="relative rounded-2xl overflow-hidden aspect-[16/10]">
                                <img src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop" alt="Model S" className="w-full h-full object-cover" />
                                <div className="absolute top-3 right-3 bg-white/95 text-gray-900 text-[11px] px-2.5 py-1 rounded-full font-bold shadow-sm">Standard</div>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Model S - Studio</h4>
                                <p className="text-xs text-gray-500 mt-0.5">450 sq.ft • Kit Ready</p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="flex flex-col gap-2">
                            <div className="relative rounded-2xl overflow-hidden aspect-[16/10]">
                                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop" alt="Model M" className="w-full h-full object-cover" />
                                <div className="absolute top-3 right-3 bg-white/95 text-gray-900 text-[11px] px-2.5 py-1 rounded-full font-bold shadow-sm">Premium</div>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Model M - 2 Bed</h4>
                                <p className="text-xs text-gray-500 mt-0.5">850 sq.ft • Kit Ready</p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="flex flex-col gap-2">
                            <div className="relative rounded-2xl overflow-hidden aspect-[16/10]">
                                <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop" alt="Model L" className="w-full h-full object-cover" />
                                <div className="absolute top-3 right-3 bg-white/95 text-gray-900 text-[11px] px-2.5 py-1 rounded-full font-bold shadow-sm">Standard</div>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Model L - 3 Bed</h4>
                                <p className="text-xs text-gray-500 mt-0.5">1200 sq.ft • Kit Ready</p>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="flex flex-col gap-2">
                            <div className="relative rounded-2xl overflow-hidden aspect-[16/10]">
                                <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop" alt="Model X" className="w-full h-full object-cover" />
                                <div className="absolute top-3 right-3 bg-black/90 text-white text-[11px] px-2.5 py-1 rounded-full font-bold shadow-sm">Project</div>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Model X - Duplex</h4>
                                <p className="text-xs text-gray-500 mt-0.5">1800 sq.ft • Kit Ready</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-4 bg-white rounded-2xl shadow-sm p-8 border border-gray-200/60 flex flex-col justify-start h-fit">
                    <h3 className="text-[20px] font-bold text-[#0F172A] mb-6 tracking-tight">Franchise Performance</h3>
                    <div className="space-y-4 mb-4">
                        {franchisePerformance.map((perf, idx) => (
                            <div key={idx} className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl transition-all hover:shadow-sm">
                                <div className="flex items-stretch space-x-4">
                                    <div className="w-1.5 bg-[#2563EB] rounded-full h-auto"></div>
                                    <div>
                                        <h4 className="font-bold text-[15px] text-gray-900">{perf.region}</h4>
                                        <p className="text-[13px] text-gray-500 mt-0.5">{perf.status}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-[#2563EB] text-[17px] tracking-tight">{perf.delta}</span>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">ROI Delta</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-2 bg-black text-white py-3.5 px-6 rounded-[14px] font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors">
                        Apply for Franchise
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
