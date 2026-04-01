import * as Icons from "lucide-react";

export function SummaryBanner({ icon, title, subtitle }) {
    const IconComponent = Icons[icon] || null;

    return (
        <div className="bg-gray-900 text-white rounded-xl p-5 flex items-center space-x-4">
            {IconComponent && (
                <div className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-gray-300" />
                </div>
            )}
            <div>
                <h3 className="font-bold text-lg leading-tight">{title}</h3>
                {subtitle && <p className="text-gray-400 text-xs mt-1 uppercase tracking-wide">{subtitle}</p>}
            </div>
        </div>
    );
}
