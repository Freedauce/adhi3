import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../lib/utils";
import * as Icons from "lucide-react";

export function StatCard({ icon, label, value, delta, deltaPositive = true }) {
    const IconComponent = Icons[icon] || null;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <span className="text-sm text-gray-500 font-medium">{label}</span>
                {IconComponent && <IconComponent className="w-5 h-5 text-gray-400" />}
            </div>

            <div className="flex items-end justify-between mt-auto">
                <span className="text-2xl font-bold text-gray-900">{value}</span>

                {delta && (
                    <div className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ml-2",
                        deltaPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                        {deltaPositive ?
                            <TrendingUp className="w-3 h-3" /> :
                            <TrendingDown className="w-3 h-3" />
                        }
                        {delta}
                    </div>
                )}
            </div>
        </div>
    );
}
