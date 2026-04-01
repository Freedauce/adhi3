export function ProgressBar({ label, value, colorClass = "bg-blue-500", showPercent = true }) {
    // Clamp value between 0-100
    const width = Math.min(Math.max(value, 0), 100);

    return (
        <div className="mb-4 last:mb-0">
            <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                {showPercent && <span className="text-sm font-bold text-gray-900">{width}%</span>}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                    className={`h-2 rounded-full ${colorClass}`}
                    style={{ width: `${width}%` }}
                ></div>
            </div>
        </div>
    );
}
