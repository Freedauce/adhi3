import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { useRole } from "../../context/RoleContext";
import { regions } from "../../mock/houseTypes";
import { Edit2 } from "lucide-react";

export default function RegionManagement() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "REGIONS"]} />
            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Region Management</h2>
                <p className="text-sm text-gray-500 mt-1">Manage costs, tax rates, FX rates, and regulatory flags per country.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regions.map(region => (
                    <div key={region.code} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-adhi-surface text-adhi-primary rounded-xl flex items-center justify-center font-bold text-sm">{region.code}</div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{region.label}</h3>
                                    <p className="text-xs text-gray-500">{region.currency}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge label={region.active ? "Active" : "Inactive"} variant={region.active ? "active" : "delayed"} />
                                <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500"><Edit2 size={14} /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">FX Rate</p>
                                <p className="text-lg font-bold text-gray-900">{region.fxRateToUsd.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-400">per 1 USD</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{region.taxLabel}</p>
                                <p className="text-lg font-bold text-gray-900">{region.taxRatePct}%</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</p>
                                <p className="text-lg font-bold text-gray-900">{region.active ? "Live" : "Off"}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
