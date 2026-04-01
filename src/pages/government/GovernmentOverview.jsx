import { Star, Leaf } from "lucide-react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { StatCard } from "../../components/ui/StatCard";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useRole } from "../../context/RoleContext";
import { housingPhases, governmentOverviewStats } from "../../mock/governmentData";

export default function GovernmentOverview() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel]} />

            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Government Overview</h2>
                <p className="text-sm text-gray-500 mt-1">Deep dive metrics and operational data.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Public Housing Progress</h3>

                <div className="space-y-4 mb-4">
                    {housingPhases.map((phase, idx) => (
                        <ProgressBar
                            key={idx}
                            label={phase.label}
                            value={phase.percent}
                            colorClass={phase.color}
                        />
                    ))}
                </div>
                <p className="text-sm text-gray-400 italic font-medium">{governmentOverviewStats.nationalGoal}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <StatCard icon="Users" label="Jobs Created" value={governmentOverviewStats.jobsCreated.value} delta={governmentOverviewStats.jobsCreated.delta} />
                <StatCard icon="Briefcase" label="Local SMEs Supported" value={governmentOverviewStats.smesSupported.value} />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100/50 flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-gray-600 mb-1">Citizen Satisfaction</h4>
                        <div className="flex items-baseline space-x-1">
                            <span className="text-3xl font-bold text-gray-900">{governmentOverviewStats.citizenSatisfaction}</span>
                            <span className="text-lg font-semibold text-gray-400">/ 5</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    </div>
                </div>

                <div className="bg-green-50/50 rounded-xl p-6 border border-green-100/50 flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-gray-600 mb-1">CO2 Avoided</h4>
                        <span className="text-3xl font-bold text-gray-900">{governmentOverviewStats.co2Avoided}</span>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Leaf className="w-6 h-6 text-green-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}
